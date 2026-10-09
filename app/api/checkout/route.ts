import {
  Beds24Error,
  createHeldBooking,
  getOffers,
  releaseHeldBooking,
} from "@/lib/beds24";
import { PAYMENT, villas } from "@/lib/data";
import {
  MidtransError,
  createSnapTransaction,
  snapClientConfig,
} from "@/lib/midtrans";
import { makeOrderId } from "@/lib/payments";
import { parseStay } from "@/lib/stay";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function bad(error: string, status = 400) {
  return Response.json({ error }, { status });
}

// POST /api/checkout — hold the villa in Beds24 and open a Midtrans payment.
// The price always comes from a fresh Beds24 check, never from the browser.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("Invalid request.");

  const stay = parseStay(body.checkin, body.checkout, body.guests);
  if ("error" in stay) return bad(stay.error);

  const villa = villas.find((v) => v.roomId === Number(body.roomId));
  if (!villa) return bad("Unknown villa.");
  if (stay.guests > villa.maxGuests) {
    return bad(`${villa.name} sleeps up to ${villa.maxGuests}.`);
  }

  const firstName = text(body.firstName, 60);
  const lastName = text(body.lastName, 60);
  const email = text(body.email, 120);
  const phone = text(body.phone, 40);
  const notes = text(body.notes, 1000);
  if (!firstName || !lastName) return bad("Please enter your name.");
  if (!EMAIL.test(email)) return bad("Please enter a valid email.");

  let bookingId: number | null = null;
  try {
    const offers = await getOffers(stay.checkin, stay.checkout, stay.guests, {
      fresh: true,
    });
    const offer = offers.find((o) => o.roomId === villa.roomId);
    if (!offer?.available || offer.price == null) {
      return bad(`${villa.name} is no longer available for these dates.`, 409);
    }
    const amount = Math.round((offer.price * PAYMENT.percent) / 100);

    bookingId = await createHeldBooking({
      roomId: villa.roomId,
      ...stay,
      price: offer.price,
      firstName,
      lastName,
      email,
      phone,
      notes,
    });

    const orderId = makeOrderId(bookingId);
    // Behind nginx the app sees http; trust the proxy's forwarded proto.
    const url = new URL(request.url);
    const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.slice(0, -1);
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;

    const token = await createSnapTransaction({
      orderId,
      amount,
      itemName: `${villa.name}, ${stay.checkin} to ${stay.checkout}`,
      customer: { firstName, lastName, email, phone },
      finishUrl: `${proto}://${host}/reserve`,
      expiryMinutes: PAYMENT.expiryMinutes,
    });

    return Response.json({
      token,
      orderId,
      amount,
      price: offer.price,
      testMode: bookingId === null,
      ...snapClientConfig(),
    });
  } catch (err) {
    console.error(err);
    // Don't leave the villa blocked if the payment couldn't be opened.
    if (bookingId !== null) {
      await releaseHeldBooking(bookingId).catch((e) => console.error(e));
    }
    if (err instanceof Beds24Error || err instanceof MidtransError) {
      return bad(
        "We couldn't start the payment. Please try again, or message us on WhatsApp.",
        502,
      );
    }
    return bad("Something went wrong. Please try again, or message us on WhatsApp.", 500);
  }
}
