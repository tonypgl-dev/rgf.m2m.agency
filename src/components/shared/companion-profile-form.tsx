"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companionProfileSchema, type CompanionProfileInput } from "@/lib/validators/auth";
import { updateCompanionProfileAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/shared/tag-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile, Companion } from "@/types";

interface Props {
  profile: Profile;
  companion: Companion | null;
}

export function CompanionProfileForm({ profile, companion }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanionProfileInput>({
    resolver: zodResolver(companionProfileSchema),
    defaultValues: {
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      city: profile.city ?? "",
      bio: companion?.bio ?? "",
      hourly_rate: companion?.hourly_rate != null ? String(companion.hourly_rate) : "",
      languages: companion?.languages ?? [],
      activities: companion?.activities ?? [],
    },
  });

  async function onSubmit(data: CompanionProfileInput) {
    setServerError(null);
    const result = await updateCompanionProfileAction(data);
    if (result?.error) setServerError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
          {serverError}
        </p>
      )}

      {/* Personal info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" placeholder="Jane Doe" {...register("full_name")} />
            {errors.full_name && (
              <p className="text-xs text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" type="tel" placeholder="+40 700 000 000" {...register("phone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Bucharest" {...register("city")} />
          </div>
        </CardContent>
      </Card>

      {/* Guide profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Guide profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell travelers what you love about your city and what makes you a great local guide…"
              rows={4}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hourly_rate">Hourly rate (USD)</Label>
            <Input
              id="hourly_rate"
              type="number"
              min={0}
              step={0.01}
              placeholder="25"
              {...register("hourly_rate")}
            />
            {errors.hourly_rate && (
              <p className="text-xs text-destructive">{errors.hourly_rate.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>
              Languages{" "}
              <span className="text-muted-foreground text-xs">(press Enter to add)</span>
            </Label>
            <TagInput
              value={watch("languages")}
              onChange={(tags) => setValue("languages", tags)}
              placeholder="English, Romanian…"
            />
            {errors.languages && (
              <p className="text-xs text-destructive">{errors.languages.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>
              Activities{" "}
              <span className="text-muted-foreground text-xs">(press Enter to add)</span>
            </Label>
            <TagInput
              value={watch("activities")}
              onChange={(tags) => setValue("activities", tags)}
              placeholder="Hiking, Museums, Restaurants…"
            />
            {errors.activities && (
              <p className="text-xs text-destructive">{errors.activities.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
