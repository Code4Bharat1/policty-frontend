"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { SectionCard } from "@/components/app/primitives";
import { catalogService } from "@/services";

export default function AdminCmsPage() {
  const { data: posts } = useQuery({ queryKey: ["blog"], queryFn: catalogService.blogPosts });
  const { data: faqs } = useQuery({ queryKey: ["faqs"], queryFn: catalogService.faqs });
  const { data: testimonials } = useQuery({ queryKey: ["testimonials"], queryFn: catalogService.testimonials });
  return (
    <PortalPage role="ADMIN" title="Content management" description="Everything published on the marketing website.">
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Blog articles" description={`${posts?.length ?? 0} published`}>
          <ul className="divide-y divide-border">
            {(posts ?? []).map((p) => (
              <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.author} · {p.date}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="FAQs" description={`${faqs?.length ?? 0} entries`}>
          <ul className="divide-y divide-border">
            {(faqs ?? []).map((f) => (
              <li key={f.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold text-foreground">{f.question}</p>
                <p className="text-xs text-muted-foreground">{f.category}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard className="lg:col-span-2" title="Testimonials" description={`${testimonials?.length ?? 0} approved`}>
          <div className="grid gap-4 md:grid-cols-3">
            {(testimonials ?? []).map((t) => (
              <div key={t.id} className="rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">“{t.quote}”</p>
                <p className="mt-3 text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role} · {t.city}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </PortalPage>
  );
}
