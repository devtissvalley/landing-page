// Server-side Beds24 API V2 client. Import only from route handlers — it
// reads secret tokens from the environment.
//
// BEDS24_TOKEN  read-only long life token (read:inventory, read:properties).
// Bookings are not created through the API; /reserve hands off to WhatsApp.

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
