"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Loader2, Edit, Trash2, AlertTriangle, Layers, Plus, X } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { catalogService, nameOfCompany } from "@/services";
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

const initialDefaultPlans = [
  { id: "P1", name: "Standard", sumInsured: "500000", annualPremium: "6999", deductible: "5000", highlights: "Essential hospitalization, Road ambulance" },
  { id: "P2", name: "Comprehensive", sumInsured: "1000000", annualPremium: "12999", deductible: "0", highlights: "Zero deductible, Restore benefit, Daycare" },
  { id: "P3", name: "Super Secure", sumInsured: "2500000", annualPremium: "22999", deductible: "0", highlights: "Worldwide coverage, Maternity, OPD cover" },
];

const initialDefaultAddOns = [
  { name: "Critical Illness Rider", premium: "1500" },
  { name: "Hospital Daily Cash", premium: "650" },
];

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form State for Creating
  const [form, setForm] = useState({
    name: "",
    category: "health",
    companyId: "comp-hdfc",
    planType: "Comprehensive",
    tagline: "",
    minPremium: "6999",
    maxCoverage: "2500000",
    inclusions: "Cashless hospitalization, 24/7 medical concierge, Zero co-pay",
    exclusions: "Self-inflicted injuries, Pre-existing diseases before waiting period",
    plans: initialDefaultPlans,
    addOns: initialDefaultAddOns,
  });

  // Form State for Editing
  const [editForm, setEditForm] = useState({
    name: "",
    category: "health",
    companyId: "comp-hdfc",
    planType: "Comprehensive",
    tagline: "",
    minPremium: "",
    maxCoverage: "",
    inclusions: "",
    exclusions: "",
    featured: true,
    plans: initialDefaultPlans,
    addOns: initialDefaultAddOns,
  });

  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: catalogService.categories });
  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: catalogService.companies });
  const { data: products, isLoading, refetch } = useQuery({ queryKey: ["products-all"], queryFn: () => catalogService.products() });

  const categoryList = categories && categories.length > 0 ? categories : fallbackCategories;
  const companyList = companies && companies.length > 0 ? companies : fallbackCompanies;

  // Auto-calculate / adjust tiers from Base Premium & Max Coverage
  const handleAutoFillTiers = (minPrem, maxCov, isEdit = false) => {
    const minP = parseFloat(minPrem) || 6999;
    const maxC = parseFloat(maxCov) || 1000000;

    const generated = [
      {
        id: "P1",
        name: "Standard",
        sumInsured: String(Math.round(maxC * 0.5)),
        annualPremium: String(minP),
        deductible: "5000",
        highlights: "Essential hospitalization, Emergency ambulance",
      },
      {
        id: "P2",
        name: "Comprehensive",
        sumInsured: String(maxC),
        annualPremium: String(Math.round(minP * 1.6)),
        deductible: "0",
        highlights: "Zero deductible, Restore benefit, Daycare procedures",
      },
      {
        id: "P3",
        name: "Super Secure",
        sumInsured: String(Math.round(maxC * 2.5)),
        annualPremium: String(Math.round(minP * 2.8)),
        deductible: "0",
        highlights: "Worldwide emergency coverage, Maternity, OPD cover",
      },
    ];

    if (isEdit) {
      setEditForm((prev) => ({ ...prev, plans: generated }));
    } else {
      setForm((prev) => ({ ...prev, plans: generated }));
    }
  };

  // 1. CREATE PRODUCT
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.minPremium || !form.maxCoverage) {
      toast.error("Please fill in product name, base premium, and max coverage.");
      return;
    }

    setSaving(true);
    try {
      const formattedPlans = form.plans.map((p) => ({
        id: p.id,
        name: p.name.trim(),
        sumInsured: parseFloat(p.sumInsured) || parseFloat(form.maxCoverage),
        annualPremium: parseFloat(p.annualPremium) || parseFloat(form.minPremium),
        deductible: parseFloat(p.deductible) || 0,
        highlights: typeof p.highlights === "string" ? p.highlights.split(",").map((s) => s.trim()).filter(Boolean) : p.highlights,
      }));

      const formattedAddOns = form.addOns
        .filter((a) => a.name.trim() && a.premium)
        .map((a) => ({
          name: a.name.trim(),
          premium: parseFloat(a.premium) || 0,
        }));

      await catalogService.createProduct({
        name: form.name.trim(),
        category: form.category,
        companyId: form.companyId,
        planType: form.planType.trim() || "Comprehensive",
        tagline: form.tagline.trim() || "Comprehensive insurance protection with instant cashless claims.",
        minPremium: parseFloat(form.minPremium),
        maxCoverage: parseFloat(form.maxCoverage),
        rating: 4.8,
        featured: true,
        inclusions: form.inclusions ? form.inclusions.split(",").map((s) => s.trim()).filter(Boolean) : ["Cashless claims", "24/7 assistance"],
        exclusions: form.exclusions ? form.exclusions.split(",").map((s) => s.trim()).filter(Boolean) : ["Normal wear and tear", "Intentional damage"],
        plans: formattedPlans,
        addOns: formattedAddOns,
      });

      toast.success(`Product "${form.name.trim()}" published successfully with calculation tiers.`);
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  // 2. OPEN EDIT MODAL
  const openEditModal = (prod) => {
    setSelectedProduct(prod);

    const existingPlans = Array.isArray(prod.plans) && prod.plans.length > 0
      ? prod.plans.map((p) => ({
          id: p.id || "P1",
          name: p.name || "Standard",
          sumInsured: String(p.sumInsured || prod.maxCoverage || "1000000"),
          annualPremium: String(p.annualPremium || prod.minPremium || "7999"),
          deductible: String(p.deductible || "0"),
          highlights: Array.isArray(p.highlights) ? p.highlights.join(", ") : (p.highlights || ""),
        }))
      : initialDefaultPlans;

    const existingAddOns = Array.isArray(prod.addOns) && prod.addOns.length > 0
      ? prod.addOns.map((a) => ({ name: a.name, premium: String(a.premium) }))
      : initialDefaultAddOns;

    setEditForm({
      name: prod.name || "",
      category: prod.category || "health",
      companyId: prod.companyId || "comp-hdfc",
      planType: prod.planType || "Comprehensive",
      tagline: prod.tagline || "",
      minPremium: prod.minPremium ? String(prod.minPremium) : "6999",
      maxCoverage: prod.maxCoverage ? String(prod.maxCoverage) : "1000000",
      inclusions: Array.isArray(prod.inclusions) ? prod.inclusions.join(", ") : (prod.inclusions || ""),
      exclusions: Array.isArray(prod.exclusions) ? prod.exclusions.join(", ") : (prod.exclusions || ""),
      featured: prod.featured !== false,
      plans: existingPlans,
      addOns: existingAddOns,
    });
    setEditOpen(true);
  };

  // 3. UPDATE PRODUCT
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !editForm.name.trim() || !editForm.minPremium || !editForm.maxCoverage) {
      toast.error("Please fill in all required product fields.");
      return;
    }

    setUpdating(true);
    try {
      const formattedPlans = editForm.plans.map((p) => ({
        id: p.id,
        name: p.name.trim(),
        sumInsured: parseFloat(p.sumInsured) || parseFloat(editForm.maxCoverage),
        annualPremium: parseFloat(p.annualPremium) || parseFloat(editForm.minPremium),
        deductible: parseFloat(p.deductible) || 0,
        highlights: typeof p.highlights === "string" ? p.highlights.split(",").map((s) => s.trim()).filter(Boolean) : p.highlights,
      }));

      const formattedAddOns = editForm.addOns
        .filter((a) => a.name.trim() && a.premium)
        .map((a) => ({
          name: a.name.trim(),
          premium: parseFloat(a.premium) || 0,
        }));

      await catalogService.updateProduct(selectedProduct.id, {
        name: editForm.name.trim(),
        category: editForm.category,
        companyId: editForm.companyId,
        planType: editForm.planType.trim(),
        tagline: editForm.tagline.trim(),
        minPremium: parseFloat(editForm.minPremium),
        maxCoverage: parseFloat(editForm.maxCoverage),
        featured: editForm.featured,
        inclusions: editForm.inclusions ? editForm.inclusions.split(",").map((s) => s.trim()).filter(Boolean) : ["Cashless claims", "24/7 assistance"],
        exclusions: editForm.exclusions ? editForm.exclusions.split(",").map((s) => s.trim()).filter(Boolean) : ["Normal wear and tear", "Intentional damage"],
        plans: formattedPlans,
        addOns: formattedAddOns,
      });

      toast.success(`Product "${editForm.name.trim()}" updated successfully.`);
      setEditOpen(false);
      setSelectedProduct(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update product.");
    } finally {
      setUpdating(false);
    }
  };

  // 4. OPEN DELETE MODAL
  const openDeleteModal = (prod) => {
    setProductToDelete(prod);
    setDeleteOpen(true);
  };

  // 5. DELETE PRODUCT
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await catalogService.deleteProduct(productToDelete.id);
      toast.success(`Product "${productToDelete.name}" deleted.`);
      setDeleteOpen(false);
      setProductToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Product",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div>
          <p className="font-semibold text-foreground">{r.name}</p>
          <p className="text-xs text-muted-foreground">{nameOfCompany(r.companyId)} · {r.plans?.length || 3} Tiers</p>
        </div>
      ),
    },
    { key: "category", header: "Category", sortValue: (r) => r.category, cell: (r) => <span className="capitalize">{r.category}</span> },
    { key: "planType", header: "Plan type", hideOnMobile: true, cell: (r) => r.planType },
    { key: "minPremium", header: "From", sortValue: (r) => r.minPremium, cell: (r) => inr(r.minPremium) },
    { key: "maxCoverage", header: "Max cover", sortValue: (r) => r.maxCoverage, cell: (r) => inr(r.maxCoverage, true) },
    { key: "rating", header: "Rating", sortValue: (r) => r.rating, cell: (r) => r.rating?.toFixed(1) || "4.8" },
    {
      key: "actions",
      header: "Actions",
      cell: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => openEditModal(r)}
            title="Edit product"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => openDeleteModal(r)}
            title="Delete product"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PortalPage
      role="ADMIN"
      title="Products"
      description="Manage insurance plans, calculation tiers, and rider add-ons on the marketplace."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Insurance Product &amp; Calculation Tiers</DialogTitle>
              <DialogDescription>
                Publish a new plan with customized pricing tiers, coverage limits, and rider add-ons.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">1. General Info</TabsTrigger>
                  <TabsTrigger value="tiers">2. Plan Tiers (3)</TabsTrigger>
                  <TabsTrigger value="addons">3. Riders &amp; Inclusions</TabsTrigger>
                </TabsList>

                {/* TAB 1: GENERAL INFO */}
                <TabsContent value="general" className="space-y-3.5 pt-3">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="pr-cat">Category <span className="text-destructive">*</span></Label>
                      <select
                        id="pr-cat"
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        {categoryList.map((c) => (
                          <option key={c.slug} value={c.slug} className="bg-popover text-popover-foreground">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="pr-comp">Partner Insurer <span className="text-destructive">*</span></Label>
                      <select
                        id="pr-comp"
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
                    <Label htmlFor="pr-plan">Plan Type <span className="text-destructive">*</span></Label>
                    <Input
                      id="pr-plan"
                      placeholder="e.g. Family Floater / Pure Term"
                      value={form.planType}
                      onChange={(e) => setForm({ ...form, planType: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="pr-min">Base Starting Premium (₹) <span className="text-destructive">*</span></Label>
                      <Input
                        id="pr-min"
                        type="number"
                        min={1}
                        required
                        value={form.minPremium}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({ ...form, minPremium: val });
                          handleAutoFillTiers(val, form.maxCoverage);
                        }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="pr-max">Max Sum Insured (₹) <span className="text-destructive">*</span></Label>
                      <Input
                        id="pr-max"
                        type="number"
                        min={1}
                        required
                        value={form.maxCoverage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({ ...form, maxCoverage: val });
                          handleAutoFillTiers(form.minPremium, val);
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pr-tag">Tagline / Key Value Proposition</Label>
                    <Input
                      id="pr-tag"
                      placeholder="e.g. 4X restore benefit with zero deductible"
                      value={form.tagline}
                      onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    />
                  </div>
                </TabsContent>

                {/* TAB 2: TIERS BUILDER */}
                <TabsContent value="tiers" className="space-y-3.5 pt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Configure individual coverage amounts and annual pricing for each tier:
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAutoFillTiers(form.minPremium, form.maxCoverage)}
                    >
                      Recalculate Default Tiers
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {form.plans.map((p, idx) => (
                      <div key={p.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary uppercase tracking-wide">Tier {idx + 1}: {p.name}</span>
                          <span className="text-xs text-muted-foreground">ID: {p.id}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Tier Name</Label>
                            <Input
                              value={p.name}
                              className="h-8 text-xs"
                              onChange={(e) => {
                                const copy = [...form.plans];
                                copy[idx].name = e.target.value;
                                setForm({ ...form, plans: copy });
                              }}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Sum Insured (₹)</Label>
                            <Input
                              type="number"
                              value={p.sumInsured}
                              className="h-8 text-xs"
                              onChange={(e) => {
                                const copy = [...form.plans];
                                copy[idx].sumInsured = e.target.value;
                                setForm({ ...form, plans: copy });
                              }}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Annual Premium (₹)</Label>
                            <Input
                              type="number"
                              value={p.annualPremium}
                              className="h-8 text-xs"
                              onChange={(e) => {
                                const copy = [...form.plans];
                                copy[idx].annualPremium = e.target.value;
                                setForm({ ...form, plans: copy });
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Deductible (₹)</Label>
                            <Input
                              type="number"
                              value={p.deductible}
                              className="h-8 text-xs"
                              onChange={(e) => {
                                const copy = [...form.plans];
                                copy[idx].deductible = e.target.value;
                                setForm({ ...form, plans: copy });
                              }}
                            />
                          </div>

                          <div className="col-span-2 space-y-1">
                            <Label className="text-xs">Highlights (Comma separated)</Label>
                            <Input
                              value={p.highlights}
                              className="h-8 text-xs"
                              onChange={(e) => {
                                const copy = [...form.plans];
                                copy[idx].highlights = e.target.value;
                                setForm({ ...form, plans: copy });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* TAB 3: RIDERS & INCLUSIONS */}
                <TabsContent value="addons" className="space-y-3.5 pt-3">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add-on Riders (Optional Tiers)</Label>
                    <div className="mt-2 space-y-2">
                      {form.addOns.map((a, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            placeholder="Rider Name"
                            value={a.name}
                            className="h-8 text-xs flex-1"
                            onChange={(e) => {
                              const copy = [...form.addOns];
                              copy[idx].name = e.target.value;
                              setForm({ ...form, addOns: copy });
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Annual Extra (₹)"
                            value={a.premium}
                            className="h-8 text-xs w-32"
                            onChange={(e) => {
                              const copy = [...form.addOns];
                              copy[idx].premium = e.target.value;
                              setForm({ ...form, addOns: copy });
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive"
                            onClick={() => {
                              setForm({ ...form, addOns: form.addOns.filter((_, i) => i !== idx) });
                            }}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs mt-1"
                        onClick={() => {
                          setForm({ ...form, addOns: [...form.addOns, { name: "", premium: "500" }] });
                        }}
                      >
                        <Plus className="mr-1 size-3.5" /> Add Rider Option
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="pr-inc">Coverage Inclusions (Comma separated)</Label>
                    <Input
                      id="pr-inc"
                      placeholder="e.g. Cashless hospitalization, Road ambulance, Restore benefit"
                      value={form.inclusions}
                      onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pr-exc">Policy Exclusions (Comma separated)</Label>
                    <Input
                      id="pr-exc"
                      placeholder="e.g. Self-inflicted injury, Pre-existing conditions before waiting period"
                      value={form.exclusions}
                      onChange={(e) => setForm({ ...form, exclusions: e.target.value })}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="pt-2">
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

      {/* EDIT PRODUCT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Insurance Product &amp; Tiers</DialogTitle>
            <DialogDescription>
              Update plan specifications, tier pricing, and rider add-on calculations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">1. General Info</TabsTrigger>
                <TabsTrigger value="tiers">2. Plan Tiers (3)</TabsTrigger>
                <TabsTrigger value="addons">3. Riders &amp; Inclusions</TabsTrigger>
              </TabsList>

              {/* EDIT TAB 1 */}
              <TabsContent value="general" className="space-y-3.5 pt-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-pr-name">Product Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-pr-name"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-pr-cat">Category <span className="text-destructive">*</span></Label>
                    <select
                      id="edit-pr-cat"
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    >
                      {categoryList.map((c) => (
                        <option key={c.slug} value={c.slug} className="bg-popover text-popover-foreground">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-pr-comp">Partner Insurer <span className="text-destructive">*</span></Label>
                    <select
                      id="edit-pr-comp"
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      value={editForm.companyId}
                      onChange={(e) => setEditForm({ ...editForm, companyId: e.target.value })}
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
                  <Label htmlFor="edit-pr-plan">Plan Type <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-pr-plan"
                    value={editForm.planType}
                    onChange={(e) => setEditForm({ ...editForm, planType: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-pr-min">Base Starting Premium (₹) <span className="text-destructive">*</span></Label>
                    <Input
                      id="edit-pr-min"
                      type="number"
                      min={1}
                      required
                      value={editForm.minPremium}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditForm({ ...editForm, minPremium: val });
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-pr-max">Max Sum Insured (₹) <span className="text-destructive">*</span></Label>
                    <Input
                      id="edit-pr-max"
                      type="number"
                      min={1}
                      required
                      value={editForm.maxCoverage}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditForm({ ...editForm, maxCoverage: val });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-pr-tag">Tagline / Key Feature</Label>
                  <Input
                    id="edit-pr-tag"
                    value={editForm.tagline}
                    onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                  />
                </div>
              </TabsContent>

              {/* EDIT TAB 2 */}
              <TabsContent value="tiers" className="space-y-3.5 pt-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Adjust tier pricing and coverage limits:</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAutoFillTiers(editForm.minPremium, editForm.maxCoverage, true)}
                  >
                    Recalculate Default Tiers
                  </Button>
                </div>

                <div className="space-y-3">
                  {editForm.plans.map((p, idx) => (
                    <div key={p.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">Tier {idx + 1}: {p.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {p.id}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Tier Name</Label>
                          <Input
                            value={p.name}
                            className="h-8 text-xs"
                            onChange={(e) => {
                              const copy = [...editForm.plans];
                              copy[idx].name = e.target.value;
                              setEditForm({ ...editForm, plans: copy });
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Sum Insured (₹)</Label>
                          <Input
                            type="number"
                            value={p.sumInsured}
                            className="h-8 text-xs"
                            onChange={(e) => {
                              const copy = [...editForm.plans];
                              copy[idx].sumInsured = e.target.value;
                              setEditForm({ ...editForm, plans: copy });
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Annual Premium (₹)</Label>
                          <Input
                            type="number"
                            value={p.annualPremium}
                            className="h-8 text-xs"
                            onChange={(e) => {
                              const copy = [...editForm.plans];
                              copy[idx].annualPremium = e.target.value;
                              setEditForm({ ...editForm, plans: copy });
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Deductible (₹)</Label>
                          <Input
                            type="number"
                            value={p.deductible}
                            className="h-8 text-xs"
                            onChange={(e) => {
                              const copy = [...editForm.plans];
                              copy[idx].deductible = e.target.value;
                              setEditForm({ ...editForm, plans: copy });
                            }}
                          />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Highlights (Comma separated)</Label>
                          <Input
                            value={p.highlights}
                            className="h-8 text-xs"
                            onChange={(e) => {
                              const copy = [...editForm.plans];
                              copy[idx].highlights = e.target.value;
                              setEditForm({ ...editForm, plans: copy });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* EDIT TAB 3 */}
              <TabsContent value="addons" className="space-y-3.5 pt-3">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add-on Riders</Label>
                  <div className="mt-2 space-y-2">
                    {editForm.addOns.map((a, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          placeholder="Rider Name"
                          value={a.name}
                          className="h-8 text-xs flex-1"
                          onChange={(e) => {
                            const copy = [...editForm.addOns];
                            copy[idx].name = e.target.value;
                            setEditForm({ ...editForm, addOns: copy });
                          }}
                        />
                        <Input
                          type="number"
                          placeholder="Annual Extra (₹)"
                          value={a.premium}
                          className="h-8 text-xs w-32"
                          onChange={(e) => {
                            const copy = [...editForm.addOns];
                            copy[idx].premium = e.target.value;
                            setEditForm({ ...editForm, addOns: copy });
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive"
                          onClick={() => {
                            setEditForm({ ...editForm, addOns: editForm.addOns.filter((_, i) => i !== idx) });
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs mt-1"
                      onClick={() => {
                        setEditForm({ ...editForm, addOns: [...editForm.addOns, { name: "", premium: "500" }] });
                      }}
                    >
                      <Plus className="mr-1 size-3.5" /> Add Rider Option
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="edit-pr-inc">Inclusions (Comma separated)</Label>
                  <Input
                    id="edit-pr-inc"
                    value={editForm.inclusions}
                    onChange={(e) => setEditForm({ ...editForm, inclusions: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-pr-exc">Exclusions (Comma separated)</Label>
                  <Input
                    id="edit-pr-exc"
                    value={editForm.exclusions}
                    onChange={(e) => setEditForm({ ...editForm, exclusions: e.target.value })}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalPage>
  );
}
