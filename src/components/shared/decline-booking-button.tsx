"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { companionCancelBookingAction } from "@/app/actions/bookings";

export function DeclineBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDecline() {
    setPending(true);
    await companionCancelBookingAction(bookingId);
    setPending(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDecline}
      disabled={pending}
      className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
    >
      {pending ? "Declining…" : "Decline"}
    </button>
  );
}
