/**
 * Public feedback-loop helpers — every feedback CTA on the site opens a
 * prefilled GitHub issue so the loop stays public and traceable.
 */
export const REPO_URL = "https://github.com/Insia88/rail-rwa";
export const ISSUES_URL = `${REPO_URL}/issues`;

export function issueUrl({
  title,
  body,
  template,
}: {
  title: string;
  body: string;
  template?: string;
}): string {
  const params = new URLSearchParams();
  if (template) params.set("template", template);
  params.set("title", title);
  params.set("body", body);
  return `${REPO_URL}/issues/new?${params.toString()}`;
}

export const FEEDBACK_QUESTIONS = [
  {
    id: "wedge",
    q: "첫 wedge는 무엇이어야 할까요?",
    detail: "수출채권 팩토링 vs 프리랜서 정산 — 8주 안에 하나만 고른다면?",
    issueTitle: "[Feedback] 첫 wedge: 수출채권 vs 프리랜서",
    issueBody:
      "## 질문\n8주 안에 하나만 고른다면 어떤 wedge가 먼저일까요?\n\n## 제 생각\n- 수출채권 팩토링: 증거(수출신고·USDC 정산)가 이미 구조화되어 있음\n- 프리랜서 정산: 시장은 넓지만 증거가 파편화됨\n\n## 의견\n(여기에 적어주세요)\n\n---\nRAIL demo: https://rail-rwa.vercel.app",
  },
  {
    id: "kpi",
    q: "8주 KPI 우선순위는?",
    detail: "팩토링 LOI 1건 vs 여권 10건 vs 테스트넷 ERC-3643 발행 1건.",
    issueTitle: "[Feedback] Nitro 8주 KPI 우선순위",
    issueBody:
      "## 질문\nNitro 2기 8주 동안 무엇을 가장 먼저 증명해야 할까요?\n\n- [ ] 팩토링사 LOI 1건\n- [ ] 신용 여권 10건 발급\n- [ ] ERC-3643 테스트넷 발행 + LP 1곳\n\n## 의견\n(여기에 적어주세요)\n\n---\nRAIL demo: https://rail-rwa.vercel.app",
  },
  {
    id: "partner",
    q: "첫 파트너는 어디가 좋을까요?",
    detail: "부산·대구 수출기업 / 팩토링사 / 무역보험 — 소개 가능한 곳이 있다면.",
    issueTitle: "[Partner] RAIL 첫 파일럿 파트너 소개",
    issueBody:
      "## 소개 요청\nRAIL의 첫 파일럿 파트너로 적합한 곳을 소개받고 싶습니다.\n\n관심 유형: 수출 중소기업 / 팩토링사 / 무역보험 / 기타\n\n## 소개할 곳\n(회사명, 담당자, 왜 적합한지)\n\n---\nRAIL demo: https://rail-rwa.vercel.app",
  },
] as const;
