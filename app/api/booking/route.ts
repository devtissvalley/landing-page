import { Beds24Error, createBookingRequest, getOffers } from "@/lib/beds24";
import { villas } from "@/lib/data";
import { parseStay } from "@/lib/stay";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// POST /api/booking — create a booking request in Beds24 (or dry run).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const stay = parseStay(body.checkin, body.checkout, body.guests);
  if ("error" in stay) {
    return Response.json({ error: stay.error }, { status: 400 });
  }

  const villa = villas.find((v) => v.roomId === Number(body.roomId));
  if (!villa) {
    return Response.json({ error: "Unknown villa." }, { status: 400 });
  }
  if (stay.guests > villa.maxGuests) {
    return Response.json(
      { error: `${villa.name} sleeps up to ${villa.maxGuests}.` },
      { status: 400 },
    );
  }

  const firstName = text(body.firstName, 60);
  const lastName = text(body.lastName, 60);
  const email = text(body.email, 120);
  const phone = text(body.phone, 40);
  const notes = text(body.notes, 1000);
  if (!firstName || !lastName) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return Response.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  try {
    // Re-check right before booking: the guest may have waited on the form.
    const offers = await getOffers(stay.checkin, stay.checkout, stay.guests);
    const offer = offers.find((o) => o.roomId === villa.roomId);
    if (!offer?.available) {
      return Response.json(
        { error: `${villa.name} is no longer available for these dates.` },
        { status: 409 },
      );
    }

    const result = await createBookingRequest({
      roomId: villa.roomId,
      ...stay,
      firstName,
      lastName,
      email,
      phone,
      notes,
    });

    if (result.dryRun) {
      console.info("[booking dry run]", JSON.stringify(result.payload));
      return Response.json({ status: "dry-run", price: offer.price });
    }
    return Response.json({
      status: "sent",
      price: offer.price,
      bookingId: result.result?.new?.id ?? null,
    });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Beds24Error
        ? "We couldn't reach our booking system. Please try again or contact us."
        : "Something went wrong.";
    return Response.json({ error: message }, { status: 502 });
  }
}
