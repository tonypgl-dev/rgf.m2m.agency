"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookingAction } from "@/app/actions/bookings";
import type { Companion, Profile, AvailabilitySlot } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CompanionFull extends Companion {
  profiles: Profile;
}

interface Props {
  companion: CompanionFull;
  slots: AvailabilitySlot[];
  isLoggedIn: boolean;
}

// ─── Date / time helpers ──────────────────────────────────────────────────────

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonday(weekOffset: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + weekOffset * 7);
  return monday;
}

function toDateStr(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr);
  return `${h % 12 || 12}:${mStr} ${h >= 12 ? "PM" : "AM"}`;
}

function slotDurationHours(slot: AvailabilitySlot): number {
  const [sh, sm] = slot.time_start.split(":").map(Number);
  const [eh, em] = slot.time_end.split(":").map(Number);
  return Math.round(((eh * 60 + em - sh * 60 - sm) / 60) * 10) / 10;
}

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Week Calendar ─────────────────────────────────────────────────────────────

interface WeekCalendarProps {
  weekOffset: number;
  onWeekChange: (delta: number) => void;
  slotsByDate: Record<string, AvailabilitySlot[]>;
  selectedDate: string | null;
  onDateSelect: (dateStr: string) => void;
  /** If true, disallow going to previous weeks before current */
  lockPast?: boolean;
}

