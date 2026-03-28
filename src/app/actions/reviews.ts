"use server";

import { createClient } from "@/lib/supabase/server";

type ActionResult = { error?: string };

export async function submitReviewAction(data: {
  booking_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
}): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify booking belongs to this tourist and is completed
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, tourist_id, companion_id, status, check_out_at")
    .eq("id", data.booking_id)
    .eq("tourist_id", user.id)
    .eq("status", "completed")
    .single();

  if (!booking) return { error: "Booking not found or not eligible for review" };

  // 7-day window from check-out (fall back to now if no check_out_at)
  const reference = booking.check_out_at
    ? new Date(booking.check_out_at)
    : new Date();
  const sevenDaysLater = new Date(reference.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (new Date() > sevenDaysLater) {
    return { error: "Review window has expired (7 days after check-out)" };
  }

  const { error } = await supabase.from("reviews").insert({
    booking_id: data.booking_id,
    reviewer_id: user.id,
    reviewee_id: data.reviewee_id,
    rating: data.rating,
    comment: data.comment || null,
  });

  return error ? { error: error.message } : {};
}
