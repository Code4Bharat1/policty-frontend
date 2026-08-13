"use client";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { SectionCard } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { catalogService } from "@/services";

export default function CustomerSupportPage() {
  const { data: faqs } = useQuery({ queryKey: ["faqs"], queryFn: catalogService.faqs });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 450));
    toast.success("Ticket raised. Reference PC-SR-4821 — we reply within one working day.");
    reset();
  });

  return (
    <PortalPage role="CUSTOMER" title="Support" description="Talk to your advisor, raise a service request or read common answers.">
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Raise a service request">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sr-subject">Subject</Label>
              <Input id="sr-subject" {...register("subject", { required: "Subject is required" })} />
              {errors.subject ? <p className="text-xs text-destructive">{errors.subject.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sr-category">Category</Label>
              <select id="sr-category" className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" {...register("category", { required: true })}>
                <option>Policy servicing</option>
                <option>Claim assistance</option>
                <option>Payment or refund</option>
                <option>Document request</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sr-message">How can we help?</Label>
              <Textarea id="sr-message" rows={5} {...register("message", { required: "Please describe your request", minLength: { value: 20, message: "Please add at least 20 characters" } })} />
              {errors.message ? <p className="text-xs text-destructive">{errors.message.message}</p> : null}
            </div>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Submit request"}</Button>
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Reach us">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="size-4" aria-hidden /> 1800 200 4000 (8am–9pm)</li>
              <li className="flex items-center gap-2"><Mail className="size-4" aria-hidden /> care@policycare.demo</li>
              <li className="flex items-center gap-2"><MessageSquare className="size-4" aria-hidden /> WhatsApp: 90000 40000</li>
            </ul>
          </SectionCard>
          <SectionCard title="Quick answers">
            <Accordion type="single" collapsible>
              {(faqs ?? []).slice(0, 5).map((f) => (
                <AccordionItem key={f.id} value={f.id}>
                  <AccordionTrigger className="text-left text-sm font-semibold">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionCard>
        </div>
      </div>
    </PortalPage>
  );
}
