import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export interface CompanionCardData {
  id: string;
  fullName: string | null;
  city: string | null;
  avatarUrl: string | null;
  languages: string[];
  activities: string[];
  ratingAvg: number;
  totalReviews: number;
  hourlyRate: number | null;
}

export function CompanionCard({ c }: { c: CompanionCardData }) {
  const initials = c.fullName
    ? c.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const visibleActivities = c.activities.slice(0, 3);
  const extraActivities = c.activities.length - visibleActivities.length;

  return (
    <div className="flex flex-col rounded-2xl border bg-background overflow-hidden hover:shadow-md transition-shadow">
      {/* Top: avatar + name + city */}
      <div className="p-4 pb-3 flex items-start gap-3">
        <Avatar className="h-14 w-14 shrink-0">
          <AvatarImage src={c.avatarUrl ?? undefined} alt={c.fullName ?? ""} />
          <AvatarFallback className="text-base font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{c.fullName ?? "Companion"}</p>

          {c.city && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{c.city}</span>
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
            <span className="text-sm font-medium">
              {c.totalReviews > 0
                ? Number(c.ratingAvg).toFixed(1)
                : "New"}
            </span>
            {c.totalReviews > 0 && (
              <span className="text-xs text-muted-foreground">
                ({c.totalReviews})
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-base font-bold">
            €{c.hourlyRate ?? "—"}
          </p>
          <p className="text-[11px] text-muted-foreground">/hour</p>
        </div>
      </div>

      {/* Languages */}
      {c.languages.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1">
          {c.languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs px-2 py-0">
              {lang}
            </Badge>
          ))}
        </div>
      )}

      {/* Activities */}
      {visibleActivities.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {visibleActivities.map((act) => (
            <Badge key={act} variant="outline" className="text-xs px-2 py-0">
              {act}
            </Badge>
          ))}
          {extraActivities > 0 && (
            <Badge variant="outline" className="text-xs px-2 py-0 text-muted-foreground">
              +{extraActivities} more
            </Badge>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto px-4 pb-4">
        <Link
          href={`/companions/${c.id}`}
          className={cn(buttonVariants({ size: "sm" }), "w-full justify-center")}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function CompanionCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border bg-background overflow-hidden animate-pulse">
      <div className="p-4 pb-3 flex items-start gap-3">
        <div className="h-14 w-14 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
        <div className="space-y-1 shrink-0">
          <div className="h-5 bg-muted rounded w-10" />
          <div className="h-3 bg-muted rounded w-8" />
        </div>
      </div>
      <div className="px-4 pb-2 flex gap-1.5">
        <div className="h-5 bg-muted rounded-full w-16" />
        <div className="h-5 bg-muted rounded-full w-14" />
      </div>
      <div className="px-4 pb-3 flex gap-1.5">
        <div className="h-5 bg-muted rounded-full w-20" />
        <div className="h-5 bg-muted rounded-full w-16" />
      </div>
      <div className="px-4 pb-4 mt-auto">
        <div className="h-8 bg-muted rounded-md w-full" />
      </div>
    </div>
  );
}
