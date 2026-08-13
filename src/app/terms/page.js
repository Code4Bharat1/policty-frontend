"use client";
import { SiteLayout } from "@/components/site/site-layout";

const sections = [
  { h: "Acceptance", p: "By using the Policy Care platform you agree to these terms. If you are using the platform on behalf of an organisation, you confirm you are authorised to bind it." },
  { h: "Nature of service", p: "Policy Care provides distribution and servicing support. The insurance contract is between you and the insurer; policy terms, exclusions and claim decisions are governed by the policy wording." },
  { h: "Quotations", p: "Quotations are indicative and valid for the period stated. Final premium is confirmed by the insurer after underwriting and may differ from the estimate shown." },
  { h: "Payments", p: "Premiums are collected through regulated payment gateways and remitted to the insurer. Cover starts only when the insurer confirms receipt and issues the policy." },
  { h: "Acceptable use", p: "You agree not to submit false information, upload unlawful content, attempt unauthorised access to other accounts, or interfere with platform security controls." },
  { h: "Limitation of liability", p: "Policy Care is not liable for insurer decisions on underwriting or claims. Our liability for service failures is limited to the fees received in respect of the affected transaction." },
  { h: "Governing law", p: "These terms are governed by the laws of India, with exclusive jurisdiction in the courts of Mumbai." },
];

export default function TermsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-14 lg:px-8">
        <p className="text-eyebrow">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated 11 August 2026.</p>
        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-base font-bold">{s.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
