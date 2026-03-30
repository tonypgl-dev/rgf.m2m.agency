"use server";

import { createClient } from "@/lib/supabase/server";

interface UpdatePayload {
  userId: string;
  name: string;
  phone: string;
  city: string;
}

export async function updateTouristProfile({ userId, name, phone, city }: UpdatePayload) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: name.trim() || null,
      phone: phone.trim() || null,
      city: city.trim() || null,
    })
    .eq("id", userId);

  if (error) return { error: error.message };
  return { error: null };
}
