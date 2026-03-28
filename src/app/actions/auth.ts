"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Role } from "@/types";

type ActionError = { error: string; redirectTo?: string };

export async function loginAction(
  email: string,
  password: string
): Promise<ActionError> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication failed" };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return { error: profileError?.message ?? "Profile null" };

  if (profile.role === "tourist") {
    return { error: "", redirectTo: "/tourist/dashboard" };
  } else if (profile.role === "companion") {
    const { data: companion } = await supabase
      .from("companions")
      .select("bio")
      .eq("profile_id", user.id)
      .maybeSingle();
    return { error: "", redirectTo: companion?.bio ? "/companion/dashboard" : "/companion/profile" };
  }

  return { error: "", redirectTo: "/" };
}

export async function registerAction(data: {
  email: string;
  password: string;
  role: Role;
  full_name: string;
  phone?: string;
  city?: string;
  bio?: string;
  hourly_rate?: string;
  languages?: string[];
  activities?: string[];
}): Promise<ActionError> {
  const supabase = await createClient();
  const service = createServiceClient();

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (signUpError) return { error: signUpError.message };
  if (!authData.user) return { error: "Sign up failed. Please try again." };

  const userId = authData.user.id;

  // Use service role so we can insert immediately regardless of email confirmation
  const { error: profileError } = await service.from("profiles").insert({
    id: userId,
    role: data.role,
    full_name: data.full_name || null,
    phone: data.phone || null,
    city: data.city || null,
  });

  if (profileError) return { error: profileError.message };

  if (data.role === "companion") {
    const { error: companionError } = await service.from("companions").insert({
      profile_id: userId,
      bio: data.bio || null,
      hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : null,
      languages: data.languages ?? [],
      activities: data.activities ?? [],
    });
    if (companionError) return { error: companionError.message };
  }

  // If email confirmation is required, session will be null
  if (!authData.session) {
    redirect("/login?message=check-email");
  }

  redirect(data.role === "tourist" ? "/tourist/dashboard" : "/companion/profile");

  return { error: "" };
}

export async function updateCompanionProfileAction(formData: {
  full_name: string;
  phone?: string;
  city?: string;
  bio: string;
  hourly_rate?: string;
  languages: string[];
  activities: string[];
}): Promise<ActionError> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: formData.full_name,
      phone: formData.phone || null,
      city: formData.city || null,
    })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  const { error: companionError } = await supabase
    .from("companions")
    .update({
      bio: formData.bio,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      languages: formData.languages,
      activities: formData.activities,
    })
    .eq("profile_id", user.id);

  if (companionError) return { error: companionError.message };

  redirect("/companion/dashboard");

  return { error: "" };
}
