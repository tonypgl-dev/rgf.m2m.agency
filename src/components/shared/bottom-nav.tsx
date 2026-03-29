"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Calendar, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  href: string;
  label: string;
  icon: React.ElementType;
}

const TOURIST_TABS: Tab[] = [
  { href: "/companions", label: "Explore", icon: Compass },
  { href: "/tourist/dashboard", label: "Bookings", icon: Calendar },
  { href: "/tourist/profile", label: "Profile", icon: User },
];

const COMPANION_TABS: Tab[] = [
  { href: "/companion/dashboard", label: "Bookings", icon: Calendar },
  { href: "/companion/earnings", label: "Earnings", icon: Wallet },
  { href: "/companion/profile", label: "Profile", icon: User },
];

export function BottomNav({ role }: { role: "tourist" | "companion" }) {
  const pathname = usePathname();
  const tabs = role === "tourist" ? TOURIST_TABS : COMPANION_TABS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors",
                active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <Icon
                className="h-[22px] w-[22px]"
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span
                className={cn(
                  "text-[10px]",
                  active ? "font-semibold" : "font-medium"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
