"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Loader2, ShieldCheck } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { catalogService, nameOfCompany } from "@/services";
import { apiClient } from "@/services/apiClient";
import { inr } from "@/lib/format";

const columns = [
  {
    key: "name",
    header: "Product",
    sortValue: (r) => r.name,
    cell: (r) => (
      <div>
        <p className="font-semibold text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground">{nameOfCompany(r.companyId)}</p>
      </div>
    ),
  },
  { key: "category", header: "Category", sortValue: (r) => r.category, cell: (r) => <span className="capitalize">{r.category}</span> },
  { key: "planType", header: "Plan type", hideOnMobile: true, cell: (r) => r.planType },
  { key: "minPremium", header: "From", sortValue: (r) => r.minPremium, cell: (r) => inr(r.minPremium) },
  { key: "maxCoverage", header: "Max cover", sortValue: (r) => r.maxCoverage, cell: (r) => inr(r.maxCoverage, true) },
  { key: "rating", header: "Rating", sortValue: (r) => r.rating, cell: (r) => r.rating?.toFixed(1) || "4.8" },
];

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "health",
    companyId: "comp-hdfc",
    planType: "Comprehensive",
    tagline: "",
    minPremium: "",
    maxCoverage: "",
    inclusions: "",
    exclusions: "",
  });

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: catalogService.categories });
  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: catalogService.companies });
  const { data: products, isLoading, refetch } = useQuery({ queryKey: ["products-all"], queryFn: () => catalogService.products() });

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.minPremium || !form.maxCoverage) {
      toast.error("Please fill in all required product fields.");
      return;
    }

    setSaving(true);
    try {
      await apiClient.post("/catalog/products", {
        name: form.name.trim(),
        category: form.category,
        companyId: form.companyId,
        planType: form.planType.trim(),
        tagline: form.tagline.trim() || "Comprehensive insurance protection with instant cashless claims.",
        minPremium: parseFloat(form.minPremium),
        maxCoverage: parseFloat(form.maxCoverage),
        rating: 4.8,
        featured: true,
        inclusions: form.inclusions ? form.inclusions.split(",").map((s) => s.trim()) : ["Cashless claims", "24/7 assistance"],
        exclusions: form.exclusions ? form.exclusions.split(",").map((s) => s.trim()) : ["Normal wear and tear", "Intentional damage"],
      });

      toast.success(`Product "${form.name.trim()}" created successfully.`);
      setForm({
        name: "",
        category: "health",
        companyId: "comp-hdfc",
        planType: "Comprehensive",
        tagline: "",
        minPremium: "",
        maxCoverage: "",
        inclusions: "",
        exclusions: "",
      });
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalPage
      role="ADMIN"
      title="Products"
      description="Manage and publish insurance plans available on the marketplace."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Insurance Product</DialogTitle>
              <DialogDescription>
                Publish a new insurance plan to the public marketplace.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="pr-name">Product Name <span className="text-destructive">*</span></Label>
                <Input
                  id="pr-name"
                  required
                  placeholder="e.g. Optima Super Secure"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pr-cat">Category <span className="text-destructive">*</span></Label>
                  <select
                    id="pr-cat"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {(categories ?? []).map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pr-comp">Partner Insurer <span className="text-destructive">*</span></Label>
                  <select
                    id="pr-comp"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={form.companyId}
                    onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  >
                    {(companies ?? []).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pr-plan">Plan Type <span className="text-destructive">*</span></Label>
                <Input
                  id="pr-plan"
                  placeholder="e.g. Family Floater / Pure Term"
                  value={form.planType}
                  onChange={(e) => setForm({ ...form, planType: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pr-min">Annual Premium (From ₹) <span className="text-destructive">*</span></Label>
                  <Input
                    id="pr-min"
                    type="number"
                    min={1}
                    required
                    placeholder="e.g. 7999"
                    value={form.minPremium}
                    onChange={(e) => setForm({ ...form, minPremium: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pr-max">Max Sum Insured (₹) <span className="text-destructive">*</span></Label>
                  <Input
                    id="pr-max"
                    type="number"
                    min={1}
                    required
                    placeholder="e.g. 10000000"
                    value={form.maxCoverage}
                    onChange={(e) => setForm({ ...form, maxCoverage: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pr-tag">Tagline / Key Feature</Label>
                <Input
                  id="pr-tag"
                  placeholder="e.g. 4X restore benefit with zero deductible"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pr-inc">Inclusions (Comma separated)</Label>
                <Input
                  id="pr-inc"
                  placeholder="e.g. Cashless hospitalization, Road ambulance"
                  value={form.inclusions}
                  onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Publishing…
                    </>
                  ) : (
                    "Publish Product"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <DataTable
        data={products}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.name} ${r.category} ${nameOfCompany(r.companyId)}`}
        searchPlaceholder="Search products"
        exportable
      />
    </PortalPage>
  );
}
