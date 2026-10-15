// Outgoing email through Resend (transactional email API). Server only.
//
// RESEND_API_KEY   API key with "Sending access" for tissvalley.com
// EMAIL_FROM       optional, default "TISS Valley <reservations@tissvalley.com>"
// EMAIL_REPLY_TO   optional, default reservations@tissvalley.com (the Zoho
//                  inbox, so guest replies reach the team)

export class EmailError extends Error {}

const DEFAULT_FROM = "TISS Valley <reservations@tissvalley.com>";
const DEFAULT_REPLY_TO = "reservations@tissvalley.com";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function replyToAddress() {
  return process.env.EMAIL_REPLY_TO || DEFAULT_REPLY_TO;
}

export type Email = {
  to: string;
  bcc?: string;
  subject: string;
  html: string;
  text: string;
  /**
   * Same key = same email: Resend sends it only once, so retries and
   * concurrent calls for one invoice can't reach the guest twice.
   */
  idempotencyKey: string;
};

/** Send one email. Returns the Resend message id. */
export async function sendEmail(email: Email): Promise<string> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new EmailError("RESEND_API_KEY is not set");

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        "idempotency-key": email.idempotencyKey,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to: [email.to],
        ...(email.bcc ? { bcc: [email.bcc] } : {}),
        reply_to: replyToAddress(),
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new EmailError(`Resend unreachable: ${String(err)}`);
  }
  const body = await res.json().catch(() => null);
  if (res.ok && typeof body?.id === "string") return body.id;
  // Already sent (or being sent) under this key — not an error for us.
  if (res.status === 409) return `duplicate:${email.idempotencyKey}`;
  throw new EmailError(`Resend failed (${res.status}): ${JSON.stringify(body)}`);
}
