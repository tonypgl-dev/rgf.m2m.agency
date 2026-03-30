"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Props {
  conversationId: string;
  currentUserId: string;
  otherPartyName: string | null;
  initialMessages: DirectMessage[];
}

function msgTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DirectChat({
  conversationId,
  currentUserId,
  otherPartyName,
  initialMessages,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<DirectMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`dm:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as DirectMessage;
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, conversationId]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setInput("");

    const { error } = await supabase.from("direct_messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: trimmed,
    });

    if (error) setInput(trimmed);
    setSending(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <p className="font-medium text-sm">{otherPartyName ?? "Guide"}</p>
        <p className="text-xs text-muted-foreground">Ask anything before booking</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={[
                  "max-w-[75%] px-3 py-2 text-sm break-words",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                    : "bg-muted rounded-2xl rounded-bl-sm",
                ].join(" ")}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <p className={`text-[10px] mt-0.5 ${isOwn ? "text-primary-foreground/60 text-right" : "text-muted-foreground"}`}>
                  {msgTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t px-3 py-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message…"
          className="flex-1"
        />
        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || sending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
