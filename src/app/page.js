"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight, BadgeCheck, Building2, Car, CheckCircle2, ClipboardList, FileSearch, HeartPulse,
  Home, Plane, Quote as QuoteIcon, ShieldCheck, Star, Users, Wallet,
} from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { catalogService } from "@/services";
import { inr } from "@/lib/format";

const categoryIcons = {
  health: HeartPulse, life: Users, motor: Car, travel: Plane, home: Home, business: Building2,
};

export default function HomePage() {
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: catalogService.categories });
  const { data: products } = useQuery({ queryKey: ["products"], queryFn: () => catalogService.products() });
  const { data: faqs } = useQuery({ queryKey: ["faqs"], queryFn: catalogService.faqs });
  const { data: testimonials } = useQuery({ queryKey: ["testimonials"], queryFn: catalogService.testimonials });

  const featured = (products ?? []).filter((p) => p.featured).slice(0, 3);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-xs font-semibold">
              <BadgeCheck className="size-3.5 text-accent" aria-hidden /> Digital Insurance Advisory & Operations Platform
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              Every policy, renewal and claim in one operations-grade dashboard.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
              Policy Care replaces spreadsheets, WhatsApp threads and paper files with a structured digital platform —
              for customers, for advisors and for the operations team behind them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">Explore insurance <ArrowRight className="size-4" aria-hidden /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/enquiry">Get a quote</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6">
              {[["100% Digital", "Unified Policy Portfolio"], ["Dedicated Advisor", "End-to-End Claim Support"], ["Fast Processing", "Instant Document Vault"]].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-xl font-bold">{v}</dt>
                  <dd className="text-xs text-primary-foreground/70 mt-0.5">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src="/hero-advisor.jpg"
              alt="Insurance advisor reviewing a customer's policy portfolio on a laptop"
              className="w-full rounded-2xl border border-primary-foreground/15 object-cover shadow-raised"
              width={880}
              height={660}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-eyebrow">Product categories</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Cover for every part of life</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((c) => {
            const Icon = categoryIcons[c.slug] ?? ShieldCheck;
            return (
              <Link key={c.slug} href={`/products?category=${c.slug}`} className="surface group p-6 transition-shadow hover:shadow-raised">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold">{c.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                  View plans <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured plans (only shown when real products exist) */}
      {featured.length > 0 && (
        <section className="border-y border-border bg-card">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-eyebrow">Featured plans</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Published insurance plans</h2>
              </div>
              <Button variant="outline" asChild><Link href="/products">Compare all plans</Link></Button>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {featured.map((p) => (
                <article key={p.id} className="surface flex flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-eyebrow">{p.planType}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning-foreground">
                      <Star className="size-3.5 fill-current text-warning" aria-hidden /> {p.rating}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.tagline}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <div>
                      <dt className="text-xs text-muted-foreground">Starting at</dt>
                      <dd className="text-lg font-bold">{inr(p.minPremium)}<span className="text-xs font-medium text-muted-foreground">/yr</span></dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Cover up to</dt>
                      <dd className="text-lg font-bold">{inr(p.maxCoverage, true)}</dd>
                    </div>
                  </dl>
                  <Button className="mt-5" asChild>
                    <Link href={`/products/${p.id}`}>View plan details</Link>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why choose */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-eyebrow">Why Policy Care</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Advisory expertise, delivered digitally</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileSearch, title: "Genuine comparison", body: "Side-by-side coverage, deductibles, riders and exclusions — not just premium." },
            { icon: ShieldCheck, title: "One portfolio view", body: "Policies from every insurer tracked together with expiry alerts and documents." },
            { icon: ClipboardList, title: "Claims handled for you", body: "Your advisor coordinates documentation and follows up with the insurer's desk." },
            { icon: Wallet, title: "Transparent pricing", body: "No customer fees. Commission-funded advisory disclosed on every quotation." },
          ].map((f) => (
            <div key={f.title} className="surface p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/12 text-accent">
                <f.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
          <p className="text-eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">From enquiry to policy in four steps</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              ["Share your requirement", "Tell us who needs cover, the budget and any existing policies."],
              ["Compare shortlisted plans", "Your advisor prepares a comparison with coverage and exclusions explained."],
              ["Accept the quotation", "Review premium, riders and validity, then accept digitally."],
              ["Policy issued & tracked", "Documents land in your portal with renewal and claim tracking switched on."],
            ].map(([title, body], i) => (
              <li key={title} className="relative">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <h3 className="mt-4 text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-eyebrow">Insurance comparison</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Policy Care versus buying direct</h2>
        <div className="surface mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">Comparison of Policy Care with buying insurance directly or through an offline agent</caption>
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th scope="col" className="px-5 py-3 font-semibold">What matters</th>
                <th scope="col" className="px-5 py-3 font-semibold">Policy Care</th>
                <th scope="col" className="px-5 py-3 font-semibold">Insurer website</th>
                <th scope="col" className="px-5 py-3 font-semibold">Offline agent</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Multi-insurer comparison", "Multi-Insurer Compare", "Single insurer", "Limited"],
                ["Digital policy vault", "Yes", "Partial", "No"],
                ["Renewal reminders", "45/30/15/7 days", "Email only", "Manual"],
                ["Claim assistance", "Dedicated advisor", "Call centre", "Varies"],
                ["Audited servicing history", "Full audit trail", "No", "No"],
              ].map(([a, b, c, d]) => (
                <tr key={a} className="border-b border-border last:border-0">
                  <th scope="row" className="px-5 py-3 text-left font-medium">{a}</th>
                  <td className="px-5 py-3 font-semibold text-success"><CheckCircle2 className="mr-1.5 inline size-4" aria-hidden />{b}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials (only shown when real testimonials exist) */}
      {(testimonials ?? []).length > 0 && (
        <section className="border-y border-border bg-card">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
            <p className="text-eyebrow">Customer stories</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">What policyholders say</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {(testimonials ?? []).map((t) => (
                <figure key={t.id} className="surface flex h-full flex-col p-6">
                  <QuoteIcon className="size-5 text-accent" aria-hidden />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">{t.quote}</blockquote>
                  <figcaption className="mt-4 border-t border-border pt-3 text-sm">
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.role} · {t.city}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {(faqs ?? []).length > 0 && (
        <section className="mx-auto w-full max-w-3xl px-4 py-16 lg:px-8">
          <p className="text-eyebrow">Frequently asked</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Questions before you start</h2>
          <Accordion type="single" collapsible className="mt-6">
            {(faqs ?? []).slice(0, 6).map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left text-sm font-semibold">{f.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-6">
            <Button variant="outline" asChild><Link href="/faq">See all FAQs</Link></Button>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to organise your insurance?</h2>
            <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
              Share your requirement and a licensed advisor will get back within one working day with a comparison.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" asChild><Link href="/enquiry">Get a quote</Link></Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/login">Sign in to portal</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
