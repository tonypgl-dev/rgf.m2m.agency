"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-8 w-8 inline-flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity text-[var(--text-secondary)]"
    >
      <span style={{ fontSize: "1rem", lineHeight: 1 }}>
        {isDark ? "☀" : "☽"}
      </span>
    </button>
  );
}
