"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";

export async function updateCompanionPhotosAction(
  companionId: string,
  photos: string[]
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify this companion belongs to the current user
  const { data: companion } = await supabase
    .from("companions")
    .select("id, profile_id")
    .eq("id", companionId)
    .eq("profile_id", user.id)
    .single();

  if (!companion) return { error: "Guide profile not found" };

  const service = createServiceClient();
  const { error } = await service
    .from("companions")
    .update({ photos: photos.slice(0, 5) })
    .eq("id", companionId);

  if (error) return { error: error.message };

  revalidatePath("/companion/profile");
  revalidatePath(`/companions/${companionId}`);
  return {};
}
