import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const PRODUCT = [
  { href: "/underwrite", label: "신용 여권" },
  { href: "/market", label: "RWA 시장 기상도" },
  { href: "/agents", label: "에이전트 팀" },
  { href: "/underwrite/hanbit", label: "한빛전자 심사" },
  { href: "/passport/hanbit", label: "한빛전자 여권" },
  { href: "/en", label: "English edition" },
];

const DOCS = [
  { href: "/nitro", label: "For Hashed · Nitro" },
  { href: "/feedback", label: "Feedback loop" },
  { href: "/log", label: "Build log" },
  { href: "/RAIL-onepager.pdf", label: "1페이지 요약 (KO)" },
  { href: "/RAIL-onepager-en.pdf", label: "One-pager (EN)" },
  { href: "https://github.com/Insia88/rail-rwa", label: "GitHub repository ↗" },
  { href: "https://github.com/Insia88/rail-rwa/issues", label: "Contact · GitHub Issues ↗" },
  { href: "https://github.com/Insia88/rail-rwa/blob/main/LICENSE", label: "License (demo, proprietary) ↗" },
];

const DATA = [
  "DefiLlama · Stablecoins",
  "Frankfurter (ECB) · USD/KRW",
  "Hyperliquid HIP-3 · 24/7 Korea",
  "CoinGecko · RWA categories",
  "특허청 KIPRIS · 관세청 수출신고",
];

const CREW = [
  "SCOUT · 증거 수집",
  "VERIFIER · 교차검증",
  "UNDERWRITER · 신용 판정",
  "BROKER · 유동성 매칭",
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-dark bg-noir text-cream">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06]" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Logo inverse />
            <p className="max-w-xs text-[13px] leading-relaxed text-cream/55">
              은행이 읽지 못하는 매출을 신용으로 번역하는 온체인 신용 레일.
              수출채권 RWA와 스테이블코인 유동성을 연결합니다.
            </p>
            <p className="max-w-xs text-[11px] leading-relaxed text-cream/35">
              Credit for the cash flow the bank can&apos;t read. Built by one human and an
              agent crew in Seoul.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35">
              Seoul · Base · USDC
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid/80">Product</p>
            {PRODUCT.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block text-[13px] text-cream/60 transition-colors duration-200 hover:text-cream"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid/80">Docs & Contact</p>
            {DOCS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                className="block text-[13px] text-cream/60 transition-colors duration-200 hover:text-cream"
              >
                {l.label}
              </a>
            ))}
            <ul className="space-y-1.5 pt-2">
              {DATA.map((s) => (
                <li key={s} className="font-mono text-[10px] leading-relaxed text-cream/40">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid/80">Agent Crew</p>
            <ul className="space-y-1.5">
              {CREW.map((s) => (
                <li key={s} className="font-mono text-[10px] leading-relaxed text-cream/45">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line-dark pt-6 md:flex-row md:items-start md:justify-between">
          <p className="max-w-3xl font-mono text-[10px] leading-relaxed tracking-[0.02em] text-cream/35">
            RAIL은 데모입니다. 실제 금융 서비스가 아니며, 신용 심사·수출채권 발행·온체인 투자 기록은
            시뮬레이션입니다. 시장 데이터는 공개 API에서 조회합니다. RAIL is a demo; not a financial
            service, and on-chain issuance/investment records are simulated.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
              RAIL Credit Engine · Seoul
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/25">© 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
