"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { claimColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { claimService, policyService, policyNumberOf } from "@/services";

export default function CustomerClaimsPage() {
  const { user } = useAuth();
  const customerId = user?.linkedId;
  const [open, setOpen] = useState(false);
  const scope = { customerId: customerId ?? "" };

  const { data, isLoading, refetch } = useQuery({ queryKey: ["claims", customerId], queryFn: () => claimService.list(scope), enabled: !!customerId });
  const { data: policies } = useQuery({ queryKey: ["policies", customerId], queryFn: () => policyService.list(scope), enabled: !!customerId });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await claimService.submit({
        policyId: values.policyId,
        type: values.type,
        amount: parseFloat(values.amount),
        description: values.description,
        customerId,
      });
      toast.success(`Claim registered for ${policyNumberOf(values.policyId) || "your policy"}. Our desk will contact you within 24 hours.`);
      reset();
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to submit claim.");
    }
  });

  return (
    <PortalPage
      role="CUSTOMER"
      title="Claims"
      description="Register a new claim, upload documents and follow the assessment timeline."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>File a claim</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>File a new claim</DialogTitle>
              <DialogDescription>Give us the basics — our claims desk will request documents next.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cl-policy">Policy</Label>
                <select
                  id="cl-policy"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  {...register("policyId", { required: "Select a policy" })}
                >
                  <option value="">Select a policy</option>
                  {(policies ?? []).map((p) => (
                    <option key={p.id} value={p.id}>{p.policyNumber} — {p.planName}</option>
                  ))}
                </select>
                {errors.policyId ? <p className="text-xs text-destructive">{errors.policyId.message}</p> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cl-type">Claim type</Label>
                <Input id="cl-type" placeholder="Hospitalisation, accident repair…" {...register("type", { required: "Claim type is required" })} />
                {errors.type ? <p className="text-xs text-destructive">{errors.type.message}</p> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cl-amount">Estimated amount (₹)</Label>
                <Input id="cl-amount" type="number" min={1} {...register("amount", { required: "Amount is required" })} />
                {errors.amount ? <p className="text-xs text-destructive">{errors.amount.message}</p> : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cl-desc">What happened?</Label>
                <Textarea id="cl-desc" rows={4} {...register("description", { required: "A short description helps us assess faster", minLength: { value: 20, message: "Please add at least 20 characters" } })} />
                {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit claim"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={claimColumns({ href: (c) => `/customer/claims/${c.id}` })}
        searchKeys={(r) => `${r.claimNumber} ${r.type} ${r.status}`}
        searchPlaceholder="Search claims"
        exportable
        emptyTitle="No claims filed"
        emptyDescription="When you file a claim it will appear here with a live status timeline."
      />
    </PortalPage>
  );
}
