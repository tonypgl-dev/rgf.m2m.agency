"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerStep1Schema,
  registerStep2Schema,
  type RegisterStep1Input,
  type RegisterStep2Input,
} from "@/lib/validators/auth";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/shared/tag-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<RegisterStep1Input | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Step 1 form
  const step1 = useForm<RegisterStep1Input>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: { role: "tourist" },
  });

  // Step 2 form
  const step2 = useForm<RegisterStep2Input>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: { languages: [], activities: [] },
  });

  function handleStep1(data: RegisterStep1Input) {
    setStep1Data(data);
    setStep(2);
  }

  async function handleStep2(data: RegisterStep2Input) {
    if (!step1Data) return;
    setServerError(null);

    const result = await registerAction({
      email: step1Data.email,
      password: step1Data.password,
      role: step1Data.role,
      full_name: data.full_name,
      phone: data.phone,
      city: data.city,
      bio: data.bio,
      hourly_rate: data.hourly_rate,
      languages: data.languages,
      activities: data.activities,
    });

    if (result?.error) setServerError(result.error);
  }

  const isCompanion = step1Data?.role === "companion" || step1.watch("role") === "companion";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {step === 1 ? "Create account" : "Your profile"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Step 1 of 2 — Account details"
              : `Step 2 of 2 — ${step1Data?.role === "companion" ? "Companion" : "Tourist"} details`}
          </CardDescription>
        </CardHeader>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <form onSubmit={step1.handleSubmit(handleStep1)}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...step1.register("email")}
                />
                {step1.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {step1.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...step1.register("password")}
                />
                {step1.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {step1.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...step1.register("confirmPassword")}
                />
                {step1.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {step1.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>I am a…</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["tourist", "companion"] as const).map((role) => (
                    <label
                      key={role}
                      className={`flex items-center justify-center rounded-md border p-3 cursor-pointer text-sm font-medium transition-colors
                        ${step1.watch("role") === role
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-input hover:bg-muted"
                        }`}
                    >
                      <input
                        type="radio"
                        value={role}
                        className="sr-only"
                        {...step1.register("role")}
                      />
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                  ))}
                </div>
                {step1.formState.errors.role && (
                  <p className="text-xs text-destructive">
                    {step1.formState.errors.role.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Next
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <form onSubmit={step2.handleSubmit(handleStep2)}>
            <CardContent className="space-y-4">
              {serverError && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
                  {serverError}
                </p>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  placeholder="Jane Doe"
                  {...step2.register("full_name")}
                />
                {step2.formState.errors.full_name && (
                  <p className="text-xs text-destructive">
                    {step2.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+40 700 000 000"
                  {...step2.register("phone")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">City (optional)</Label>
                <Input
                  id="city"
                  placeholder="Bucharest"
                  {...step2.register("city")}
                />
              </div>

              {/* Companion-only fields */}
              {isCompanion && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell tourists about yourself…"
                      rows={3}
                      {...step2.register("bio")}
                    />
                    {step2.formState.errors.bio && (
                      <p className="text-xs text-destructive">
                        {step2.formState.errors.bio.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hourly_rate">Hourly rate (USD, optional)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="25"
                      {...step2.register("hourly_rate")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Languages <span className="text-muted-foreground text-xs">(press Enter to add)</span></Label>
                    <TagInput
                      value={step2.watch("languages") ?? []}
                      onChange={(tags) => step2.setValue("languages", tags)}
                      placeholder="English, Romanian…"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Activities <span className="text-muted-foreground text-xs">(press Enter to add)</span></Label>
                    <TagInput
                      value={step2.watch("activities") ?? []}
                      onChange={(tags) => step2.setValue("activities", tags)}
                      placeholder="Hiking, Museums…"
                    />
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={step2.formState.isSubmitting}
              >
                {step2.formState.isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
