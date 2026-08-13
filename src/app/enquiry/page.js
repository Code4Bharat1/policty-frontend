"use client";
import { SiteLayout } from "@/components/site/site-layout";
import { EnquiryForm } from "@/components/site/enquiry-form";

export default function EnquiryPage() {
  return (
    <SiteLayout>
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-eyebrow">Insurance enquiry</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Get a quotation</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Tell us who needs cover and what matters most. An advisor prepares a comparison of shortlisted plans with
            coverage, riders and exclusions explained in plain language — no obligation to buy.
          </p>
          <ol className="mt-8 space-y-4 text-sm text-muted-foreground">
            <li><strong className="text-foreground">1. Requirement captured</strong> — usually within an hour.</li>
            <li><strong className="text-foreground">2. Comparison shared</strong> — within one working day.</li>
            <li><strong className="text-foreground">3. Policy issued</strong> — instantly for motor and travel.</li>
          </ol>
        </div>
        <EnquiryForm title="Insurance enquiry" />
      </div>
    </SiteLayout>
  );
}
