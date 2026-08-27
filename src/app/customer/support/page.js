"use client";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, MessageSquare, Phone, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { SectionCard } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { catalogService, enquiryService } from "@/services";
import { useAuth } from "@/lib/auth";

export default function CustomerSupportPage() {
  const { user } = useAuth();
  const { data: faqs } = useQuery({ queryKey: ["faqs"], queryFn: catalogService.faqs });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await enquiryService.submit({
        name: user?.name || "Customer",
        email: user?.email || "customer@policycare.in",
        phone: user?.phone || undefined,
        category: values.category,
        message: `[${values.subject}] ${values.message}`,
        type: "Support Request",
      });

      const refNumber = res?.id || res?.data?.id || "SR-1001";
      toast.success(`Service request registered (Ref: ${refNumber}). Our support desk will reach out within 24 hours.`);
      reset();
    } catch (err) {
      toast.error(err.message || "Failed to submit service request. Please try again.");
    }
  });

  return (
    <PortalPage role="CUSTOMER" title="Support" description="Talk to your advisor, raise a service request or read common answers.">
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Raise a service request">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sr-subject">Subject <span className="text-destructive">*</span></Label>
              <Input id="sr-subject" placeholder="e.g. Need assistance with policy endorsement" {...register("subject", { required: "Subject is required" })} />
              {errors.subject ? <p className="text-xs text-destructive">{errors.subject.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sr-category">Category <span className="text-destructive">*</span></Label>
              <select id="sr-category" className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" {...register("category", { required: true })}>
                <option value="Policy Servicing">Policy servicing</option>
                <option value="Claim Assistance">Claim assistance</option>
                <option value="Payment or Refund">Payment or refund</option>
                <option value="Document Request">Document request</option>
                <option value="General Support">Something else</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sr-message">How can we help? <span className="text-destructive">*</span></Label>
              <Textarea id="sr-message" rows={5} placeholder="Please provide details regarding your request..." {...register("message", { required: "Please describe your request", minLength: { value: 10, message: "Please add at least 10 characters" } })} />
              {errors.message ? <p className="text-xs text-destructive">{errors.message.message}</p> : null}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Submitting…
                </>
              ) : (
                "Submit request"
              )}
            </Button>
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Reach us">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="size-4" aria-hidden /> 1800 200 4000 (8am–9pm)</li>
              <li className="flex items-center gap-2"><Mail className="size-4" aria-hidden /> care@policycare.in</li>
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
