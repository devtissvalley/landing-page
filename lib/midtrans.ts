// Server-side Midtrans client (Snap + Status API). Import only from route
// handlers — it reads the secret server key from the environment.
//
// MIDTRANS_SERVER_KEY     secret, server only
// MIDTRANS_CLIENT_KEY     public, sent to the browser to open the Snap popup
// MIDTRANS_IS_PRODUCTION  "true" for live payments; anything else = sandbox

import { createHash, timingSafeEqual } from "node:crypto";

export class MidtransError extends Error {}

function config() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.MIDTRANS_CLIENT_KEY;
  if (!serverKey || !clientKey) {
    throw new MidtransError("MIDTRANS_SERVER_KEY / MIDTRANS_CLIENT_KEY not set");
  }
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return {
    serverKey,
    clientKey,
    snapApi: isProduction
      ? "https://app.midtrans.com/snap/v1"
      : "https://app.sandbox.midtrans.com/snap/v1",
    coreApi: isProduction
      ? "https://api.midtrans.com/v2"
      : "https://api.sandbox.midtrans.com/v2",
    snapJs: isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js",
  };
}

/** What the browser needs to load the Snap popup. */
export function snapClientConfig() {
  const { clientKey, snapJs } = config();
  return { clientKey, snapJs };
}

async function call(url: string, init?: RequestInit) {
  const { serverKey } = config();
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new MidtransError(`Midtrans unreachable: ${String(err)}`);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok || !body) {
    throw new MidtransError(
      `Midtrans ${url} failed (${res.status}): ${JSON.stringify(body)}`,
    );
  }
  return body;
}

/**
 * Guest and stay details stored on the Midtrans order itself (custom
 * fields), so the payment result and the invoice can be built from the
 * order alone — no database, and no need to read guest data from Beds24.
 */
export type OrderDetails = {
  name: string;
  email: string;
  phone: string;
  roomId: number;
  checkin: string;
  checkout: string;
  guests: number;
};

// Midtrans custom fields hold at most 255 characters each.
function toCustomFields(d: OrderDetails) {
  const fields = {
    custom_field1: JSON.stringify({ n: d.name, p: d.phone }),
    custom_field2: JSON.stringify({ e: d.email }),
    custom_field3: JSON.stringify({ r: d.roomId, i: d.checkin, o: d.checkout, g: d.guests }),
  };
  for (const v of Object.values(fields)) {
    if (v.length > 255) throw new MidtransError("Order details too long for Midtrans");
  }
  return fields;
}

function fromCustomFields(body: Record<string, unknown>): OrderDetails | null {
  try {
    const a = JSON.parse(String(body.custom_field1));
    const b = JSON.parse(String(body.custom_field2));
    const c = JSON.parse(String(body.custom_field3));
    if (typeof b.e !== "string" || typeof c.r !== "number") return null;
    return {
      name: String(a.n ?? ""),
      phone: String(a.p ?? ""),
      email: b.e,
      roomId: c.r,
      checkin: String(c.i),
      checkout: String(c.o),
      guests: Number(c.g),
    };
  } catch {
    return null;
  }
}

/** Human label for how the order was paid, e.g. "BCA Virtual Account". */
function paymentMethod(body: Record<string, unknown>) {
  const type = String(body.payment_type ?? "");
  const va = (body.va_numbers as { bank?: string }[] | undefined)?.[0]?.bank;
  if (type === "bank_transfer" && va) return `${va.toUpperCase()} Virtual Account`;
  if (type === "bank_transfer" && body.permata_va_number) return "Permata Virtual Account";
  if (type === "echannel") return "Mandiri Bill Payment";
  if (type === "credit_card") return "Card";
  if (type === "qris") return "QRIS";
  if (type === "gopay") return "GoPay";
  if (type === "shopeepay") return "ShopeePay";
  if (type === "cstore") return "Convenience store";
  return type ? type.replace(/_/g, " ") : "Online payment";
}

