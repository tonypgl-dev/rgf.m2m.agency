"use client";

import { useState, useTransition } from "react";
import { updateTouristProfile } from "./actions";

interface Props {
  userId: string;
  initialName: string;
  initialPhone: string;
  initialCity: string;
}

export function TouristProfileForm({ userId, initialName, initialPhone, initialCity }: Props) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [city, setCity] = useState(initialCity);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError(null);

    startTransition(async () => {
      const result = await updateTouristProfile({ userId, name, phone, city });
      if (result?.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-background divide-y">
      <div className="px-4 py-3">
        <label className="text-xs text-muted-foreground block mb-1">Full name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
          required
        />
      </div>
      <div className="px-4 py-3">
        <label className="text-xs text-muted-foreground block mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+40 7xx xxx xxx"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
        />
      </div>
      <div className="px-4 py-3">
        <label className="text-xs text-muted-foreground block mb-1">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Bucharest"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        {error && <p className="text-xs text-destructive">{error}</p>}
        {saved && <p className="text-xs text-green-600">Saved!</p>}
        {!error && !saved && <span />}
        <button
          type="submit"
          disabled={isPending}
          className="text-sm font-medium px-4 py-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-opacity"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
