import { Beds24Error, getOffers } from "@/lib/beds24";
import { parseStay } from "@/lib/stay";

// GET /api/availability?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&guests=2
export async function GET(request: Request) {
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
    const offers = await getOffers(stay.checkin, stay.checkout, stay.guests);
    return Response.json({ currency: "IDR", offers });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Beds24Error
        ? "Availability is unavailable right now."
        : "Something went wrong.";
    return Response.json({ error: message }, { status: 502 });
  }
}
