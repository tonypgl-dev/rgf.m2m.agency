"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ─── Inner checkout form ───────────────────────────────────────────────────────

function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/tourist/bookings/${bookingId}`,
      },
    });

    // confirmPayment only returns here if there's an error (success = redirect)
    setError(confirmError.message ?? "Payment failed. Please try again.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
          {error}
        </p>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || !elements || loading}
      >
        {loading ? "Processing…" : "Pay now"}
      </Button>
    </form>
  );
}

// ─── Exported wrapper ──────────────────────────────────────────────────────────

interface Props {
  clientSecret: string;
  bookingId: string;
}

export function PaymentForm({ clientSecret, bookingId }: Props) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <CheckoutForm bookingId={bookingId} />
    </Elements>
  );
}
