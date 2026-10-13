import { Beds24Error, getCancellationRule, getOffers } from "@/lib/beds24";
import { sweepStaleHolds } from "@/lib/payments";
import { limitRequest } from "@/lib/rate-limit";
import { parseStay } from "@/lib/stay";

// GET /api/availability?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&guests=2
export async function GET(request: Request) {
  // Each uncached search costs Beds24 API credit; keep one visitor from
  // spending the property's whole allowance.
  const limited = limitRequest(request, "availability", 30, 60_000);
  if (limited) return limited;

  const params = new URL(request.url).searchParams;
  const stay = parseStay(
    params.get("checkin"),
    params.get("checkout"),
    params.get("guests"),
  );
  if ("error" in stay) {
    return Response.json({ error: stay.error }, { status: 400 });
  }

  try {
    sweepStaleHolds();
    const [offers, cancellation] = await Promise.all([
      getOffers(stay.checkin, stay.checkout, stay.guests),
      // The policy is shown before paying; a lookup failure shouldn't hide
      // availability, the page then falls back to "ask us".
      getCancellationRule().catch((err) => {
        console.error(err);
        return null;
      }),
    ]);
    return Response.json({ currency: "IDR", offers, cancellation });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Beds24Error
        ? "We couldn't reach our booking system. Please try again, or message us on WhatsApp."
        : "Something went wrong. Please try again, or message us on WhatsApp.";
    return Response.json({ error: message }, { status: 502 });
  }
}
