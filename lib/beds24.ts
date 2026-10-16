// Server-side Beds24 API V2 client. Import only from route handlers — it
// reads secret tokens from the environment.
//
// BEDS24_TOKEN          read-only long life token (read:inventory, read:properties)
// BEDS24_REFRESH_TOKEN  optional refresh token for read+write bookings,
//                       write bookings-personal and read+write
//                       bookings-financial (made from an invite code with
//                       scripts/beds24-setup.mjs). Without it, online
//                       payments run in test mode: Midtrans is charged
//                       (sandbox) but no booking is created in Beds24.

import { BEDS24_PROPERTY_ID } from "@/lib/data";
import { emailConfigured } from "@/lib/email";

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
  token: string | null,
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
        ...(token ? { token } : {}),
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
// Bounded so a flood of distinct date searches can't grow memory forever.
const OFFERS_CACHE_MAX = 500;
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
  offersCache.delete(key);
  if (offersCache.size >= OFFERS_CACHE_MAX) {
    // Map keeps insertion order: the first key is the oldest entry.
    offersCache.delete(offersCache.keys().next().value!);
  }
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

// Written on every hold, and the only thing the stale-hold sweep matches on,
// so it never touches bookings from other channels.
const HOLD_MARKER = "Website booking — awaiting Midtrans payment";

// Long life tokens are read-only, so writes use a 24-hour token from the
// refresh token, renewed shortly before it expires. Renewing also keeps the
// refresh token alive (Beds24 drops one unused for 30 days); the stale-hold
// sweep asks for a token whenever the site gets traffic, so it stays in use.
const TOKEN_MARGIN_MS = 10 * 60_000;
let access: { token: string; expiresAt: number } | null = null;
let renewing: Promise<string> | null = null;

async function writeToken(): Promise<string | null> {
  const refreshToken = process.env.BEDS24_REFRESH_TOKEN;
  if (!refreshToken) return null;
  if (access && Date.now() < access.expiresAt) return access.token;

  renewing ??= (async () => {
    const body = await call("/authentication/token", null, {
      headers: { refreshToken },
    });
    if (typeof body.token !== "string") {
      throw new Beds24Error("Beds24 /authentication/token returned no token");
    }
    const expiresIn = Number(body.expiresIn) || 3600;
    access = {
      token: body.token,
      expiresAt: Date.now() + expiresIn * 1000 - TOKEN_MARGIN_MS,
    };
    return body.token as string;
  })().finally(() => {
    renewing = null;
  });
  return renewing;
}

/** Whether bookings are really written to Beds24 (false = test mode). */
export function canWriteBookings() {
  return Boolean(process.env.BEDS24_REFRESH_TOKEN);
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
  const token = await writeToken();
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
      apiMessage: HOLD_MARKER,
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
    includeInfoItems: "true",
  });
  const body = await call(`/bookings?${params}`, token);
  return (body.data?.[0] ?? null) as {
    id: number;
    status: string;
    invoiceItems?: { type: string; description?: string }[];
    infoItems?: { code?: string }[];
  } | null;
}

// Info item written on the booking once the website's invoice email is sent,
// so it is never sent twice (even after a restart or a webhook retry).
const INVOICE_INFO_CODE = "WEBSITE_INVOICE";

/**
 * Record a Midtrans payment on the booking and confirm it. Safe to call more
 * than once for the same order: the payment line is only added once.
 * Returns whether the website's invoice email was already sent.
 */
export async function confirmPaidBooking(
  id: number,
  orderId: string,
  amount: number,
): Promise<{ invoiceSent: boolean }> {
  const token = await writeToken();
  if (!token) return { invoiceSent: false };

  const booking = await getBooking(token, id);
  if (!booking) throw new Beds24Error(`Beds24 booking ${id} not found`);
  const invoiceSent = (booking.infoItems ?? []).some(
    (item) => item.code === INVOICE_INFO_CODE,
  );
  const alreadyPaid = (booking.invoiceItems ?? []).some(
    (item) => item.type === "payment" && item.description?.includes(orderId),
  );
  if (alreadyPaid && booking.status === "confirmed") return { invoiceSent };

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
      // The website emails its own invoice when Resend is set up; then
      // Beds24's guest email would be a duplicate.
      actions: { notifyGuest: !emailConfigured(), notifyHost: true },
    },
  ]);
  return { invoiceSent };
}

/** Note on the booking that the invoice email went out. */
export async function markInvoiceSent(id: number, emailId: string) {
  const token = await writeToken();
  if (!token) return;
  await postBookings(token, [
    {
      id,
      infoItems: [{ code: INVOICE_INFO_CODE, text: `Invoice email sent (${emailId})` }],
    },
  ]);
}

/** Release a held booking whose payment failed or expired. */
export async function releaseHeldBooking(id: number) {
  const token = await writeToken();
  if (!token) return;

  const booking = await getBooking(token, id);
  // Only cancel our own unpaid hold — never a booking that got confirmed.
  if (!booking || booking.status !== "request") return;
  await postBookings(token, [{ id, status: "cancelled" }]);
}

/**
 * Unpaid holds created by this website (status "request" with our marker),
 * for the stale-hold sweep. Empty in test mode.
 */
export async function listHeldWebsiteBookings(): Promise<
  { id: number; bookedAt: number }[]
> {
  const token = await writeToken();
  if (!token) return [];
  const params = new URLSearchParams({
    propertyId: String(BEDS24_PROPERTY_ID),
    status: "request",
  });
  const body = await call(`/bookings?${params}`, token);
  type ApiBooking = { id: number; apiMessage?: string; bookingTime?: string };
  return ((body.data ?? []) as ApiBooking[])
    .filter((b) => b.apiMessage === HOLD_MARKER && b.bookingTime)
    .map((b) => ({ id: b.id, bookedAt: Date.parse(b.bookingTime!) }))
    .filter((b) => Number.isFinite(b.bookedAt));
}

// --- Cancellation policy -------------------------------------------------

export type CancellationRule =
  | { type: "always" }
  | { type: "never" }
  | { type: "daysBeforeArrival"; days: number };

const RULE_TTL_MS = 10 * 60_000;
let ruleCache: { at: number; rule: CancellationRule } | null = null;

/**
 * The property's guest-cancellation rule as set in Beds24 (Settings →
 * Properties → Booking Rules), so the website always shows what Beds24
 * enforces. Cached for 10 minutes.
 */
export async function getCancellationRule(): Promise<CancellationRule> {
  if (ruleCache && Date.now() - ruleCache.at < RULE_TTL_MS) return ruleCache.rule;

  const token = process.env.BEDS24_TOKEN;
  if (!token) throw new Beds24Error("BEDS24_TOKEN is not set");
  const params = new URLSearchParams({ id: String(BEDS24_PROPERTY_ID) });
  const body = await call(`/properties?${params}`, token);
  const raw = body.data?.[0]?.bookingRules?.allowGuestCancellation ?? {};

  let rule: CancellationRule = { type: "never" };
  if (raw.type === "always") rule = { type: "always" };
  else if (raw.type === "daysBeforeArrival") {
    const days = Number(raw.daysBeforeArrivalValue);
    if (Number.isInteger(days) && days >= 0) rule = { type: "daysBeforeArrival", days };
  }
  ruleCache = { at: Date.now(), rule };
  return rule;
}
