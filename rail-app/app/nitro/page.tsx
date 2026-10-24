import type { Metadata } from "next";
import Link from "next/link";
import { FEEDBACK_QUESTIONS, issueUrl, ISSUES_URL, REPO_URL } from "@/lib/feedback";
import { ALL_RESULTS } from "@/lib/engine";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { dateKo, dateKrLong, krw, krwCompact, pct, usdCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "김서준 대표님께 · Nitro 2기",
  description:
    "RAIL — 은행이 읽지 못하는 수출 현금흐름을 온체인 증거로 검증해 신용 여권을 만들고, 승인된 수출채권을 RWA로 유동화하는 데모. Nitro 2기 지원 메모.",
};

const LETTER_DATE = "2026-10-25";

const TRUTH_ROWS = [
  { item: "지원자 3인", detail: "가상 인물·가상 회사로 만든 데모 픽스처입니다.", tone: "sim" },
  {
    item: "신용 판정·한도·금리",
    detail:
      "결정론 엔진이 계산합니다. 입력값은 시뮬레이션이지만, 같은 입력에는 같은 결과가 나옵니다.",
    tone: "sim",
  },
  {
    item: "RWA 발행·펀딩·LP",
    detail: "온체인에 기록된 자산은 없습니다. 화면의 증서는 시뮬레이션입니다.",
    tone: "sim",
  },
  {
    item: "시장 수치",
    detail: "DefiLlama·ECB·Hyperliquid·CoinGecko에서 서버사이드로 조회한 라이브 값입니다.",
    tone: "live",
  },
  { item: "실제 고객·매출·LOI", detail: "0건입니다. 다음 7일의 목표로 공개합니다.", tone: "none" },
] as const;

const NEXT_7_DAYS = [
  {
    when: "1–2일차",
    title: "실제 수출기업 1곳의 증거로 여권을 다시 발급",
    note: "고객 인터뷰 2건 포함",
  },
  { when: "3–4일차", title: "영문 데모 영상과 제품 페이지 완성", note: "이번 주 안에 배포" },
  { when: "5–7일차", title: "팩토링사 1곳 파일럿 미팅, LOI 조건 정리", note: "말이 아니라 계약 전 단계" },
];

function toneStyle(tone: "sim" | "live" | "none") {
  if (tone === "live") return { text: "실제", dot: "bg-verified" };
  if (tone === "none") return { text: "없음", dot: "bg-graphite-3" };
  return { text: "시뮬레이션", dot: "bg-vermilion" };
}

