import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getStripe } from "@/lib/stripe";
import { PaymentForm } from "@/components/shared/payment-form";
import { Separator } from "@/components/ui/separator";

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const service = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("tourist_id", user.id)
    .single();

  if (!booking) notFound();
  if (booking.status !== "pending") redirect(`/tourist/bookings/${id}`);

  // Fetch companion (need stripe_account_id)
  const { data: companion } = await supabase
    .from("companions")
    .select("stripe_account_id, profiles(full_name)")
    .eq("id", booking.companion_id)
    .single();

  const stripeAccountId = companion?.stripe_account_id as string | null | undefined;

  if (!stripeAccountId) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <div className="max-w-sm text-center space-y-2">
          <h1 className="text-lg font-semibold">Payment unavailable</h1>
          <p className="text-sm text-muted-foreground">
            This guide hasn&apos;t connected their Stripe account yet. Please
            contact support or try someone else.
          </p>
        </div>
      </div>
    );
  }

  // Create or retrieve PaymentIntent
  let clientSecret: string;

  if (booking.stripe_payment_intent_id) {
    const pi = await getStripe().paymentIntents.retrieve(
      booking.stripe_payment_intent_id
    );
    if (pi.status === "succeeded") redirect(`/tourist/bookings/${id}`);
    clientSecret = pi.client_secret!;
  } else {
    const amount = Math.round(Number(booking.total_price) * 100); // cents
    const applicationFee = Math.round(amount * 0.25); // 25% platform fee

    const pi = await getStripe().paymentIntents.create({
      amount,
      currency: "usd",
      application_fee_amount: applicationFee,
      transfer_data: { destination: stripeAccountId },
      metadata: { booking_id: id },
    });

    clientSecret = pi.client_secret!;

    await service
      .from("bookings")
      .update({ stripe_payment_intent_id: pi.id })
      .eq("id", id);
  }

  // Fetch slot for display
  const { data: slot } = await supabase
    .from("availability_slots")
    .select("date, time_start, time_end")
    .eq("id", booking.slot_id)
    .single();

  const companionProfile = companion?.profiles as
    | { full_name: string | null }
    | undefined;

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Complete payment</h1>

        {/* Order summary */}
        <div className="rounded-xl border bg-background p-5 text-sm space-y-3">
          <p className="font-medium text-base">Order summary</p>
          <Separator />
          {[
            ["Guide", companionProfile?.full_name ?? "—"],
            ["Date", slot?.date ?? "—"],
            [
              "Time",
              slot
                ? `${formatTime(slot.time_start)} – ${formatTime(slot.time_end)}`
                : "—",
            ],
            ["Activity", booking.activity],
            ["Duration", `${booking.duration_hours}h`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>${Number(booking.total_price).toFixed(2)}</span>
          </div>
        </div>

        {/* Stripe Payment Element */}
        <div className="rounded-xl border bg-background p-5">
          <PaymentForm clientSecret={clientSecret} bookingId={id} />
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Payments are processed securely by Stripe. A 25% platform fee is included.
        </p>
      </div>
    </div>
  );
}
