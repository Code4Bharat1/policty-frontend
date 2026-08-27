"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Files, Download, Trash2, ShieldCheck, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { documentColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { documentService, nameOfCustomer } from "@/services";

export default function AdminDocumentsPage() {
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["documents-all"],
    queryFn: () => documentService.list(),
  });

  const docs = data ?? [];
  const policyDocs = docs.filter((d) => (d.category || "").toLowerCase().includes("policy")).length;
  const kycDocs = docs.filter((d) => (d.category || "").toLowerCase().includes("kyc") || (d.category || "").toLowerCase().includes("id")).length;
  const claimDocs = docs.filter((d) => (d.category || "").toLowerCase().includes("claim") || (d.category || "").toLowerCase().includes("bill")).length;

  const handleDelete = async () => {
    if (!docToDelete) return;
    setDeleting(true);
    try {
      await documentService.delete(docToDelete.id);
      toast.success(`Document ${docToDelete.name} deleted.`);
      setDocToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    ...documentColumns,
    {
      key: "actions",
      header: "Action",
      cell: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              const downloadUrl = r.fileUrl
                ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/documents/${r.id}/download`
                : null;
              if (downloadUrl) {
                window.open(downloadUrl, "_blank");
              } else {
                toast.success(`Downloading ${r.name}…`);
              }
            }}
            title="Download Document"
          >
            <Download className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="size-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => setDocToDelete(r)}
            title="Delete Document"
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
      title="Document Vault & Archives"
      description="Central master vault of all customer KYC, policy schedules, and claim documents."
    >
      <StatGrid>
        <StatCard label="Total Stored Files" value={docs.length} icon={Files} />
        <StatCard label="Policy Schedules" value={policyDocs} icon={FileText} tone="success" />
        <StatCard label="KYC & Identity Proofs" value={kycDocs} icon={ShieldCheck} tone="info" />
      </StatGrid>

      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.name} ${r.category} ${nameOfCustomer(r.customerId)} ${r.relatedEntity}`}
        searchPlaceholder="Search documents"
        exportable
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!docToDelete} onOpenChange={(open) => !open && setDocToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Delete Stored Document
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong>{docToDelete?.name}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocToDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Deleting…
                </>
              ) : (
                "Delete Document"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalPage>
  );
}
