"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Star } from "lucide-react";
import { ReviewSheet } from "@/components/shared/review-sheet";

interface PastBooking {
  id: string;
  activity: string;
  slot: { date: string; time_start: string; time_end: string } | null;
  companionName: string | null;
  companionCity: string | null;
  companionProfileId: string | null;
  reviewable: boolean;
}

function fmt(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function TouristPastBookings({ bookings }: { bookings: PastBooking[] }) {
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  if (!bookings.length) {
    return (
      <p className="text-sm text-muted-foreground">No completed bookings yet.</p>
    );
  }

  const reviewing = bookings.find((b) => b.id === reviewingId) ?? null;

  return (
    <>
      <ul className="space-y-3">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="rounded-xl border bg-background p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="font-medium truncate">
                  {b.companionName ?? "Guide"}
                </p>
                {b.companionCity && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {b.companionCity}
                  </p>
                )}
              </div>

              {b.reviewable && (
                <button
                  type="button"
                  onClick={() => setReviewingId(b.id)}
                  className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 shrink-0"
                >
                  <Star className="h-3.5 w-3.5" />
                  Leave review
                </button>
              )}
            </div>

            {b.slot && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                <Calendar className="h-3 w-3" />
                {b.slot.date} · {fmt(b.slot.time_start)} – {fmt(b.slot.time_end)}
              </p>
            )}

            <p className="text-xs text-muted-foreground mt-1">{b.activity}</p>

            <Link
              href={`/tourist/bookings/${b.id}`}
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              View details →
            </Link>
          </li>
        ))}
      </ul>

      {reviewing && (
        <ReviewSheet
          bookingId={reviewing.id}
          revieweeId={reviewing.companionProfileId ?? ""}
          companionName={reviewing.companionName}
          open={reviewingId !== null}
          onOpenChange={(open) => {
            if (!open) setReviewingId(null);
          }}
        />
      )}
    </>
  );
}
