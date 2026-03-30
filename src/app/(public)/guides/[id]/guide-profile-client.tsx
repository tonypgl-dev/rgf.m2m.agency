"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface GuideFull extends Companion {
  profiles: Profile;
}

interface Props {
  guide: GuideFull;
  slots: AvailabilitySlot[];
  isLoggedIn: boolean;
}

// ─── Activity tag colors ────────────────────────────────────────────────────────

const ACTIVITY_COLORS: Record<string, { bg: string; text: string }> = {
  "City Tour":    { bg: "bg-violet-100 dark:bg-violet-950/60", text: "text-violet-700 dark:text-violet-300" },
  "Food Tour":    { bg: "bg-amber-100  dark:bg-amber-950/60",  text: "text-amber-700  dark:text-amber-300"  },
  Hiking:         { bg: "bg-green-100  dark:bg-green-950/60",  text: "text-green-700  dark:text-green-300"  },
  Coffee:         { bg: "bg-orange-100 dark:bg-orange-950/60", text: "text-orange-700 dark:text-orange-300" },
  Museum:         { bg: "bg-blue-100   dark:bg-blue-950/60",   text: "text-blue-700   dark:text-blue-300"   },
  Nightlife:      { bg: "bg-pink-100   dark:bg-pink-950/60",   text: "text-pink-700   dark:text-pink-300"   },
  Shopping:       { bg: "bg-rose-100   dark:bg-rose-950/60",   text: "text-rose-700   dark:text-rose-300"   },
  Photography:    { bg: "bg-cyan-100   dark:bg-cyan-950/60",   text: "text-cyan-700   dark:text-cyan-300"   },
};

const FALLBACK_COLOR = {
  bg: "bg-secondary",
  text: "text-secondary-foreground",
};

