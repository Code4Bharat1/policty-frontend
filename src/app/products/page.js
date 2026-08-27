"use client";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Scale, Search, Star, X } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/primitives";
import { catalogService } from "@/services";
import { inr } from "@/lib/format";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [company, setCompany] = useState("all");
  const [maxPremium, setMaxPremium] = useState(40000);
  const [compare, setCompare] = useState([]);

  const category = searchParams.get("category") ?? "all";

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: catalogService.categories });
  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: catalogService.companies });
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", q, category, company, maxPremium],
    queryFn: () => catalogService.products({ q, category, companyId: company, maxPremium }),
  });

  const comparing = useMemo(() => (products ?? []).filter((p) => compare.includes(p.id)), [products, compare]);

  const toggleCompare = (id) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));

  const setCategory = (slug) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <SiteLayout>
      <div className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
          <p className="text-eyebrow">Insurance marketplace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Insurance products &amp; plans</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Filter by category, insurer and budget, then compare up to three plans side by side before requesting a quotation.
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="surface h-fit space-y-6 p-5">
          <h2 className="text-sm font-bold">Filters</h2>
          <div className="space-y-2">
            <Label htmlFor="pq">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input id="pq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Plan or benefit" className="pl-9" />
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium">Category</legend>
            <div className="space-y-1">
              <button
                onClick={() => setCategory("all")}
                className={`w-full rounded-md px-3 py-2 text-left text-sm ${category === "all" ? "bg-secondary/10 font-semibold text-secondary" : "text-muted-foreground hover:bg-muted"}`}
              >
                All categories
              </button>
              {(categories ?? []).map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${category === c.slug ? "bg-secondary/10 font-semibold text-secondary" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="company">Insurance company</Label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger id="company"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All insurers</SelectItem>
                {(companies ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="premium">Maximum starting premium: {inr(maxPremium)}</Label>
            <Slider id="premium" min={1000} max={40000} step={500} value={[maxPremium]} onValueChange={([v]) => setMaxPremium(v ?? 40000)} />
          </div>
        </aside>

        <section>
          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
            </div>
          ) : (products ?? []).length === 0 ? (
            <EmptyState icon={Search} title="No plans match these filters" description="Try widening the premium range or clearing the category filter." />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {(products ?? []).map((p) => (
                <article key={p.id} className="surface flex flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-eyebrow">{p.planType}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold">
                      <Star className="size-3.5 fill-current text-warning" aria-hidden /> {p.rating}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-bold leading-snug">
                    <Link href={`/products/${p.id}`} className="hover:text-secondary">{p.name}</Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.tagline}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    {p.benefits.slice(0, 3).map((b) => <li key={b}>• {b}</li>)}
                  </ul>
                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <div>
                      <dt className="text-xs text-muted-foreground">Starting at</dt>
                      <dd className="text-base font-bold">{inr(p.minPremium)}/yr</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Cover up to</dt>
                      <dd className="text-base font-bold">{inr(p.maxCoverage, true)}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                      <Link href={`/checkout?productId=${p.id}&category=${p.category}&sumInsured=${p.maxCoverage}&premium=${p.minPremium}`}>
                        Buy Online
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/products/${p.id}`}>Details <ArrowRight className="size-4" aria-hidden /></Link>
                    </Button>
                    <Button variant={compare.includes(p.id) ? "secondary" : "ghost"} size="icon" onClick={() => toggleCompare(p.id)} title="Compare plan">
                      <Scale className="size-4" aria-hidden />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {comparing.length > 1 ? (
            <div className="surface mt-8 overflow-x-auto">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="text-sm font-bold">Plan comparison ({comparing.length})</h2>
                <Button variant="ghost" size="sm" onClick={() => setCompare([])}><X className="size-4" aria-hidden /> Clear</Button>
              </div>
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th scope="col" className="px-5 py-3 font-semibold">Feature</th>
                    {comparing.map((p) => <th key={p.id} scope="col" className="px-5 py-3 font-semibold">{p.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Coverage", (p) => inr(p.maxCoverage, true)],
                    ["Premium from", (p) => `${inr(p.minPremium)}/yr`],
                    ["Deductible", (p) => inr(p.plans[0].deductible)],
                    ["Benefits", (p) => p.benefits.slice(0, 3).join(", ")],
                    ["Add-ons", (p) => p.addOns.map((a) => a.name).join(", ")],
                    ["Eligibility", (p) => p.eligibility[0]],
                    ["Exclusions", (p) => p.exclusions.slice(0, 2).join(", ")],
                  ].map(([label, fn]) => (
                    <tr key={label} className="border-b border-border last:border-0 align-top">
                      <th scope="row" className="px-5 py-3 text-left font-medium">{label}</th>
                      {comparing.map((p) => <td key={p.id} className="px-5 py-3 text-muted-foreground">{fn(p)}</td>)}
                    </tr>
                  ))}
                  <tr>
                    <td className="px-5 py-3" />
                    {comparing.map((p) => (
                      <td key={p.id} className="px-5 py-3">
                        <Button size="sm" asChild><Link href={`/products/${p.id}`}>Request quote</Link></Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </div>
    </SiteLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <SiteLayout>
        <div className="mx-auto w-full max-w-7xl p-10">
          <Skeleton className="h-64 w-full" />
        </div>
      </SiteLayout>
    }>
      <ProductsContent />
    </Suspense>
  );
}
