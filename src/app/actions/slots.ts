"use server";

import { createClient } from "@/lib/supabase/server";

type ActionResult = { error?: string };

export async function addSlotAction(data: {
  date: string;
  time_start: string;
  time_end: string;
}): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: companion } = await supabase
    .from("companions")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!companion) return { error: "Not a guide account" };

  const { error } = await supabase.from("availability_slots").insert({
    companion_id: companion.id,
    date: data.date,
    time_start: data.time_start,
    time_end: data.time_end,
    is_booked: false,
  });

  return error ? { error: error.message } : {};
}

export async function removeSlotAction(slotId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: companion } = await supabase
    .from("companions")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!companion) return { error: "Not a guide account" };

  // Only allow removing unbooked slots
  const { error } = await supabase
    .from("availability_slots")
    .delete()
    .eq("id", slotId)
    .eq("companion_id", companion.id)
    .eq("is_booked", false);

  return error ? { error: error.message } : {};
}
