"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { enquiryService } from "@/services";

const categories = ["Health", "Life & Term", "Motor", "Travel", "Home", "Business"];

export function EnquiryForm({ title = "Insurance enquiry" }) {
  const [values, setValues] = useState({ name: "", email: "", phone: "", category: "Health", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => setValues((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(values.phone.replace(/\D/g, "").slice(-10))) e.phone = "Enter a valid 10-digit mobile number.";
    if (values.message.trim().length < 5) e.message = "Tell us a little more (at least 5 characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await enquiryService.submit(values);
      setValues({ name: "", email: "", phone: "", category: values.category, message: "" });
      toast.success("Enquiry received", { description: "A licensed advisor will contact you within one working day." });
    } catch (err) {
      toast.error("Failed to submit enquiry", { description: err.message || "Please check your network connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="surface p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eq-name">Full name <span className="text-destructive">*</span></Label>
          <Input id="eq-name" value={values.name} maxLength={100} onChange={(e) => set("name")(e.target.value)} aria-invalid={Boolean(errors.name)} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="eq-email">Email <span className="text-destructive">*</span></Label>
            <Input id="eq-email" type="email" value={values.email} maxLength={255} onChange={(e) => set("email")(e.target.value)} aria-invalid={Boolean(errors.email)} />
            {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="eq-phone">Mobile <span className="text-destructive">*</span></Label>
            <Input id="eq-phone" inputMode="tel" value={values.phone} maxLength={15} onChange={(e) => set("phone")(e.target.value)} aria-invalid={Boolean(errors.phone)} />
            {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="eq-category">Insurance type</Label>
          <Select value={values.category} onValueChange={set("category")}>
            <SelectTrigger id="eq-category"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="eq-message">How can we help? <span className="text-destructive">*</span></Label>
          <Textarea id="eq-message" rows={4} maxLength={1000} value={values.message} onChange={(e) => set("message")(e.target.value)} aria-invalid={Boolean(errors.message)} />
          {errors.message ? <p className="text-xs text-destructive">{errors.message}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Sending…</> : "Submit enquiry"}
        </Button>
        <p className="text-xs text-muted-foreground">By submitting you agree to be contacted about your enquiry. We never sell your data.</p>
      </div>
    </form>
  );
}
