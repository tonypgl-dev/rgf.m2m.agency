"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addSlotAction, removeSlotAction } from "@/app/actions/slots";
import type { AvailabilitySlot } from "@/types";

interface Props {
  slots: AvailabilitySlot[];
}

export function AvailabilityManager({ slots }: Props) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Next 30 days min/max for date picker
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  async function handleAdd() {
    if (!date || !timeStart || !timeEnd) return;
    setAdding(true);
    setError(null);

    const res = await addSlotAction({ date, time_start: timeStart, time_end: timeEnd });
    setAdding(false);

    if (res.error) {
      setError(res.error);
    } else {
      setDate("");
      setTimeStart("");
      setTimeEnd("");
      router.refresh();
    }
  }

  async function handleRemove(slotId: string) {
    setRemoving(slotId);
    await removeSlotAction(slotId);
    setRemoving(null);
    router.refresh();
  }

  // Sort upcoming unbooked slots
  const upcoming = slots
    .filter((s) => !s.is_booked && s.date >= today)
    .sort((a, b) => (a.date + a.time_start).localeCompare(b.date + b.time_start));

  return (
    <div className="space-y-4">
      {/* Add form */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-3 sm:col-span-1">
          <Label className="text-xs text-muted-foreground mb-1 block">Date</Label>
          <Input
            type="date"
            min={today}
            max={maxDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Start</Label>
          <Input
            type="time"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">End</Label>
          <Input
            type="time"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        onClick={handleAdd}
        disabled={!date || !timeStart || !timeEnd || adding}
        size="sm"
        className="gap-1.5"
      >
        <Plus className="h-3.5 w-3.5" />
        {adding ? "Adding…" : "Add slot"}
      </Button>

      {/* Existing slots */}
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming availability slots.</p>
      ) : (
        <ul className="space-y-2">
          {upcoming.map((slot) => (
            <li
              key={slot.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <span>
                {slot.date} · {fmt(slot.time_start)} – {fmt(slot.time_end)}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(slot.id)}
                disabled={removing === slot.id}
                className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                aria-label="Remove slot"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function fmt(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
