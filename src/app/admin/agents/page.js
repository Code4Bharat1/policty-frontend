"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus, Loader2, Edit, Trash2, Power, AlertTriangle } from "lucide-react";
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
import { agentService } from "@/services";
import { inr } from "@/lib/format";

export default function AdminAgentsPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentToDelete, setAgentToDelete] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branch: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    branch: "",
    status: "Active",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["performance"],
    queryFn: agentService.performance,
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);
    try {
      await agentService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password || "Advisor@2026!",
        phone: form.phone.trim() || undefined,
        branch: form.branch.trim() || "Head Office",
      });

      toast.success("Advisor " + form.name.trim() + " provisioned and credentials emailed.");
      setForm({ name: "", email: "", password: "", phone: "", branch: "" });
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to create advisor");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (agent) => {
    const nextStatus = agent.status === "Active" ? "Inactive" : "Active";
    setActionLoadingId(agent.id);
    try {
      await agentService.update(agent.id, { status: nextStatus });
      toast.success("Advisor " + agent.name + " is now " + nextStatus + ".");
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update advisor status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openEditModal = (agent) => {
    setSelectedAgent(agent);
    setEditForm({
      name: agent.name || "",
      phone: agent.phone || "",
      branch: agent.branch || "",
      status: agent.status || "Active",
    });
    setEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setSaving(true);
    try {
      await agentService.update(selectedAgent.id, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim() || undefined,
        branch: editForm.branch.trim() || "Head Office",
        status: editForm.status,
      });

      toast.success("Advisor " + editForm.name.trim() + " updated successfully.");
      setEditOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update advisor");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (agent) => {
    setAgentToDelete(agent);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!agentToDelete) return;
    setDeleting(true);
    try {
      await agentService.delete(agentToDelete.id);
      toast.success("Advisor " + agentToDelete.name + " offboarded successfully.");
      setDeleteOpen(false);
      setAgentToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to delete advisor");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Advisor",
      sortValue: (r) => r.agent.name,
      cell: (r) => (
        <div>
          <a
            href={"/admin/agents/" + r.agent.id}
            className="font-semibold text-foreground hover:underline"
          >
            {r.agent.name}
          </a>
          <p className="text-xs text-muted-foreground">
            {r.agent.code} - {r.agent.branch || r.agent.city || "Head Office"}
          </p>
        </div>
      ),
    },
    { key: "policies", header: "Policies", sortValue: (r) => r.policies, cell: (r) => r.policies },
    { key: "premium", header: "Premium", sortValue: (r) => r.premium, cell: (r) => inr(r.premium, true) },
    {
      key: "conv",
      header: "Conversions",
      hideOnMobile: true,
      sortValue: (r) => r.conversions,
      cell: (r) => r.conversions + "/" + r.leads,
    },
    { key: "commission", header: "Commission", sortValue: (r) => r.commission, cell: (r) => inr(r.commission, true) },
    {
      key: "status",
      header: "Status",
      sortValue: (r) => r.agent.status,
      cell: (r) => <StatusBadge status={r.agent.status || "Active"} />,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r) => {
        const isActive = (r.agent.status || "Active") === "Active";
        const isBusy = actionLoadingId === r.agent.id;

        return (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={isActive ? "outline" : "secondary"}
              className={"h-7 px-2 text-xs font-semibold " + (isActive ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700")}
              disabled={isBusy}
              onClick={() => handleToggleStatus(r.agent)}
              title={isActive ? "Deactivate Advisor (blocks login)" : "Activate Advisor"}
            >
              <Power className="mr-1 size-3" />
              {isActive ? "Deactivate" : "Activate"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              disabled={isBusy}
              onClick={() => openEditModal(r.agent)}
              title="Edit Advisor Details"
            >
              <Edit className="size-3" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
              disabled={isBusy}
              onClick={() => openDeleteModal(r.agent)}
              title="Delete / Offboard Advisor"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PortalPage
      role="ADMIN"
      title="Advisors"
      description="Distribution network performance, credential dispatch, and advisor lifecycle management."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 size-4" /> Add New Advisor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Provision New Advisor</DialogTitle>
              <DialogDescription>
                Create an advisor profile and automatically email their portal login credentials.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ag-name">Full name <span className="text-destructive">*</span></Label>
                <Input
                  id="ag-name"
                  required
                  placeholder="e.g. Amit Patel"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ag-email">Email address <span className="text-destructive">*</span></Label>
                <Input
                  id="ag-email"
                  type="email"
                  required
                  placeholder="advisor@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ag-pass">Initial password</Label>
                <Input
                  id="ag-pass"
                  type="password"
                  placeholder="Default: Advisor@2026!"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Leave blank to use default password: Advisor@2026!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ag-phone">Mobile</Label>
                  <Input
                    id="ag-phone"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ag-branch">Branch / Region</Label>
                  <Input
                    id="ag-branch"
                    placeholder="Mumbai Central"
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Provisioning...
                    </>
                  ) : (
                    "Create Advisor & Send Email"
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
        rowKey={(r) => r.agent.id}
        columns={columns}
        searchKeys={(r) => r.agent.name + " " + r.agent.code + " " + (r.agent.branch || "")}
        searchPlaceholder="Search advisors"
        exportable
      />

      {/* Edit Advisor Modal Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Advisor Details</DialogTitle>
            <DialogDescription>
              Update contact information, branch assignment, and account status.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-ag-name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="edit-ag-name"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-ag-phone">Mobile Phone</Label>
                <Input
                  id="edit-ag-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-ag-branch">Assigned Branch</Label>
                <Input
                  id="edit-ag-branch"
                  value={editForm.branch}
                  onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-ag-status">Account Status</Label>
              <select
                id="edit-ag-status"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="Active">Active (Full Portal Access)</option>
                <option value="Inactive">Inactive (Login Deactivated)</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Styled Delete / Offboarding Confirmation Modal Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <DialogTitle>Offboard Advisor</DialogTitle>
                <DialogDescription>
                  This action will permanently remove the advisor from the system.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <p className="font-semibold text-foreground">{agentToDelete?.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Code: <span className="font-mono">{agentToDelete?.code}</span> &bull; {agentToDelete?.branch || "Head Office"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Their user login credentials will be revoked immediately and they will no longer be able to access the Advisor Portal.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={handleConfirmDelete}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Offboarding...
                </>
              ) : (
                "Yes, Offboard Advisor"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalPage>
  );
}
