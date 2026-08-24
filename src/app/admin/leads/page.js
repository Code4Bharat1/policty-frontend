"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserCheck, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { leadColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { leadService, agentService, nameOfAgent } from "@/services";

export default function AdminLeadsPage() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading, refetch } = useQuery({ queryKey: ["leads-all"], queryFn: () => leadService.list() });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: agentService.list });

  const handleOpenAssign = (lead) => {
    setSelectedLead(lead);
    setSelectedAgentId(lead.agentId || (agents?.[0]?.id ?? ""));
  };

  const handleAssignAgent = async (e) => {
    e.preventDefault();
    if (!selectedLead || !selectedAgentId) return;

    setSaving(true);
    try {
      await leadService.update(selectedLead.id, { agentId: selectedAgentId });
      toast.success(`Lead for ${selectedLead.name} assigned to advisor.`);
      setSelectedLead(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to assign advisor.");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    ...leadColumns,
    {
      key: "agent",
      header: "Advisor",
      hideOnMobile: true,
      sortValue: (r) => nameOfAgent(r.agentId),
      cell: (r) => (
        <span className={r.agentId ? "font-medium text-foreground" : "text-amber-600 font-medium"}>
          {nameOfAgent(r.agentId)}
        </span>
      ),
    },
    {
      key: "assign",
      header: "Action",
      cell: (r) => (
        <Button size="sm" variant="outline" onClick={() => handleOpenAssign(r)}>
          <UserCheck className="mr-1.5 size-3.5" /> Assign
        </Button>
      ),
    },
  ];

  return (
    <PortalPage role="ADMIN" title="CRM / Leads" description="Prospect enquiries across the distribution network.">
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.name} ${r.phone} ${r.interest} ${r.stage} ${nameOfAgent(r.agentId)}`}
        searchPlaceholder="Search leads"
        exportable
      />

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Advisor to Lead</DialogTitle>
            <DialogDescription>
              Prospect: {selectedLead?.name} ({selectedLead?.phone || selectedLead?.email}) · Interest: {selectedLead?.interest}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <form onSubmit={handleAssignAgent} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="lead-agent">Select Servicing Advisor <span className="text-destructive">*</span></Label>
                <select
                  id="lead-agent"
                  required
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                >
                  <option value="">Select an active advisor</option>
                  {(agents ?? []).map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.code || ag.id}) — {ag.branch || "Head Office"}
                    </option>
                  ))}
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedLead(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || !selectedAgentId}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Assigning…
                    </>
                  ) : (
                    "Assign Advisor"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PortalPage>
  );
}
