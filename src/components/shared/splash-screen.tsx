"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 2500);
    const unmountTimer = setTimeout(() => setMounted(false), 3200);
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
      {/* Portrait — mobil */}
      <div className="absolute inset-0 block md:hidden">
        <Image src="/openg.png" fill className="object-cover" priority alt="Roamly" />
      </div>
      {/* Landscape — desktop */}
      <div className="absolute inset-0 hidden md:block">
        <Image src="/og-landscape.png" fill className="object-cover" priority alt="Roamly" />
      </div>
    </div>
  );
}
