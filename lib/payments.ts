// Ties a Midtrans order to its held Beds24 booking. Server only.
//
// The Beds24 booking id travels inside the Midtrans order id, so no database
// is needed: "TISS-<bookingId>-<suffix>", or "TISS-TEST-<suffix>" in test mode
// (no Beds24 write token, nothing booked).

import { confirmPaidBooking, releaseHeldBooking } from "@/lib/beds24";
import { getPaymentStatus, type PaymentState } from "@/lib/midtrans";

const ORDER_ID = /^TISS-(\d+|TEST)-[a-z0-9]+$/;

export function makeOrderId(bookingId: number | null) {
  return `TISS-${bookingId ?? "TEST"}-${Date.now().toString(36)}`;
}

export function isOrderId(value: unknown): value is string {
  return typeof value === "string" && ORDER_ID.test(value);
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
