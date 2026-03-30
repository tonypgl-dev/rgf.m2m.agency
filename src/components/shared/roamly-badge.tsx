import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoamlyBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white",
        "bg-[#1F1F2E] shadow-sm",
        className
      )}
    >
      <ShieldCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
      <span className="flex flex-col leading-tight text-left">
        <span className="font-medium">Licensed Local Guide</span>
        <span className="text-[10px] font-normal text-white/75">by Roamly</span>
      </span>
    </span>
  );
}
