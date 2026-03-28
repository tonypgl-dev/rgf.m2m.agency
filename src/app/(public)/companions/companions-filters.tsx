"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const CITIES = ["Bucharest", "Cluj", "Brasov", "Sibiu", "Timisoara"];
const LANGUAGES = ["English", "French", "German", "Spanish", "Italian", "Romanian", "Aromanian"];
const ACTIVITIES = [
  "City Tour",
  "Dinner",
  "Museum Visit",
  "Hiking",
  "Nightlife",
  "Shopping",
  "Coffee & Chat",
];
const MAX_PRICES = [
  { label: "Up to €25/hr", value: "25" },
  { label: "Up to €50/hr", value: "50" },
  { label: "Up to €75/hr", value: "75" },
  { label: "Up to €100/hr", value: "100" },
];

interface FilterValues {
  city: string;
  language: string;
  activity: string;
  maxPrice: string;
}

interface Props {
  initial: FilterValues;
}

function buildHref(values: FilterValues) {
  const p = new URLSearchParams();
  if (values.city) p.set("city", values.city);
  if (values.language) p.set("language", values.language);
  if (values.activity) p.set("activity", values.activity);
  if (values.maxPrice) p.set("maxPrice", values.maxPrice);
  const qs = p.toString();
  return qs ? `/companions?${qs}` : "/companions";
}

function FilterControls({
  values,
  onChange,
}: {
  values: FilterValues;
  onChange: (next: FilterValues) => void;
}) {
  function set(key: keyof FilterValues, val: string | null) {
    onChange({ ...values, [key]: !val || val === "all" ? "" : val });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          City
        </Label>
        <Select
          value={values.city || "all"}
          onValueChange={(v) => set("city", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any city</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Language
        </Label>
        <Select
          value={values.language || "all"}
          onValueChange={(v) => set("language", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any language</SelectItem>
            {LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Activity
        </Label>
        <Select
          value={values.activity || "all"}
          onValueChange={(v) => set("activity", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any activity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any activity</SelectItem>
            {ACTIVITIES.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Max price
        </Label>
        <Select
          value={values.maxPrice || "all"}
          onValueChange={(v) => set("maxPrice", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any price</SelectItem>
            {MAX_PRICES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function CompanionsFilters({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<FilterValues>(initial);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Desktop: apply immediately on each change
  function handleDesktopChange(next: FilterValues) {
    setValues(next);
    router.push(buildHref(next));
  }

  // Mobile sheet: stage changes, apply on button click
  const [sheetValues, setSheetValues] = useState<FilterValues>(initial);

  function handleSheetApply() {
    setValues(sheetValues);
    router.push(buildHref(sheetValues));
    setSheetOpen(false);
  }

  function handleSheetClear() {
    const cleared: FilterValues = { city: "", language: "", activity: "", maxPrice: "" };
    setSheetValues(cleared);
    setValues(cleared);
    router.push("/companions");
    setSheetOpen(false);
  }

  const hasFilters = Object.values(values).some(Boolean);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:block w-56 shrink-0">
        <div className="sticky top-20 rounded-xl border bg-background p-4 space-y-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Filters</p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => handleDesktopChange({ city: "", language: "", activity: "", maxPrice: "" })}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
          <FilterControls values={values} onChange={handleDesktopChange} />
        </div>
      </aside>

      {/* ── Mobile filter button ── */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            setSheetValues(values);
            setSheetOpen(true);
          }}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {hasFilters && (
            <span className="ml-1 rounded-full bg-primary text-primary-foreground text-[10px] h-4 w-4 flex items-center justify-center">
              {Object.values(values).filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasFilters && (
          <button
            type="button"
            onClick={handleSheetClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Mobile filter sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="pb-8">
          <SheetHeader className="mb-5">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <FilterControls values={sheetValues} onChange={setSheetValues} />

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={handleSheetClear}>
              Clear
            </Button>
            <Button className="flex-1" onClick={handleSheetApply}>
              Show results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