function WeekCalendar({
  weekOffset,
  onWeekChange,
  slotsByDate,
  selectedDate,
  onDateSelect,
  lockPast = true,
}: WeekCalendarProps) {
  const monday = getMonday(weekOffset);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const todayStr = toDateStr(new Date());

  const monthLabel = (() => {
    const first = days[0];
    const last = days[6];
    if (first.getMonth() === last.getMonth()) {
      return `${MONTH_NAMES[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${MONTH_NAMES[first.getMonth()]} – ${MONTH_NAMES[last.getMonth()]} ${last.getFullYear()}`;
  })();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onWeekChange(-1)}
          disabled={lockPast && weekOffset === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{monthLabel}</span>
        <Button variant="ghost" size="icon" onClick={() => onWeekChange(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((lbl) => (
          <div
            key={lbl}
            className="text-center text-xs text-muted-foreground font-medium py-1"
          >
            {lbl}
          </div>
        ))}
        {days.map((date) => {
          const dateStr = toDateStr(date);
          const past = isPast(date);
          const hasSlots = !past && Boolean(slotsByDate[dateStr]?.length);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => hasSlots && onDateSelect(dateStr)}
              disabled={past || !hasSlots}
              className={[
                "relative flex flex-col items-center justify-center rounded-lg p-2 text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : hasSlots
                    ? "hover:bg-muted cursor-pointer"
                    : "opacity-30 cursor-not-allowed",
                isToday && !isSelected ? "ring-1 ring-primary" : "",
              ].join(" ")}
            >
              <span className="font-medium leading-none">{date.getDate()}</span>
              {hasSlots && (
                <span
                  className={`mt-1 h-1 w-1 rounded-full ${
                    isSelected ? "bg-primary-foreground" : "bg-primary"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CompanionProfileClient({ companion, slots, isLoggedIn }: Props) {
  const router = useRouter();
  const profile = companion.profiles;

  // ── Display calendar (page, non-booking) ──
  const [displayWeekOffset, setDisplayWeekOffset] = useState(0);
  const [displayDate, setDisplayDate] = useState<string | null>(null);

  // ── Sheet / booking state ──
  const [sheetOpen, setSheetOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sheetWeekOffset, setSheetWeekOffset] = useState(0);
  const [sheetDate, setSheetDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [activity, setActivity] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const slotsByDate = useMemo(
    () =>
      slots.reduce<Record<string, AvailabilitySlot[]>>((acc, s) => {
        (acc[s.date] ??= []).push(s);
        return acc;
      }, {}),
    [slots]
  );

  const displaySlots = displayDate ? (slotsByDate[displayDate] ?? []) : [];
  const sheetSlots = sheetDate ? (slotsByDate[sheetDate] ?? []) : [];
  const duration = selectedSlot ? slotDurationHours(selectedSlot) : 0;
  const totalPrice = duration * (companion.hourly_rate ?? 0);

  function openSheet() {
    if (!isLoggedIn) {
      router.push(`/login?next=/companions/${companion.id}`);
      return;
    }
    setStep(1);
    setSheetDate(null);
    setSelectedSlot(null);
    setActivity("");
    setMeetingPoint("");
    setBookingError(null);
    setSheetOpen(true);
  }

  async function handleProceedToPayment() {
    if (!selectedSlot) return;
    setSubmitting(true);
    setBookingError(null);

    const result = await createBookingAction({
      companion_id: companion.id,
      slot_id: selectedSlot.id,
      activity,
      meeting_point: meetingPoint,
      total_price: totalPrice,
      duration_hours: Math.round(duration),
    });

    setSubmitting(false);
    if (result?.error) setBookingError(result.error);
  }

  const avatarInitials = initials(profile.full_name);

  return (
    <>
      {/* ───────────────────── Page content ───────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-8 pb-28 md:pb-12 space-y-8">

        {/* Header */}
        <div className="flex gap-4 items-start">
          <Avatar className="h-20 w-20 flex-shrink-0 text-lg">
            {profile.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? ""} />
            )}
            <AvatarFallback>{avatarInitials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">
                {profile.full_name ?? "Companion"}
              </h1>
              {companion.verified && (
                <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
              {companion.total_reviews > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {companion.rating_avg.toFixed(1)}
                  <span className="text-muted-foreground/60">
                    · {companion.total_reviews} reviews
                  </span>
                </span>
              )}
              {profile.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.city}
                </span>
              )}
            </div>

            {companion.hourly_rate != null && (
              <p className="mt-2 text-lg font-semibold">
                ${companion.hourly_rate}
                <span className="text-sm font-normal text-muted-foreground"> / hr</span>
              </p>
            )}
          </div>

          {/* Desktop Book Now */}
          <Button size="lg" onClick={openSheet} className="hidden md:flex flex-shrink-0">
            Book Now
          </Button>
        </div>

        <Separator />

        {/* Bio */}
        {companion.bio && (
          <section className="space-y-2">
            <h2 className="font-semibold text-lg">About</h2>
            <p className="text-muted-foreground leading-relaxed">{companion.bio}</p>
          </section>
        )}

        {/* Languages & Activities */}
        {(companion.languages.length > 0 || companion.activities.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {companion.languages.length > 0 && (
              <section className="space-y-2">
                <h2 className="font-semibold">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {companion.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">{lang}</Badge>
                  ))}
                </div>
              </section>
            )}
            {companion.activities.length > 0 && (
              <section className="space-y-2">
                <h2 className="font-semibold">Activities</h2>
                <div className="flex flex-wrap gap-2">
                  {companion.activities.map((act) => (
                    <Badge key={act} variant="outline">{act}</Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <Separator />

        {/* Availability calendar (display) */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">Availability</h2>

          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No upcoming availability yet.
            </p>
          ) : (
            <>
              <WeekCalendar
                weekOffset={displayWeekOffset}
                onWeekChange={(d) => setDisplayWeekOffset((p) => p + d)}
                slotsByDate={slotsByDate}
                selectedDate={displayDate}
                onDateSelect={setDisplayDate}
              />

              {displayDate && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Available times
                  </p>
                  {displaySlots.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {displaySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm"
                        >
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatTime(slot.time_start)} – {formatTime(slot.time_end)}
                          <span className="text-muted-foreground">
                            ({slotDurationHours(slot)}h)
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No slots available.</p>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <Separator />

        {/* Reviews */}
        <section className="space-y-3">
          <h2 className="font-semibold text-lg">
            Reviews{companion.total_reviews > 0 && ` (${companion.total_reviews})`}
          </h2>
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        </section>
      </div>

      {/* ───────────────────── Mobile sticky bar ───────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:hidden z-40">
        <div className="flex items-center gap-4 max-w-3xl mx-auto">
          {companion.hourly_rate != null && (
            <div className="flex-shrink-0">
              <span className="font-semibold text-lg">${companion.hourly_rate}</span>
              <span className="text-sm text-muted-foreground"> / hr</span>
            </div>
          )}
          <Button size="lg" onClick={openSheet} className="flex-1">
            Book Now
          </Button>
        </div>
      </div>

      {/* ───────────────────── Booking Sheet ───────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg flex flex-col p-0"
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>
              {step === 1 && "Select a time slot"}
              {step === 2 && "Booking details"}
              {step === 3 && "Confirm booking"}
            </SheetTitle>
            {/* Step indicator */}
            <div className="flex gap-1 mt-2">
              {([1, 2, 3] as const).map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    s <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* ── Step 1: Calendar + slot selection ── */}
            {step === 1 && (
              <>
                <WeekCalendar
                  weekOffset={sheetWeekOffset}
                  onWeekChange={(d) => setSheetWeekOffset((p) => p + d)}
                  slotsByDate={slotsByDate}
                  selectedDate={sheetDate}
                  onDateSelect={(date) => {
                    setSheetDate(date);
                    setSelectedSlot(null);
                  }}
                />

                {!sheetDate && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Select a highlighted date to see available times.
                  </p>
                )}

                {sheetDate && sheetSlots.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No available slots for this day.
                  </p>
                )}

                {sheetDate && sheetSlots.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Available times
                    </p>
                    {sheetSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const hrs = slotDurationHours(slot);
                      const price = hrs * (companion.hourly_rate ?? 0);

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={[
                            "w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors",
                            isSelected
                              ? "border-primary bg-primary/5 text-primary"
                              : "hover:bg-muted",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatTime(slot.time_start)} – {formatTime(slot.time_end)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {hrs}h
                            {companion.hourly_rate != null && (
                              <> · ${price.toFixed(0)}</>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── Step 2: Activity + meeting point ── */}
            {step === 2 && selectedSlot && (
              <>
                {/* Slot recap */}
                <div className="rounded-lg bg-muted px-4 py-3 text-sm space-y-1.5">
                  {[
                    ["Date", selectedSlot.date],
                    [
                      "Time",
                      `${formatTime(selectedSlot.time_start)} – ${formatTime(selectedSlot.time_end)}`,
                    ],
                    ["Duration", `${duration}h`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="activity">Activity</Label>
                  {companion.activities.length > 0 ? (
                    <Select value={activity} onValueChange={(v) => setActivity(v ?? "")}>
                      <SelectTrigger id="activity">
                        <SelectValue placeholder="Choose an activity…" />
                      </SelectTrigger>
                      <SelectContent>
                        {companion.activities.map((act) => (
                          <SelectItem key={act} value={act}>
                            {act}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="activity"
                      placeholder="e.g. City tour, Museum visit"
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="meeting-point">Meeting point</Label>
                  <Input
                    id="meeting-point"
                    placeholder="e.g. Piața Unirii, Bucharest"
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ── Step 3: Summary ── */}
            {step === 3 && selectedSlot && (
              <>
                <div className="rounded-lg border p-4 space-y-4 text-sm">
                  {/* Companion info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {profile.avatar_url && (
                        <AvatarImage src={profile.avatar_url} />
                      )}
                      <AvatarFallback>{avatarInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile.full_name}</p>
                      {profile.city && (
                        <p className="text-muted-foreground text-xs">{profile.city}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Booking details */}
                  <div className="space-y-2">
                    {[
                      ["Date", selectedSlot.date],
                      [
                        "Time",
                        `${formatTime(selectedSlot.time_start)} – ${formatTime(selectedSlot.time_end)}`,
                      ],
                      ["Duration", `${duration}h`],
                      ["Activity", activity],
                      ["Meeting point", meetingPoint],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-muted-foreground flex-shrink-0">{label}</span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {bookingError && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
                    {bookingError}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer navigation */}
          <div className="border-t px-6 py-4 flex gap-2 bg-background">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                disabled={submitting}
              >
                Back
              </Button>
            )}
            {step === 1 && (
              <Button
                className="flex-1"
                disabled={!selectedSlot}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            )}
            {step === 2 && (
              <Button
                className="flex-1"
                disabled={!activity.trim() || !meetingPoint.trim()}
                onClick={() => setStep(3)}
              >
                Review booking
              </Button>
            )}
            {step === 3 && (
              <Button
                className="flex-1"
                disabled={submitting}
                onClick={handleProceedToPayment}
              >
                {submitting ? "Processing…" : "Proceed to Payment"}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
