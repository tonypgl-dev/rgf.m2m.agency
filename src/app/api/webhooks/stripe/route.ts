import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const service = createServiceClient();

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;

    const { data: booking } = await service
      .from("bookings")
      .select("id")
      .eq("stripe_payment_intent_id", pi.id)
      .single();

    if (booking) {
      await service
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", booking.id);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object;

    const { data: booking } = await service
      .from("bookings")
      .select("id, slot_id")
      .eq("stripe_payment_intent_id", pi.id)
      .single();

    if (booking) {
      await Promise.all([
        service
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("id", booking.id),
        service
          .from("availability_slots")
          .update({ is_booked: false })
          .eq("id", booking.slot_id),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
