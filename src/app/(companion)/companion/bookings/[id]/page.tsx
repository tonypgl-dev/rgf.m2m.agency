import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Chat, type ChatBooking } from "@/components/shared/chat";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin } from "lucide-react";
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

export default async function CompanionBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify companion identity
  const { data: companion } = await supabase
    .from("companions")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!companion) redirect("/companion/dashboard");

  // Fetch booking (must belong to this companion)
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("companion_id", companion.id)
    .single();

  if (!booking) notFound();

  const status = booking.status as BookingStatus;

  const { data: slot } = await supabase
    .from("availability_slots")
    .select("date, time_start, time_end")
    .eq("id", booking.slot_id)
    .single();

  const { data: tourist } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", booking.tourist_id)
    .single();

  // ── Confirmed / completed → chat view ────────────────────────────────────
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
        <div className="flex items-center justify-between px-4 py-3 bg-background border-b">
          <Link
            href="/companion/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </Link>
          <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
        </div>

        <div className="flex-1 min-h-0 p-4">
          <Chat
            booking={chatBooking}
            currentUserId={user.id}
            userRole="companion"
            otherPartyName={tourist?.full_name ?? null}
            initialMessages={(messages ?? []) as Message[]}
          />
        </div>
      </div>
    );
  }

  // ── Pending / cancelled → summary view ────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Booking</h1>
          <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
        </div>

        <div className="rounded-xl border bg-background p-6 space-y-4 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Tourist
            </p>
            <p className="font-medium">{tourist?.full_name ?? "—"}</p>
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
            <span>Earnings</span>
            <span>${(Number(booking.total_price) * 0.75).toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            After 25% platform fee from ${Number(booking.total_price).toFixed(2)}
          </p>
        </div>

        <Link
          href="/companion/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
