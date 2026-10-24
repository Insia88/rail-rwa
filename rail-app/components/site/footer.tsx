import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const PRODUCT = [
  { href: "/underwrite", label: "신용 여권 만들기" },
  { href: "/passport/hanbit", label: "여권 예시" },
  { href: "/market", label: "RWA 시장" },
  { href: "/agents", label: "에이전트 팀" },
  { href: "/en", label: "English edition" },
];

const COMPANY = [
  { href: "/nitro", label: "For Hashed · Nitro" },
  { href: "/feedback", label: "피드백 루프" },
  { href: "/log", label: "빌드 로그" },
  { href: "/RAIL-onepager.pdf", label: "1페이지 요약 (KO)" },
  { href: "/RAIL-onepager-en.pdf", label: "One-pager (EN)" },
];

const EXTERNAL = [
  { href: "https://github.com/Insia88/rail-rwa", label: "GitHub" },
  { href: "https://github.com/Insia88/rail-rwa/issues", label: "Contact · Issues" },
  { href: "https://github.com/Insia88/rail-rwa/blob/main/LICENSE", label: "License" },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-porcelain">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo inverse={false} />
            <p className="max-w-xs text-[14px] leading-[1.7] text-graphite-2">
              수출대금과 정산 흐름을 온체인 증거로 검증해 신용 여권을 만들고,
              승인된 수출채권을 RWA로 유동화합니다.
            </p>
            <p className="max-w-xs text-[12px] leading-[1.7] text-graphite-3">
              Credit for the cash flow the bank can&apos;t read. Built in Seoul by one human and
              an agent crew.
            </p>
            <p className="text-[12px] font-medium text-graphite-3">Seoul · Base · USDC</p>
          </div>

          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-graphite">Product</p>
            {PRODUCT.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block text-[14px] text-graphite-2 transition-colors hover:text-graphite"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-graphite">Company</p>
            {COMPANY.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block text-[14px] text-graphite-2 transition-colors hover:text-graphite"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-graphite">Links</p>
            {EXTERNAL.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="block text-[14px] text-graphite-2 transition-colors hover:text-graphite"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-6 md:flex-row md:items-start md:justify-between">
          <p className="max-w-3xl text-[12px] leading-[1.7] text-graphite-3">
            RAIL은 데모입니다. 실제 금융 서비스가 아니며, 신용 심사·수출채권 발행·온체인 투자 기록은
            시뮬레이션입니다. 시장 데이터는 공개 API에서 조회합니다. RAIL is a demo; not a financial
            service, and issuance/investment records are simulated.
          </p>
          <p className="shrink-0 text-[12px] text-graphite-3">© 2026 RAIL · Seoul</p>
        </div>
      </div>
    </footer>
  );
}
