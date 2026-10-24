import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { FEEDBACK_QUESTIONS, issueUrl, ISSUES_URL, REPO_URL } from "@/lib/feedback";

export const metadata: Metadata = {
  title: "For Hashed · Nitro 2기",
  description:
    "RAIL — 은행이 읽지 못하는 수출 현금흐름을 온체인 신용 여권으로 만들고, 수출채권을 RWA로 유동화하는 데모. Nitro 2기 지원 메모.",
};

const PROOF = [
  {
    label: "에이전트 네이티브 팀",
    nitro: "조직도에 에이전트가 있는가",
    rail: "1명 + 에이전트 크루. MCP 2종(신용·아트), 공개 의사결정 로그, 하루 만에 제품·영문·감사까지.",
    href: "/agents",
    link: "빌드 기록 보기",
  },
  {
    label: "포크되지 않는 것 (아직 없음)",
    nitro: "코드가 공개되어도 복제되지 않는 자산",
    rail: "솔직히: 현재 모트는 0입니다. 목표 모트는 ① 수출신고·정산 지갑 독점 읽기 ② 팩토링사 10% junior first-loss ③ 200건 상환 데이터셋. 각각 소유자·날짜를 정해 /log에 기록합니다.",
    href: "/log",
    link: "목표 모트 보기",
  },
  {
    label: "데모 픽스처 vs 라이브",
    nitro: "무엇이 실제이고 무엇이 시뮬레이션인지 구분하는가",
    rail: "지원자 3인은 가상 인물(데모 픽스처)입니다. 실제 고객은 0명. 시장 수치는 라이브 API이고, 판정·여권·RWA 기록은 시뮬레이션임을 화면에 표기합니다.",
    href: "/feedback",
    link: "정직성 기준 보기",
  },
  {
    label: "글로벌 접근",
    nitro: "한국을 넘어 읽히는 제품인가",
    rail: "영문 에디션 /en, EN one-pager, hreflang·canonical·sitemap, trust & regulatory 밴드.",
    href: "/en",
    link: "English edition",
  },
];

const LOOP = [
  { n: "01", t: "피드백", d: "GitHub Issue로 공개 기록 (30초)" },
  { n: "02", t: "트리아지", d: "48시간 안에 라벨·우선순위" },
  { n: "03", t: "배포", d: "7일 안에 제품/카피/구조에 반영" },
  { n: "04", t: "기록", d: "/log에 무엇이 왜 바뀌었는지 남김" },
];

