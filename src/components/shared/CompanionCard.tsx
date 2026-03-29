"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Star, MapPin, CheckCircle } from "lucide-react";
import { RoamlyBadge } from "@/components/shared/roamly-badge";
import { cn } from "@/lib/utils";

export interface CompanionCardData {
  id: string;
  fullName: string | null;
  city: string | null;
  avatarUrl: string | null;
  photos: string[];
  languages: string[];
  activities: string[];
  ratingAvg: number;
  totalReviews: number;
  hourlyRate: number | null;
  verified: boolean;
}

const LANG_COLORS: Record<string, { bg: string; color: string }> = {
  English:   { bg: "#EDE9FE", color: "#6D28D9" },
  French:    { bg: "#FEF3C7", color: "#92400E" },
  German:    { bg: "#DCFCE7", color: "#166534" },
  Spanish:   { bg: "#FEE2E2", color: "#991B1B" },
  Italian:   { bg: "#FFF7ED", color: "#9A3412" },
  Romanian:  { bg: "#EFF6FF", color: "#1D4ED8" },
  Aromanian: { bg: "#FDF4FF", color: "#86198F" },
};

function langStyle(lang: string) {
  return LANG_COLORS[lang] ?? { bg: "#F3F4F6", color: "#374151" };
}

export function CompanionCard({
  c,
  featured,
}: {
  c: CompanionCardData;
  featured?: boolean;
}) {
  // Build the ordered photo list: photos[] first, then fallback to avatarUrl
  const allPhotos =
    c.photos.length > 0
      ? c.photos
      : c.avatarUrl
        ? [c.avatarUrl]
        : [];

  const [photoIdx, setPhotoIdx] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0); // track last delta so tap zones can ignore swipes

  const currentPhoto = allPhotos[photoIdx] ?? null;
  const total = allPhotos.length;
  const firstLetter = c.fullName?.[0]?.toUpperCase() ?? "?";

  const firstLang = c.languages[0] ?? null;
  const firstAct  = c.activities[0] ?? null;
  const extraCount =
    (c.languages.length - (firstLang ? 1 : 0)) +
    (c.activities.length - (firstAct ? 1 : 0));

  function goPrev() {
    setPhotoIdx((i) => (i - 1 + total) % total);
  }
  function goNext() {
    setPhotoIdx((i) => (i + 1) % total);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchDeltaX.current = delta;
    if (delta > 50) goPrev();
    else if (delta < -50) goNext();
  }

  return (
    <div className={cn("relative", featured && "pt-5")}>
      {/* ── "CEA MAI BUNA" ribbon badge ── */}
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full",
              "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400",
              "text-amber-900 text-[11px] font-extrabold tracking-wide uppercase",
              "shadow-[0_2px_12px_rgba(251,191,36,0.7)] ring-1 ring-amber-300/60",
              "whitespace-nowrap select-none"
            )}
          >
            🎀 Cea mai bună
          </span>
        </div>
      )}

      {/* ── Card shell (not a link — photos intercept clicks) ── */}
      <div
        className={cn(
          "rounded-2xl overflow-hidden bg-white transition-all duration-200",
          "shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)]",
          featured &&
            "ring-2 ring-amber-400 shadow-[0_4px_24px_rgba(251,191,36,0.28)] hover:shadow-[0_8px_36px_rgba(251,191,36,0.40)]"
        )}
      >
        {/* ── Photo area ── */}
        <div
          className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-muted select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Gradient placeholder — always rendered as base layer */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
            <span className="text-5xl font-bold text-white">{firstLetter}</span>
          </div>

          {/* Current photo */}
          {currentPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={currentPhoto}
              src={currentPhoto}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
              draggable={false}
            />
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(15,15,25,0.80) 0%, rgba(15,15,25,0.20) 50%, transparent 100%)",
            }}
          />

          {/* ── Tap zones: left 40% = prev, right 40% = next ── */}
          {total > 1 && (
            <>
              <div
                className="absolute inset-y-0 left-0 w-[40%] z-10 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (Math.abs(touchDeltaX.current) < 10) goPrev();
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-[40%] z-10 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (Math.abs(touchDeltaX.current) < 10) goNext();
                }}
              />
            </>
          )}

          {/* ── Dot indicators ── */}
          {total > 1 && (
            <div className="absolute bottom-[52px] left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
              {allPhotos.map((_, i) => (
                <span
                  key={i}
                  className="rounded-full transition-colors"
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor:
                      i === photoIdx ? "white" : "rgba(255,255,255,0.40)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Top-right: rating pill */}
          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm">
              <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
              <span className="text-[12px] font-semibold text-gray-900 tabular-nums">
                {c.totalReviews > 0 ? Number(c.ratingAvg).toFixed(1) : "New"}
              </span>
            </span>
          </div>

          {/* Top-left: verified + Roamly license (verified guides only) */}
          {c.verified && (
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start max-w-[min(100%,220px)]">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1">
                <CheckCircle className="h-3 w-3 text-accent shrink-0" strokeWidth={2.5} />
                <span className="text-[11px] font-medium text-white">Verified</span>
              </span>
              <RoamlyBadge className="max-w-full" />
            </div>
          )}

          {/* Bottom overlay: name + city (left) + price (right) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3 z-20 pointer-events-none">
            <div className="min-w-0">
              <p
                className="text-white font-bold leading-tight line-clamp-2 sm:text-[16px]"
                style={{ fontSize: 18 }}
              >
                {c.fullName ?? "Guide"}
              </p>
              {c.city && (
                <p className="flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-gray-300 shrink-0" />
                  <span className="text-[13px] truncate" style={{ color: "#D1D5DB" }}>
                    {c.city}
                  </span>
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-white font-semibold leading-tight" style={{ fontSize: 16 }}>
                €{c.hourlyRate ?? "—"}
              </p>
              <p style={{ fontSize: 12, color: "#D1D5DB" }}>/hr</p>
            </div>
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="p-3 space-y-2.5">
          {/* Tags: 1 language + 1 activity + "+N more" */}
          {(firstLang || firstAct || extraCount > 0) && (
            <div className="flex items-center gap-1.5 overflow-hidden">
              {firstLang && (() => {
                const { bg, color } = langStyle(firstLang);
                return (
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shrink-0"
                    style={{ backgroundColor: bg, color }}
                  >
                    {firstLang}
                  </span>
                );
              })()}
              {firstAct && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shrink-0 bg-gray-100 text-gray-700">
                  {firstAct}
                </span>
              )}
              {extraCount > 0 && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shrink-0 bg-gray-100 text-gray-500">
                  +{extraCount} more
                </span>
              )}
            </div>
          )}

          {/* Book a Guide → profile */}
          <Link
            href={`/companions/${c.id}`}
            className="block w-full h-10 rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 select-none"
            style={{ backgroundColor: "#FB923C" }}
          >
            Book a Guide <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function CompanionCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
      <div className="aspect-[4/5] sm:aspect-[3/4] shimmer" />
      <div className="p-3 space-y-2.5">
        <div className="flex gap-1.5">
          <div className="h-5 rounded-full w-16 shimmer" />
          <div className="h-5 rounded-full w-20 shimmer" />
        </div>
        <div className="h-10 rounded-xl shimmer" />
      </div>
    </div>
  );
}
