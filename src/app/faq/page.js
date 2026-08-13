"use client";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { catalogService } from "@/services";

export default function FaqPage() {
  const { data: faqs } = useQuery({ queryKey: ["faqs"], queryFn: catalogService.faqs });
  const groups = Array.from(new Set((faqs ?? []).map((f) => f.category)));
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-14 lg:px-8">
        <p className="text-eyebrow">Support</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Frequently asked questions</h1>
        {groups.map((g) => (
          <section key={g} className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{g}</h2>
            <Accordion type="single" collapsible className="mt-2">
              {(faqs ?? []).filter((f) => f.category === g).map((f) => (
                <AccordionItem key={f.id} value={f.id}>
                  <AccordionTrigger className="text-left text-sm font-semibold">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
