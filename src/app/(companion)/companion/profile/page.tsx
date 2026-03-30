import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompanionProfileForm } from "@/components/shared/companion-profile-form";
import { StripeConnectButton } from "@/components/shared/stripe-connect-button";
import { PhotoUploadSection } from "@/components/shared/photo-upload-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile, Companion } from "@/types";

export default async function CompanionProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ stripe?: string }>;
}) {
  const { stripe } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("profiles")
    .select("*, companions(*)")
    .eq("id", user.id)
    .single();

  if (error || !data || data.role !== "companion") redirect("/login");

  const profile = data as Profile & { companions: Companion[] };
  const companion = profile.companions?.[0] ?? null;

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your profile so tourists can find you.
          </p>
        </div>

        {/* Profile approval status */}
        {companion && companion.status === "pending" && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
            <p className="font-medium">Profile under review</p>
            <p className="mt-0.5 text-yellow-700">
              Your profile is being reviewed by our team. You'll be visible to tourists once approved — usually within 24 hours.
            </p>
          </div>
        )}
        {companion && companion.status === "rejected" && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
            <p className="font-medium">Profile not approved</p>
            <p className="mt-0.5 text-red-700">
              Your profile didn't meet our quality standards. Please update your photos and bio, then contact support.
            </p>
          </div>
        )}
        {companion && companion.status === "approved" && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
            <p className="font-medium">Profile approved — you're live!</p>
            <p className="mt-0.5">Tourists can find and book you on Roamly.</p>
          </div>
        )}

        {/* Stripe status messages */}
        {stripe === "success" && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
            Stripe account connected successfully. You can now receive payments.
          </div>
        )}
        {stripe === "refresh" && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-700">
            Stripe onboarding was interrupted. Please try connecting again.
          </div>
        )}

        <CompanionProfileForm profile={profile} companion={companion} />

        {/* Photos */}
        {companion && (
          <PhotoUploadSection
            companionId={companion.id}
            initialPhotos={companion.photos ?? []}
          />
        )}

        {/* Stripe Connect */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Connect your Stripe account to receive payouts from bookings.
            </p>
            <StripeConnectButton
              isConnected={!!companion?.stripe_account_id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
