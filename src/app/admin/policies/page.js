"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
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
import { policyService, customerService, agentService, catalogService, nameOfCustomer } from "@/services";
import { inr } from "@/lib/format";

const fallbackCategories = [
  { slug: "health", name: "Health Insurance" },
  { slug: "life", name: "Life Insurance" },
  { slug: "motor", name: "Motor Insurance" },
  { slug: "travel", name: "Travel Insurance" },
  { slug: "home", name: "Home Insurance" },
  { slug: "business", name: "Business Insurance" },
];

const fallbackCompanies = [
  { id: "comp-hdfc", name: "HDFC ERGO General Insurance" },
  { id: "comp-star", name: "Star Health & Allied Insurance" },
  { id: "comp-icici", name: "ICICI Lombard General Insurance" },
  { id: "comp-tata", name: "Tata AIG General Insurance" },
  { id: "comp-care", name: "Care Health Insurance" },
  { id: "comp-lic", name: "Life Insurance Corporation (LIC)" },
];

export default function AdminPoliciesPage() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearStr = nextYear.toISOString().slice(0, 10);

  const [form, setForm] = useState({
    customerId: "",
    agentId: "",
    category: "Health Insurance",
    companyId: "comp-hdfc",
    planName: "",
    sumInsured: "1000000",
    premium: "14500",
    startDate: todayStr,
    expiryDate: nextYearStr,
    nomineeName: "",
    nomineeRelation: "Spouse",
  });

  const { data, isLoading, refetch } = useQuery({ queryKey: ["policies-all"], queryFn: () => policyService.list() });
  const { data: customers } = useQuery({ queryKey: ["customers"], queryFn: () => customerService.list() });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: () => agentService.list() });
  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: catalogService.companies });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: catalogService.categories });

  const categoryList = categories && categories.length > 0 ? categories : fallbackCategories;
  const companyList = companies && companies.length > 0 ? companies : fallbackCompanies;

  const handleIssuePolicy = async (e) => {
    e.preventDefault();
    if (!form.customerId || !form.planName.trim() || !form.premium || !form.sumInsured) {
      toast.error("Please fill in customer, plan name, sum insured and premium.");
      return;
    }

    setSaving(true);
    try {
      await policyService.create({
        customerId: form.customerId,
        agentId: form.agentId || undefined,
        productId: "PR-CUSTOM",
        companyId: form.companyId,
        category: form.category,
        planName: form.planName.trim(),
        sumInsured: parseFloat(form.sumInsured),
        premium: parseFloat(form.premium),
        startDate: form.startDate,
        expiryDate: form.expiryDate,
        status: "Active",
        nominees: form.nomineeName.trim()
          ? [{ name: form.nomineeName.trim(), relation: form.nomineeRelation || "Spouse", share: 100 }]
          : [],
      });

      toast.success("Policy issued successfully.");
      setOpen(false);
      setForm({
        customerId: "",
        agentId: "",
        category: "Health Insurance",
        companyId: "comp-hdfc",
        planName: "",
        sumInsured: "1000000",
        premium: "14500",
        startDate: todayStr,
        expiryDate: nextYearStr,
        nomineeName: "",
        nomineeRelation: "Spouse",
      });
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to issue policy.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalPage
      role="ADMIN"
      title="Policies"
      description="Every policy issued on the platform."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" /> Issue New Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Issue Insurance Policy</DialogTitle>
              <DialogDescription>
                Underwrite and issue an official policy schedule linked to a customer and advisor.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleIssuePolicy} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pol-cust">Policyholder (Customer) <span className="text-destructive">*</span></Label>
                  <select
                    id="pol-cust"
                    required
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.customerId}
                    onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  >
                    <option value="">Select Customer</option>
                    {(customers ?? []).map((c) => (
                      <option key={c.id} value={c.id} className="bg-popover text-popover-foreground">
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pol-agent">Servicing Advisor</Label>
                  <select
                    id="pol-agent"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pol-cat">Insurance Category <span className="text-destructive">*</span></Label>
                  <select
                    id="pol-cat"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categoryList.map((c) => (
                      <option key={c.slug} value={c.name} className="bg-popover text-popover-foreground">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pol-comp">Partner Insurer <span className="text-destructive">*</span></Label>
                  <select
                    id="pol-comp"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.companyId}
                    onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  >
                    {companyList.map((c) => (
                      <option key={c.id} value={c.id} className="bg-popover text-popover-foreground">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pol-plan">Plan Name <span className="text-destructive">*</span></Label>
                <Input
                  id="pol-plan"
                  required
                  placeholder="e.g. Optima Secure Health Cover"
                  value={form.planName}
                  onChange={(e) => setForm({ ...form, planName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pol-sum">Sum Insured (₹) <span className="text-destructive">*</span></Label>
                  <Input
                    id="pol-sum"
                    type="number"
                    min={1}
                    required
                    placeholder="1000000"
                    value={form.sumInsured}
                    onChange={(e) => setForm({ ...form, sumInsured: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pol-prem">Annual Premium (₹) <span className="text-destructive">*</span></Label>
                  <Input
                    id="pol-prem"
                    type="number"
                    min={1}
                    required
                    placeholder="14500"
                    value={form.premium}
                    onChange={(e) => setForm({ ...form, premium: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pol-start">Start Date</Label>
                  <Input
                    id="pol-start"
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pol-exp">Expiry Date</Label>
                  <Input
                    id="pol-exp"
                    type="date"
                    required
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pol-nom">Nominee Name</Label>
                  <Input
                    id="pol-nom"
                    placeholder="e.g. Kavita Sharma"
                    value={form.nomineeName}
                    onChange={(e) => setForm({ ...form, nomineeName: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pol-rel">Nominee Relationship</Label>
                  <Input
                    id="pol-rel"
                    placeholder="e.g. Spouse / Son / Parent"
                    value={form.nomineeRelation}
                    onChange={(e) => setForm({ ...form, nomineeRelation: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Issuing Policy…
                    </>
                  ) : (
                    "Issue Policy"
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
        columns={policyColumns({ customer: true, agent: true })}
        searchKeys={(r) => `${r.policyNumber} ${nameOfCustomer(r.customerId)} ${r.planName} ${r.status}`}
        searchPlaceholder="Search policies"
        exportable
      />
    </PortalPage>
  );
}
