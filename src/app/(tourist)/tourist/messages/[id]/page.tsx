import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DirectChat } from "@/components/shared/direct-chat";

export default async function DirectMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: conversationId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Load conversation + companion profile name
  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      id, tourist_id, companion_id,
      companions!inner(
        id,
        profiles!inner(full_name)
      )
    `)
    .eq("id", conversationId)
    .eq("tourist_id", user.id)
    .maybeSingle();

  if (!conversation) notFound();

  const companionProfile = (
    conversation.companions as unknown as { profiles: { full_name: string | null } }
  ).profiles;

  // Load messages
  const { data: messages } = await supabase
    .from("direct_messages")
    .select("id, conversation_id, sender_id, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
      <DirectChat
        conversationId={conversationId}
        currentUserId={user.id}
        otherPartyName={companionProfile?.full_name ?? null}
        initialMessages={messages ?? []}
      />
    </div>
  );
}
