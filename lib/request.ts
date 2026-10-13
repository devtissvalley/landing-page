// Shared request checks for the JSON API routes.

/**
 * Parse a JSON body, accepting only `Content-Type: application/json`. A
 * plain HTML form on another site can't send that header without a CORS
 * preflight, so this stops other sites from posting through a visitor's
 * browser. Returns null for anything else.
 */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) return null;
  const body = await request.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? body : null;
}
