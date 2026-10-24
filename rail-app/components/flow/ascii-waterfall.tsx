import type { Profile, UnderwritingResult } from "@/lib/types";
import { pct } from "@/lib/format";

const FRAME = 66;
const INNER = FRAME - 4;
const KRW = (n: number) => `KRW ${Math.round(n).toLocaleString("ko-KR")}`;

function row(left: string, right = ""): string {
  const body = right
    ? `${left}${" ".repeat(Math.max(1, INNER - left.length - right.length))}${right}`
    : left;
  return `│ ${body.slice(0, INNER).padEnd(INNER)} │`;
}

function titleLine(title: string): string {
  const dashes = Math.max(0, FRAME - title.length - 5);
  return `┌─ ${title} ${"─".repeat(dashes)}┐`;
}

function footLine(title: string): string {
  const dashes = Math.max(0, FRAME - title.length - 5);
  return `└─ ${title} ${"─".repeat(dashes)}┘`;
}

function divider(): string {
  return `├${"─".repeat(FRAME - 2)}┤`;
}

/** p95 of a small series = nearest-rank percentile (deterministic, no random). */
function p95(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1);
  return sorted[rank];
}

/**
 * Engineering diagram, not a chart: a 12px mono ASCII waterfall of the
 * receivable capital stack and settlement. Every figure is read from `result`
 * (and `profile` for the p95 of independently verified inflow).
 */
export function AsciiWaterfall({
  result,
  profile,
}: {
  result: UnderwritingResult;
  profile: Profile;
}) {
  const { funding } = result;
  const face = result.faceValueKrw;
  const feeRate = face > 0 ? `${((result.feeKrw / face) * 100).toFixed(1)}%` : "—";
  const fundedTotal = funding.investors.reduce((acc, investor) => acc + investor.amountKrw, 0);
  const verifiedInflow = profile.monthlyInflowKrw.map(
    (value, index) => value * (profile.verifiedShareByMonth[index] ?? 0),
  );
  const p95Inflow = p95(verifiedInflow);

  const tranches = ["SENIOR", "MEZZ", "EQUITY"] as const;
  const trancheRows = tranches.map((tranche, index) => {
    const investor = funding.investors[index];
    const left = investor
      ? `${tranche}  ${investor.alias} · ${investor.region}`
      : `${tranche}  — awaiting LP`;
    return row(left, investor ? KRW(investor.amountKrw) : "—");
  });

  const lines = [
    titleLine("RAIL / CAPITAL WATERFALL"),
    row("SENIOR → MEZZ → EQUITY", "tranche order"),
    divider(),
    ...trancheRows,
    row(`MATCHED ${pct(funding.fundedPct, 0)}`, KRW(fundedTotal)),
    divider(),
    row("FACE VALUE", KRW(face)),
    row(`DISCOUNT ${pct(result.apr, 2)} × ${result.tenorDays}/365`, `- ${KRW(result.discountKrw)}`),
    row(`FEE ${feeRate}`, `- ${KRW(result.feeKrw)}`),
    row("NET PROCEEDS", KRW(result.netProceedsKrw)),
    divider(),
    row("P95 VERIFIED INFLOW · 6M", KRW(p95Inflow)),
    footLine("P95 DRAWDOWN · RULE ENGINE"),
  ];

  return (
    <figure className="mt-5 border border-ink/25 bg-paper">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 px-3.5 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/70">
          ASCII / capital waterfall
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55">
          12px mono · box-drawing
        </span>
      </figcaption>
      <div className="overflow-x-auto px-3.5 py-3.5">
        <pre className="w-max font-mono text-[12px] leading-[1.55] text-ink/80">
          {lines.join("\n")}
        </pre>
      </div>
    </figure>
  );
}
