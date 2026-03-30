"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrGetConversationAction } from "@/app/actions/chat";

interface Props {
  companionId: string;
  guideName: string | null;
  isLoggedIn: boolean;
  redirectPath: string; // current page path, for post-login redirect
}

export function MessageGuideButton({ companionId, guideName, isLoggedIn, redirectPath }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(redirectPath)}`);
      return;
    }

    setLoading(true);
    const result = await createOrGetConversationAction(companionId);
    setLoading(false);

    if (result.conversationId) {
      router.push(`/tourist/messages/${result.conversationId}`);
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 dark:[background-image:none] dark:bg-[rgba(166,124,255,0.15)] dark:border-[rgba(166,124,255,0.35)] dark:text-[#A67CFF] dark:hover:bg-[rgba(166,124,255,0.25)]"
    >
      <MessageCircle className="h-4 w-4" />
      {loading ? "Opening…" : `Message ${guideName?.split(" ")[0] ?? "Guide"}`}
    </Button>
  );
}
