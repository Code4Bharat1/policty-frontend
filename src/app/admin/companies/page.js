"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, PlusCircle, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { StatusBadge } from "@/components/app/status-badge";
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
import { catalogService } from "@/services";
import { apiClient } from "@/services/apiClient";

const columns = [
  {
    key: "name",
    header: "Insurer",
    sortValue: (r) => r.name,
    cell: (r) => (
      <div>
        <p className="font-semibold text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.shortName}</p>
      </div>
    ),
  },
  { key: "email", header: "Contact", hideOnMobile: true, cell: (r) => `${r.email || "—"} · ${r.phone || "—"}` },
  { key: "csr", header: "Claim settlement", sortValue: (r) => r.claimSettlementRatio, cell: (r) => `${r.claimSettlementRatio || 97}%` },
  { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status || "Active"} /> },
];

export default function AdminCompaniesPage() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    email: "",
    phone: "",
    claimSettlementRatio: "98.0",
  });

  const { data, isLoading, refetch } = useQuery({ queryKey: ["companies"], queryFn: catalogService.companies });

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.shortName.trim()) {
      toast.error("Please enter insurer name and short code.");
      return;
    }

    setSaving(true);
    try {
      const generatedId = `comp-${form.shortName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
      await apiClient.post("/catalog/companies", {
        id: generatedId,
        name: form.name.trim(),
        shortName: form.shortName.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        claimSettlementRatio: parseFloat(form.claimSettlementRatio) || 98.0,
        rating: 4.8,
        status: "Active",
      });

      toast.success(`Insurer "${form.name.trim()}" onboarded successfully.`);
      setForm({ name: "", shortName: "", email: "", phone: "", claimSettlementRatio: "98.0" });
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to onboard insurer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalPage
      role="ADMIN"
      title="Insurance companies"
      description="Authorized insurance underwriters available on the marketplace."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" /> Add Partner Insurer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Onboard Partner Insurer</DialogTitle>
              <DialogDescription>
                Register an authorized insurance company with contact details and claim settlement ratio.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="co-name">Full Company Name <span className="text-destructive">*</span></Label>
                <Input
                  id="co-name"
                  required
                  placeholder="e.g. Star Health & Allied Insurance Co Ltd"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="co-short">Short Name / Code <span className="text-destructive">*</span></Label>
                  <Input
                    id="co-short"
                    required
                    placeholder="e.g. Star Health"
                    value={form.shortName}
                    onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="co-csr">Claim Settlement Ratio (%)</Label>
                  <Input
                    id="co-csr"
                    type="number"
                    step="0.1"
                    min={50}
                    max={100}
                    value={form.claimSettlementRatio}
                    onChange={(e) => setForm({ ...form, claimSettlementRatio: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="co-email">Support Email</Label>
                  <Input
                    id="co-email"
                    type="email"
                    placeholder="care@starhealth.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="co-phone">Toll-Free Phone</Label>
                  <Input
                    id="co-phone"
                    placeholder="1800 425 2255"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Registering…
                    </>
                  ) : (
                    "Register Insurer"
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
        columns={columns}
        searchKeys={(r) => `${r.name} ${r.shortName}`}
        searchPlaceholder="Search insurers"
        exportable
      />
    </PortalPage>
  );
}
