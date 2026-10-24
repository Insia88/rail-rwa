import type { MarketSnapshot } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { pct, usdCompact } from "@/lib/format";
import { trimUsd } from "@/components/landing/format";
import { SectionHead } from "@/components/landing/section-head";

export function TransmissionTable({ market }: { market: MarketSnapshot }) {
  const kr200 = market.onkorea.markets.find((m) => m.label === "코스피200");

  const rows = [
    {
      variable: "벤치마크 금리",
      value: pct(market.benchmark.apr, 2),
      effect: "APR 하한",
      detail: `무위험 대체재 수익률(${market.benchmark.label}). 팩토링 금리의 기준점입니다.`,
    },
    {
      variable: "USD / KRW",
      value: market.usdKrw.toLocaleString("ko-KR", { maximumFractionDigits: 2 }),
      effect: "환리스크 프리미엄",
      detail: "달러 결제 비중이 높을수록 금리에 환리스크 가산이 붙습니다.",
    },
    {
      variable: "스테이블코인 유동성",
      value: trimUsd(usdCompact(market.stablecoinMcapUsd)),
      effect: "풀 깊이",
      detail: "USDT·USDC 잔고가 두꺼울수록 LP 모집과 상환이 빨라집니다.",
    },
    {
      variable: "RWA 시장 (CoinGecko)",
      value: trimUsd(usdCompact(market.rwa.rwaTotalUsd)),
      effect: "출구 유동성",
      detail: `토큰화 사모신용 ${trimUsd(usdCompact(market.rwa.tokenizedPrivateCreditUsd))} 시장이 우리 제품의 직접 비교군입니다.`,
    },
    {
      variable: "온체인 한국자산 마크",
      value: kr200 ? kr200.markPx.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) : "—",
      effect: "담보가치 · 환헤지",
      detail: "24/7 perp 마크가 담보가치와 환헤지 기준을 실시간으로 갱신합니다.",
    },
  ];

  return (
    <section className="border-b border-line-dark bg-noir">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="04"
          kicker="Transmission"
          title="이 숫자가 신용에 반영되는 방식."
          sub="시장 데이터는 금리·한도·담보가치를 바꾸는 입력값입니다. 어떤 경로로 들어가는지 그대로 적습니다."
        />

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">시장 변수에서 신용 판정으로 이어지는 경로</caption>
              <thead>
                <tr className="border-y border-line-dark">
                  <th
                    scope="col"
                    className="w-[34%] py-3 pr-4 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/30"
                  >
                    시장 변수
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-right font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/30"
                  >
                    현재 값
                  </th>
                  <th
                    scope="col"
                    className="py-3 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/30"
                  >
                    신용 반영
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.variable} className="border-b border-line-dark">
                    <td className="py-4 pr-4 align-top">
                      <p className="text-[13.5px] font-bold text-cream">{row.variable}</p>
                      <p className="mt-1 max-w-md text-[11.5px] leading-relaxed text-cream/40">
                        {row.detail}
                      </p>
                    </td>
                    <td className="type-data whitespace-nowrap py-4 pr-4 text-right align-top text-[13px] text-cream">
                      {row.value}
                    </td>
                    <td className="py-4 align-top">
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-signal/90">
                        {row.effect}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
