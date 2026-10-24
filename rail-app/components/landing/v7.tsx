import Link from "next/link";
import type { MarketSnapshot, UnderwritingResult } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { dateKo, krwCompact, pct, usdCompact } from "@/lib/format";
import type { V7ArtifactCopy, V7HeroCopy, V7ProofCopy } from "./v7-copy";

type Locale = "ko" | "en";

const EN_NAMES: Record<string, string> = {
  hanbit: "Hanbit Electronics",
  kimfreelance: "Kim Do-hyun",
  fiberlogic: "FiberLogic",
  sejong: "Sejong Trading",
};

/** Applicant display name — English edition uses romanized names. */
export function displayName(
  result: { profileId: string; applicantName: string },
  locale: Locale,
): string {
  return locale === "en" ? EN_NAMES[result.profileId] ?? result.applicantName : result.applicantName;
}

export function Pill({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center justify-center rounded-full bg-graphite px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-white transition-colors duration-200 hover:bg-graphite/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/40 focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
    >
      {children}
    </Link>
  );
}

export function TextLink({
  href,
  children,
  external,
  inverse,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  inverse?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={
        inverse
          ? "inline-flex items-center gap-1 text-[15px] font-medium text-white/70 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
          : "inline-flex items-center gap-1 text-[15px] font-medium text-graphite-2 underline decoration-hairline-2 underline-offset-4 transition-colors duration-200 hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/40 focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
      }
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

function limitText(limitKrw: number, locale: Locale) {
  return locale === "en" ? `KRW ${Math.round(limitKrw / 1e6)}M` : `${krwCompact(limitKrw)}원`;
}

function PassportCard({
  copy,
  result,
  locale = "ko",
}: {
  copy: V7HeroCopy;
  result: UnderwritingResult;
  locale?: Locale;
}) {
  return (
    <article className="rounded-[var(--radius-card)] border border-hairline bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-graphite-3">{copy.card.kicker}</p>
        <p className="font-mono text-[12px] tracking-[-0.01em] text-graphite-3">{result.passportId}</p>
      </div>

      <p className="mt-6 text-[22px] font-semibold tracking-[-0.02em] text-graphite">
        {displayName(result, locale)}
      </p>
      <p className="mt-1 text-[13px] text-graphite-3">{copy.card.meta}</p>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-porcelain px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] text-graphite-3">{copy.card.decisionLabel}</span>
          <span className="text-[15px] font-semibold text-vermilion">{copy.card.decision}</span>
        </div>
        <span className="rounded-full border border-hairline px-2.5 py-1 text-[13px] text-graphite-2">
          {copy.card.gradeLabel} {result.grade}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-hairline pt-5">
        <div>
          <dt className="text-[13px] text-graphite-3">{copy.card.limitLabel}</dt>
          <dd className="mt-1 whitespace-nowrap text-[clamp(1.45rem,2.6vw,2.2rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
            {limitText(result.limitKrw, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-graphite-3">{copy.card.aprLabel}</dt>
          <dd className="mt-1 text-[clamp(1.35rem,2.4vw,2rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
            {pct(result.apr, 2)}
          </dd>
        </div>
        <div className="col-span-2 flex items-baseline justify-between gap-3 border-t border-hairline pt-4">
          <dt className="text-[13px] text-graphite-3">{copy.card.coverageLabel}</dt>
          <dd className="text-[20px] font-semibold leading-none tracking-[-0.02em] text-graphite">
            {pct(result.evidenceCoverage * 100, 1)}
          </dd>
        </div>
      </dl>

      <p className="mt-6 border-t border-hairline pt-4 text-[12px] text-graphite-3">
        {copy.card.footer}
      </p>
    </article>
  );
}

/** Act 1 — Hero: warm porcelain, one sentence label, 64px H1, product card. */
export function V7Hero({
  copy,
  market,
  result,
  locale = "ko",
}: {
  copy: V7HeroCopy;
  market: MarketSnapshot;
  result: UnderwritingResult;
  locale?: Locale;
}) {
  const fx = market.usdKrw.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  const live =
    locale === "en"
      ? `Live as of ${dateKo(market.asOf)} · USD/KRW ${fx} · stablecoins ${usdCompact(market.stablecoinMcapUsd)}`
      : `실시간 기준 ${dateKo(market.asOf)} · USD/KRW ${fx} · 스테이블코인 ${usdCompact(market.stablecoinMcapUsd)}`;

  return (
    <section className="relative overflow-hidden bg-porcelain">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/art/v7/hero-light.webp')] bg-cover bg-center opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-porcelain/20 to-porcelain"
      />
      <div className="relative mx-auto w-full max-w-[1120px] px-6 pb-20 pt-28 sm:pt-32 lg:pb-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-[13px] text-graphite-3">{copy.label}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-5 text-[clamp(2.5rem,6.4vw,4rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-graphite">
                {copy.title1}
                <br />
                {copy.title2}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-[17px] leading-[1.65] text-graphite-2">
                {copy.sub}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Pill href={copy.primary.href}>{copy.primary.label}</Pill>
                <TextLink href={copy.secondary.href} external={copy.secondary.external}>
                  {copy.secondary.label}
                </TextLink>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-10 text-[13px] text-graphite-3">{live}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 rounded-[40px] bg-white/40 blur-2xl"
              />
              <div className="relative">
                <PassportCard copy={copy} result={result} locale={locale} />
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    locale === "en" ? "Rejected by 3 banks" : "은행 3곳 거절",
                    `${locale === "en" ? "Coverage" : "증거"} ${pct(result.evidenceCoverage * 100, 0)}`,
                    locale === "en" ? "4-agent rule engine" : "4 에이전트 · 규칙 엔진",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-hairline bg-surface/70 px-3 py-1.5 text-[12.5px] text-graphite-2 backdrop-blur"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Act 3 — Artifact: the issued passport as a static document + three RWA steps. */
export function V7Artifact({
  copy,
  result,
  locale = "ko",
}: {
  copy: V7ArtifactCopy;
  result: UnderwritingResult;
  locale?: Locale;
}) {
  const evidence = result.evidence.slice(0, 3);

  return (
    <section id="passport" className="relative scroll-mt-24 overflow-hidden bg-graphite text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_8%,rgba(255,255,255,0.10),transparent_55%)]"
      />
      <div className="relative mx-auto w-full max-w-[1120px] px-6 py-20 lg:py-24">
        <Reveal>
          <p className="text-[13px] text-white/50">{copy.label}</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-white">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.65] text-white/65">{copy.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal delay={0.06}>
            <article className="rounded-[var(--radius-card)] border border-hairline bg-surface p-6 text-graphite shadow-[0_60px_140px_-40px_rgba(0,0,0,0.85)] sm:p-8">
              <div className="flex items-center justify-between gap-3 border-b border-hairline pb-4">
                <p className="text-[13px] text-graphite-3">{copy.docKicker}</p>
                <p className="font-mono text-[12px] text-graphite-3">{result.passportId}</p>
              </div>

              <p className="mt-6 text-[22px] font-semibold tracking-[-0.02em] text-graphite">
                {result.applicantName}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-5">
                <div>
                  <p className="text-[13px] text-graphite-3">
                    {locale === "en" ? "Approved limit" : "승인 한도"}
                  </p>
                  <p className="mt-1 text-[clamp(1.6rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
                    {limitText(result.limitKrw, locale)}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-graphite-3">
                    {locale === "en" ? "APR · 90d" : "금리 · 90일"}
                  </p>
                  <p className="mt-1 text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
                    {pct(result.apr, 2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
                <p className="text-[13px] text-graphite-3">
                  {locale === "en" ? "Evidence coverage" : "증빙 커버리지"}
                </p>
                <p className="text-[18px] font-semibold text-graphite">
                  {pct(result.evidenceCoverage * 100, 1)}
                </p>
              </div>

              <ul className="mt-6 border-t border-hairline pt-2">
                {evidence.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline py-3"
                  >
                    <span className="min-w-0 text-[14px] text-graphite-2">{item.label}</span>
                    <span className="shrink-0 text-[13px] text-graphite-3">
                      {item.verified
                        ? locale === "en"
                          ? "verified"
                          : "검증"
                        : locale === "en"
                          ? "unverified"
                          : "미검증"}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[12px] text-graphite-3">{copy.docFooter}</p>
            </article>
          </Reveal>

          <div className="flex flex-col gap-8 lg:gap-10">
            {copy.steps.map((step, i) => (
              <Reveal key={step.tag} delay={0.06 + i * 0.04}>
                <div className="grid grid-cols-[44px_1fr] gap-4">
                  <span className="pt-1 text-[13px] text-white/40">{step.tag}</span>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.65] text-white/65">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <div className="pl-[60px]">
                <TextLink href={copy.pdfLink.href} external={copy.pdfLink.external} inverse>
                  {copy.pdfLink.label}
                </TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Act 4 — Proof & CTA: three numbers, honesty line, links, final CTA. */
export function V7ProofCta({ copy }: { copy: V7ProofCopy }) {
  return (
    <section id="case" className="scroll-mt-24 border-t border-hairline bg-surface">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-20 lg:py-24">
        <Reveal>
          <p className="text-[13px] text-graphite-3">{copy.label}</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-graphite">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.65] text-graphite-2">{copy.sub}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="mt-12 grid gap-8 border-y border-hairline py-10 sm:grid-cols-3">
            {copy.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-graphite">
                  {stat.value}
                </dd>
                <dt className="mt-3 text-[14px] leading-[1.5] text-graphite-3">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 text-[13px] leading-[1.6] text-graphite-3">{copy.faithNote}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <TextLink href={copy.links.nitro.href}>{copy.links.nitro.label}</TextLink>
            <TextLink href={copy.links.feedback.href}>{copy.links.feedback.label}</TextLink>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-16 border-t border-hairline pt-10">
            <h2 className="max-w-xl text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-graphite">
              {copy.ctaTitle}
            </h2>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Pill href={copy.ctaPrimary.href}>{copy.ctaPrimary.label}</Pill>
              <TextLink href={copy.ctaSecondary.href}>{copy.ctaSecondary.label}</TextLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
