// Small in-memory rate limiter for the API routes. The site runs as one
// Node process behind nginx, so per-process memory is enough; it resets on
// restart, which is fine for abuse protection.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

/**
 * Client IP as seen by nginx. X-Real-IP is set by nginx itself; the last
 * X-Forwarded-For entry is the one nginx appended. Never trust the first
 * X-Forwarded-For entry — the client can write that.
 */
export function clientIp(request: Request) {
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",").at(-1)!.trim();
  return "unknown";
}

/**
 * Allow `limit` requests per `windowMs` for `key`. Returns the seconds to
 * wait when the limit is hit, or 0 when the request may go ahead.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) prune(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return 0;
  }
  if (bucket.count >= limit) return Math.ceil((bucket.resetAt - now) / 1000);
  bucket.count++;
  return 0;
}

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Still full (a flood of distinct IPs): drop the oldest half.
  if (buckets.size >= MAX_KEYS) {
    let drop = Math.floor(buckets.size / 2);
    for (const key of buckets.keys()) {
      if (drop-- <= 0) break;
      buckets.delete(key);
    }
  }
}

/** 429 response for a limited request. */
export function tooManyRequests(retryAfter: number) {
  return Response.json(
    { error: "Too many requests. Please wait a moment and try again." },
    { status: 429, headers: { "retry-after": String(retryAfter) } },
  );
}

let warnedNoIp = false;

/**
 * Apply a named limit to a request. Returns a 429 Response to send back, or
 * null when the request may go ahead.
 */
export function limitRequest(
  request: Request,
  name: string,
  limit: number,
  windowMs: number,
) {
  const ip = clientIp(request);
  if (ip === "unknown") {
    // Without the proxy's IP headers every visitor would share one bucket
    // and block each other. Skip limiting rather than lock everyone out.
    if (!warnedNoIp) {
      warnedNoIp = true;
      console.warn(
        "[rate-limit] No X-Real-IP / X-Forwarded-For header — limits are off. Set them in nginx.",
      );
    }
    return null;
  }
  const wait = rateLimit(`${name}:${ip}`, limit, windowMs);
  return wait > 0 ? tooManyRequests(wait) : null;
}
