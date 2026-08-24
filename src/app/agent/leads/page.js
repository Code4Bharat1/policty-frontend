"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Loader2, PhoneCall } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { leadColumns } from "@/components/app/columns";
import { SectionCard } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { leadService } from "@/services";
import { inr } from "@/lib/format";

const stages = ["New", "Contacted", "Qualified", "Quotation", "Negotiation", "Converted", "Lost"];

export default function AgentLeadsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId || user?.id || "";
  const [view, setView] = useState("table");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "health",
    estimatedPremium: "15000",
    priority: "High",
    stage: "New",
    source: "Direct Referral",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["leads", agentId],
    queryFn: () => leadService.list(agentId),
    enabled: !!user,
  });

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please enter lead name and contact phone number.");
      return;
    }

    setSaving(true);
    try {
      await leadService.create({
        agentId: agentId || undefined,
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        interest: form.interest,
        estimatedPremium: parseFloat(form.estimatedPremium) || 10000,
        priority: form.priority,
        stage: form.stage,
        source: form.source,
      });

      toast.success(`Lead for "${form.name.trim()}" logged successfully.`);
      setForm({
        name: "",
        email: "",
        phone: "",
        interest: "health",
        estimatedPremium: "15000",
        priority: "High",
        stage: "New",
        source: "Direct Referral",
      });
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to log lead.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdvanceStage = async (lead, nextStage) => {
    try {
      await leadService.update(lead.id, { stage: nextStage });
      toast.success(`Lead ${lead.name} moved to ${nextStage}.`);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update stage.");
    }
  };

  const columns = [
    ...leadColumns,
    {
      key: "action",
      header: "",
      cell: (r) => (
        <Button size="sm" variant="outline" onClick={() => toast.success(`Call logged for ${r.name}.`)}>
          <PhoneCall className="mr-1.5 size-3.5" /> Log call
        </Button>
      ),
    },
  ];

  return (
    <PortalPage
      role="AGENT"
      title="Leads & Opportunities"
      description="Track prospect pipelines from initial enquiry to closed policy."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" /> Create New Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Prospect Lead</DialogTitle>
              <DialogDescription>
                Record a new client opportunity and assign initial pipeline parameters.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ld-name">Prospect Name <span className="text-destructive">*</span></Label>
                <Input
                  id="ld-name"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ld-phone">Phone Number <span className="text-destructive">*</span></Label>
                  <Input
                    id="ld-phone"
                    required
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ld-email">Email Address</Label>
                  <Input
                    id="ld-email"
                    type="email"
                    placeholder="client@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ld-int">Interest Category</Label>
                  <select
                    id="ld-int"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={form.interest}
                    onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  >
                    <option value="health">Health Insurance</option>
                    <option value="life">Term / Life Insurance</option>
                    <option value="motor">Motor Insurance</option>
                    <option value="travel">Travel Insurance</option>
                    <option value="business">Commercial Insurance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ld-prem">Est. Premium (₹)</Label>
                  <Input
                    id="ld-prem"
                    type="number"
                    min={1000}
                    value={form.estimatedPremium}
                    onChange={(e) => setForm({ ...form, estimatedPremium: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ld-pri">Priority</Label>
                  <select
                    id="ld-pri"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ld-stage">Initial Stage</Label>
                  <select
                    id="ld-stage"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Quotation">Quotation</option>
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
                    "Save Lead"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="table">List View</TabsTrigger>
          <TabsTrigger value="board">Pipeline Board</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-4">
          <DataTable
            data={data}
            loading={isLoading}
            rowKey={(r) => r.id}
            columns={columns}
            searchKeys={(r) => `${r.name} ${r.email || ""} ${r.phone} ${r.interest} ${r.stage}`}
            searchPlaceholder="Search leads"
            exportable
          />
        </TabsContent>
        <TabsContent value="board" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage) => {
              const items = (data ?? []).filter((l) => l.stage === stage);
              return (
                <SectionCard
                  key={stage}
                  title={stage}
                  description={`${items.length} leads · ${inr(items.reduce((s, l) => s + (l.estimatedPremium || 0), 0), true)}`}
                  contentClassName="space-y-3 p-4"
                >
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No leads in this stage.</p>
                  ) : (
                    items.map((l) => (
                      <div key={l.id} className="rounded-lg border border-border p-3 bg-card shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{l.name}</p>
                          <StatusBadge status={l.priority} />
                        </div>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          {l.interest} · {l.phone}
                        </p>
                        <p className="mt-2 text-sm font-bold text-foreground">{inr(l.estimatedPremium || 0)}</p>
                      </div>
                    ))
                  )}
                </SectionCard>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </PortalPage>
  );
}
