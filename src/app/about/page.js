"use client";
import { Building2, Target, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 lg:px-8">
          <p className="text-eyebrow">About us</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Insurance servicing, rebuilt as software</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Policy Care began as an advisory practice servicing families and small businesses across India. The work was
            good; the tooling was not — renewals tracked in spreadsheets, claim files in email, and no single place a
            customer could see everything they owned. We rebuilt the practice as a platform.
          </p>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-14 md:grid-cols-3 lg:px-8">
        {[
          { icon: Users, t: "Customer first", d: "Every screen answers a question a policyholder actually asks: am I covered, when does it expire, where is my claim?" },
          { icon: Target, t: "Advisor enabled", d: "Advisors get a real CRM — leads, follow-ups, quotations and commissions — instead of a notebook." },
          { icon: Building2, t: "Operations grade", d: "Role-based access, audit logs and reporting so the business can be run, not just observed." },
        ].map((v) => (
          <div key={v.t} className="surface p-6">
            <v.icon className="size-5 text-accent" aria-hidden />
            <h2 className="mt-3 text-base font-bold">{v.t}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
