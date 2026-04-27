import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A3625",
};

export const metadata: Metadata = {
  title: "Voter Pulse AI — Your Agentic Election Coach",
  description:
    "Bridge the gap between complex ECI procedures and citizen participation. From registration to voting — your step-by-step civic journey guide.",
  keywords: ["voter", "election", "India", "ECI", "registration", "EVM", "VVPAT", "civic"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VoterPulse",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen min-h-dvh flex flex-col bg-background text-foreground relative">
        <ClientProviders>{children}</ClientProviders>
        
        {/* Soothing Floating Demo Badge */}
        <div className="absolute top-4 right-4 z-[100] pointer-events-none">
          <div className="glass-card px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] text-muted-foreground/80 bg-background/30 backdrop-blur-md border border-border/50 shadow-sm transition-opacity hover:opacity-0">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse flex-shrink-0" />
            <span>Educational Demo • Fictional Data</span>
          </div>
        </div>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
