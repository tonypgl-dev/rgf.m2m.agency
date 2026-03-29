// Skeleton aspects mirror MasonryGrid's ASPECTS array
const ASPECTS = ["3/4", "4/5", "2/3", "3/4", "2/3", "4/5", "3/4", "4/5", "2/3", "3/4", "2/3", "4/5"];

export default function CompanionsLoading() {
  return (
    <div>
      {/* Heading skeleton */}
      <div className="px-4 pt-6 pb-2 space-y-2">
        <div className="h-7 bg-muted rounded w-56 animate-pulse" />
        <div className="h-4 bg-muted rounded w-36 animate-pulse" />
      </div>

      {/* Filter bar skeleton */}
      <div className="h-[45px] bg-white border-b border-border/60 flex items-center px-4 gap-2">
        {[64, 80, 60, 72, 68, 80].map((w, i) => (
          <div
            key={i}
            className="h-7 rounded-full bg-muted animate-pulse shrink-0"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Masonry skeleton */}
      <div className="columns-2 sm:columns-3 lg:columns-4" style={{ columnGap: "1px" }}>
        {ASPECTS.map((ratio, i) => (
          <div
            key={i}
            className="break-inside-avoid shimmer"
            style={{ aspectRatio: ratio, marginBottom: "1px" }}
          />
        ))}
      </div>
    </div>
  );
}
