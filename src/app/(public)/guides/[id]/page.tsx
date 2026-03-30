import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuideProfileClient, type GuideFull } from "./guide-profile-client";
import type { AvailabilitySlot } from "@/types";

export default async function GuideProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: companion, error } = await supabase
    .from("companions")
    .select("*, profiles(*)")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (error || !companion) notFound();

  // Fetch next 7 days only — for the availability preview strip
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: slots } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("companion_id", id)
    .eq("is_booked", false)
    .gte("date", today)
    .lte("date", sevenDaysLater)
    .order("date", { ascending: true })
    .order("time_start", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <GuideProfileClient
      guide={companion as GuideFull}
      slots={(slots ?? []) as AvailabilitySlot[]}
      isLoggedIn={!!user}
    />
  );
}
