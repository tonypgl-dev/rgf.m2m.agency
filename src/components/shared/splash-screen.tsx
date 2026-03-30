"use client";

import { useEffect, useState } from "react";

type Phase = "loading" | "splash" | "done";

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [src, setSrc] = useState("");

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const imgSrc = isMobile ? "/openg.png" : "/og-landscape.png";
    setSrc(imgSrc);

    const img = new window.Image();

    img.onload = () => {
      setPhase("splash");
      setTimeout(() => setPhase("done"), 4000);
    };

    img.onerror = () => setPhase("done");

    img.src = imgSrc;

    // Fallback: dacă imaginea durează prea mult, continuăm oricum
    const maxTimer = setTimeout(() => setPhase("done"), 12000);

    return () => clearTimeout(maxTimer);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "#0D0A1A" }}
    >
      {/* Loading spinner — afișat cât timp imaginea se preîncarcă */}
      {phase === "loading" && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid rgba(249,115,22,0.2)",
            borderTopColor: "#F97316",
            animation: "splash-spin 0.8s linear infinite",
          }}
        />
      )}

      {/* Imaginea splash — afișată după preîncărcare, acoperă exact ecranul */}
      {phase === "splash" && src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Roamly"
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "contain",
            objectPosition: "center",
            backgroundColor: "#0D0A1A",
          }}
        />
      )}
    </div>
  );
}
