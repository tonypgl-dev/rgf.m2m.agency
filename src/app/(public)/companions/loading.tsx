import { CompanionCardSkeleton } from "@/components/shared/CompanionCard";

export default function CompanionsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-32 mt-2 animate-pulse" />
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar skeleton */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="rounded-xl border bg-background p-4 space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-16" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 bg-muted rounded w-20" />
                <div className="h-9 bg-muted rounded" />
              </div>
            ))}
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CompanionCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
