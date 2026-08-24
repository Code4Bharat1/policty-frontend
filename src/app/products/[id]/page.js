"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Building2, Check, FileText, ShieldCheck, Star, X } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { catalogService, quoteService } from "@/services";
import { inr } from "@/lib/format";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id;
  const { data: product, isLoading } = useQuery({ queryKey: ["product", id], queryFn: () => catalogService.product(id) });
  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: catalogService.companies });
  const [planId, setPlanId] = useState("P2");
  const [addOns, setAddOns] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-12 lg:px-8">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </SiteLayout>
    );
  }
  if (!product) return null;

  const company = (companies ?? []).find((c) => c.id === product.companyId);
  const plan = product.plans.find((p) => p.id === planId) ?? product.plans[0];
  const addOnCost = product.addOns.filter((a) => addOns.includes(a.name)).reduce((s, a) => s + a.premium, 0);

  const requestQuote = async () => {
    setSubmitting(true);
    try {
      await quoteService.request({ productId: product.id, coverage: plan.sumInsured, addOns });
      toast.success("Quote request submitted", { description: "A licensed advisor will respond within one working day." });
    } catch {
      toast.error("We could not submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <div className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden /> All products
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-eyebrow flex items-center gap-2"><Building2 className="size-3.5" aria-hidden /> {company?.name}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{product.description}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3">
              <Star className="size-4 fill-current text-warning" aria-hidden />
              <span className="text-sm font-semibold">{product.rating} / 5</span>
              <span className="text-xs text-muted-foreground">· CSR {company?.claimSettlementRatio}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold">Plan options</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {product.plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlanId(p.id)}
                  aria-pressed={planId === p.id}
                  className={`surface p-5 text-left transition-colors ${planId === p.id ? "border-secondary ring-2 ring-secondary/25" : "hover:border-secondary/40"}`}
                >
                  <p className="text-sm font-bold">{p.name}</p>
                  <p className="mt-2 text-xl font-bold">{inr(p.annualPremium)}<span className="text-xs font-medium text-muted-foreground">/yr</span></p>
                  <p className="mt-1 text-xs text-muted-foreground">Sum insured {inr(p.sumInsured, true)} · Deductible {inr(p.deductible)}</p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {p.highlights.map((h) => <li key={h} className="flex gap-1.5"><Check className="mt-0.5 size-3 shrink-0 text-success" aria-hidden />{h}</li>)}
                  </ul>
                </button>
              ))}
            </div>
          </section>

          <Tabs defaultValue="coverage">
            <TabsList className="flex-wrap">
              <TabsTrigger value="coverage">Coverage &amp; benefits</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="addons">Add-ons</TabsTrigger>
              <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="coverage" className="surface mt-4 p-6">
              <ul className="space-y-3">
                {product.benefits.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{b}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="eligibility" className="surface mt-4 p-6">
              <ul className="space-y-3">
                {product.eligibility.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />{b}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="addons" className="surface mt-4 p-6">
              <ul className="divide-y divide-border">
                {product.addOns.map((a) => (
                  <li key={a.name} className="flex items-center justify-between gap-3 py-3">
                    <label className="flex items-center gap-3 text-sm font-medium">
                      <Checkbox
                        checked={addOns.includes(a.name)}
                        onCheckedChange={(v) => setAddOns((prev) => (v ? [...prev, a.name] : prev.filter((x) => x !== a.name)))}
                        aria-label={`Add ${a.name}`}
                      />
                      {a.name}
                    </label>
                    <span className="text-sm font-semibold">+{inr(a.premium)}/yr</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="exclusions" className="surface mt-4 p-6">
              <ul className="space-y-3">
                {product.exclusions.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm"><X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />{b}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="documents" className="surface mt-4 p-6">
              <ul className="space-y-3 text-sm">
                {["Policy wording", "Prospectus", "Claim form", "Network hospital list"].map((d) => (
                  <li key={d} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2"><FileText className="size-4 text-muted-foreground" aria-hidden />{d}</span>
                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading policy brochure for ${data.name}…`)}>Download</Button>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="surface h-fit p-6 lg:sticky lg:top-24">
          <p className="text-eyebrow">Your selection</p>
          <p className="mt-2 text-sm font-semibold">{plan.name} plan</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Sum insured</dt><dd className="font-semibold">{inr(plan.sumInsured, true)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Base premium</dt><dd className="font-semibold">{inr(plan.annualPremium)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Add-ons ({addOns.length})</dt><dd className="font-semibold">{inr(addOnCost)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-base"><dt className="font-semibold">Estimated annual</dt><dd className="font-bold">{inr(plan.annualPremium + addOnCost)}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">Indicative premium excluding GST. Final pricing is confirmed by the insurer after underwriting.</p>
          <Button className="mt-5 w-full" onClick={requestQuote} disabled={submitting}>
            {submitting ? "Submitting…" : "Get quote"}
          </Button>
          <Button variant="outline" className="mt-2 w-full" asChild><Link href="/enquiry">Talk to an advisor</Link></Button>
        </aside>
      </div>
    </SiteLayout>
  );
}
