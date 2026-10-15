// Payment receipt / booking confirmation email sent to the guest after a
// Midtrans payment settles. Pure functions: build the email from data.
// Email clients need tables and inline styles, so this is plain HTML
// strings rather than React.

import { formatDate } from "@/lib/cancellation";
import { BUSINESS, SITE_URL } from "@/lib/seo";

export type InvoiceData = {
  orderId: string;
  /** Beds24 booking id; null in test mode (nothing booked). */
  bookingId: number | null;
  guestName: string;
  guestEmail: string;
  villaName: string;
  checkin: string;
  checkout: string;
  nights: number;
  guests: number;
  /** Amount charged, IDR. */
  amount: number;
  /** Total stay price, IDR (differs from amount only with a deposit). */
  total: number;
  method: string;
  /** Midtrans settlement time, "YYYY-MM-DD HH:mm:ss" WIB. */
  paidAt: string;
  cancellation: string;
};

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "15 October 2026, 11:05 WIB" from Midtrans' "2026-10-15 11:05:08". */
function formatPaidAt(paidAt: string) {
  const m = paidAt.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2})/);
  return m ? `${formatDate(m[1])}, ${m[2]}:${m[3]} WIB` : paidAt;
}

export function bookingReference(d: Pick<InvoiceData, "bookingId" | "orderId">) {
  return d.bookingId ? `TV-${d.bookingId}` : d.orderId;
}

export function buildInvoiceEmail(d: InvoiceData) {
  const ref = bookingReference(d);
  const testMode = d.bookingId === null;
  const firstName = d.guestName.split(" ")[0] || "there";
  const deposit = d.amount < d.total;
  const address = `${BUSINESS.streetAddress}, ${BUSINESS.locality}, ${BUSINESS.district}, ${BUSINESS.county}, ${BUSINESS.region} ${BUSINESS.postalCode}`;

  const stayRows: [string, string][] = [
    ["Booking reference", ref],
    ["Villa", d.villaName],
    ["Check-in", formatDate(d.checkin)],
    ["Check-out", formatDate(d.checkout)],
    ["Length of stay", `${d.nights} ${d.nights === 1 ? "night" : "nights"}`],
    ["Guests", `${d.guests} ${d.guests === 1 ? "guest" : "guests"}`],
  ];
  const payRows: [string, string][] = [
    ...(deposit ? ([["Stay total", idr.format(d.total)]] as [string, string][]) : []),
    [deposit ? "Deposit paid" : "Amount paid", idr.format(d.amount)],
    ...(deposit ? ([["Balance due", idr.format(d.total - d.amount)]] as [string, string][]) : []),
    ["Paid with", d.method],
    ["Paid on", formatPaidAt(d.paidAt)],
    ["Payment reference", d.orderId],
  ];

  const subject = `${testMode ? "[TEST] " : ""}Booking confirmed — ${d.villaName}, ${formatDate(d.checkin)} (${ref})`;

  const rows = (items: [string, string][]) =>
    items
      .map(
        ([k, v]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #E4DBC9;color:#6B675F;font-size:13px;width:44%;vertical-align:top;">${escapeHtml(k)}</td>
            <td style="padding:10px 0;border-bottom:1px solid #E4DBC9;color:#2B2A27;font-size:14px;text-align:right;vertical-align:top;">${escapeHtml(v)}</td>
          </tr>`,
      )
      .join("");

  const sectionTitle = (t: string) =>
    `<p style="margin:32px 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#B5765A;">${t}</p>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#EFE7D7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFE7D7;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FBF8F2;border:1px solid #E4DBC9;font-family:Helvetica,Arial,sans-serif;">
      ${
        testMode
          ? `<tr><td style="background:#B5765A;color:#FBF8F2;font-size:12px;letter-spacing:1px;text-align:center;padding:8px;">TEST PAYMENT — no booking was made</td></tr>`
          : ""
      }
      <tr><td align="center" style="background:#2B2A27;padding:28px 24px;">
        <img src="${SITE_URL}/logo/tiss-valley.png" width="72" height="72" alt="TISS Valley" style="display:block;border:0;">
      </td></tr>
      <tr><td style="padding:36px 40px 8px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7E927F;">Payment received · Booking confirmed</p>
        <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;line-height:1.25;color:#2B2A27;">Thank you, ${escapeHtml(firstName)}.</h1>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#4A4741;">Your stay at TISS Valley is confirmed. This email is your receipt — please keep it for your records.</p>
      </td></tr>
      <tr><td style="padding:0 40px;">
        ${sectionTitle("Your stay")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows(stayRows)}</table>
        ${sectionTitle("Payment")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows(payRows)}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
          <tr>
            <td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#2B2A27;">${deposit ? "Paid now" : "Total paid"}</td>
            <td style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#2B2A27;text-align:right;">${idr.format(d.amount)}</td>
          </tr>
          <tr><td colspan="2" style="padding-top:6px;"><span style="display:inline-block;background:#2E4034;color:#EFE7D7;font-size:11px;letter-spacing:2px;padding:4px 10px;">PAID</span></td></tr>
        </table>
        ${sectionTitle("Cancellation policy")}
        <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#4A4741;">${escapeHtml(d.cancellation)}</p>
        ${sectionTitle("Questions?")}
        <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#4A4741;">Reply to this email, or message us on WhatsApp at <a href="${BUSINESS.whatsapp}" style="color:#B5765A;">${escapeHtml(BUSINESS.telephone)}</a>.</p>
      </td></tr>
      <tr><td style="padding:40px 40px 32px;">
        <p style="margin:0;padding-top:20px;border-top:1px solid #E4DBC9;font-size:12px;line-height:1.6;color:#8C877D;">
          ${escapeHtml(BUSINESS.name)} · ${escapeHtml(address)}<br>
          <a href="${SITE_URL}" style="color:#8C877D;">tissvalley.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const line = (items: [string, string][]) => items.map(([k, v]) => `${k}: ${v}`).join("\n");
  const text = [
    testMode ? "TEST PAYMENT — no booking was made\n" : "",
    `Thank you, ${firstName}.`,
    "Your stay at TISS Valley is confirmed. This email is your receipt.",
    "",
    "YOUR STAY",
    line(stayRows),
    "",
    "PAYMENT",
    line(payRows),
    "",
    "CANCELLATION POLICY",
    d.cancellation,
    "",
    `Questions? Reply to this email, or WhatsApp ${BUSINESS.telephone}.`,
    "",
    `${BUSINESS.name} · ${address}`,
    SITE_URL,
  ].join("\n");

  return { subject, html, text };
}
