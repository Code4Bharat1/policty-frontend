"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { LoadingRows } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogService, nameOfCompany } from "@/services";
import { inr } from "@/lib/format";

export default function CustomerInsurancePage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: catalogService.categories });
  const { data: products, isLoading } = useQuery({ queryKey: ["products", q, category], queryFn: () => catalogService.products({ q, category }) });

  return (
    <PortalPage role="CUSTOMER" title="Explore insurance" description="Compare plans from leading insurers and request a quote from your advisor.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plans" className="sm:max-w-xs" aria-label="Search plans" />
        <div className="flex flex-wrap gap-2">
          <Button variant={category === "all" ? "default" : "outline"} size="sm" onClick={() => setCategory("all")}>All</Button>
          {(categories ?? []).map((c) => (
            <Button key={c.slug} variant={category === c.slug ? "default" : "outline"} size="sm" onClick={() => setCategory(c.slug)}>{c.name}</Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingRows rows={4} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(products ?? []).map((p) => (
            <article key={p.id} className="surface flex flex-col p-5">
              <p className="text-eyebrow">{nameOfCompany(p.companyId)}</p>
              <h2 className="mt-1 text-base font-bold text-foreground">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">{inr(p.minPremium)}<span className="text-xs font-normal text-muted-foreground">/yr onwards</span></span>
                <span className="flex items-center gap-1 text-muted-foreground"><Star className="size-3.5 fill-current text-accent" aria-hidden />{p.rating.toFixed(1)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href={`/checkout?productId=${p.id}&category=${p.category}&sumInsured=${p.maxCoverage}&premium=${p.minPremium}`}>
                    ⚡ Buy Online
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1"><Link href={`/products/${p.id}`}>View details</Link></Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </PortalPage>
  );
}
