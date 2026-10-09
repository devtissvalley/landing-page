import { verifyNotificationSignature } from "@/lib/midtrans";
import { isOrderId, syncPayment } from "@/lib/payments";

// POST /api/midtrans/notify — Midtrans payment notification (webhook).
// Set as "Payment Notification URL" in the Midtrans dashboard:
//   https://tissvalley.com/api/midtrans/notify
// The payload is only trusted for its order id; the actual status is
// re-read from the Midtrans Status API inside syncPayment.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid notification." }, { status: 400 });
  }
  try {
    if (!verifyNotificationSignature(body)) {
      return Response.json({ error: "Invalid signature." }, { status: 403 });
    }
    // Orders not created by this site (e.g. dashboard tests): acknowledge only.
    if (!isOrderId(body.order_id)) return Response.json({ ok: true });

    const result = await syncPayment(body.order_id);
    console.info("[midtrans notify]", body.order_id, result.state);
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    // Non-2xx makes Midtrans retry the notification later.
    return Response.json({ error: "Sync failed." }, { status: 500 });
  }
}
