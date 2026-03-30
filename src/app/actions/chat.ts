"use server";

import { createClient } from "@/lib/supabase/server";

type ActionResult = { error?: string };

export async function createOrGetConversationAction(
  companionId: string
): Promise<{ conversationId?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Try to find existing conversation
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("tourist_id", user.id)
    .eq("companion_id", companionId)
    .maybeSingle();

  if (existing) return { conversationId: existing.id };

  // Create new
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ tourist_id: user.id, companion_id: companionId })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { conversationId: created.id };
}

export async function checkInAction(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("bookings")
    .update({ check_in_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("tourist_id", user.id)
    .is("check_in_at", null);

  return error ? { error: error.message } : {};
}

export async function checkOutAction(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("bookings")
    .update({ check_out_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("tourist_id", user.id)
    .not("check_in_at", "is", null)
    .is("check_out_at", null);

  return error ? { error: error.message } : {};
}

export async function markCompleteAction(bookingId: string): Promise<ActionResult> {
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

  const { error } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId)
    .eq("companion_id", companion.id)
    .eq("status", "confirmed");

  return error ? { error: error.message } : {};
}
