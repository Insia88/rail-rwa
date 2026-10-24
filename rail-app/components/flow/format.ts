/**
 * Presentation-only formatting for flow artifacts.
 * Amounts always come from engine results — these helpers only render them.
 */

/** 180000000 → "1억 8,000만원" · 54000000 → "5,400만원" · 0 → "0원" */
export function wonPhrase(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0원";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.round((n % 100_000_000) / 10_000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0) parts.push(`${man.toLocaleString("ko-KR")}만`);
  return `${parts.join(" ")}원`;
}
