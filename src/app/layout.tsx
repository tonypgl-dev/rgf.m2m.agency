import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit, Comfortaa, Nunito, Oxanium, Inter } from "next/font/google";
import { Footer } from "@/components/shared/footer";
import { SplashScreen } from "@/components/shared/splash-screen";
import { ThemeProvider } from "@/components/shared/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "800"],
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["300", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://roamly.ro"),
  title: "Roamly — Your local guide in Romania",
  description:
    "Book a verified local for dinner, city tours, hiking & more. Real people. Real experiences.",
  openGraph: {
    title: "Roamly — Your local guide in Romania.",
    description:
      "Book a verified local for dinner, city tours, hiking & more. Real people. Real experiences.",
    url: "https://roamly.ro",
    siteName: "Roamly",
    images: [
      {
        url: "https://roamly.ro/og-landscape.png",
        width: 1200,
        height: 630,
        alt: "Roamly — Your local guide in Romania.",
      },
      {
        url: "https://roamly.ro/og-portrait.png",
        width: 630,
        height: 840,
        alt: "Roamly — Your local guide in Romania.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamly — Your local guide in Romania.",
    description:
      "Book a verified local for dinner, city tours, hiking & more.",
    images: ["https://roamly.ro/og-landscape.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/og-portrait.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Roamly — Your local guide in Romania",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F1F2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.variable} ${comfortaa.variable} ${nunito.variable} ${oxanium.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SplashScreen />
          <div className="flex-1 flex flex-col min-h-0">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
