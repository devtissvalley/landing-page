// Wording of the Beds24 cancellation rule for one stay. Shared by the
// /reserve page (shown before paying) and the invoice email, so both say
// exactly the same thing. Safe to import in the browser.

import type { CancellationRule } from "@/lib/beds24";

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

export const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "10 November 2026" for a YYYY-MM-DD date. */
export function formatDate(date: string) {
  return longDate.format(new Date(`${date}T00:00:00Z`));
}

export function cancellationText(rule: CancellationRule | null, checkIn: string) {
  if (!rule) {
    return "Please ask us about the cancellation policy before you pay.";
  }
  if (rule.type === "always") return "Free cancellation up to check-in.";
  if (rule.type === "never") return "Non-refundable: this booking can't be cancelled for a refund.";
  const deadline = addDays(checkIn, -rule.days);
  const today = new Date().toISOString().split("T")[0];
  if (deadline < today) {
    return `Non-refundable: check-in is less than ${rule.days} days away, so this booking can't be cancelled for a refund.`;
  }
  return `Free cancellation until ${formatDate(deadline)} (${rule.days} days before check-in). After that, the booking is non-refundable.`;
}
