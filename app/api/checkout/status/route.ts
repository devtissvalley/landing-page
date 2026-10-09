import { isOrderId, syncPayment } from "@/lib/payments";

// GET /api/checkout/status?orderId=TISS-… — payment result for the guest's
// browser after the Snap popup closes or Midtrans redirects back. Also syncs
// Beds24, so bookings update even before (or without) the webhook arriving.
export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("orderId");
  if (!isOrderId(orderId)) {
    return Response.json({ error: "Invalid order." }, { status: 400 });
  }
  try {
    return Response.json(await syncPayment(orderId));
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Couldn't check the payment. Please refresh in a moment." },
      { status: 502 },
    );
  }
}
