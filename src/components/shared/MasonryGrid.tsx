"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin } from "lucide-react";
import type { CompanionCardData } from "@/components/shared/CompanionCard";

// Deterministic aspect-ratio variation — gives the tapestry its rhythm
const ASPECTS = ["3/4", "4/5", "2/3", "3/4", "2/3", "4/5"];

// Language pill accent colors (on dark overlay, use tinted text against transparent bg)
const LANG_COLOR: Record<string, string> = {
  English:   "#C4B5FD",
  French:    "#FDE68A",
  German:    "#A7F3D0",
  Spanish:   "#FCA5A5",
  Italian:   "#FED7AA",
  Romanian:  "#BFDBFE",
  Aromanian: "#F5D0FE",
};

export function MasonryGrid({
  cards,
  featuredId,
}: {
  cards: CompanionCardData[];
  featuredId?: string;
}) {
  const router = useRouter();
  const [previewId, setPreviewId] = useState<string | null>(null);

  // Any click that doesn't hit a card dismisses the preview.
  // The card handler calls e.stopPropagation() so this won't fire on card taps.
  useEffect(() => {
    if (!previewId) return;
    function dismiss() {
      setPreviewId(null);
    }
    document.addEventListener("click", dismiss);
    return () => document.removeEventListener("click", dismiss);
  }, [previewId]);

  function handleTap(e: React.MouseEvent, id: string) {
    e.stopPropagation(); // prevent document dismiss from firing
    if (previewId === id) {
      // Second tap → navigate
      router.push(`/companions/${id}`);
    } else {
      // First tap → preview
      setPreviewId(id);
    }
  }

  return (
    <div
      className="columns-2 sm:columns-3 lg:columns-4"
      style={{ columnGap: "1px" }}
    >
      {cards.map((card, i) => {
        const isPreview = previewId === card.id;
        const isFeatured = card.id === featuredId;
        const aspectRatio = ASPECTS[i % ASPECTS.length];
        const firstLetter = card.fullName?.[0]?.toUpperCase() ?? "?";

        return (
          <div
            key={card.id}
            className="break-inside-avoid relative cursor-pointer select-none"
            style={{ marginBottom: "1px" }}
            onClick={(e) => handleTap(e, card.id)}
          >
            {/* Photo tile */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio }}
            >
              {/* Gradient placeholder — always rendered as base layer */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                <span className="text-4xl font-bold text-white">{firstLetter}</span>
              </div>

              {/* Photo — sits on top, covers placeholder if it loads */}
              {(card.photos?.[0] ?? card.avatarUrl) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={(card.photos?.[0] ?? card.avatarUrl)!}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              )}

              {/* ── Idle state: subtle depth gradient at bottom ── */}
              {!isPreview && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 45%)",
                  }}
                />
              )}

              {/* ── Featured badge (idle) ── */}
              {isFeatured && !isPreview && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-900 text-[10px] font-extrabold tracking-wide uppercase shadow-sm whitespace-nowrap">
                    🎀 Cea mai bună
                  </span>
                </div>
              )}

              {/* ── Preview overlay (tap 1) ── */}
              {isPreview && (
                <div
                  className="absolute inset-0 flex flex-col"
                  style={{ backgroundColor: "rgba(15,15,25,0.75)" }}
                >
                  {/* Top: featured badge or spacer */}
                  <div className="flex justify-center pt-3 min-h-[28px]">
                    {isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-900 text-[10px] font-extrabold tracking-wide uppercase shadow-sm whitespace-nowrap">
                        🎀 Cea mai bună
                      </span>
                    )}
                  </div>

                  {/* Center: guide info */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-1.5 px-3 py-2">
                    {/* Name */}
                    <p
                      className="text-white font-bold text-center leading-snug"
                      style={{ fontSize: 18 }}
                    >
                      {card.fullName ?? "Guide"}
                    </p>

                    {/* City */}
                    {card.city && (
                      <p
                        className="flex items-center gap-1"
                        style={{ fontSize: 13, color: "#D1D5DB" }}
                      >
                        <MapPin className="h-3 w-3 shrink-0" />
                        {card.city}
                      </p>
                    )}

                    {/* Rating · Price */}
                    <div
                      className="flex items-center gap-2"
                      style={{ fontSize: 14, color: "white" }}
                    >
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                        {card.totalReviews > 0
                          ? Number(card.ratingAvg).toFixed(1)
                          : "New"}
                      </span>
                      {card.hourlyRate !== null && (
                        <>
                          <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
                          <span>€{card.hourlyRate}/hr</span>
                        </>
                      )}
                    </div>

                    {/* Language pills */}
                    {card.languages.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-0.5">
                        {card.languages.slice(0, 3).map((lang) => (
                          <span
                            key={lang}
                            className="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
                            style={{
                              border: "1px solid rgba(255,255,255,0.30)",
                              color: LANG_COLOR[lang] ?? "white",
                              backgroundColor: "rgba(255,255,255,0.07)",
                            }}
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom: tap hint */}
                  <p
                    className="text-center pb-3"
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}
                  >
                    View full profile →
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