export default function NitroPage() {
  return (
    <main className="bg-noir text-cream">
      <section className="relative overflow-hidden border-b border-line-dark">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
              For Hashed · Nitro Seoul 2기 · 2026.10.25
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.2vw,3.4rem)] font-extrabold leading-[1.18] tracking-[-0.02em]">
              김서준 대표님,<br />
              <span className="text-signal">신용의 레일</span>을<br />
              8주 안에 증명하겠습니다.
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-cream/55 sm:text-[16px]">
              RAIL은 은행이 거절한 수출 중소기업의 현금흐름을 온체인 증거로 검증해
              <strong className="font-semibold text-cream/90"> 신용 여권</strong>을 만들고, 승인된 수출채권을
              <strong className="font-semibold text-cream/90"> RWA(ERC-3643)</strong>로 유동화하는 데모입니다.
              이 페이지는 지원서가 아니라, 대표님께 직접 묻는 피드백 요청입니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/underwrite"
                className="inline-flex h-11 items-center bg-signal px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-noir transition-opacity hover:opacity-90"
              >
                3분 데모 시작 →
              </Link>
              <Link
                href="/RAIL-onepager.pdf"
                className="inline-flex h-11 items-center border border-cream/25 px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/80 transition-colors hover:border-cream/50 hover:text-cream"
              >
                1페이지 요약 (PDF)
              </Link>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center border border-cream/15 px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/55 transition-colors hover:text-cream"
              >
                GitHub ↗
              </a>
            </div>
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/30">
              LIVE · rail-rwa.vercel.app · EN edition · 데모 (실제 금융 서비스 아님)
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line-dark">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Why now</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
              세 변화가 같은 지점에서 만납니다.
            </h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 sm:grid-cols-3" step={0.05}>
            {[
              { k: "STO 법제화", v: "2026-01-15 국회 통과 · 2027.1 시행(잠정)", d: "수출채권 수익권 토큰의 제도적 레일" },
              { k: "스테이블코인", v: "$305B 유동성 · USDC 정산", d: "크로스보더 정산이 분 단위로" },
              { k: "달러 결제", v: "수출대금 84.2%", d: "원화 재무제표에 잡히지 않는 현금흐름" },
            ].map((m) => (
              <StaggerItem key={m.k}>
                <div className="h-full border border-line-dark bg-noir-2/50 p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-acid/80">{m.k}</p>
                  <p className="mt-2 text-[15px] font-bold leading-snug text-cream">{m.v}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-cream/45">{m.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-b border-line-dark">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Nitro lens</p>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
              Nitro가 보는 기준으로, 이미 증명한 것.
            </h2>
          </Reveal>
          <div className="mt-8 border-t border-line-dark">
            {PROOF.map((p, i) => (
              <Reveal key={p.label} delay={i * 0.04}>
                <div className="grid gap-3 border-b border-line-dark py-5 sm:grid-cols-[0.9fr_1.4fr] sm:gap-8">
                  <div>
                    <p className="text-[15px] font-bold text-cream">{p.label}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-cream/35">
                      {p.nitro}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] leading-[1.7] text-cream/60">{p.rail}</p>
                    <Link
                      href={p.href}
                      className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-acid/80 transition-colors hover:text-acid"
                    >
                      {p.link} →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line-dark">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Truth surface</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
              무엇이 실제이고, 무엇이 시뮬레이션인가.
            </h2>
            <p className="mt-3 max-w-2xl text-[13px] leading-[1.7] text-cream/50">
              이 구분을 숨기면 데모는 신뢰를 잃습니다. RAIL은 실제 고객 0명의 데모이며, 아래처럼 경계를 명시합니다.
            </p>
          </Reveal>
          <div className="mt-8 border-t border-line-dark">
            {[
              { k: "지원자 3인", v: "시뮬레이션 — 가상 인물·가상 회사", tone: "sim" },
              { k: "신용 판정·한도·금리", v: "결정론 엔진 계산 (입력은 가상)", tone: "sim" },
              { k: "RWA 발행·펀딩·LP", v: "시뮬레이션 — 온체인 기록 없음", tone: "sim" },
              { k: "시장 수치 (스테이블코인·환율·RWA)", v: "라이브 API (DefiLlama·ECB·Hyperliquid)", tone: "live" },
              { k: "실제 고객·매출·LOI", v: "0 — 다음 7일 목표", tone: "none" },
            ].map((row) => (
              <div key={row.k} className="grid gap-2 border-b border-line-dark py-3.5 sm:grid-cols-[220px_1fr_80px] sm:items-baseline sm:gap-6">
                <p className="text-[13px] font-medium text-cream/85">{row.k}</p>
                <p className="text-[12.5px] leading-relaxed text-cream/50">{row.v}</p>
                <span className={`justify-self-start border px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] sm:justify-self-end ${row.tone === "live" ? "border-verified/50 text-verified" : row.tone === "none" ? "border-signal/50 text-signal" : "border-cream/20 text-cream/40"}`}>
                  {row.tone === "live" ? "live" : row.tone === "none" ? "missing" : "sim"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="border border-line-dark p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-signal">Decline discipline</p>
              <p className="mt-2 text-[15px] font-bold text-cream">승인만 하는 엔진은 신용이 아닙니다.</p>
              <p className="mt-2 text-[12px] leading-[1.7] text-cream/50">
                거절 룰 데모: 동일 수출신고번호가 다른 펀더에 이미 담보로 잡힌 경우 VERIFIER가 차단합니다.
                사유 코드 <span className="font-mono text-cream/70">E-DUP-PLEDGE</span> ·{" "}
                <span className="font-mono text-cream/70">E-SOURCE-MISMATCH</span>.
                현재 엔진은 승인 3건만 보여줍니다 — 다음 라운드에 거절 픽스처 1건을 추가해 승인률이 아니라
                <strong className="text-cream/80"> 거절률</strong>을 보여주겠습니다.
              </p>
            </div>
            <div className="border border-line-dark p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-acid/80">Economics · 가정</p>
              <p className="mt-2 text-[15px] font-bold text-cream">티켓·수수료·손실 (검증 전)</p>
              <ul className="mt-2 space-y-1 text-[12px] leading-[1.7] text-cream/50">
                <li>— 티켓: 3,000만–3억원 · 90일 수출채권</li>
                <li>— 수수료: 액면가의 1.5–3.0% (등급별), 서비스 비용 별도</li>
                <li>— 예상 손실: 2–4% 가정 · junior first-loss 10% (팩토링사)</li>
                <li>— LP 목표 수익: 세전 9–12% · 손실 반영 후 7–9%</li>
              </ul>
              <p className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.1em] text-cream/25">
                위 수치는 사업 모델 가정이며 데모 엔진/증서 수치가 아닙니다.
              </p>
            </div>
          </div>

          <p className="mt-6 text-[11px] leading-relaxed text-cream/35">
            만든 사람: 1인 창업자 · GitHub{" "}
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-cream/60 underline underline-offset-4">@Insia88</a>.
            소개·피드백은 GitHub Issues 또는 15분 통화 요청으로 부탁드립니다.
          </p>
        </div>
      </section>

      <section className="border-b border-line-dark bg-paper text-ink">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">3 questions</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
              대표님께 직접 묻고 싶은 세 가지.
            </h2>
            <p className="mt-3 max-w-xl text-[13.5px] leading-[1.7] text-ink/60">
              답은 GitHub Issue로 남겨주셔도 되고, 15분 통화로 들려주셔도 됩니다.
              모든 답은 공개 로그에 기록하고 7일 안에 제품에 반영합니다.
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 md:grid-cols-3" step={0.05}>
            {FEEDBACK_QUESTIONS.map((q) => (
              <StaggerItem key={q.id}>
                <div className="flex h-full flex-col border border-ink/15 bg-cream/40 p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35">
                    Question
                  </p>
                  <p className="mt-2 text-[16px] font-bold leading-snug text-ink">{q.q}</p>
                  <p className="mt-2 flex-1 text-[12.5px] leading-[1.65] text-ink/60">{q.detail}</p>
                  <a
                    href={issueUrl({ title: q.issueTitle, body: q.issueBody, template: "feedback.yml" })}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/70 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
                  >
                    의견 남기기 (GitHub, 30초) ↗
                  </a>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-[11px] leading-relaxed text-ink/45">
            * 개인정보·민감정보는 Issue에 남기지 마세요. 소개 요청은{" "}
            <a
              href={issueUrl({
                title: "[Partner] RAIL 파일럿 파트너 소개",
                body: "## 소개 요청\n\n## 소개할 곳 (회사명/담당자/왜 적합한지)\n",
                template: "partner-intro.yml",
              })}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ink/30 underline-offset-2"
            >
              파트너 소개 템플릿
            </a>
            으로 부탁드립니다.
          </p>
        </div>
      </section>

      <section className="border-b border-line-dark">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Feedback loop</p>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
                피드백이 제품을 바꾸는 과정을 공개합니다.
              </h2>
              <p className="mt-4 text-[13.5px] leading-[1.75] text-cream/55">
                지난 3일 동안 받은 네 개의 피드백이 실제로 구조를 바꿨습니다.
                무엇이 들어왔고, 무엇을 배포했는지 <Link href="/log" className="text-acid underline decoration-acid/30 underline-offset-4">build log</Link>에 남깁니다.
              </p>
              <div className="mt-6 space-y-2.5">
                {[
                  { in: "“실사례 기준 이 구조가 최선인가?”", out: "10 viewports → 5.6, 6-act case-first, inline 심사" },
                  { in: "“해시드·글로벌 파트너 퀄리티”", out: "/en 에디션, EN one-pager, trust·regulatory 밴드, licence·contact" },
                  { in: "“영문 버전도 릴리즈”", out: "EN 데모 경로 + 언어 전환" },
                  { in: "“직관적으로 구성”", out: "데모 경로 바, 3-step 스트립, breadcrumb" },
                ].map((row) => (
                  <div key={row.in} className="flex flex-col gap-1 border-l-2 border-signal/60 pl-3 sm:flex-row sm:items-baseline sm:gap-3">
                    <p className="text-[12px] text-cream/60">{row.in}</p>
                    <span aria-hidden className="hidden text-cream/25 sm:inline">→</span>
                    <p className="text-[12px] font-medium text-cream/85">{row.out}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-3 sm:grid-cols-2">
                {LOOP.map((s) => (
                  <div key={s.n} className="border border-line-dark bg-noir-2/40 p-5">
                    <p className="type-data text-[14px] text-signal">{s.n}</p>
                    <p className="mt-2 text-[14px] font-bold text-cream">{s.t}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-cream/45">{s.d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/feedback"
                  className="inline-flex h-10 items-center bg-cream px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-noir transition-opacity hover:opacity-90"
                >
                  피드백 루프 열기 →
                </Link>
                <a
                  href={ISSUES_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center border border-cream/20 px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/65 transition-colors hover:text-cream"
                >
                  Issues 보기 ↗
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Next 7 days</p>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
              다음 7일의 공개 약속.
            </h2>
          </Reveal>
          <ol className="mt-8 border-t border-line-dark">
            {[
              { d: "Day 1–2", t: "실제 수출기업 1곳의 증거 데이터로 여권 재발급", s: "고객 인터뷰 2건 포함" },
              { d: "Day 3–4", t: "영문 데모 영상 + 자막, /en 제품 페이지 완성", s: "이번 주 내 배포" },
              { d: "Day 5–7", t: "팩토링사 1곳 파일럿 미팅, LOI 조건 정리", s: "무전이 아닌 계약 전 단계" },
            ].map((row) => (
              <li key={row.d} className="grid gap-2 border-b border-line-dark py-5 sm:grid-cols-[110px_1.2fr_1fr] sm:gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-acid/70">{row.d}</span>
                <span className="text-[14px] font-medium text-cream">{row.t}</span>
                <span className="text-[12px] text-cream/45">{row.s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/underwrite"
              className="inline-flex h-11 items-center bg-signal px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-noir transition-opacity hover:opacity-90"
            >
              데모 직접 해보기 →
            </Link>
            <Link
              href="/feedback"
              className="inline-flex h-11 items-center border border-cream/25 px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/80 transition-colors hover:border-cream/50 hover:text-cream"
            >
              피드백 남기기
            </Link>
            <Link
              href="/en"
              className="inline-flex h-11 items-center border border-cream/15 px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/55 transition-colors hover:text-cream"
            >
              English edition
            </Link>
          </div>
          <p className="mt-8 max-w-2xl text-[11px] leading-relaxed text-cream/30">
            RAIL은 데모입니다. 실제 금융 서비스가 아니며, 신용 심사·수출채권 발행·온체인 투자 기록은
            시뮬레이션입니다. 이 페이지의 수치·출처는 리포지토리에서 확인할 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
