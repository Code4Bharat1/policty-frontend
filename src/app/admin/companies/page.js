"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, PlusCircle, Loader2, Edit, Trash2, AlertTriangle } from "lucide-react";
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

export default function AdminCompaniesPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const [form, setForm] = useState({
    name: "",
    shortName: "",
    email: "",
    phone: "",
    claimSettlementRatio: "98.0",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    shortName: "",
    email: "",
    phone: "",
    claimSettlementRatio: "98.0",
    status: "Active",
  });

  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, refetch } = useQuery({ queryKey: ["companies"], queryFn: catalogService.companies });

  // 1. CREATE COMPANY
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.shortName.trim()) {
      toast.error("Please enter insurer name and short code.");
      return;
    }

    setSaving(true);
    try {
      const generatedId = `comp-${form.shortName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
      await catalogService.createCompany({
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

  // 2. OPEN EDIT MODAL
  const openEditModal = (co) => {
    setSelectedCompany(co);
    setEditForm({
      name: co.name || "",
      shortName: co.shortName || "",
      email: co.email || "",
      phone: co.phone || "",
      claimSettlementRatio: String(co.claimSettlementRatio || "98.0"),
      status: co.status || "Active",
    });
    setEditOpen(true);
  };

  // 3. UPDATE COMPANY
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!selectedCompany || !editForm.name.trim() || !editForm.shortName.trim()) {
      toast.error("Please enter insurer name and short code.");
      return;
    }

    setUpdating(true);
    try {
      await catalogService.updateCompany(selectedCompany.id, {
        name: editForm.name.trim(),
        shortName: editForm.shortName.trim(),
        email: editForm.email.trim() || undefined,
        phone: editForm.phone.trim() || undefined,
        claimSettlementRatio: parseFloat(editForm.claimSettlementRatio) || 98.0,
        status: editForm.status,
      });

      toast.success(`Insurer "${editForm.name.trim()}" updated successfully.`);
      setEditOpen(false);
      setSelectedCompany(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update insurer.");
    } finally {
      setUpdating(false);
    }
  };

  // 4. OPEN DELETE MODAL
  const openDeleteModal = (co) => {
    setCompanyToDelete(co);
    setDeleteOpen(true);
  };

  // 5. DELETE COMPANY
  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;
    setDeleting(true);
    try {
      await catalogService.deleteCompany(companyToDelete.id);
      toast.success(`Insurer "${companyToDelete.name}" removed.`);
      setDeleteOpen(false);
      setCompanyToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to delete insurer.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Insurer",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div>
          <p className="font-semibold text-foreground">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.shortName} · ID: {r.id}</p>
        </div>
      ),
    },
    { key: "email", header: "Contact", hideOnMobile: true, cell: (r) => `${r.email || "—"} · ${r.phone || "—"}` },
    { key: "csr", header: "Claim settlement", sortValue: (r) => r.claimSettlementRatio, cell: (r) => `${r.claimSettlementRatio || 97}%` },
    { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status || "Active"} /> },
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
            title="Edit insurer"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => openDeleteModal(r)}
            title="Delete insurer"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* EDIT INSURER MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Partner Insurer</DialogTitle>
            <DialogDescription>
              Update insurance company details and claim settlement ratio.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCompany} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-co-name">Full Company Name <span className="text-destructive">*</span></Label>
              <Input
                id="edit-co-name"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-co-short">Short Name / Code <span className="text-destructive">*</span></Label>
                <Input
                  id="edit-co-short"
                  required
                  value={editForm.shortName}
                  onChange={(e) => setEditForm({ ...editForm, shortName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-co-csr">Claim Settlement Ratio (%)</Label>
                <Input
                  id="edit-co-csr"
                  type="number"
                  step="0.1"
                  min={50}
                  max={100}
                  value={editForm.claimSettlementRatio}
                  onChange={(e) => setEditForm({ ...editForm, claimSettlementRatio: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-co-email">Support Email</Label>
                <Input
                  id="edit-co-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-co-phone">Toll-Free Phone</Label>
                <Input
                  id="edit-co-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-co-status">Status</Label>
              <select
                id="edit-co-status"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <DialogFooter>
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

      {/* DELETE INSURER CONFIRMATION MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Delete Partner Insurer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{companyToDelete?.name}</strong>? Any products under this insurer may need re-assignment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCompany} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete Insurer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalPage>
  );
}
