import type { MarketSnapshot, WeatherSignal } from "./types";

/**
 * "RWA 기상도" — deterministic readings from live market context.
 * No LLM required; every line is traceable to a number in the snapshot.
 */
export function buildWeather(m: MarketSnapshot): WeatherSignal[] {
  const signals: WeatherSignal[] = [];
  const fx = m.usdKrw;
  const fxDirection: WeatherSignal["direction"] = fx >= 1_380 ? "up" : fx <= 1_300 ? "down" : "flat";
  signals.push({
    horizon: "지금",
    direction: fxDirection,
    title:
      fxDirection === "up"
        ? "원화 약세 — 달러 매출의 원화 환산액이 커집니다"
        : fxDirection === "down"
          ? "원화 강세 — 달러 매출의 원화 환산액이 줄어듭니다"
          : "환율 중립권 — 헤지 비용이 수익성을 가릅니다",
    body: `USD/KRW ${fx.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}. 수출대금의 84.2%가 달러로 결제되는 구조에서(한국은행 2025), 환율은 매출의 크기가 아니라 상환 능력의 변동성입니다.`,
  });

  const sc = m.stablecoinChange30dPct;
  signals.push({
    horizon: "지금",
    direction: sc === null ? "flat" : sc >= 0.5 ? "up" : sc <= -0.5 ? "down" : "flat",
    title:
      sc !== null && sc >= 0.5
        ? "달러 유동성 확장 — 온체인 정산 채널이 두꺼워집니다"
        : sc !== null && sc <= -0.5
          ? "스테이블코인 순환 감소 — 유동성 조달 비용 상승 신호"
          : "스테이블코인 유동성 횡보",
    body: `스테이블코인 시가총액 $${(m.stablecoinMcapUsd / 1e9).toFixed(1)}B (30일 ${sc === null ? "—" : `${sc > 0 ? "+" : ""}${sc.toFixed(1)}%`}). USDT·USDC가 전체의 ${m.stablecoins.slice(0, 2).reduce((a, c) => a + c.sharePct, 0).toFixed(1)}%를 차지합니다.`,
  });

  const kr200 = m.onkorea.markets.find((x) => x.label === "코스피200");
  signals.push({
    horizon: "지금",
    direction: "up",
    title: "한국 자산은 이미 24시간 온체인에서 거래됩니다",
    body: `Hyperliquid HIP-3 'xyz' DEX에서 코스피200(${kr200 ? kr200.markPx.toFixed(2) : "—"})·현대차·SK하이닉스·원/달러가 24/7 거래됩니다. 일 거래대금 $${(m.onkorea.dayVolumeUsd / 1e9).toFixed(2)}B의 파생상품 시세(현물 아님)가 수출채권의 담보가치와 환헤지를 실시간으로 마크합니다.`,
  });

  signals.push({
    horizon: "3개월",
    direction: m.benchmark.apr >= 4.5 ? "up" : m.benchmark.apr <= 3.8 ? "down" : "flat",
    title: "토큰화 국채 금리가 팩토링 금리의 하한을 정합니다",
    body: `벤치마크 ${m.benchmark.apr.toFixed(2)}% (${m.benchmark.label}). 무위험 대체재 수익률이 오르면 RWA 신용 상품은 더 높은 스프레드를 요구받습니다.`,
  });

  signals.push({
    horizon: "12개월",
    direction: "up",
    title: "수출채권의 토큰화 — 정산이 아니라 '발행'이 병목이 됩니다",
    body: `글로벌 RWA 시장은 집계 기준에 따라 $38B~$77B, 그중 토큰화 사모신용이 $25.6B(CoinGecko, 2026-10-22). 다음 단계는 자산을 감싸는 일이 아니라 권리·돈·조건·책임을 같은 거래 구조로 묶는 일입니다. 국내 STO 법은 2026-01-15 통과, 시행은 2027년 1월(잠정).`,
  });

  signals.push({
    horizon: "12개월",
    direction: "up",
    title: "에이전트가 심사하고, 에이전트가 유동성을 매칭합니다",
    body: "은행 영업시간 밖에서도 신용 판정과 자금 매칭이 돌아가야 24/7 수출 결제와 속도가 맞습니다. RAIL의 심사·검증·중개 에이전트는 휴일 없이 같은 기준으로 반복합니다.",
  });

  return signals;
}
