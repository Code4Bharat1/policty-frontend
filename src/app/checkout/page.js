"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileDown,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { catalogService, policyService, nameOfCompany } from "@/services";
import { apiClient } from "@/services/apiClient";
import { inr } from "@/lib/format";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const productId = searchParams.get("productId") || "prod-optima-secure";
  const queryCategory = searchParams.get("category") || "health";
  const queryPlan = searchParams.get("planName") || "Gold Comprehensive";
  const querySumInsured = parseFloat(searchParams.get("sumInsured") || "1000000");
  const queryPremium = parseFloat(searchParams.get("premium") || "14500");

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [completedPolicy, setCompletedPolicy] = useState(null);

  // Proposer & Nominee Details Form
  const [form, setForm] = useState({
    proposerName: user?.name || "Kunal Verma",
    proposerEmail: user?.email || "kunal@example.com",
    proposerPhone: "9876543210",
    dob: "1994-06-15",
    address: "B-402, Green Valley Apartments, Andheri West, Mumbai",
    pincode: "400053",
    nomineeName: "Pooja Verma",
    nomineeRelation: "Spouse",
    nomineeAge: "29",
  });

  const { data: product } = useQuery({
    queryKey: ["product-checkout", productId],
    queryFn: () => catalogService.product(productId).catch(() => null),
  });

  const sumInsured = querySumInsured || 1000000;
  const basePremium = queryPremium || 14500;
  const gst = Math.round(basePremium * 0.18);
  const totalAmount = basePremium + gst;

  const todayStr = new Date().toISOString().slice(0, 10);
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearStr = nextYear.toISOString().slice(0, 10);

  const handleCompletePayment = async () => {
    setProcessing(true);
    try {
      // 1. Determine customer ID from auth or create transient
      const customerId = user?.linkedId || user?.id || `CU-${Date.now().toString().slice(-4)}`;

      // 2. Issue Policy directly in MongoDB
      const policyRes = await policyService.create({
        customerId,
        companyId: product?.companyId || "comp-hdfc",
        category: product?.category || queryCategory || "Health Insurance",
        planName: product?.name || queryPlan || "Comprehensive Health Plan",
        sumInsured,
        premium: totalAmount,
        startDate: todayStr,
        expiryDate: nextYearStr,
        status: "Active",
        nominees: [
          {
            name: form.nomineeName.trim(),
            relation: form.nomineeRelation,
            share: 100,
          },
        ],
      });

      const issuedPolicy = policyRes?.data || policyRes;

      // 3. Record Payment transaction
      try {
        await apiClient.post("/payments", {
          policyId: issuedPolicy?.id || `PL-${Date.now().toString().slice(-4)}`,
          customerId,
          amount: totalAmount,
          method: paymentMethod.toUpperCase(),
          gateway: "PolicyCare InstantPay",
          status: "Success",
        });
      } catch {
        // Continue even if payment record fails
      }

      setCompletedPolicy(issuedPolicy);
      setStep(4); // Success screen
      toast.success("Policy issued and activated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to process payment and issue policy.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SiteLayout>
      <div className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
          <p className="text-eyebrow flex items-center gap-2">
            <Lock className="size-3.5 text-primary" /> 256-Bit SSL Encrypted Checkout
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Instant Online Policy Checkout
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete your online application to receive your policy schedule and digital health card immediately.
          </p>

          {/* STEP PROGRESS INDICATOR */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className={`flex items-center gap-2 text-xs font-semibold sm:text-sm ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>1</span>
              Plan Summary
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-border" />
            <div className={`flex items-center gap-2 text-xs font-semibold sm:text-sm ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2</span>
              Proposer & Nominee
            </div>
            <div className="h-0.5 flex-1 mx-3 bg-border" />
            <div className={`flex items-center gap-2 text-xs font-semibold sm:text-sm ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>3</span>
              Instant Payment
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
        {/* STEP 4: SUCCESS / CONFIRMATION SCREEN */}
        {step === 4 && completedPolicy ? (
          <div className="surface mx-auto max-w-2xl p-8 text-center shadow-lg">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-10" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Payment &amp; Issuance Successful
            </p>
            <h2 className="mt-1 text-2xl font-bold">Your Policy is Live and Active!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              An official copy of your policy schedule has been sent to <strong>{form.proposerEmail}</strong>.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-card p-5 text-left text-sm space-y-2.5">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Policy Number:</span>
                <span className="font-bold text-foreground">{completedPolicy.policyNumber || "PC/HEA/2026/0001"}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Plan Name:</span>
                <span className="font-semibold text-foreground">{completedPolicy.planName || product?.name || queryPlan}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Sum Insured:</span>
                <span className="font-bold text-primary">{inr(sumInsured, true)}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Policy Period:</span>
                <span className="text-foreground">{todayStr} to {nextYearStr} (1 Year)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nominee:</span>
                <span className="text-foreground">{form.nomineeName} ({form.nomineeRelation})</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => {
                  toast.success("Downloading Certificate of Insurance (PDF)…");
                }}
              >
                <FileDown className="mr-2 size-4" /> Download Policy Certificate (PDF)
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/customer/policies">View in Customer Portal</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* LEFT CONTENT AREA */}
            <div className="space-y-6">
              {/* STEP 1: PLAN REVIEW */}
              {step === 1 && (
                <div className="surface p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">1. Review Selected Plan</h2>
                    <p className="text-sm text-muted-foreground">
                      Confirm your coverage amount and included benefits before proceeding.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary capitalize">
                          {product?.category || queryCategory}
                        </span>
                        <h3 className="mt-2 text-xl font-bold">{product?.name || queryPlan}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Underwritten by {nameOfCompany(product?.companyId) || "HDFC ERGO General Insurance"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Sum Insured</p>
                        <p className="text-lg font-bold text-primary">{inr(sumInsured, true)}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Benefits Included:</p>
                      <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> Cashless hospitalization
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> 10,000+ network hospitals
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> Zero co-pay &amp; restore benefit
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> 24/7 emergency claim support
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)}>
                      Continue to Proposer Details <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: PROPOSER & NOMINEE DETAILS */}
              {step === 2 && (
                <div className="surface p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">2. Policyholder &amp; Nominee Details</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter the details of the primary insured person and designated nominee.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold border-b border-border pb-1 text-foreground">A. Primary Policyholder (Proposer)</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-name">Full Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="chk-name"
                          required
                          value={form.proposerName}
                          onChange={(e) => setForm({ ...form, proposerName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-dob">Date of Birth <span className="text-destructive">*</span></Label>
                        <Input
                          id="chk-dob"
                          type="date"
                          required
                          value={form.dob}
                          onChange={(e) => setForm({ ...form, dob: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-email">Email Address <span className="text-destructive">*</span></Label>
                        <Input
                          id="chk-email"
                          type="email"
                          required
                          value={form.proposerEmail}
                          onChange={(e) => setForm({ ...form, proposerEmail: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-phone">Mobile Phone <span className="text-destructive">*</span></Label>
                        <Input
                          id="chk-phone"
                          required
                          value={form.proposerPhone}
                          onChange={(e) => setForm({ ...form, proposerPhone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="chk-addr">Residential Address</Label>
                        <Input
                          id="chk-addr"
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-pin">Pincode</Label>
                        <Input
                          id="chk-pin"
                          value={form.pincode}
                          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        />
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold border-b border-border pb-1 pt-3 text-foreground">B. Nominee Details (Beneficiary)</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-nom-name">Nominee Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="chk-nom-name"
                          required
                          placeholder="e.g. Pooja Verma"
                          value={form.nomineeName}
                          onChange={(e) => setForm({ ...form, nomineeName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-nom-rel">Relationship <span className="text-destructive">*</span></Label>
                        <select
                          id="chk-nom-rel"
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          value={form.nomineeRelation}
                          onChange={(e) => setForm({ ...form, nomineeRelation: e.target.value })}
                        >
                          <option value="Spouse">Spouse</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-nom-age">Nominee Age</Label>
                        <Input
                          id="chk-nom-age"
                          type="number"
                          value={form.nomineeAge}
                          onChange={(e) => setForm({ ...form, nomineeAge: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 size-4" /> Back
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      Proceed to Payment <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: INSTANT PAYMENT */}
              {step === 3 && (
                <div className="surface p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">3. Select Payment Method</h2>
                    <p className="text-sm text-muted-foreground">
                      Pay securely to trigger instant automated policy issuance.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                        paymentMethod === "upi"
                          ? "border-primary bg-primary/5 font-semibold text-primary ring-2 ring-primary/20"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <QrCode className="size-6 mb-2 text-primary" />
                      <span className="text-xs sm:text-sm">UPI / QR Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 font-semibold text-primary ring-2 ring-primary/20"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <CreditCard className="size-6 mb-2 text-primary" />
                      <span className="text-xs sm:text-sm">Debit / Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                        paymentMethod === "netbanking"
                          ? "border-primary bg-primary/5 font-semibold text-primary ring-2 ring-primary/20"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Building2 className="size-6 mb-2 text-primary" />
                      <span className="text-xs sm:text-sm">Net Banking</span>
                    </button>
                  </div>

                  {paymentMethod === "upi" && (
                    <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
                      <div className="mx-auto flex size-36 items-center justify-center rounded-lg border border-border bg-white p-2">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=policycare@okaxis&pn=PolicyCare&am=17110&cu=INR"
                          alt="UPI QR Code"
                          className="size-32"
                        />
                      </div>
                      <p className="text-xs font-semibold text-foreground">Scan with Google Pay, PhonePe, Paytm, or BHIM</p>
                      <p className="text-xs text-muted-foreground">UPI ID: <strong>policycare@okaxis</strong></p>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="chk-card-num">Card Number</Label>
                        <Input id="chk-card-num" placeholder="4111 2222 3333 4444" defaultValue="4111 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="chk-card-exp">Expiry Date</Label>
                          <Input id="chk-card-exp" placeholder="MM/YY" defaultValue="12/28" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="chk-card-cvv">CVV</Label>
                          <Input id="chk-card-cvv" placeholder="123" defaultValue="890" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="rounded-xl border border-border bg-card p-5 space-y-2 text-sm">
                      <p className="text-xs text-muted-foreground">Select your bank:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"].map((b) => (
                          <div key={b} className="flex items-center gap-2 rounded border border-border p-2.5 hover:bg-muted cursor-pointer">
                            <input type="radio" name="bank" defaultChecked={b === "HDFC Bank"} id={b} />
                            <label htmlFor={b} className="font-medium text-xs cursor-pointer">{b}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 size-4" /> Back
                    </Button>
                    <Button onClick={handleCompletePayment} disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" /> Issuing Policy…
                        </>
                      ) : (
                        `Pay ${inr(totalAmount)} & Issue Policy`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SUMMARY SIDEBAR */}
            <aside className="surface h-fit p-6 lg:sticky lg:top-24 space-y-4">
              <p className="text-eyebrow">Price Summary</p>
              <h3 className="text-base font-bold">{product?.name || queryPlan}</h3>
              <p className="text-xs text-muted-foreground">Sum Insured: <strong>{inr(sumInsured, true)}</strong></p>

              <dl className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Base Premium (1 Yr)</dt>
                  <dd className="font-medium">{inr(basePremium)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">GST (18%)</dt>
                  <dd className="font-medium">{inr(gst)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base">
                  <dt className="font-bold">Total Payable</dt>
                  <dd className="font-bold text-primary">{inr(totalAmount)}</dd>
                </div>
              </dl>

              <div className="rounded-lg bg-primary/5 p-3 text-xs text-primary space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Instant Issuance Guarantee
                </p>
                <p className="text-muted-foreground">
                  Your policy certificate and number will be generated immediately upon payment.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <SiteLayout>
          <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading checkout…</p>
          </div>
        </SiteLayout>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