export default async function NitroPage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));
  const hanbit = results[0];

  const numbers = [
    { label: "신용 점수", value: hanbit.score.toFixed(1), note: `등급 ${hanbit.grade}` },
    { label: "승인 한도", value: krwCompact(hanbit.limitKrw), note: krw(hanbit.limitKrw) },
    { label: "적용 금리", value: pct(hanbit.apr, 2), note: "90일 · 연 기준" },
  ];

  return (
    <main className="bg-porcelain text-graphite">
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-24 sm:px-6 sm:pt-28">
        <article className="mx-auto w-full max-w-[720px]">
          <header className="border-b border-hairline-2 pb-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-brand text-[26px] font-semibold leading-none tracking-[-0.02em]">
                  RAIL<span className="text-vermilion">.</span>
                </p>
                <p className="mt-2 text-[13px] leading-[1.6] text-graphite-2">
                  Credit infrastructure · Seoul
                </p>
              </div>
              <p className="text-[13px] leading-[1.6] text-graphite-2">
                For Hashed · Nitro Seoul 2기
              </p>
            </div>
          </header>

          <h1 className="mt-10 text-[clamp(1.9rem,4.2vw,2.7rem)] font-semibold leading-[1.24] tracking-[-0.02em]">
            은행이 읽지 못한 매출을,
            <br />
            8주 안에 신용으로.
          </h1>

          <dl className="mt-8 grid gap-x-10 gap-y-4 border-y border-hairline py-6 sm:grid-cols-2">
            <div>
              <dt className="text-[13px] leading-[1.6] text-graphite-2">수신</dt>
              <dd className="mt-1 text-[15px] font-medium leading-[1.6]">김서준 대표님 · Hashed</dd>
            </div>
            <div>
              <dt className="text-[13px] leading-[1.6] text-graphite-2">발신</dt>
              <dd className="mt-1 text-[15px] font-medium leading-[1.6]">RAIL · 1인 창업자</dd>
            </div>
            <div>
              <dt className="text-[13px] leading-[1.6] text-graphite-2">날짜</dt>
              <dd className="mt-1 text-[15px] font-medium leading-[1.6]">
                {dateKrLong(LETTER_DATE)}
              </dd>
            </div>
            <div>
              <dt className="text-[13px] leading-[1.6] text-graphite-2">제목</dt>
              <dd className="mt-1 text-[15px] font-medium leading-[1.6]">
                RAIL 데모 소개와 세 가지 질문
              </dd>
            </div>
          </dl>

          <div className="mt-10 space-y-6 text-[17px] leading-[1.8] text-graphite">
            <p>
              대표님, RAIL은 은행이 거절한 수출 중소기업의 현금흐름을 온체인 증거로 검증해
              <strong className="font-semibold"> 신용 여권</strong>을 만들고, 승인된 수출채권을
              <strong className="font-semibold"> RWA</strong>로 유동화하는 데모입니다. 지원서를 한
              장 더 보내는 대신, 지금 돌아가는 제품을 직접 열어보시고 판단을 듣고 싶어 이 편지를
              씁니다.
            </p>
            <p>
              지금의 사실은 분명합니다. 실제 고객은 0명이고, 화면에 나오는 지원자 3인은 가상
              인물입니다. 판정·한도·금리는 결정론 엔진이 계산하며, 증서와 펀딩은 시뮬레이션임을
              화면에 표시합니다. 대신 시장 수치는 실시간이고, 같은 입력에는 항상 같은 판정이
              나옵니다. 은행 석 곳에서 거절당한 수출기업 한 곳을 예로 들면 결과는 이렇습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-card border border-hairline bg-hairline sm:grid-cols-3">
            {numbers.map((n) => (
              <div key={n.label} className="bg-surface px-6 py-5">
                <p className="text-[13px] leading-[1.6] text-graphite-2">{n.label}</p>
                <p className="mt-2 text-[clamp(1.6rem,3vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums">
                  {n.value}
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-graphite-2">{n.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13px] leading-[1.7] text-graphite-2">
            한빛전자(가상 지원자) 기준 · {dateKo(market.asOf)} 엔진 계산 · 입력은 시뮬레이션
          </p>

          <p className="mt-8 text-[17px] leading-[1.8]">
            왜 지금인지는 숫자로 설명됩니다. 수출대금의 대부분이 달러로 결제되고, 스테이블코인
            유동성은 {usdCompact(market.stablecoinMcapUsd)} 규모이며, 국내 토큰증권 법제화는 시행을
            앞두고 있습니다. 이 세 변화가 만나는 지점이 수출채권입니다. RAIL은 그 지점에서
            증거·심사·발행을 맡고, 자금은 허가된 기관이 공급하는 구조를 지향합니다.
          </p>
          <p className="mt-4 text-[13px] leading-[1.7] text-graphite-2">
            라이브 데이터: USD/KRW {market.usdKrw.toLocaleString("ko-KR")} · 스테이블코인{" "}
            {usdCompact(market.stablecoinMcapUsd)} · RWA {usdCompact(market.rwa.rwaTotalUsd)} (
            {dateKo(market.asOf)}, DefiLlama · ECB · CoinGecko)
          </p>

          <section className="mt-16" aria-labelledby="questions">
            <h2
              id="questions"
              className="text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
            >
              대표님께 묻고 싶은 세 가지
            </h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-graphite-2">
              답은 GitHub Issue로 남겨주셔도 되고, 15분 통화로 들려주셔도 됩니다. 모든 답은 공개
              로그에 기록하고 7일 안에 제품에 반영합니다.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {FEEDBACK_QUESTIONS.map((q, i) => (
                <div
                  key={q.id}
                  className="flex h-full flex-col rounded-card border border-hairline bg-surface p-6"
                >
                  <p className="text-[13px] leading-[1.6] text-graphite-2">질문 {i + 1}</p>
                  <p className="mt-2 text-[17px] font-semibold leading-[1.45]">{q.q}</p>
                  <p className="mt-2 flex-1 text-[15px] leading-[1.65] text-graphite-2">
                    {q.detail}
                  </p>
                  <a
                    href={issueUrl({
                      title: q.issueTitle,
                      body: q.issueBody,
                      template: "feedback.yml",
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex text-[14px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    의견 남기기 (GitHub) ↗
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16" aria-labelledby="truth">
            <h2
              id="truth"
              className="text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
            >
              무엇이 실제이고, 무엇이 시뮬레이션인가
            </h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-graphite-2">
              이 구분을 숨기면 데모는 신뢰를 잃습니다. RAIL은 실제 고객 0명의 데모이며, 아래처럼
              경계를 명시합니다.
            </p>
            <div className="mt-6 overflow-hidden rounded-card border border-hairline bg-surface">
              <table className="w-full table-fixed border-collapse text-left">
                <thead className="hidden sm:table-header-group">
                  <tr className="border-b border-hairline">
                    <th
                      scope="col"
                      className="w-[30%] px-5 py-3 text-[13px] font-medium text-graphite-2"
                    >
                      항목
                    </th>
                    <th scope="col" className="px-5 py-3 text-[13px] font-medium text-graphite-2">
                      내용
                    </th>
                    <th
                      scope="col"
                      className="w-[22%] px-5 py-3 text-[13px] font-medium text-graphite-2"
                    >
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TRUTH_ROWS.map((row) => {
                    const tone = toneStyle(row.tone);
                    return (
                      <tr key={row.item} className="border-b border-hairline last:border-b-0">
                        <th
                          scope="row"
                          className="block px-5 pb-1 pt-4 text-[15px] font-medium leading-[1.5] sm:table-cell sm:py-4 sm:align-top"
                        >
                          {row.item}
                        </th>
                        <td className="block px-5 pb-2 text-[15px] leading-[1.65] text-graphite-2 sm:table-cell sm:py-4 sm:align-top">
                          {row.detail}
                        </td>
                        <td className="block px-5 pb-4 sm:table-cell sm:py-4 sm:align-top">
                          <span className="inline-flex items-center gap-2 rounded-chip border border-hairline-2 px-2.5 py-1 text-[13px] leading-none text-graphite">
                            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                            {tone.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16" aria-labelledby="discipline">
            <h2
              id="discipline"
              className="text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
            >
              거절과 단위경제
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-card border border-hairline bg-surface p-6">
                <p className="text-[15px] font-semibold leading-[1.5]">
                  승인만 하는 엔진은 신용이 아닙니다
                </p>
                <p className="mt-3 text-[15px] leading-[1.7] text-graphite-2">
                  동일 수출신고번호가 다른 펀더에 이미 담보로 잡혀 있으면 VERIFIER가 차단합니다.
                  사유 코드는{" "}
                  <span className="font-mono text-[14px] text-graphite">E-DUP-PLEDGE</span>,{" "}
                  <span className="font-mono text-[14px] text-graphite">E-SOURCE-MISMATCH</span>
                  입니다. 현재 엔진은 승인 3건만 보여주고, 다음 라운드에 거절 픽스처 1건을 더해
                  승인률이 아니라 거절률을 보여드리겠습니다.
                </p>
              </div>
              <div className="rounded-card border border-hairline bg-surface p-6">
                <p className="text-[15px] font-semibold leading-[1.5]">티켓·수수료·손실 가정</p>
                <ul className="mt-3 space-y-1.5 text-[15px] leading-[1.65] text-graphite-2">
                  <li>티켓 3,000만–3억원 · 90일 수출채권</li>
                  <li>수수료 액면가의 1.5–3.0% (등급별), 서비스 비용 별도</li>
                  <li>예상 손실 2–4% · 팩토링사 junior first-loss 10%</li>
                  <li>LP 목표 수익 세전 9–12%, 손실 반영 후 7–9%</li>
                </ul>
                <p className="mt-4 text-[13px] leading-[1.6] text-graphite-2">
                  위 수치는 사업 모델 가정이며 데모 엔진·증서의 값이 아닙니다.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16" aria-labelledby="next">
            <h2
              id="next"
              className="text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
            >
              다음 7일의 공개 약속
            </h2>
            <ol className="mt-6 border-t border-hairline">
              {NEXT_7_DAYS.map((row) => (
                <li
                  key={row.when}
                  className="grid gap-1.5 border-b border-hairline py-5 sm:grid-cols-[96px_1fr] sm:gap-6"
                >
                  <span className="text-[13px] leading-[1.6] text-graphite-2">{row.when}</span>
                  <span>
                    <span className="block text-[16px] font-medium leading-[1.5]">{row.title}</span>
                    <span className="mt-1 block text-[15px] leading-[1.6] text-graphite-2">
                      {row.note}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-16 border-t border-hairline pt-10">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <p className="text-[15px] leading-[1.7] text-graphite-2">감사합니다.</p>
                <p className="mt-4 text-[20px] font-semibold leading-[1.3] tracking-[-0.01em]">
                  RAIL · 1인 창업자
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-graphite-2">
                  Seoul · rail-rwa.vercel.app
                </p>
              </div>
              <div
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[1.5px] border-vermilion/70"
                aria-label="RAIL 직인"
              >
                <div className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full border border-vermilion/30">
                  <span className="font-brand text-[15px] font-semibold leading-none tracking-[0.02em] text-vermilion">
                    RAIL
                  </span>
                  <span className="mt-1.5 text-[12px] leading-none text-vermilion">Seoul</span>
                </div>
              </div>
            </div>

            <p className="mt-10 text-[15px] leading-[1.8] text-graphite-2">
              덧붙임 — 제품은{" "}
              <Link
                href="/underwrite"
                className="font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
              >
                3분 데모
              </Link>
              에서 직접 확인하실 수 있습니다. 요약은{" "}
              <a
                href="/RAIL-onepager.pdf"
                className="font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion"
              >
                1페이지 PDF
              </a>
              , 코드는{" "}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion"
              >
                GitHub
              </a>
              에 있습니다. 피드백은{" "}
              <a
                href={ISSUES_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion"
              >
                공개 Issue
              </a>
              로 남겨주시면 7일 안에 회신드립니다.
            </p>

            <p className="mt-10 border-t border-hairline pt-6 text-[13px] leading-[1.7] text-graphite-2">
              RAIL은 데모입니다. 실제 금융 서비스가 아니며, 신용 심사·수출채권 발행·온체인 투자
              기록은 시뮬레이션입니다. 시장 데이터는 공개 API에서 조회합니다.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
