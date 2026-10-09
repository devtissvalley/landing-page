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

export type SnapRequest = {
  orderId: string;
  amount: number;
  itemName: string;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  finishUrl: string;
  expiryMinutes: number;
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
      expiry: { unit: "minutes", duration: req.expiryMinutes },
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
  };
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
