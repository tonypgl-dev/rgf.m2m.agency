"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ActionError = { error: string };

export async function createBookingAction(data: {
  companion_id: string;
  slot_id: string;
  activity: string;
  meeting_point: string;
  total_price: number;
  duration_hours: number;
}): Promise<ActionError> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to book." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profile not found." };
  if (profile.role !== "tourist") return { error: "Only tourists can make bookings." };

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      tourist_id: user.id,
      companion_id: data.companion_id,
      slot_id: data.slot_id,
      activity: data.activity,
      meeting_point: data.meeting_point,
      total_price: data.total_price,
      duration_hours: data.duration_hours,
      status: "pending",
    })
    .select("id")
    .single();

  if (bookingError) return { error: bookingError.message };

  // Mark slot as booked
  await supabase
    .from("availability_slots")
    .update({ is_booked: true })
    .eq("id", data.slot_id);

  redirect(`/tourist/bookings/${booking.id}`);

  return { error: "" };
}

export async function companionCancelBookingAction(
  bookingId: string
): Promise<{ error?: string }> {
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

  if (!companion) return { error: "Not a companion" };

  // Only pending bookings can be cancelled by companion
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, slot_id, status")
    .eq("id", bookingId)
    .eq("companion_id", companion.id)
    .eq("status", "pending")
    .single();

  if (!booking) return { error: "Booking not found or cannot be cancelled" };

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) return { error: error.message };

  // Free the slot
  await supabase
    .from("availability_slots")
    .update({ is_booked: false })
    .eq("id", booking.slot_id);

  return {};
}
