import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Roamly logo — SVG replica of the stylised "R" mark.
 * Fully transparent background; scales via className (e.g. h-10, h-12).
 *
 * Anatomy:
 *  - Left stem (full height)
 *  - Top arch + bowl (cubic bezier arching right, returning to mid-stem)
 *  - Diagonal leg (R leg, lower-right)
 *  - Arrow shaft + orange arrowhead (upper-right)
 *  - Orange dot (in the R counter/bowl area)
 */
export function Logo({ className, ...props }: Props) {
  const PURPLE = "#A67CFF";
  const ORANGE = "#F97316";
  const R_STROKE = 23;

  return (
    <svg
      viewBox="0 0 270 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Roamly"
      role="img"
      {...props}
    >
      {/* ── Left stem — full height ── */}
      <path
        d="M 55 300 L 55 78"
        stroke={PURPLE}
        strokeWidth={R_STROKE}
        strokeLinecap="round"
      />

      {/*
        ── Top arch + bowl ──
        Starts at top of stem (55, 78), arches right over the top,
        curves back down the right side, then returns to the stem
        at mid-height (55, 195) — forming the bowl of the R.
      */}
      <path
        d="M 55 78 C 55 22 225 22 225 118 C 225 192 135 205 55 195"
        stroke={PURPLE}
        strokeWidth={R_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Diagonal leg — from bowl junction down-right ── */}
      <path
        d="M 135 200 L 222 300"
        stroke={PURPLE}
        strokeWidth={R_STROKE}
        strokeLinecap="round"
      />

      {/*
        ── Arrow shaft ──
        Goes from the upper-right area of the arch toward the arrowhead.
        Ends at the back-centre of the arrowhead triangle so there's no gap.
      */}
      <path
        d="M 204 72 L 231 42"
        stroke={PURPLE}
        strokeWidth={14}
        strokeLinecap="round"
      />

      {/*
        ── Arrowhead (orange filled triangle) ──
        Tip:   (258, 12)
        Base1: (243, 31)
        Base2: (219, 53)
        Direction: ~40° from horizontal, pointing upper-right.
      */}
      <polygon
        points="258,12 243,31 219,53"
        fill={ORANGE}
      />

      {/* ── Orange dot — inside the R counter/bowl ── */}
      <circle
        cx="120"
        cy="142"
        r="20"
        fill={ORANGE}
      />
    </svg>
  );
}
