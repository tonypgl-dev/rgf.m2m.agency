import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Chat, type ChatBooking } from "@/components/shared/chat";
import { buttonVariants } from "@/lib/button-variants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Calendar } from "lucide-react";
import type { BookingStatus, Message } from "@/types";

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Awaiting payment",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_VARIANTS: Record<
  BookingStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
};

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default async function TouristBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirect_status?: string }>;
}) {
  const { id } = await params;
  const { redirect_status } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("tourist_id", user.id)
    .single();

  if (!booking) notFound();

  const status = booking.status as BookingStatus;

  // Fetch companion + profile
  const { data: companion } = await supabase
    .from("companions")
    .select("id, profiles(full_name, city)")
    .eq("id", booking.companion_id)
    .single();

  const { data: slot } = await supabase
    .from("availability_slots")
    .select("date, time_start, time_end")
    .eq("id", booking.slot_id)
    .single();

  const companionProfile = companion?.profiles as
    | { full_name: string | null; city: string | null }
    | undefined;

  // ── Confirmed / completed → show chat ──────────────────────────────────────
  if (status === "confirmed" || status === "completed") {
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", id)
      .order("created_at", { ascending: true });

    const chatBooking: ChatBooking = {
      id,
      date: slot?.date ?? "",
      time_start: slot?.time_start ?? "",
      time_end: slot?.time_end ?? "",
      activity: booking.activity,
      meeting_point: booking.meeting_point,
      status,
      check_in_at: booking.check_in_at ?? null,
      check_out_at: booking.check_out_at ?? null,
      duration_hours: booking.duration_hours,
      total_price: Number(booking.total_price),
    };

    return (
      <div className="h-screen flex flex-col bg-muted/30">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-background border-b">
          <Link
            href="/tourist/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </Link>
          <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
        </div>

        {/* Chat fills remaining height */}
        <div className="flex-1 min-h-0 p-4">
          <Chat
            booking={chatBooking}
            currentUserId={user.id}
            userRole="tourist"
            otherPartyName={companionProfile?.full_name ?? null}
            initialMessages={(messages ?? []) as Message[]}
          />
        </div>
      </div>
    );
  }

  // ── Pending / cancelled → show standard detail view ───────────────────────
  const paymentJustSubmitted =
    redirect_status === "succeeded" && status === "pending";

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Booking</h1>
          <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
        </div>

        {paymentJustSubmitted && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
            Payment submitted — your booking will be confirmed shortly.
          </div>
        )}


        <div className="rounded-xl border bg-background p-6 space-y-4 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Guide
            </p>
            <p className="font-medium">{companionProfile?.full_name ?? "—"}</p>
            {companionProfile?.city && (
              <p className="flex items-center gap-1 text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                {companionProfile.city}
              </p>
            )}
          </div>

          <Separator />

          {slot && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Date
                </p>
                <p className="flex items-center gap-1.5 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {slot.date}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Time
                </p>
                <p className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatTime(slot.time_start)} – {formatTime(slot.time_end)}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {[
            ["Activity", booking.activity],
            ["Meeting point", booking.meeting_point],
            ["Duration", `${booking.duration_hours}h`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-right max-w-[60%]">{value}</span>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>${Number(booking.total_price).toFixed(2)}</span>
          </div>
        </div>

        {status === "pending" && !paymentJustSubmitted && (
          <Link
            href={`/tourist/bookings/${id}/pay`}
            className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
          >
            Pay now
          </Link>
        )}

        <Link
          href="/tourist/dashboard"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-center"
          )}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
