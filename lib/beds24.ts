// Server-side Beds24 API V2 client. Import only from route handlers — it
// reads secret tokens from the environment.
//
// BEDS24_TOKEN        read-only long life token (read:inventory, read:properties)
// BEDS24_WRITE_TOKEN  optional token with write:bookings. Without it, booking
//                     requests run in dry-run mode and nothing is sent to Beds24.

import { BEDS24_PROPERTY_ID } from "@/lib/data";

const API = "https://beds24.com/api/v2";

export type RoomOffer = {
  roomId: number;
  available: boolean;
  unitsAvailable: number;
  /** Total price for the whole stay, in the property currency (IDR). */
  price: number | null;
};

export type BookingRequest = {
  roomId: number;
  checkin: string;
  checkout: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
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
// wait on Beds24. Booking always passes `fresh` to skip it.
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

/**
 * Create a booking with status "request" in Beds24. Without
 * BEDS24_WRITE_TOKEN this is a dry run: it returns the payload it would
 * have sent and Beds24 is not touched.
 *
 * NOTE: the POST /bookings field names below follow the Beds24 V2 docs but
 * are untested — there is no write token yet. Test against a non-live
 * room before enabling.
 */
export async function createBookingRequest(req: BookingRequest) {
  const payload = [
    {
      propertyId: BEDS24_PROPERTY_ID,
      roomId: req.roomId,
      status: "request",
      arrival: req.checkin,
      departure: req.checkout,
      numAdult: req.guests,
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      phone: req.phone,
      comments: req.notes,
      referer: "Website",
    },
  ];

  const token = process.env.BEDS24_WRITE_TOKEN;
  if (!token) return { dryRun: true as const, payload };

  const body = await call("/bookings", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  // POST /bookings answers with one result per booking in the payload.
  const results = Array.isArray(body) ? body : [body];
  const failed = results.find((r) => r?.success === false);
  if (failed) {
    throw new Beds24Error(
      `Beds24 /bookings rejected the booking: ${JSON.stringify(failed.errors ?? failed)}`,
    );
  }
  return { dryRun: false as const, result: results[0] };
}
