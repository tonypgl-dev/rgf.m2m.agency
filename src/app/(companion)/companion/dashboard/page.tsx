import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Calendar, Star, TrendingUp } from "lucide-react";
import { AvailabilityManager } from "@/components/shared/availability-manager";
import { DeclineBookingButton } from "@/components/shared/decline-booking-button";
import type { BookingStatus, AvailabilitySlot } from "@/types";

function fmt(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default async function CompanionDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: companion } = await supabase
    .from("companions")
    .select("id, rating_avg, total_reviews, stripe_account_id")
    .eq("profile_id", user.id)
    .single();

  if (!companion) redirect("/companion/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Pending booking requests
  const { data: pendingBookings } = await supabase
    .from("bookings")
    .select(
      `id, activity, meeting_point, total_price, duration_hours,
       availability_slots(date, time_start, time_end),
       profiles!tourist_id(full_name)`
    )
    .eq("companion_id", companion.id)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  // Upcoming confirmed bookings
  const { data: confirmedBookings } = await supabase
    .from("bookings")
    .select(
      `id, activity, meeting_point,
       availability_slots(date, time_start, time_end),
       profiles!tourist_id(full_name)`
    )
    .eq("companion_id", companion.id)
    .eq("status", "confirmed")
    .order("created_at", { ascending: true });

  // Earnings: completed bookings
  const { data: completedBookings } = await supabase
    .from("bookings")
    .select("total_price, created_at")
    .eq("companion_id", companion.id)
    .eq("status", "completed");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const totalEarnings = (completedBookings ?? []).reduce(
    (sum, b) => sum + Number(b.total_price) * 0.75,
    0
  );
  const monthEarnings = (completedBookings ?? [])
    .filter((b) => b.created_at >= startOfMonth)
    .reduce((sum, b) => sum + Number(b.total_price) * 0.75, 0);

  // All availability slots (next 30 days)
  const today = now.toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: slots } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("companion_id", companion.id)
    .gte("date", today)
    .lte("date", maxDate)
    .order("date", { ascending: true });

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="bg-background border-b px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Hi, {profile?.full_name?.split(" ")[0] ?? "there"} 👋
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              {companion.total_reviews > 0 && (
                <span className="flex items-center gap-1 text-sm text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                  {Number(companion.rating_avg).toFixed(1)}{" "}
                  <span className="text-muted-foreground">
                    ({companion.total_reviews})
                  </span>
                </span>
              )}
            </div>
          </div>
          <Link
            href="/companion/profile"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Profile
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="bookings">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="bookings" className="flex-1">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex-1">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex-1">
              Availability
            </TabsTrigger>
          </TabsList>

          {/* ── Bookings tab ── */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Pending requests */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Pending requests
              </h2>

              {!pendingBookings?.length ? (
                <p className="text-sm text-muted-foreground">No pending requests.</p>
              ) : (
                <ul className="space-y-3">
                  {pendingBookings.map((b) => {
                    const slot = b.availability_slots as unknown as
                      | { date: string; time_start: string; time_end: string }
                      | null;
                    const tourist = b.profiles as unknown as { full_name: string | null } | null;

                    return (
                      <li
                        key={b.id}
                        className="rounded-xl border bg-background p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium">
                            {tourist?.full_name ?? "Tourist"}
                          </p>
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            Awaiting payment
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground">{b.activity}</p>

                        {slot && (
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {slot.date} · {fmt(slot.time_start)} – {fmt(slot.time_end)}
                          </p>
                        )}

                        <p className="text-xs font-medium">
                          ${Number(b.total_price).toFixed(2)} total · your earnings:{" "}
                          <span className="text-green-700">
                            ${(Number(b.total_price) * 0.75).toFixed(2)}
                          </span>
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                          <Link
                            href={`/companion/bookings/${b.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            View details →
                          </Link>
                          <DeclineBookingButton bookingId={b.id} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <Separator />

            {/* Confirmed upcoming */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Confirmed upcoming
              </h2>

              {!confirmedBookings?.length ? (
                <p className="text-sm text-muted-foreground">
                  No confirmed bookings yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {confirmedBookings.map((b) => {
                    const slot = b.availability_slots as unknown as
                      | { date: string; time_start: string; time_end: string }
                      | null;
                    const tourist = b.profiles as unknown as { full_name: string | null } | null;

                    return (
                      <li key={b.id}>
                        <Link
                          href={`/companion/bookings/${b.id}`}
                          className="block rounded-xl border bg-background p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium">
                              {tourist?.full_name ?? "Tourist"}
                            </p>
                            <Badge variant="default" className="shrink-0 text-xs">
                              Confirmed
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {b.activity}
                          </p>
                          {slot && (
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                              <Calendar className="h-3 w-3" />
                              {slot.date} · {fmt(slot.time_start)} –{" "}
                              {fmt(slot.time_end)}
                            </p>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </TabsContent>

          {/* ── Earnings tab ── */}
          <TabsContent value="earnings">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    This month
                  </p>
                  <p className="text-2xl font-semibold">
                    ${monthEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    All time
                  </p>
                  <p className="text-2xl font-semibold">
                    ${totalEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                After 25% platform fee · {completedBookings?.length ?? 0} completed{" "}
                {completedBookings?.length === 1 ? "booking" : "bookings"}
              </p>

              {!companion.stripe_account_id && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                  Connect Stripe to receive payouts.{" "}
                  <Link
                    href="/companion/profile"
                    className="underline underline-offset-2 font-medium"
                  >
                    Set up now →
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Availability tab ── */}
          <TabsContent value="availability">
            <AvailabilityManager slots={(slots ?? []) as AvailabilitySlot[]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
