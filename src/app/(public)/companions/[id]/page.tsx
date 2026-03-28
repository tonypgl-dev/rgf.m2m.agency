import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CompanionProfileClient,
  type CompanionFull,
} from "./companion-profile-client";
import type { AvailabilitySlot } from "@/types";

export default async function CompanionPage({
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
    .single();

  if (error || !companion) notFound();

  const today = new Date().toISOString().split("T")[0];
  const fourWeeksLater = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: slots } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("companion_id", id)
    .eq("is_booked", false)
    .gte("date", today)
    .lte("date", fourWeeksLater)
    .order("date", { ascending: true })
    .order("time_start", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <CompanionProfileClient
      companion={companion as CompanionFull}
      slots={(slots ?? []) as AvailabilitySlot[]}
      isLoggedIn={!!user}
    />
  );
}
