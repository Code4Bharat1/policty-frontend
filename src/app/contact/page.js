"use client";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { EnquiryForm } from "@/components/site/enquiry-form";

export default function ContactPage() {
  return (
    <SiteLayout>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div>
          <p className="text-eyebrow">Contact</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Talk to the advisory desk</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Our licensed advisors are available Monday to Saturday, 9 AM to 8 PM IST. Claim emergencies are handled 24x7.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-start gap-3"><Phone className="mt-0.5 size-4 text-accent" aria-hidden /><span><strong className="block">1800 200 4000</strong>Toll free, Mon–Sat</span></li>
            <li className="flex items-start gap-3"><Mail className="mt-0.5 size-4 text-accent" aria-hidden /><span><strong className="block">care@policycare.in</strong>Response within one working day</span></li>
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 text-accent" aria-hidden /><span><strong className="block">Mumbai head office</strong>Level 7, Trade Centre, Bandra Kurla Complex, Mumbai 400051</span></li>
          </ul>
        </div>
        <EnquiryForm title="Send us a message" />
      </div>
    </SiteLayout>
  );
}
