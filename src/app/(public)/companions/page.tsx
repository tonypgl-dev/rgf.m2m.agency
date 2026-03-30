import { createClient } from "@/lib/supabase/server";
import type { CompanionCardData } from "@/components/shared/CompanionCard";
import { CompanionsFilters } from "./companions-filters";
import { MasonryGrid } from "@/components/shared/MasonryGrid";

const FEATURED_ID = "dddddddd-0000-0000-0000-000000000004";

export default async function CompanionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { city, language, activity, maxPrice } = await searchParams;

  const supabase = await createClient();

  let query = supabase
    .from("companions")
    .select(`
      id, profile_id, hourly_rate, languages, activities, rating_avg, total_reviews, verified, photos,
      profiles!inner(full_name, avatar_url, city)
    `)
    .eq("status", "approved")
    .order("rating_avg", { ascending: false });

  if (city     && typeof city     === "string") query = query.eq("profiles.city", city);
  if (language && typeof language === "string") query = query.contains("languages", [language]);
  
  if (activity) {
    const activitiesArr = Array.isArray(activity) ? activity : [activity];
    if (activitiesArr.length > 0) {
      // "AND" logic: all selected activities must be present in the guide's activities array
      query = query.contains("activities", activitiesArr);
    }
  }

  if (maxPrice && typeof maxPrice === "string") query = query.lte("hourly_rate", Number(maxPrice));

  const { data: companions } = await query;

  const cards: CompanionCardData[] = (companions ?? []).map((c) => {
    const profile = c.profiles as unknown as {
      full_name: string | null;
      avatar_url: string | null;
      city: string | null;
    } | null;

    return {
      id:           c.id,
      fullName:     profile?.full_name ?? null,
      city:         profile?.city ?? null,
      avatarUrl:    profile?.avatar_url ?? null,
      photos:       (c.photos as string[] | null) ?? [],
      languages:    c.languages ?? [],
      activities:   c.activities ?? [],
      ratingAvg:    Number(c.rating_avg),
      totalReviews: c.total_reviews,
      hourlyRate:   c.hourly_rate !== null ? Number(c.hourly_rate) : null,
      verified:     Boolean(c.verified),
    };
  });

  const filterValues = {
    city:     typeof city     === "string" ? city     : "",
    language: typeof language === "string" ? language : "",
    activity: activity ?? [],
    maxPrice: typeof maxPrice === "string" ? maxPrice : "",
  };

  return (
    <div>
      {/* ── Page heading ── */}
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Guides in {typeof city === "string" && city ? city : "Bucharest"}
        </h1>
        {cards.length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {cards.length} available
          </p>
        )}
      </div>

      {/* ── Filter bar: sticky below nav (h-14 = 56px = top-14) ── */}
      <div className="sticky top-14 z-30 bg-background border-b border-border/60">
        <CompanionsFilters initial={filterValues} />
      </div>

      {/* ── Masonry grid: edge-to-edge ── */}
      {cards.length === 0 ? (
        <div className="px-4 py-16 text-center text-muted-foreground">
          <p className="font-medium">No guides match your filters.</p>
          <p className="text-sm mt-1">Try removing a filter.</p>
        </div>
      ) : (
        <MasonryGrid cards={cards} featuredId={FEATURED_ID} />
      )}
    </div>
  );
}
