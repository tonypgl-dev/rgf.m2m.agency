"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = ["light", "system", "dark"] as const;
type Theme = (typeof THEMES)[number];

const SEGMENTS: { value: Theme; icon: React.ReactNode }[] = [
  { value: "light",  icon: <Sun  className="h-3 w-3" /> },
  { value: "system", icon: <span className="text-[10px] font-semibold leading-none">A</span> },
  { value: "dark",   icon: <Moon className="h-3 w-3" /> },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Default to system if not mounted yet
  const current = mounted ? ((theme as Theme) ?? "system") : "system";

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger: small chevron arrow ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Theme settings"
        className={cn(
          "h-5 w-5 inline-flex items-center justify-center",
          "text-foreground/30 hover:text-foreground/60 transition-colors duration-150"
        )}
      >
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* ── Dropdown panel: slides in below trigger ── */}
      <div
        className={cn(
          "absolute top-[calc(100%+6px)] right-0 z-50",
          "transition-all duration-200 origin-top-right",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Square compact toggle group */}
        <div className="inline-flex border border-border bg-background shadow-md">
          {SEGMENTS.map(({ value, icon }, i) => {
            const active = current === value;
            return (
              <button
                key={value}
                onClick={() => { setTheme(value); setOpen(false); }}
                aria-label={value}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 transition-colors duration-100",
                  // separator between segments
                  i > 0 && "border-l border-border",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