function activityColor(act: string) {
  for (const key of Object.keys(ACTIVITY_COLORS)) {
    if (act.toLowerCase().includes(key.toLowerCase())) {
      return ACTIVITY_COLORS[key];
    }
  }
  return FALLBACK_COLOR;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function initials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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

const SHORT_DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHORT_MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function toDateStr(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

// ─── Hero Gallery ───────────────────────────────────────────────────────────────

function HeroGallery({ photos, name }: { photos: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const touchStart = useRef(0);

  function prev() { setIdx((i) => (i - 1 + photos.length) % photos.length); }
  function next() { setIdx((i) => (i + 1) % photos.length); }

  if (photos.length === 0) {
    return (
      <div className="relative w-full aspect-[3/4] sm:aspect-[16/9] bg-gradient-to-br from-violet-200 to-pink-200 dark:from-violet-900 dark:to-pink-900 flex items-center justify-center -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden">
        <span className="text-7xl font-bold text-white/70">{name[0]?.toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-[3/4] sm:aspect-[16/9] overflow-hidden -mx-4 sm:mx-0 sm:rounded-2xl bg-muted"
      onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
      }}
    >
      {/* Gradient fallback behind image */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-200 to-pink-200 dark:from-violet-900 dark:to-pink-900 flex items-center justify-center">
        <span className="text-7xl font-bold text-white/70">{name[0]?.toUpperCase()}</span>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={photos[idx]}
        src={photos[idx]}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Nav arrows */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-lg bg-black/35 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/55 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-lg bg-black/35 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/55 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10">
          {photos.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 18 : 6,
                height: 6,
                backgroundColor: i === idx ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      )}

      {/* Photo counter badge */}
      {photos.length > 1 && (
        <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">
          {idx + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}

// ─── 7-day availability strip ────────────────────────────────────────────────────

function AvailabilityStrip({
  slots,
  selectedDate,
  onSelect,
}: {
  slots: AvailabilitySlot[];
  selectedDate: string | null;
  onSelect: (d: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const slotDates = useMemo(
    () => new Set(slots.map((s) => s.date)),
    [slots]
  );

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
      {days.map((day) => {
        const dateStr = toDateStr(day);
        const hasSlots = slotDates.has(dateStr);
        const isSelected = selectedDate === dateStr;
        const isToday = dateStr === toDateStr(today);

        return (
          <button
            key={dateStr}
            type="button"
            disabled={!hasSlots}
            onClick={() => hasSlots && onSelect(dateStr)}
            className={[
              "snap-start flex-shrink-0 flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 transition-all border",
              isSelected
                ? "bg-foreground text-background border-foreground"
                : hasSlots
                  ? "bg-card border-border hover:border-foreground/30 cursor-pointer"
                  : "bg-muted border-transparent opacity-35 cursor-default",
            ].join(" ")}
            style={{ minWidth: 52 }}
          >
            <span className={`text-[10px] font-medium uppercase tracking-wide ${isSelected ? "opacity-70" : "text-muted-foreground"}`}>
              {isToday ? "Today" : SHORT_DAY[day.getDay()]}
            </span>
            <span className="text-lg font-semibold leading-none">
              {day.getDate()}
            </span>
            <span className={`text-[10px] ${isSelected ? "opacity-70" : "text-muted-foreground"}`}>
              {SHORT_MONTH[day.getMonth()]}
            </span>
            {hasSlots && (
              <span
                className={`h-1 w-1 rounded-full ${isSelected ? "bg-background" : "bg-accent-warm"}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Booking Sheet internals ────────────────────────────────────────────────────

function BookingSheet({
  guide,
  slots,
  open,
  onOpenChange,
}: {
  guide: GuideFull;
  slots: AvailabilitySlot[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const profile = guide.profiles;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [activity, setActivity] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
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

  const daySlots = selectedDate ? (slotsByDate[selectedDate] ?? []) : [];
  const duration = selectedSlot ? slotDurationHours(selectedSlot) : 0;
  const totalPrice = duration * (guide.hourly_rate ?? 0);

  function reset() {
    setStep(1);
    setSelectedDate(null);
    setSelectedSlot(null);
    setActivity("");
    setMeetingPoint("");
    setSpecialRequests("");
    setBookingError(null);
  }

  async function handleBook() {
    if (!selectedSlot) return;
    setSubmitting(true);
    setBookingError(null);
    const result = await createBookingAction({
      companion_id: guide.id,
      slot_id: selectedSlot.id,
      activity,
      meeting_point: meetingPoint,
      total_price: totalPrice,
      duration_hours: Math.round(duration),
    });
    setSubmitting(false);
    if (result?.error) setBookingError(result.error);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[92dvh] flex flex-col p-0 sm:max-w-lg sm:mx-auto sm:rounded-2xl sm:bottom-4 sm:top-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <SheetHeader className="px-6 pb-4 border-b">
          <SheetTitle className="text-left">
            {step === 1 && "Pick a time"}
            {step === 2 && "Your details"}
            {step === 3 && "Confirm booking"}
          </SheetTitle>
          {/* Step bar */}
          <div className="flex gap-1 mt-2">
            {([1, 2, 3] as const).map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-foreground" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <p className="text-xs text-muted-foreground">Select an available day</p>
              <AvailabilityStrip
                slots={slots}
                selectedDate={selectedDate}
                onSelect={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
              />

              {selectedDate && daySlots.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-3">No slots on this day.</p>
              )}

              {!selectedDate && (
                <p className="text-sm text-muted-foreground text-center py-3 italic">
                  Tap a highlighted day above to see time slots.
                </p>
              )}

              {selectedDate && daySlots.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Available times
                  </p>
                  {daySlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const hrs = slotDurationHours(slot);
                    const price = hrs * (guide.hourly_rate ?? 0);

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={[
                          "w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all",
                          isSelected
                            ? "border-foreground bg-foreground/5"
                            : "border-border hover:border-foreground/30 hover:bg-muted",
                        ].join(" ")}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatTime(slot.time_start)} – {formatTime(slot.time_end)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {hrs}h{guide.hourly_rate != null && ` · €${price.toFixed(0)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && selectedSlot && (
            <>
              {/* Slot recap chip */}
              <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{selectedSlot.date} · {formatTime(selectedSlot.time_start)} – {formatTime(selectedSlot.time_end)}</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="activity">Activity</Label>
                {guide.activities.length > 0 ? (
                  <Select value={activity} onValueChange={(v) => setActivity(v ?? "")}>
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="Choose an activity…" />
                    </SelectTrigger>
                    <SelectContent>
                      {guide.activities.map((act) => (
                        <SelectItem key={act} value={act}>{act}</SelectItem>
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

              <div className="space-y-1.5">
                <Label htmlFor="special-requests">
                  Special requests
                  <span className="ml-1 text-xs text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="special-requests"
                  placeholder="Any dietary needs, preferences, or questions…"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            </>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && selectedSlot && (
            <>
              <div className="rounded-2xl border p-4 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
                    <AvatarFallback>{initials(profile.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{profile.full_name}</p>
                    <p className="text-muted-foreground text-xs">{profile.city}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2.5">
                  {[
                    ["Date", selectedSlot.date],
                    ["Time", `${formatTime(selectedSlot.time_start)} – ${formatTime(selectedSlot.time_end)}`],
                    ["Duration", `${duration}h`],
                    ["Activity", activity],
                    ["Meeting point", meetingPoint],
                    ...(specialRequests ? [["Special requests", specialRequests]] : []),
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
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {bookingError && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-xl p-3">
                  {bookingError}
                </p>
              )}
            </>
          )}
        </div>

        {/* Sheet footer */}
        <div className="border-t px-6 py-4 flex gap-3 bg-background">
          {step > 1 && (
            <Button
              variant="outline"
              className="flex-shrink-0"
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
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={submitting}
              onClick={handleBook}
            >
              {submitting ? "Processing…" : "Confirm & Pay"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function GuideProfileClient({ guide, slots, isLoggedIn }: Props) {
  const router = useRouter();
  const profile = guide.profiles;

  const [bioExpanded, setBioExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [stripDate, setStripDate] = useState<string | null>(null);

  const slotsByDate = useMemo(
    () =>
      slots.reduce<Record<string, AvailabilitySlot[]>>((acc, s) => {
        (acc[s.date] ??= []).push(s);
        return acc;
      }, {}),
    [slots]
  );

  const daySlots = stripDate ? (slotsByDate[stripDate] ?? []) : [];

  function openBooking() {
    if (!isLoggedIn) {
      router.push(`/login?next=/guides/${guide.id}`);
      return;
    }
    setSheetOpen(true);
  }

  const photos: string[] = guide.photos?.length > 0
    ? guide.photos
    : profile.avatar_url
      ? [profile.avatar_url]
      : [];

  const avgStr = guide.total_reviews > 0
    ? guide.rating_avg.toFixed(1)
    : null;

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32 md:pb-12 space-y-6">

        {/* ── Hero ── */}
        <HeroGallery photos={photos} name={profile.full_name ?? "Guide"} />

        {/* ── Identity ── */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.full_name ?? "Local Guide"}
            </h1>
            {guide.verified && (
              <BadgeCheck className="h-5 w-5 text-blue-500 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            {profile.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.city}
              </span>
            )}
            {avgStr && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-foreground font-medium">{avgStr}</span>
                <span className="text-muted-foreground/60">
                  · {guide.total_reviews} {guide.total_reviews === 1 ? "review" : "reviews"}
                </span>
              </span>
            )}
            {guide.hourly_rate != null && (
              <span className="font-semibold text-foreground">
                €{guide.hourly_rate}
                <span className="font-normal text-muted-foreground"> / hr</span>
              </span>
            )}
          </div>

          {guide.verified && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified Local Guide
            </span>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex gap-3">
          <Button
            size="lg"
            onClick={openBooking}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
          >
            Book Now
          </Button>
        </div>

        <Separator />

        {/* ── Activities ── */}
        {guide.activities.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Activities
            </h2>
            <div className="flex flex-wrap gap-2">
              {guide.activities.map((act) => {
                const c = activityColor(act);
                return (
                  <span
                    key={act}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${c.bg} ${c.text}`}
                  >
                    {act}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Languages ── */}
        {guide.languages.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {guide.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 rounded-lg text-sm bg-secondary text-secondary-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Bio ── */}
        {guide.bio && (
          <>
            <Separator />
            <section className="space-y-2">
              <h2 className="font-semibold">About</h2>
              <div className="relative">
                <p
                  className={[
                    "text-muted-foreground leading-relaxed text-sm",
                    !bioExpanded ? "line-clamp-3" : "",
                  ].join(" ")}
                >
                  {guide.bio}
                </p>
                {guide.bio.length > 160 && (
                  <button
                    type="button"
                    onClick={() => setBioExpanded((v) => !v)}
                    className="mt-1 inline-flex items-center gap-0.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
                  >
                    {bioExpanded ? "Show less" : "Read more"}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${bioExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>
            </section>
          </>
        )}

        <Separator />

        {/* ── Availability ── */}
        <section className="space-y-3">
          <h2 className="font-semibold">Availability this week</h2>

          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming availability.</p>
          ) : (
            <>
              <AvailabilityStrip
                slots={slots}
                selectedDate={stripDate}
                onSelect={setStripDate}
              />

              {stripDate && daySlots.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Times on this day
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
                      >
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatTime(slot.time_start)} – {formatTime(slot.time_end)}
                        <span className="text-muted-foreground text-xs">
                          ({slotDurationHours(slot)}h)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stripDate && daySlots.length === 0 && (
                <p className="text-sm text-muted-foreground">No slots available on this day.</p>
              )}
            </>
          )}
        </section>

        <Separator />

        {/* ── Reviews placeholder ── */}
        <section className="space-y-3">
          <h2 className="font-semibold">
            Reviews{guide.total_reviews > 0 && ` (${guide.total_reviews})`}
          </h2>
          {guide.total_reviews === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet — be the first!</p>
          ) : (
            <p className="text-sm text-muted-foreground">Reviews coming soon.</p>
          )}
        </section>
      </div>

      {/* ── Mobile sticky bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto">
          {guide.hourly_rate != null && (
            <p className="text-xs text-muted-foreground mb-2 text-center">
              From <span className="font-semibold text-foreground">€{guide.hourly_rate}</span> / hr
            </p>
          )}
          <Button
            size="lg"
            onClick={openBooking}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-base h-12 rounded-xl shadow-lg shadow-orange-500/20"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* ── Booking Sheet ── */}
      <BookingSheet
        guide={guide}
        slots={slots}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
