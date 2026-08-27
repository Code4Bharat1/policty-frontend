"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus, Loader2, Edit, Trash2, AlertTriangle } from "lucide-react";
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
import { customerService, agentService, nameOfAgent } from "@/services";

export default function AdminCustomersPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Mumbai",
    state: "Maharashtra",
    agentId: "",
    kycStatus: "Pending",
    status: "Active",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    agentId: "",
    kycStatus: "Pending",
    status: "Active",
  });

  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.list(),
  });

  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () => agentService.list(),
  });

  // 1. CREATE CUSTOMER
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please enter customer name, email, and phone number.");
      return;
    }

    setSaving(true);
    try {
      await customerService.create({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        city: form.city.trim() || "Mumbai",
        state: form.state.trim() || "Maharashtra",
        agentId: form.agentId || undefined,
        kycStatus: form.kycStatus,
        status: form.status,
      });

      toast.success(`Customer "${form.name.trim()}" created successfully.`);
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "Mumbai",
        state: "Maharashtra",
        agentId: "",
        kycStatus: "Pending",
        status: "Active",
      });
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to create customer.");
    } finally {
      setSaving(false);
    }
  };

  // 2. OPEN EDIT MODAL
  const openEditModal = (cust) => {
    setSelectedCustomer(cust);
    setEditForm({
      name: cust.name || "",
      email: cust.email || "",
      phone: cust.phone || "",
      city: cust.city || "",
      state: cust.state || "",
      agentId: cust.agentId || "",
      kycStatus: cust.kycStatus || "Pending",
      status: cust.status || "Active",
    });
    setEditOpen(true);
  };

  // 3. UPDATE CUSTOMER
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      toast.error("Please fill in all required customer fields.");
      return;
    }

    setUpdating(true);
    try {
      await customerService.update(selectedCustomer.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        phone: editForm.phone.trim(),
        city: editForm.city.trim(),
        state: editForm.state.trim(),
        agentId: editForm.agentId || undefined,
        kycStatus: editForm.kycStatus,
        status: editForm.status,
      });

      toast.success(`Customer "${editForm.name.trim()}" updated successfully.`);
      setEditOpen(false);
      setSelectedCustomer(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update customer.");
    } finally {
      setUpdating(false);
    }
  };

  // 4. OPEN DELETE MODAL
  const openDeleteModal = (cust) => {
    setCustomerToDelete(cust);
    setDeleteOpen(true);
  };

  // 5. DELETE CUSTOMER
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      await customerService.delete(customerToDelete.id);
      toast.success(`Customer "${customerToDelete.name}" deleted.`);
      setDeleteOpen(false);
      setCustomerToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to delete customer.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Customer",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div>
          <p className="font-semibold text-foreground">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.email} · ID: {r.id}</p>
        </div>
      ),
    },
    { key: "phone", header: "Phone", hideOnMobile: true, cell: (r) => r.phone || "—" },
    { key: "city", header: "Location", sortValue: (r) => r.city, cell: (r) => `${r.city || "—"}, ${r.state || ""}` },
    { key: "agent", header: "Advisor", hideOnMobile: true, sortValue: (r) => nameOfAgent(r.agentId), cell: (r) => nameOfAgent(r.agentId) },
    { key: "kyc", header: "KYC", sortValue: (r) => r.kycStatus, cell: (r) => <StatusBadge status={r.kycStatus || "Pending"} /> },
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
            title="Edit customer"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => openDeleteModal(r)}
            title="Delete customer"
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
      title="Customers"
      description="Master customer register across all advisors."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 size-4" /> Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Customer Record</DialogTitle>
              <DialogDescription>
                Register a new policyholder and assign an insurance advisor.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="cust-name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="cust-name"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cust-email">Email Address <span className="text-destructive">*</span></Label>
                  <Input
                    id="cust-email"
                    type="email"
                    required
                    placeholder="ananya@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cust-phone">Mobile Phone <span className="text-destructive">*</span></Label>
                  <Input
                    id="cust-phone"
                    required
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cust-city">City</Label>
                  <Input
                    id="cust-city"
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cust-state">State</Label>
                  <Input
                    id="cust-state"
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-agent">Assigned Advisor</Label>
                <select
                  id="cust-agent"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cust-kyc">KYC Status</Label>
                  <select
                    id="cust-kyc"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.kycStatus}
                    onChange={(e) => setForm({ ...form, kycStatus: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cust-status">Account Status</Label>
                  <select
                    id="cust-status"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    "Save Customer"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <DataTable
        data={customers}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.name} ${r.email} ${r.phone} ${r.city} ${nameOfAgent(r.agentId)}`}
        searchPlaceholder="Search customers"
        exportable
      />

      {/* EDIT CUSTOMER MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Customer Record</DialogTitle>
            <DialogDescription>
              Update customer contact information, KYC status, and assigned advisor.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCustomer} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-cust-name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="edit-cust-name"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-cust-email">Email Address <span className="text-destructive">*</span></Label>
                <Input
                  id="edit-cust-email"
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-cust-phone">Mobile Phone <span className="text-destructive">*</span></Label>
                <Input
                  id="edit-cust-phone"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-cust-city">City</Label>
                <Input
                  id="edit-cust-city"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-cust-state">State</Label>
                <Input
                  id="edit-cust-state"
                  value={editForm.state}
                  onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-cust-agent">Assigned Advisor</Label>
              <select
                id="edit-cust-agent"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={editForm.agentId}
                onChange={(e) => setEditForm({ ...editForm, agentId: e.target.value })}
              >
                <option value="">Direct (No Advisor)</option>
                {(agents ?? []).map((a) => (
                  <option key={a.id} value={a.id} className="bg-popover text-popover-foreground">
                    {a.name} ({a.code || a.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-cust-kyc">KYC Status</Label>
                <select
                  id="edit-cust-kyc"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={editForm.kycStatus}
                  onChange={(e) => setEditForm({ ...editForm, kycStatus: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-cust-status">Account Status</Label>
                <select
                  id="edit-cust-status"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
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

      {/* DELETE CUSTOMER CONFIRMATION MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Delete Customer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong>{customerToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete Customer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalPage>
  );
}
