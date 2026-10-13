// Shared validation for stay dates and guest count (used by the API routes).

const DATE = /^\d{4}-\d{2}-\d{2}$/;
export const MAX_NIGHTS = 30;
// Beds24 rejects arrivals roughly two years out, and rates are only loaded
// about a year ahead, so online search stops at 12 months.
export const MAX_ADVANCE_DAYS = 365;

/** Latest check-in date bookable online, as YYYY-MM-DD. */
export function lastBookableDate(from = new Date()) {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() + MAX_ADVANCE_DAYS);
  return d.toISOString().split("T")[0];
}

export type Stay = { checkin: string; checkout: string; guests: number };

export function parseStay(
  checkin: unknown,
  checkout: unknown,
  guests: unknown,
): Stay | { error: string } {
  if (typeof checkin !== "string" || !DATE.test(checkin)) {
    return { error: "Invalid check-in date." };
  }
  if (typeof checkout !== "string" || !DATE.test(checkout)) {
    return { error: "Invalid check-out date." };
  }
  const nights =
    (Date.parse(checkout) - Date.parse(checkin)) / (1000 * 60 * 60 * 24);
  if (!(nights >= 1)) {
    return { error: "Check-out must be after check-in." };
  }
  if (nights > MAX_NIGHTS) {
    return { error: `Stays are limited to ${MAX_NIGHTS} nights online.` };
  }
  const today = new Date().toISOString().split("T")[0];
  if (checkin < today) {
    return { error: "Check-in cannot be in the past." };
  }
  if (checkin > lastBookableDate()) {
    return {
      error:
        "Online booking is open up to 12 months ahead. For later dates, please message us on WhatsApp.",
    };
  }

  const n = Number(guests);
  if (!Number.isInteger(n) || n < 1 || n > 10) {
    return { error: "Invalid number of guests." };
  }
  return { checkin, checkout, guests: n };
}
