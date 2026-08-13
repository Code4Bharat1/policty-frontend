"use client";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { catalogService } from "@/services";
import { formatDate } from "@/lib/format";

export default function BlogPage() {
  const { data: posts } = useQuery({ queryKey: ["blog"], queryFn: catalogService.blogPosts });
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-14 lg:px-8">
        <p className="text-eyebrow">Knowledge centre</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Insurance guides</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {(posts ?? []).map((p) => (
            <article key={p.id} className="surface p-6">
              <p className="text-eyebrow">{p.category} · {p.readMinutes} min read</p>
              <h2 className="mt-2 text-lg font-bold leading-snug">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <p className="mt-4 text-xs text-muted-foreground">{p.author} · {formatDate(p.date)}</p>
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
