// Server-side Beds24 API V2 client. Import only from route handlers — it
// reads secret tokens from the environment.
//
// BEDS24_TOKEN        read-only long life token (read:inventory, read:properties)
// BEDS24_WRITE_TOKEN  optional token with read+write bookings,
//                     bookings-personal and bookings-financial. Without it,
//                     online payments run in test mode: Midtrans is charged
//                     (sandbox) but no booking is created in Beds24.

import { BEDS24_PROPERTY_ID } from "@/lib/data";

const API = "https://beds24.com/api/v2";

export type RoomOffer = {
  roomId: number;
  available: boolean;
  unitsAvailable: number;
  /** Total price for the whole stay, in the property currency (IDR). */
  price: number | null;
};

export class Beds24Error extends Error {}

const TIMEOUT_MS = 15_000;

async function call(
  path: string,
  token: string,
  init?: RequestInit,
  { retry = true } = {},
) {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        token,
        ...init?.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    // Network failure or timeout — the route to beds24.com can be slow.
    // Retry once; never retry a POST, it could create the booking twice.
    if (retry && (init?.method ?? "GET") === "GET") {
      return call(path, token, init, { retry: false });
    }
    throw new Beds24Error(`Beds24 ${path} unreachable: ${String(err)}`);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.success === false) {
    throw new Beds24Error(
      `Beds24 ${path} failed (${res.status}): ${JSON.stringify(body?.error ?? body?.errors ?? body)}`,
    );
  }
  return body;
}

// Short in-memory cache so repeated searches for the same stay don't each
// wait on Beds24. Pass `fresh` to skip it.
const OFFERS_TTL_MS = 60_000;
const offersCache = new Map<string, { at: number; offers: RoomOffer[] }>();

/** Live availability and price for every room type, for one stay. */
export async function getOffers(
  checkin: string,
  checkout: string,
  guests: number,
  { fresh = false } = {},
): Promise<RoomOffer[]> {
  const key = `${checkin}|${checkout}|${guests}`;
  const hit = offersCache.get(key);
  if (!fresh && hit && Date.now() - hit.at < OFFERS_TTL_MS) return hit.offers;

  const offers = await fetchOffers(checkin, checkout, guests);
  offersCache.set(key, { at: Date.now(), offers });
  return offers;
}

async function fetchOffers(
  checkin: string,
  checkout: string,
  guests: number,
): Promise<RoomOffer[]> {
  const token = process.env.BEDS24_TOKEN;
  if (!token) throw new Beds24Error("BEDS24_TOKEN is not set");

  const params = new URLSearchParams({
    propertyId: String(BEDS24_PROPERTY_ID),
    arrival: checkin,
    departure: checkout,
    numAdults: String(guests),
  });
  const body = await call(`/inventory/rooms/offers?${params}`, token);

  type ApiRoom = {
    roomId: number;
    offers?: { price?: number; unitsAvailable?: number }[];
  };
  return (body.data as ApiRoom[]).map((room) => {
    // Beds24 can return several offers per room; take the cheapest.
    const offers = (room.offers ?? []).filter(
      (o) => (o.unitsAvailable ?? 0) > 0 && typeof o.price === "number",
    );
    const best = offers.sort((a, b) => a.price! - b.price!)[0];
    return {
      roomId: room.roomId,
      available: Boolean(best),
      unitsAvailable: best?.unitsAvailable ?? 0,
      price: best?.price ?? null,
    };
  });
}

// --- Bookings (write) ---------------------------------------------------
//
// NOTE: written against the Beds24 V2 OpenAPI spec (POST /bookings, GET
// /bookings) but not yet run against the live account — there is no write
// token yet. Test with a booking that is cancelled straight after.

export type NewBooking = {
  roomId: number;
  checkin: string;
  checkout: string;
  guests: number;
  price: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

function writeToken() {
  return process.env.BEDS24_WRITE_TOKEN || null;
}

/** Whether bookings are really written to Beds24 (false = test mode). */
export function canWriteBookings() {
  return writeToken() !== null;
}

async function postBookings(token: string, payload: object[]) {
  const body = await call("/bookings", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  // One result per booking in the payload.
  const result = Array.isArray(body) ? body[0] : body;
  if (!result || result.success === false) {
    throw new Beds24Error(
      `Beds24 /bookings rejected: ${JSON.stringify(result?.errors ?? result)}`,
    );
  }
  return result;
}

/**
 * Hold the villa while the guest pays: a "request" booking that Beds24 only
 * saves if the room is still free. Returns the Beds24 booking id, or null in
 * test mode.
 */
export async function createHeldBooking(b: NewBooking): Promise<number | null> {
  const token = writeToken();
  if (!token) return null;

  const result = await postBookings(token, [
    {
      roomId: b.roomId,
      status: "request",
      arrival: b.checkin,
      departure: b.checkout,
      numAdult: b.guests,
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      mobile: b.phone,
      comments: b.notes,
      price: b.price,
      apiMessage: "Website booking — awaiting Midtrans payment",
      actions: { checkAvailability: true, autoInvoiceItemCharge: true },
    },
  ]);
  const id = Number(result.new?.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Beds24Error(`Beds24 returned no booking id: ${JSON.stringify(result)}`);
  }
  return id;
}

async function getBooking(token: string, id: number) {
  const params = new URLSearchParams({
    id: String(id),
    includeInvoiceItems: "true",
  });
  const body = await call(`/bookings?${params}`, token);
  return (body.data?.[0] ?? null) as {
    id: number;
    status: string;
    invoiceItems?: { type: string; description?: string }[];
  } | null;
}

/**
 * Record a Midtrans payment on the booking and confirm it. Safe to call more
 * than once for the same order: the payment line is only added once.
 */
export async function confirmPaidBooking(
  id: number,
  orderId: string,
  amount: number,
) {
  const token = writeToken();
  if (!token) return;

  const booking = await getBooking(token, id);
  if (!booking) throw new Beds24Error(`Beds24 booking ${id} not found`);
  const alreadyPaid = (booking.invoiceItems ?? []).some(
    (item) => item.type === "payment" && item.description?.includes(orderId),
  );
  if (alreadyPaid && booking.status === "confirmed") return;

  await postBookings(token, [
    {
      id,
      status: "confirmed",
      ...(alreadyPaid
        ? {}
        : {
            invoiceItems: [
              { type: "payment", amount, description: `Midtrans ${orderId}` },
            ],
          }),
      actions: { notifyGuest: true, notifyHost: true },
    },
  ]);
}

/** Release a held booking whose payment failed or expired. */
export async function releaseHeldBooking(id: number) {
  const token = writeToken();
  if (!token) return;

  const booking = await getBooking(token, id);
  // Only cancel our own unpaid hold — never a booking that got confirmed.
  if (!booking || booking.status !== "request") return;
  await postBookings(token, [{ id, status: "cancelled" }]);
}
