import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "RAIL — Credit for the cash flow banks can't read",
  },
  description:
    "RAIL verifies export receipts, platform payouts and patents as on-chain evidence, issues a credit passport, and tokenizes approved receivables as ERC-3643 RWAs. A demo built for Nitro Seoul 2 by one founder and an agent crew.",
  openGraph: {
    title: "RAIL — Credit for the cash flow banks can't read",
    description:
      "The bank prices collateral. RAIL prices verified cash flow. On-chain credit passports and export-receivable RWAs.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
  },
  alternates: {
    canonical: "/en",
    languages: { ko: "/", en: "/en" },
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EnDocumentLang />
      {children}
    </>
  );
}

/** Sets the document language for the English route (root layout owns <html lang="ko">). */
function EnDocumentLang() {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `try{document.documentElement.lang='en';document.documentElement.setAttribute('dir','ltr');}catch(e){}`,
      }}
    />
  );
}
