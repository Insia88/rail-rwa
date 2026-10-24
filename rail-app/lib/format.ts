export function krw(n: number, opts: { sign?: boolean } = {}): string {
  const v = Math.round(n);
  const s = new Intl.NumberFormat("ko-KR").format(Math.abs(v));
  const sign = v < 0 ? "-" : opts.sign ? "+" : "";
  return `${sign}${s}원`;
}

/** 1.2억 / 3,450만 / 9,800원 */
export function krwCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 100_000_000) {
    const eok = abs / 100_000_000;
    return `${sign}${eok >= 10 ? Math.round(eok) : eok.toFixed(1).replace(/\.0$/, "")}억`;
  }
  if (abs >= 10_000) {
    const man = abs / 10_000;
    return `${sign}${man >= 100 ? Math.round(man).toLocaleString("ko-KR") : man.toFixed(1).replace(/\.0$/, "")}만`;
  }
  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}`;
}

export function krwEok(n: number, digits = 1): string {
  return `${(n / 100_000_000).toFixed(digits)}억`;
}

export function usdCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e12) return `$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(abs / 1e3).toFixed(1)}K`;
  return `$${Math.round(abs)}`;
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits).replace(/\.0$/, "")}%`;
}

export function signedPct(n: number | null, digits = 1): string {
  if (n === null || Number.isNaN(n)) return "—";
  const s = n > 0 ? "+" : "";
  return `${s}${n.toFixed(digits)}%`;
}

export function dateKo(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${y}.${m}.${d}`;
}

export function dateKrLong(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function timeKo(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(d);
}

export function daysBetween(aIso: string, bIso: string): number {
  const a = new Date(`${aIso.slice(0, 10)}T00:00:00Z`).getTime();
  const b = new Date(`${bIso.slice(0, 10)}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86_400_000);
}

export const DECISION_LABEL = {
  approved: "승인",
  conditional: "조건부 승인",
  declined: "거절",
} as const;

export const GRADE_TONE: Record<string, string> = {
  A: "text-verified",
  "B+": "text-verified",
  B: "text-ink",
  "C+": "text-gold",
  C: "text-signal",
  D: "text-signal",
};

export const SEVERITY_LABEL = { high: "높음", medium: "중간", low: "낮음" } as const;

export function relativeFrom(asOf: string): string {
  const d = daysBetween("2026-10-22", asOf);
  if (d === 0) return "오늘";
  if (d > 0) return `${d}일 후`;
  return `${Math.abs(d)}일 전`;
}