export type SnapRequest = {
  orderId: string;
  amount: number;
  itemName: string;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  details: OrderDetails;
  finishUrl: string;
  /** Time to complete a started payment (e.g. pay the VA). */
  expiryMinutes: number;
  /** Time the payment window works before a method is chosen. */
  pageMinutes: number;
};

/** Create a Snap transaction and return its token. */
export async function createSnapTransaction(req: SnapRequest): Promise<string> {
  const { snapApi } = config();
  const body = await call(`${snapApi}/transactions`, {
    method: "POST",
    body: JSON.stringify({
      transaction_details: { order_id: req.orderId, gross_amount: req.amount },
      // gross_amount must equal the sum of item_details.
      item_details: [
        {
          id: req.orderId,
          price: req.amount,
          quantity: 1,
          name: req.itemName.slice(0, 50),
        },
      ],
      customer_details: {
        first_name: req.customer.firstName,
        last_name: req.customer.lastName,
        email: req.customer.email,
        phone: req.customer.phone,
      },
      ...toCustomFields(req.details),
      expiry: { unit: "minutes", duration: req.expiryMinutes },
      page_expiry: { unit: "minutes", duration: req.pageMinutes },
      callbacks: { finish: req.finishUrl },
      credit_card: { secure: true },
    }),
  });
  if (typeof body.token !== "string") {
    throw new MidtransError(`Midtrans returned no token: ${JSON.stringify(body)}`);
  }
  return body.token;
}

export type PaymentState = "paid" | "pending" | "failed" | "unknown";

/** Current status of an order, straight from Midtrans (source of truth). */
export async function getPaymentStatus(orderId: string) {
  const { coreApi } = config();
  const body = await call(`${coreApi}/${encodeURIComponent(orderId)}/status`);
  const status = String(body.transaction_status ?? "");
  const fraud = String(body.fraud_status ?? "");

  let state: PaymentState = "unknown";
  if (status === "settlement" || (status === "capture" && fraud === "accept")) {
    state = "paid";
  } else if (status === "pending" || (status === "capture" && fraud === "challenge")) {
    state = "pending";
  } else if (["deny", "cancel", "expire", "failure"].includes(status)) {
    state = "failed";
  }
  // Status API answers 404 inside the body for orders it doesn't know yet
  // (guest closed the popup before choosing a payment method).
  return {
    state,
    transactionStatus: status,
    amount: Math.round(Number(body.gross_amount ?? 0)),
    method: paymentMethod(body),
    // "YYYY-MM-DD HH:mm:ss" in Jakarta time (WIB), as Midtrans reports it.
    paidAt: String(body.settlement_time ?? body.transaction_time ?? ""),
    details: fromCustomFields(body),
  };
}

/**
 * Expire a pending order so it can no longer be paid (guest changed their
 * stay). Returns false if Midtrans refused because the order is already
 * paid or final — the caller should re-read the status then.
 */
export async function expireTransaction(orderId: string): Promise<boolean> {
  const { coreApi, serverKey } = config();
  let res: Response;
  try {
    res = await fetch(`${coreApi}/${encodeURIComponent(orderId)}/expire`, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new MidtransError(`Midtrans unreachable: ${String(err)}`);
  }
  const body = await res.json().catch(() => ({}));
  const code = String(body.status_code ?? res.status);
  // 407 = expired now. 404 = never started (guest didn't pick a method),
  // nothing to pay, so treat as done too.
  if (code === "407" || code === "404") return true;
  if (code === "412") return false;
  throw new MidtransError(`Midtrans expire failed: ${JSON.stringify(body)}`);
}

/** Check a notification's signature_key: SHA512(order_id+status_code+gross_amount+ServerKey). */
export function verifyNotificationSignature(n: {
  order_id?: unknown;
  status_code?: unknown;
  gross_amount?: unknown;
  signature_key?: unknown;
}) {
  const { serverKey } = config();
  if (typeof n.signature_key !== "string") return false;
  const expected = createHash("sha512")
    .update(`${n.order_id}${n.status_code}${n.gross_amount}${serverKey}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(n.signature_key);
  return a.length === b.length && timingSafeEqual(a, b);
}
