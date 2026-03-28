"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { submitReviewAction } from "@/app/actions/reviews";

interface Props {
  bookingId: string;
  revieweeId: string;
  companionName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewSheet({
  bookingId,
  revieweeId,
  companionName,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (rating === 0) return;
    setSubmitting(true);
    setError(null);

    const res = await submitReviewAction({
      booking_id: bookingId,
      reviewee_id: revieweeId,
      rating,
      comment,
    });

    setSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="pb-8">
        <SheetHeader className="mb-4">
          <SheetTitle>Leave a review</SheetTitle>
          <SheetDescription>
            How was your experience with {companionName ?? "your companion"}?
          </SheetDescription>
        </SheetHeader>

        {/* Star picker */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(n)}
              className="p-0.5"
            >
              <Star
                className="h-7 w-7 transition-colors"
                fill={(hovered || rating) >= n ? "#f59e0b" : "none"}
                stroke={(hovered || rating) >= n ? "#f59e0b" : "currentColor"}
              />
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Share your experience (optional)…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="mb-4"
        />

        {error && <p className="text-sm text-destructive mb-3">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="w-full"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
