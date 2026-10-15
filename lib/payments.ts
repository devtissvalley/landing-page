// Ties a Midtrans order to its held Beds24 booking. Server only.
//
// The Beds24 booking id travels inside the Midtrans order id, so no database
// is needed: "TISS-<bookingId>-<hmac>", or "TISS-TEST-<random>" in test mode
// (no Beds24 write token, nothing booked). The HMAC (keyed with the Midtrans
// server key) means nobody can forge an order id for someone else's booking
// — and it lets the server rebuild the order id from a booking id alone,
// which is how stale holds are found and released.

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import {
  confirmPaidBooking,
  getCancellationRule,
  listHeldWebsiteBookings,
  markInvoiceSent,
  releaseHeldBooking,
} from "@/lib/beds24";
import { cancellationText } from "@/lib/cancellation";
import { PAYMENT, villas } from "@/lib/data";
import { emailConfigured, replyToAddress, sendEmail } from "@/lib/email";
import { buildInvoiceEmail } from "@/lib/invoice";
import {
  expireTransaction,
  getPaymentStatus,
  type PaymentState,
} from "@/lib/midtrans";

const ORDER_ID = /^TISS-(\d+|TEST)-([a-f0-9]+)$/;

function orderSecret() {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) throw new Error("MIDTRANS_SERVER_KEY is not set");
  return key;
}

function signBooking(bookingId: number) {
  return createHmac("sha256", orderSecret())
    .update(`tiss-order:${bookingId}`)
    .digest("hex")
    .slice(0, 24);
}

export function makeOrderId(bookingId: number | null) {
  if (bookingId === null) return `TISS-TEST-${randomBytes(12).toString("hex")}`;
  return `TISS-${bookingId}-${signBooking(bookingId)}`;
}

