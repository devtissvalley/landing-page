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
  listHeldWebsiteBookings,
  releaseHeldBooking,
} from "@/lib/beds24";
import { PAYMENT } from "@/lib/data";
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

/**
 * Read the order's status from Midtrans and apply it to Beds24: confirm the
 * booking when paid, release the hold when the payment failed or expired.
 * Idempotent — called by the webhook and by the guest's browser.
 */
export async function syncPayment(orderId: string): Promise<{
  state: PaymentState;
  bookingId: number | null;
  testMode: boolean;
}> {
  const status = await getPaymentStatus(orderId);
  const bookingId = bookingIdOf(orderId);

  if (bookingId !== null) {
    if (status.state === "paid") {
      await confirmPaidBooking(bookingId, orderId, status.amount);
    } else if (status.state === "failed") {
      await releaseHeldBooking(bookingId);
    }
  }
  return { state: status.state, bookingId, testMode: bookingId === null };
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
      await confirmPaidBooking(hold.id, orderId, status.amount);
    } else if (status.state === "failed" || status.state === "unknown") {
      // unknown = the guest never picked a method and the Snap page has
      // expired, so it can no longer be paid.
      await releaseHeldBooking(hold.id);
    }
    // pending = e.g. VA issued; Midtrans expires it and notifies us.
  }
}
