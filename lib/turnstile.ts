// Cloudflare Turnstile check for /api/checkout, which holds a villa in
// Beds24 — the endpoint a bot would spam to block the calendar. Server only.
//
// NEXT_PUBLIC_TURNSTILE_SITE_KEY  public widget key (baked in at build time)
// TURNSTILE_SECRET_KEY            secret for server-side verification
//
// Required when MIDTRANS_IS_PRODUCTION=true. In sandbox it is skipped if the
// keys are missing; Cloudflare's test keys (always pass) work for local dev.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = "ok" | "failed" | "not-configured";

export async function verifyTurnstile(
  token: unknown,
  ip: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return "not-configured";
  if (typeof token !== "string" || !token || token.length > 2048) return "failed";

  const form = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") form.set("remoteip", ip);
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body: form,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const body = await res.json().catch(() => null);
    return body?.success === true ? "ok" : "failed";
  } catch (err) {
    console.error("[turnstile]", err);
    return "failed";
  }
}
