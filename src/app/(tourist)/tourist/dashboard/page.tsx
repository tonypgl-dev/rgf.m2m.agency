import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin } from "lucide-react";
import { TouristPastBookings } from "./past-bookings";
import type { BookingStatus } from "@/types";

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

function fmt(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default async function TouristDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Mock fallback — when DB profile is missing (e.g. fix-auth not yet run)
  const profile = profileData ?? { full_name: "Test Tourist", role: "tourist" };

  if (profile.role !== "tourist") redirect("/");

  // Upcoming confirmed/pending bookings
  const { data: upcoming } = await supabase
    .from("bookings")
    .select(
      `id, status, activity, meeting_point, companion_id,
       availability_slots(date, time_start, time_end),
       companions(id, profiles(full_name, city))`
    )
    .eq("tourist_id", user.id)
    .in("status", ["pending", "confirmed"])
    .order("created_at", { ascending: true });

  // Completed bookings
  const { data: completed } = await supabase
    .from("bookings")
    .select(
      `id, status, activity, check_out_at, companion_id,
       availability_slots(date, time_start, time_end),
       companions(id, profiles(full_name, city))`
    )
    .eq("tourist_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  // Reviews already submitted by this tourist
  const { data: myReviews } = await supabase
    .from("reviews")
    .select("booking_id")
    .eq("reviewer_id", user.id);

  const reviewedBookingIds = new Set((myReviews ?? []).map((r) => r.booking_id));

  // Completed bookings still within 7-day review window and not yet reviewed
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="bg-background border-b px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Hi, {profile.full_name?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p className="text-sm text-muted-foreground">Your bookings</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Upcoming */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Upcoming
          </h2>

          {!upcoming?.length ? (
            <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">
              No upcoming bookings.{" "}
              <Link href="/companions" className="underline underline-offset-2">
                Browse guides
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((b) => {
                const status = b.status as BookingStatus;
                const slot = b.availability_slots as unknown as
                  | { date: string; time_start: string; time_end: string }
                  | null;
                const comp = b.companions as unknown as
                  | { id: string; profiles: { full_name: string | null; city: string | null } | null }
                  | null;

                return (
                  <li key={b.id}>
                    <Link
                      href={`/tourist/bookings/${b.id}`}
                      className="block rounded-xl border bg-background p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-medium truncate">
                            {comp?.profiles?.full_name ?? "Guide"}
                          </p>
                          {comp?.profiles?.city && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {comp.profiles.city}
                            </p>
                          )}
                        </div>
                        <Badge variant={STATUS_VARIANTS[status]} className="shrink-0">
                          {STATUS_LABELS[status]}
                        </Badge>
                      </div>

                      {slot && (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3" />
                          {slot.date} · {fmt(slot.time_start)} – {fmt(slot.time_end)}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">{b.activity}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <Separator />

        {/* Past bookings — client component for review interactivity */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Past bookings
          </h2>
          <TouristPastBookings
            bookings={(completed ?? []).map((b) => {
              const slot = b.availability_slots as unknown as
                | { date: string; time_start: string; time_end: string }
                | null;
              const comp = b.companions as unknown as
                | { id: string; profiles: { full_name: string | null; city: string | null } | null }
                | null;
              const checkOut = b.check_out_at ? new Date(b.check_out_at) : null;
              const withinWindow =
                checkOut !== null &&
                Date.now() - checkOut.getTime() < sevenDaysMs;
              return {
                id: b.id,
                activity: b.activity,
                slot,
                companionName: comp?.profiles?.full_name ?? null,
                companionCity: comp?.profiles?.city ?? null,
                companionProfileId: comp?.id ?? null,
                reviewable: withinWindow && !reviewedBookingIds.has(b.id),
              };
            })}
          />
        </section>
      </div>
    </div>
  );
}
