import { createClient } from "@/lib/supabase/server";
import { CompanionCard, type CompanionCardData } from "@/components/shared/CompanionCard";
import { CompanionsFilters } from "./companions-filters";

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
      id, profile_id, hourly_rate, languages, activities, rating_avg, total_reviews,
      profiles!inner(full_name, avatar_url, city)
    `)
    .eq("verified", true)
    .order("rating_avg", { ascending: false });

  if (city && typeof city === "string") {
    query = query.eq("profiles.city", city);
  }
  if (language && typeof language === "string") {
    query = query.contains("languages", [language]);
  }
  if (activity && typeof activity === "string") {
    query = query.contains("activities", [activity]);
  }
  if (maxPrice && typeof maxPrice === "string") {
    query = query.lte("hourly_rate", Number(maxPrice));
  }

  const { data: companions } = await query;

  const cards: CompanionCardData[] = (companions ?? []).map((c) => {
    const profile = c.profiles as unknown as {
      full_name: string | null;
      avatar_url: string | null;
      city: string | null;
    } | null;

    return {
      id: c.id,
      fullName: profile?.full_name ?? null,
      city: profile?.city ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      languages: c.languages ?? [],
      activities: c.activities ?? [],
      ratingAvg: Number(c.rating_avg),
      totalReviews: c.total_reviews,
      hourlyRate: c.hourly_rate !== null ? Number(c.hourly_rate) : null,
    };
  });

  const filterValues = {
    city: typeof city === "string" ? city : "",
    language: typeof language === "string" ? language : "",
    activity: typeof activity === "string" ? activity : "",
    maxPrice: typeof maxPrice === "string" ? maxPrice : "",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page heading (mobile) */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Browse companions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cards.length} verified local{cards.length === 1 ? " guide" : " guides"} available
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Filters — renders sidebar on desktop, button on mobile */}
        <CompanionsFilters initial={filterValues} />

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button is rendered inside CompanionsFilters */}

          {cards.length === 0 ? (
            <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
              No companions match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {cards.map((c) => (
                <CompanionCard
                  key={c.id}
                  c={c}
                  featured={c.id === "dddddddd-0000-0000-0000-000000000004"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
