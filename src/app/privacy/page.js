"use client";
import { SiteLayout } from "@/components/site/site-layout";

const sections = [
  { h: "Information we collect", p: "We collect identity, contact, KYC, policy, claim and payment information that you provide or that insurers share with us in the course of servicing your policies." },
  { h: "How we use information", p: "Data is used to issue and service policies, process claims and payments, send renewal reminders, and meet regulatory record-keeping obligations. We do not sell personal data." },
  { h: "Sharing", p: "Information is shared with the insurer underwriting your policy, with third-party administrators handling your claim, and with payment gateways processing your transaction — never beyond what the service requires." },
  { h: "Storage and security", p: "Access is role based and least-privilege. Documents are stored with restricted access, transmission is encrypted, and every sensitive action is written to an immutable audit log." },
  { h: "Your rights", p: "You may request access to, correction of, or deletion of your personal data, subject to the retention periods insurers and regulators require. Write to care@policycare.demo." },
  { h: "Contact", p: "Grievance Officer, Policy Care, Level 7, Trade Centre, Bandra Kurla Complex, Mumbai 400051." },
];

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-14 lg:px-8">
        <p className="text-eyebrow">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Privacy Policy</h1>
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
