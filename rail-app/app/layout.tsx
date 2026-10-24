import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CommandPalette } from "@/components/site/command-palette";

import { PageTransition } from "@/components/site/page-transition";
import { ScrollProgress } from "@/components/ui/motion";

export const metadata: Metadata = {
  metadataBase: new URL("https://rail-rwa.vercel.app"),
  title: {
    default: "RAIL — 은행이 읽지 못하는 매출을, 신용으로",
    template: "%s · RAIL",
  },
  description:
    "RAIL은 수출대금과 정산 흐름을 온체인 증거로 검증해 중소 수출기업·프리랜서·딥테크의 신용 여권(Credit Passport)을 만들고, 수출채권을 RWA로 토큰화해 스테이블코인 유동성으로 연결하는 신용 레일입니다.",
  keywords: ["RWA", "수출채권", "팩토링", "신용평가", "스테이블코인", "온체인", "Nitro", "Hashed"],
  openGraph: {
    title: "RAIL — 신용이 먼저 도착하는 레일",
    description:
      "은행은 담보를 봅니다. RAIL은 흐름을 봅니다. 온체인 증거로 만드는 수출 중소기업 신용 여권 & 수출채권 RWA 유동화.",
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: {
    languages: { ko: "/", en: "/en" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" hrefLang="ko-KR" href="https://rail-rwa.vercel.app/" />
        <link rel="alternate" hrefLang="en-US" href="https://rail-rwa.vercel.app/en" />
        <link rel="alternate" hrefLang="x-default" href="https://rail-rwa.vercel.app/" />
        <link
          rel="preload"
          href="/fonts/archivo-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/instrument-serif-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/plex-mono-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-dvh bg-porcelain text-graphite antialiased">
        <Header />
        <ScrollProgress />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
