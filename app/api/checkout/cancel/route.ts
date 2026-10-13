import { abandonOrder, isOrderId } from "@/lib/payments";
import { limitRequest } from "@/lib/rate-limit";
import { readJson } from "@/lib/request";

// POST /api/checkout/cancel { orderId } — the guest is changing their stay:
// expire the unpaid Midtrans order and release the held villa in Beds24.
// Never touches an order that is already paid.
export async function POST(request: Request) {
  const limited = limitRequest(request, "cancel", 10, 10 * 60_000);
  if (limited) return limited;

  const body = await readJson(request);
  const orderId = body?.orderId;
  if (!isOrderId(orderId)) {
    return Response.json({ error: "Invalid order." }, { status: 400 });
  }
  try {
    return Response.json(await abandonOrder(orderId));
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Couldn't change the booking right now. Please try again." },
      { status: 502 },
    );
  }
}
