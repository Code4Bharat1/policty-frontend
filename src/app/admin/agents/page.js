"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branch: "",
  });
  const [saving, setSaving] = useState(false);

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

      toast.success(`Advisor ${form.name.trim()} provisioned successfully.`);
      setForm({ name: "", email: "", password: "", phone: "", branch: "" });
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to create advisor");
    } finally {
      setSaving(false);
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
            href={`/admin/agents/${r.agent.id}`}
            className="font-semibold text-foreground hover:underline"
          >
            {r.agent.name}
          </a>
          <p className="text-xs text-muted-foreground">
            {r.agent.code} · {r.agent.branch || r.agent.city || "Head Office"}
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
      cell: (r) => `${r.conversions}/${r.leads}`,
    },
    { key: "commission", header: "Commission", sortValue: (r) => r.commission, cell: (r) => inr(r.commission, true) },
    {
      key: "status",
      header: "Status",
      sortValue: (r) => r.agent.status,
      cell: (r) => <StatusBadge status={r.agent.status || "Active"} />,
    },
  ];

  return (
    <PortalPage
      role="ADMIN"
      title="Advisors"
      description="Distribution network performance and status."
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
                Create an advisor profile and automatically issue their portal login credentials.
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

              <div className="grid grid-cols-2 gap-3">
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
                      <Loader2 className="mr-2 size-4 animate-spin" /> Provisioning…
                    </>
                  ) : (
                    "Create Advisor Account"
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
        searchKeys={(r) => `${r.agent.name} ${r.agent.code} ${r.agent.branch || ""}`}
        searchPlaceholder="Search advisors"
        exportable
      />
    </PortalPage>
  );
}
