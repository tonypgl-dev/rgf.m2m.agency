import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Phone, Globe, Calendar, Hash } from "lucide-react";
import { TouristProfileForm } from "./profile-form";

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  ro: "Romanian",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ar: "Arabic",
};

export default async function TouristProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, phone, city, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  const fallback = { full_name: "Test Tourist", role: "tourist", phone: null, city: null, avatar_url: null, created_at: new Date().toISOString() };
  const p = profile ?? fallback;

  if (p.role !== "tourist") redirect("/");

  // Booking stats
  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("tourist_id", user.id);

  const { count: completedBookings } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("tourist_id", user.id)
    .eq("status", "completed");

  const memberSince = new Date(p.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="bg-background border-b px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Your account & settings</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Identity card */}
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center gap-4">
            {/* Avatar placeholder */}
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center shrink-0 text-2xl font-bold text-muted-foreground select-none">
              {p.full_name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-base truncate">{p.full_name ?? "—"}</p>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="secondary" className="text-xs px-2 py-0">Tourist</Badge>
                {p.phone && (
                  <Badge variant="outline" className="text-xs px-2 py-0 gap-1">
                    <CheckCircle className="h-2.5 w-2.5 text-green-500" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-background p-4 text-center">
            <p className="text-2xl font-semibold">{totalBookings ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Bookings</p>
          </div>
          <div className="rounded-xl border bg-background p-4 text-center">
            <p className="text-2xl font-semibold">{completedBookings ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
          </div>
          <div className="rounded-xl border bg-background p-4 text-center">
            <p className="text-2xl font-semibold text-green-600">
              {totalBookings ? Math.round(((completedBookings ?? 0) / totalBookings) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Completion</p>
          </div>
        </div>

        <Separator />

        {/* Edit form */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Personal details
          </h2>
          <TouristProfileForm
            userId={user.id}
            initialName={p.full_name ?? ""}
            initialPhone={p.phone ?? ""}
            initialCity={p.city ?? ""}
          />
        </section>

        <Separator />

        {/* Account info (read-only) */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Account
          </h2>

          <div className="rounded-xl border bg-background divide-y">
            <div className="flex items-center gap-3 px-4 py-3">
              <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm">{memberSince}</p>
              </div>
            </div>
            {p.phone && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{p.phone}</p>
                </div>
              </div>
            )}
            {p.city && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="text-sm">{p.city}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
