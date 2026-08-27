"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { quoteColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { quoteService, customerService, agentService, catalogService, nameOfCustomer, nameOfProduct } from "@/services";

export default function AdminQuotesPage() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    customerId: "",
    agentId: "",
    productId: "",
    coverage: "1000000",
    premium: "14500",
    addOns: "Critical Illness Rider, Hospital Daily Cash",
  });

  const { data, isLoading, refetch } = useQuery({ queryKey: ["quotes-all"], queryFn: () => quoteService.list() });
  const { data: customers } = useQuery({ queryKey: ["customers"], queryFn: () => customerService.list() });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: () => agentService.list() });
  const { data: products } = useQuery({ queryKey: ["catalog-products"], queryFn: () => catalogService.products() });

  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    if (!form.productId || !form.coverage || !form.premium) {
      toast.error("Please select a product and enter coverage & premium.");
      return;
    }

    setSaving(true);
    try {
      await quoteService.request({
        customerId: form.customerId || undefined,
        agentId: form.agentId || undefined,
        productId: form.productId,
        coverage: parseFloat(form.coverage),
        premium: parseFloat(form.premium),
        addOns: form.addOns ? form.addOns.split(",").map((s) => s.trim()).filter(Boolean) : [],
        status: "Quoted",
      });

      toast.success("Quotation proposal created successfully.");
      setOpen(false);
      setForm({
        customerId: "",
        agentId: "",
        productId: "",
        coverage: "1000000",
        premium: "14500",
        addOns: "Critical Illness Rider, Hospital Daily Cash",
      });
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to generate quotation.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalPage
      role="ADMIN"
      title="Quotations"
      description="Pipeline of quotes, pricing proposals, and customer conversion status."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" /> Create Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Generate Insurance Quotation</DialogTitle>
              <DialogDescription>
                Create an official price estimate and proposal linked to a customer and underwriter plan.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateQuotation} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="adm-q-cust">Customer (Optional)</Label>
                  <select
                    id="adm-q-cust"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.customerId}
                    onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  >
                    <option value="">Select customer</option>
                    {(customers ?? []).map((c) => (
                      <option key={c.id} value={c.id} className="bg-popover text-popover-foreground">
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="adm-q-agent">Servicing Advisor</Label>
                  <select
                    id="adm-q-agent"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.agentId}
                    onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                  >
                    <option value="">Direct (No Advisor)</option>
                    {(agents ?? []).map((a) => (
                      <option key={a.id} value={a.id} className="bg-popover text-popover-foreground">
                        {a.name} ({a.code || a.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adm-q-prod">Insurance Product <span className="text-destructive">*</span></Label>
                <select
                  id="adm-q-prod"
                  required
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={form.productId}
                  onChange={(e) => {
                    const sel = (products ?? []).find((p) => p.id === e.target.value);
                    setForm({
                      ...form,
                      productId: e.target.value,
                      coverage: sel?.maxCoverage ? String(sel.maxCoverage) : form.coverage,
                      premium: sel?.minPremium ? String(sel.minPremium) : form.premium,
                    });
                  }}
                >
                  <option value="">Select an insurance product</option>
                  {(products ?? []).map((p) => (
                    <option key={p.id} value={p.id} className="bg-popover text-popover-foreground">
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="adm-q-cov">Sum Insured Coverage (₹) <span className="text-destructive">*</span></Label>
                  <Input
                    id="adm-q-cov"
                    type="number"
                    min={1}
                    required
                    placeholder="1000000"
                    value={form.coverage}
                    onChange={(e) => setForm({ ...form, coverage: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="adm-q-prem">Annual Premium (₹) <span className="text-destructive">*</span></Label>
                  <Input
                    id="adm-q-prem"
                    type="number"
                    min={1}
                    required
                    placeholder="14500"
                    value={form.premium}
                    onChange={(e) => setForm({ ...form, premium: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adm-q-addons">Add-on Riders (Comma separated)</Label>
                <Input
                  id="adm-q-addons"
                  placeholder="e.g. Critical Illness Rider, Hospital Daily Cash"
                  value={form.addOns}
                  onChange={(e) => setForm({ ...form, addOns: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Generating…
                    </>
                  ) : (
                    "Create Quotation"
                  )}
                </Button>
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
        columns={quoteColumns({ customer: true })}
        searchKeys={(r) => `${r.quoteNumber} ${nameOfCustomer(r.customerId)} ${nameOfProduct(r.productId)} ${r.status}`}
        searchPlaceholder="Search quotes"
        exportable
      />
    </PortalPage>
  );
}
