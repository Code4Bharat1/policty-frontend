"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardList, CheckCircle2, XCircle, FileClock, Gavel, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { claimColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
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
} from "@/components/ui/dialog";
import { claimService, nameOfCustomer, policyNumberOf } from "@/services";
import { inr } from "@/lib/format";

export default function AdminClaimsPage() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ["claims-all"], queryFn: () => claimService.list() });

  // Adjudication Dialog State
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [status, setStatus] = useState("Approved");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  const handleOpenAdjudicate = (claim) => {
    setSelectedClaim(claim);
    setStatus(claim.status === "Submitted" ? "Under Review" : claim.status);
    setApprovedAmount(claim.approvedAmount ? String(claim.approvedAmount) : String(claim.amount || ""));
    setRemarks(claim.remarks || "");
  };

  const handleSaveAdjudication = async (e) => {
    e.preventDefault();
    if (!selectedClaim) return;

    setSaving(true);
    try {
      await claimService.updateStatus(
        selectedClaim.id,
        status,
        remarks.trim() || "Claim status updated by claims adjudication desk.",
        status === "Approved" || status === "Settled" ? parseFloat(approvedAmount) || selectedClaim.amount : undefined
      );

      toast.success(`Claim ${selectedClaim.claimNumber} updated to ${status}.`);
      setSelectedClaim(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update claim status.");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    ...claimColumns({ customer: true }),
    {
      key: "adjudicate",
      header: "Action",
      cell: (r) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenAdjudicate(r);
          }}
        >
          <Gavel className="mr-1.5 size-3.5" /> Adjudicate
        </Button>
      ),
    },
  ];

  return (
    <PortalPage role="ADMIN" title="Claims Adjudication" description="Review, verify documents, and adjudicate insurance claims.">
      <StatGrid>
        <StatCard label="Total claims" value={data?.length ?? 0} icon={ClipboardList} />
        <StatCard label="Under review" value={(data ?? []).filter((c) => c.status === "Under Review" || c.status === "Submitted").length} icon={FileClock} tone="warning" />
        <StatCard label="Settled" value={(data ?? []).filter((c) => c.status === "Settled").length} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected" value={(data ?? []).filter((c) => c.status === "Rejected").length} icon={XCircle} tone="danger" />
      </StatGrid>

      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.claimNumber} ${nameOfCustomer(r.customerId)} ${r.type} ${r.status}`}
        searchPlaceholder="Search claims"
        exportable
      />

      {/* Adjudication Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={(open) => !open && setSelectedClaim(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjudicate Claim: {selectedClaim?.claimNumber}</DialogTitle>
            <DialogDescription>
              Policy: {selectedClaim ? policyNumberOf(selectedClaim.policyId) : "—"} · Claimed: {selectedClaim ? inr(selectedClaim.amount) : "—"}
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <form onSubmit={handleSaveAdjudication} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="adj-status">Adjudication Decision <span className="text-destructive">*</span></Label>
                <select
                  id="adj-status"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Documents Verified">Documents Verified</option>
                  <option value="Approved">Approved</option>
                  <option value="Settled">Settled (Disbursed)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {(status === "Approved" || status === "Settled") && (
                <div className="space-y-1.5">
                  <Label htmlFor="adj-amt">Approved Settlement Amount (₹) <span className="text-destructive">*</span></Label>
                  <Input
                    id="adj-amt"
                    type="number"
                    min={1}
                    required
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="adj-remarks">Assessor Remarks / Reason <span className="text-destructive">*</span></Label>
                <Textarea
                  id="adj-remarks"
                  rows={3}
                  required
                  placeholder="e.g. Hospital bills audited. Approved according to policy sub-limits."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedClaim(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    "Confirm Decision"
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
