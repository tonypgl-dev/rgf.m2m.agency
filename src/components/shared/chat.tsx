"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Send, LogIn, LogOut, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { checkInAction, checkOutAction, markCompleteAction } from "@/app/actions/chat";
import type { Message, BookingStatus } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatBooking {
  id: string;
  date: string;
  time_start: string;
  time_end: string;
  activity: string;
  meeting_point: string;
  status: BookingStatus;
  check_in_at: string | null;
  check_out_at: string | null;
  duration_hours: number;
  total_price: number;
}

interface Props {
  booking: ChatBooking;
  currentUserId: string;
  userRole: "tourist" | "companion";
  otherPartyName: string | null;
  initialMessages: Message[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function msgTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Chat({
  booking,
  currentUserId,
  userRole,
  otherPartyName,
  initialMessages,
}: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [actionPending, setActionPending] = useState<string | null>(null);

  // Mutable booking state (updated by actions without full page reload)
  const [checkInAt, setCheckInAt] = useState(booking.check_in_at);
  const [checkOutAt, setCheckOutAt] = useState(booking.check_out_at);
  const [status, setStatus] = useState(booking.status);

  const bottomRef = useRef<HTMLDivElement>(null);
  const isCompleted = status === "completed";

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Supabase Realtime subscription ──
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${booking.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${booking.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, booking.id]);

  // ── Send message (browser client — RLS enforces auth) ──
  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setInput("");

    const { error } = await supabase.from("messages").insert({
      booking_id: booking.id,
      sender_id: currentUserId,
      content: trimmed,
    });

    if (error) setInput(trimmed); // restore on failure
    setSending(false);
  }

  // ── Safety actions ──
  async function handleCheckIn() {
    setActionPending("checkin");
    const res = await checkInAction(booking.id);
    if (!res.error) setCheckInAt(new Date().toISOString());
    setActionPending(null);
  }

  async function handleCheckOut() {
    setActionPending("checkout");
    const res = await checkOutAction(booking.id);
    if (!res.error) setCheckOutAt(new Date().toISOString());
    setActionPending(null);
  }

  async function handleMarkComplete() {
    setActionPending("complete");
    const res = await markCompleteAction(booking.id);
    if (!res.error) setStatus("completed");
    setActionPending(null);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border bg-background">

      {/* ── Booking header ── */}
      <div className="px-4 py-3 border-b bg-muted/30 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate">
            {otherPartyName ?? "Booking"}
          </span>
          <Badge
            variant={
              isCompleted
                ? "outline"
                : status === "confirmed"
                  ? "default"
                  : "secondary"
            }
            className={isCompleted ? "text-green-600 border-green-300" : ""}
          >
            {isCompleted ? "Completed" : "Confirmed"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {booking.date} · {formatTime(booking.time_start)} –{" "}
          {formatTime(booking.time_end)} · {booking.activity}
        </p>
        <p className="text-xs text-muted-foreground">
          📍 {booking.meeting_point}
        </p>
      </div>

      {/* ── Action bar ── */}
      {!isCompleted && (
        <div className="px-4 py-2 border-b flex items-center gap-2 flex-wrap">
          {userRole === "tourist" && (
            <>
              <ActionPill
                icon={<LogIn className="h-3 w-3" />}
                label="Check in"
                doneLabel="Checked in"
                done={!!checkInAt}
                loading={actionPending === "checkin"}
                disabled={!!checkInAt}
                onClick={handleCheckIn}
              />
              <ActionPill
                icon={<LogOut className="h-3 w-3" />}
                label="Check out"
                doneLabel="Checked out"
                done={!!checkOutAt}
                loading={actionPending === "checkout"}
                disabled={!checkInAt || !!checkOutAt}
                onClick={handleCheckOut}
              />
            </>
          )}
          {userRole === "companion" && (
            <button
              onClick={handleMarkComplete}
              disabled={actionPending === "complete"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              {actionPending === "complete" ? "Saving…" : "Mark as Complete"}
            </button>
          )}
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={[
                  "max-w-[75%] px-3 py-2 text-sm break-words",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                    : "bg-muted rounded-2xl rounded-bl-sm",
                ].join(" ")}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <p
                  className={`text-[10px] mt-0.5 ${
                    isOwn
                      ? "text-primary-foreground/60 text-right"
                      : "text-muted-foreground"
                  }`}
                >
                  {msgTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      {isCompleted ? (
        <div className="border-t px-4 py-3 text-center text-xs text-muted-foreground">
          This booking is complete — chat is read-only.
        </div>
      ) : (
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
      )}
    </div>
  );
}

// ─── ActionPill sub-component ─────────────────────────────────────────────────

function ActionPill({
  icon,
  label,
  doneLabel,
  done,
  loading,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  doneLabel: string;
  done: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
        done
          ? "bg-green-50 border-green-200 text-green-700"
          : disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-muted",
      ].join(" ")}
    >
      {icon}
      {loading ? "…" : done ? doneLabel : label}
    </button>
  );
}
