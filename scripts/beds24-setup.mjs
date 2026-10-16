// One-off: exchange a Beds24 invite code for the refresh token the website
// writes bookings with (long life tokens are read-only).
//
// 1. Beds24 → Settings → Apps & Integrations → API → Generate invite code,
//    scopes: bookings read+write, bookings-personal write,
//    bookings-financial read+write. No delete.
// 2. Add BEDS24_INVITE_CODE=<code> to .env.local (it expires in 24 hours).
// 3. node scripts/beds24-setup.mjs
//
// The invite code line is replaced by BEDS24_REFRESH_TOKEN. Nothing secret
// is printed. Restart the app afterwards.

import fs from "node:fs";

const ENV_FILE = process.argv[2] ?? ".env.local";
const API = "https://beds24.com/api/v2";

const env = fs.readFileSync(ENV_FILE, "utf8");
const match = env.match(/^BEDS24_INVITE_CODE=(.*)$/m);
if (!match) {
  console.error(`No BEDS24_INVITE_CODE line in ${ENV_FILE}`);
  process.exit(1);
}
const code = match[1].trim().replace(/^["']|["']$/g, "");

const res = await fetch(`${API}/authentication/setup`, {
  headers: { accept: "application/json", code, deviceName: "TISS Website" },
});
const body = await res.json().catch(() => null);
if (!res.ok || typeof body?.refreshToken !== "string") {
  console.error(`Beds24 rejected the invite code (${res.status}):`, body?.error ?? body);
  process.exit(1);
}

const line = `BEDS24_REFRESH_TOKEN=${body.refreshToken}`;
const next = env
  .replace(/^BEDS24_REFRESH_TOKEN=.*\n?/m, "")
  .replace(/^BEDS24_INVITE_CODE=.*$/m, line);
fs.writeFileSync(ENV_FILE, next);

const details = await fetch(`${API}/authentication/details`, {
  headers: { accept: "application/json", token: body.token },
}).then((r) => r.json());
console.log(`Saved BEDS24_REFRESH_TOKEN to ${ENV_FILE}.`);
console.log("Scopes:", details?.token?.scopes?.join(", "));
