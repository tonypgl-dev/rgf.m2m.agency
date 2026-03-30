"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    // Preload both images
    const img1 = new window.Image();
    img1.src = "/og-portrait.png";
    const img2 = new window.Image();
    img2.src = "/og-landscape.png";

    // Start timers only after the visible image loads
    const img = new window.Image();
    img.src = mobile ? "/og-portrait.png" : "/og-landscape.png";

    let fadeTimer: ReturnType<typeof setTimeout>;
    let unmountTimer: ReturnType<typeof setTimeout>;

    img.onload = () => {
      fadeTimer = setTimeout(() => setVisible(false), 2500);
      unmountTimer = setTimeout(() => setMounted(false), 3200);
    };

    // Fallback in case onload doesn't fire (cached images)
    fadeTimer = setTimeout(() => setVisible(false), 2500);
    unmountTimer = setTimeout(() => setMounted(false), 3200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src={isMobile ? "/og-portrait.png" : "/og-landscape.png"}
        fill
        className="object-cover"
        priority
        alt="Roamly"
      />
    </div>
  );
}
