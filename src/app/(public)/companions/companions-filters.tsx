"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
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
import { cn } from "@/lib/utils";

const CITIES = ["Bucharest", "Cluj", "Brasov", "Sibiu", "Timisoara"];
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Other",
];
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
  activity: string[];
  maxPrice: string;
}

function buildHref(v: FilterValues) {
  const p = new URLSearchParams();
  if (v.city) p.set("city", v.city);
  if (v.language) p.set("language", v.language);
  if (v.activity && v.activity.length > 0) {
    v.activity.forEach((a) => p.append("activity", a));
  }
  if (v.maxPrice) p.set("maxPrice", v.maxPrice);
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
  function set(key: keyof FilterValues, val: string | string[] | null) {
    onChange({ ...values, [key]: !val || val === "all" ? (key === "activity" ? [] : "") : val });
  }
  return (
    <div className="space-y-4">
      {([
        {
          key: "city",
          label: "City",
          opts: CITIES.map((v) => ({ label: v, value: v })),
        },
        {
          key: "language",
          label: "Language",
          opts: LANGUAGES.map((v) => ({ label: v, value: v })),
        },
        {
          key: "activity",
          label: "Activity",
          opts: ACTIVITIES.map((v) => ({ label: v, value: v })),
        },
        { key: "maxPrice", label: "Max price", opts: MAX_PRICES },
      ] as const).map(({ key, label, opts }) => (
        <div key={key} className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </Label>
          {key === "activity" ? (
             <Select 
               value={values.activity[0] || "all"} 
               onValueChange={(v) =>
                 set(key, v === "all" || v == null ? [] : [v])
               }
             >
               <SelectTrigger>
                 <SelectValue placeholder={`Any ${label.toLowerCase()}`} />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">Any {label.toLowerCase()}</SelectItem>
                 {opts.map((o) => (
                   <SelectItem key={o.value} value={o.value}>
                     {o.label}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
          ) : (
            <Select 
              value={(values[key] as string) || "all"} 
              onValueChange={(v) => set(key, v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Any ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any {label.toLowerCase()}</SelectItem>
                {opts.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
    </div>
  );
}

export function CompanionsFilters({ initial }: { initial: { city: string, language: string, activity: string | string[], maxPrice: string } }) {
  const router = useRouter();
  
  // Normalize initial activity to array
  const normalizedInitial: FilterValues = {
    ...initial,
    activity: Array.isArray(initial.activity) 
      ? initial.activity 
      : initial.activity 
        ? [initial.activity] 
        : []
  };

  const [values, setValues] = useState<FilterValues>(normalizedInitial);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetValues, setSheetValues] = useState<FilterValues>(normalizedInitial);
  const [activeDropdown, setActiveDropdown] = useState<
    "city" | "language" | null
  >(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCount = 
    (values.city ? 1 : 0) + 
    (values.language ? 1 : 0) + 
    (values.maxPrice ? 1 : 0) + 
    values.activity.length;

  function navigate(next: FilterValues) {
    setValues(next);
    router.push(buildHref(next));
    setActiveDropdown(null);
  }

  function toggleActivity(activity: string) {
    const nextActivities = values.activity.includes(activity)
      ? values.activity.filter(a => a !== activity)
      : [...values.activity, activity];
    
    navigate({
      ...values,
      activity: nextActivities,
    });
  }

  function clearAll() {
    const cleared: FilterValues = {
      city: "",
      language: "",
      activity: [],
      maxPrice: "",
    };
    setSheetValues(cleared);
    setValues(cleared);
    router.push("/companions");
    setSheetOpen(false);
    setActiveDropdown(null);
  }

  function applySheet() {
    navigate(sheetValues);
    setSheetOpen(false);
  }

  const Pill = ({
    label,
    active,
    onClick,
    hasChevron,
    isOpen,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    hasChevron?: boolean;
    isOpen?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-lg px-4 text-sm font-medium border whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-background border-border text-foreground/70 hover:border-foreground/40"
      )}
    >
      {label}
      {hasChevron && (
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      )}
    </button>
  );

  const Dropdown = ({
    options,
    currentValue,
    onSelect,
    allLabel,
  }: {
    options: string[];
    currentValue: string;
    onSelect: (val: string) => void;
    allLabel: string;
  }) => (
    <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-popover rounded-xl shadow-lg border border-border py-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-100">
      <button
        onClick={() => onSelect("")}
        className="w-full h-8 px-3 flex items-center justify-between text-sm hover:bg-muted transition-colors"
      >
        <span className={cn(!currentValue && "font-semibold text-foreground")}>
          {allLabel}
        </span>
        {!currentValue && <Check className="h-4 w-4 text-foreground" />}
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className="w-full h-8 px-3 flex items-center justify-between text-sm hover:bg-muted transition-colors"
        >
          <span className={cn(currentValue === opt && "font-semibold text-foreground")}>
            {opt}
          </span>
          {currentValue === opt && <Check className="h-4 w-4 text-foreground" />}
        </button>
      ))}
    </div>
  );

  return (
    <div className="sticky top-14 z-40 bg-background/95 backdrop-blur border-b border-border py-3">
      {/* ── Pill filter row ── */}
      <div className="overflow-x-auto scrollbar-hide no-scrollbar" ref={containerRef}>
        <div className="flex gap-2 px-4 w-max">
          {/* 1. "All" */}
          <Pill
            label="All"
            active={!activeCount}
            onClick={clearAll}
          />

          {/* 2. "Bucharest▾" */}
          <div className="relative">
            <Pill
              label={values.city || "Bucharest"}
              active={!!values.city}
              hasChevron
              isOpen={activeDropdown === "city"}
              onClick={() =>
                setActiveDropdown(activeDropdown === "city" ? null : "city")
              }
            />
            {activeDropdown === "city" && (
              <Dropdown
                allLabel="All cities"
                currentValue={values.city}
                options={CITIES}
                onSelect={(val) => navigate({ ...values, city: val })}
              />
            )}
          </div>

          {/* 3. "Dinner" */}
          <Pill
            label="Dinner"
            active={values.activity.includes("Dinner")}
            onClick={() => toggleActivity("Dinner")}
          />

          {/* 4. "City Tour" */}
          <Pill
            label="City Tour"
            active={values.activity.includes("City Tour")}
            onClick={() => toggleActivity("City Tour")}
          />

          {/* 5. "Chat" (Coffee & Chat) */}
          <Pill
            label="Chat"
            active={values.activity.includes("Coffee & Chat")}
            onClick={() => toggleActivity("Coffee & Chat")}
          />

          {/* 6. "Language▾" */}
          <div className="relative">
            <Pill
              label={values.language || "Language"}
              active={!!values.language}
              hasChevron
              isOpen={activeDropdown === "language"}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "language" ? null : "language"
                )
              }
            />
            {activeDropdown === "language" && (
              <Dropdown
                allLabel="All languages"
                currentValue={values.language}
                options={LANGUAGES}
                onSelect={(val) => navigate({ ...values, language: val })}
              />
            )}
          </div>

          {/* 7. Filters */}
          <button
            type="button"
            onClick={() => {
              setSheetValues(values);
              setSheetOpen(true);
            }}
            className={cn(
              "h-8 rounded-lg px-4 text-sm font-medium border whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0",
              activeCount > 0
                ? "bg-foreground text-background border-foreground"
                : "bg-background border-border text-foreground/70 hover:border-foreground/40"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeCount > 0 && (
              <span className="rounded-lg bg-background text-foreground text-[10px] h-4 w-4 flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Advanced filter sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="pb-8 rounded-t-2xl">
          <SheetHeader className="mb-5">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FilterControls values={sheetValues} onChange={setSheetValues} />
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={clearAll}>
              Clear
            </Button>
            <Button className="flex-1" onClick={applySheet}>
              Show results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