/** A well-formed order id made by this site (signature checked). */
export function isOrderId(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = value.match(ORDER_ID);
  if (!match) return false;
  if (match[1] === "TEST") return true;
  const expected = Buffer.from(signBooking(Number(match[1])));
  const given = Buffer.from(match[2]);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function bookingIdOf(orderId: string): number | null {
  const match = orderId.match(ORDER_ID);
  return match && match[1] !== "TEST" ? Number(match[1]) : null;
}

type SyncResult = {
  state: PaymentState;
  bookingId: number | null;
  testMode: boolean;
};

// The webhook, the guest's browser and the sweep can all sync one order at
// the same moment; run them one after another so a payment is recorded and
// invoiced once.
const inFlight = new Map<string, Promise<SyncResult>>();

/**
 * Read the order's status from Midtrans and apply it to Beds24: confirm the
 * booking when paid, release the hold when the payment failed or expired.
 * Sends the invoice email once the payment is in. Idempotent — called by the
 * webhook and by the guest's browser.
 */
export function syncPayment(orderId: string): Promise<SyncResult> {
  const previous = inFlight.get(orderId) ?? Promise.resolve(null);
  const run = previous.catch(() => null).then(() => runSync(orderId));
  inFlight.set(orderId, run);
  void run.finally(() => {
    if (inFlight.get(orderId) === run) inFlight.delete(orderId);
  }).catch(() => {});
  return run;
}

// Test mode has no Beds24 booking to note the invoice on; remember sent
// test invoices in memory instead (Resend's idempotency key covers restarts).
const testInvoicesSent = new Set<string>();

async function runSync(orderId: string): Promise<SyncResult> {
  const status = await getPaymentStatus(orderId);
  const bookingId = bookingIdOf(orderId);

  if (status.state === "paid") {
    let invoiceSent = testInvoicesSent.has(orderId);
    if (bookingId !== null) {
      ({ invoiceSent } = await confirmPaidBooking(bookingId, orderId, status.amount));
    }
    if (!invoiceSent) await sendInvoice(orderId, bookingId, status);
  } else if (status.state === "failed" && bookingId !== null) {
    await releaseHeldBooking(bookingId);
  }
  return { state: status.state, bookingId, testMode: bookingId === null };
}

/**
 * Email the guest their receipt. A failure here never undoes the booking:
 * it is logged, and the next sync for this order (webhook retry, the guest
 * checking again, the sweep) tries again.
 */
async function sendInvoice(
  orderId: string,
  bookingId: number | null,
  status: Awaited<ReturnType<typeof getPaymentStatus>>,
) {
  if (!emailConfigured()) return;
  const d = status.details;
  const villa = d && villas.find((v) => v.roomId === d.roomId);
  if (!d || !villa) {
    console.error("[invoice] order has no guest details, not sent:", orderId);
    return;
  }
  try {
    const rule = await getCancellationRule().catch(() => null);
    const nights = Math.round(
      (Date.parse(d.checkout) - Date.parse(d.checkin)) / (24 * 60 * 60_000),
    );
    const email = buildInvoiceEmail({
      orderId,
      bookingId,
      guestName: d.name,
      guestEmail: d.email,
      villaName: villa.name,
      checkin: d.checkin,
      checkout: d.checkout,
      nights,
      guests: d.guests,
      amount: status.amount,
      total: Math.round((status.amount * 100) / PAYMENT.percent),
      method: status.method,
      paidAt: status.paidAt,
      cancellation: cancellationText(rule, d.checkin),
    });
    const emailId = await sendEmail({
      to: d.email,
      bcc: replyToAddress(),
      ...email,
      idempotencyKey: `invoice/${orderId}`,
    });
    if (bookingId !== null) await markInvoiceSent(bookingId, emailId);
    else testInvoicesSent.add(orderId);
    console.info("[invoice] sent", orderId, emailId);
  } catch (err) {
    console.error("[invoice] failed for", orderId, err);
  }
}

/**
 * The guest wants different dates: stop the old order from being paid and
 * free the held villa. If the order turns out to be paid already, nothing
 * is released and the paid state is returned so the guest sees it.
 */
export async function abandonOrder(orderId: string) {
  const expired = await expireTransaction(orderId);
  if (!expired) return syncPayment(orderId);

  const bookingId = bookingIdOf(orderId);
  if (bookingId !== null) await releaseHeldBooking(bookingId);
  return { state: "failed" as PaymentState, bookingId, testMode: bookingId === null };
}

// --- Stale holds --------------------------------------------------------
//
// A guest who closes the tab before choosing a payment method never
// triggers a Midtrans notification, so their hold would stay in Beds24
// forever. The Snap page itself stops working after PAYMENT.pageMinutes
// (see createSnapTransaction), so any hold older than that with no payment
// started can be released safely.

const SWEEP_EVERY_MS = 10 * 60_000;
let lastSweep = 0;

/** Release stale holds, at most once every 10 minutes. Never throws. */
export function sweepStaleHolds() {
  const now = Date.now();
  if (now - lastSweep < SWEEP_EVERY_MS) return;
  lastSweep = now;
  void runSweep().catch((err) => console.error("[holds sweep]", err));
}

async function runSweep() {
  const holds = await listHeldWebsiteBookings();
  // Grace period on top of the Snap page lifetime.
  const cutoff = Date.now() - (PAYMENT.pageMinutes + 15) * 60_000;
  for (const hold of holds) {
    if (hold.bookedAt > cutoff) continue;
    const orderId = makeOrderId(hold.id);
    const status = await getPaymentStatus(orderId);
    if (status.state === "paid") {
      // Paid but never synced (webhook lost): confirm and send the invoice.
      await syncPayment(orderId);
    } else if (status.state === "failed" || status.state === "unknown") {
      // unknown = the guest never picked a method and the Snap page has
      // expired, so it can no longer be paid.
      await releaseHeldBooking(hold.id);
    }
    // pending = e.g. VA issued; Midtrans expires it and notifies us.
  }
}
