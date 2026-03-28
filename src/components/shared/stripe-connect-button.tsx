"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isConnected: boolean;
}

export function StripeConnectButton({ isConnected }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
        <CheckCircle2 className="h-4 w-4" />
        Stripe account connected
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleConnect}
        disabled={loading}
        className="gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        {loading ? "Redirecting to Stripe…" : "Connect Stripe Account"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
