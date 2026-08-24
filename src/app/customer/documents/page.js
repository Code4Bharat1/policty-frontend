"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, FileText } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { documentColumns } from "@/components/app/columns";
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
import { useAuth } from "@/lib/auth";
import { documentService } from "@/services";

export default function CustomerDocumentsPage() {
  const { user } = useAuth();
  const customerId = user?.linkedId || user?.id;
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Policy Documents");
  const [docName, setDocName] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["documents", customerId],
    queryFn: () => documentService.list(customerId ?? ""),
    enabled: !!user,
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", docName.trim() || file.name);
      formData.append("category", category);
      if (customerId) formData.append("customerId", customerId);

      await documentService.upload(formData);
      toast.success("Document uploaded successfully to your secure vault.");
      setFile(null);
      setDocName("");
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Upload failed. Only PDF, PNG, JPEG, and DOCX are allowed.");
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    ...documentColumns,
    {
      key: "action",
      header: "",
      cell: (r) => (
        <Button
          size="sm"
          variant="outline"
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
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <PortalPage
      role="CUSTOMER"
      title="Document vault"
      description="Securely stored documents linked to your policies and claims."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 size-4" /> Upload document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload a document</DialogTitle>
              <DialogDescription>
                Upload ID proofs, medical records, or claim bills in PDF, JPG, PNG or DOCX format (up to 10MB).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="doc-file">Choose file</Label>
                <Input
                  id="doc-file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  required
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    setFile(selected);
                    if (selected && !docName) setDocName(selected.name);
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-name">Document title</Label>
                <Input
                  id="doc-name"
                  placeholder="e.g. Hospital Discharge Summary"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-category">Document category</Label>
                <select
                  id="doc-category"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Policy Documents">Policy Documents</option>
                  <option value="Claim Bills & Receipts">Claim Bills & Receipts</option>
                  <option value="Identity Proofs (KYC)">Identity Proofs (KYC)</option>
                  <option value="Medical Reports">Medical Reports</option>
                  <option value="Vehicle Inspection">Vehicle Inspection</option>
                  <option value="Other Documents">Other Documents</option>
                </select>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Uploading…
                    </>
                  ) : (
                    "Upload to Vault"
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
        searchKeys={(r) => `${r.name} ${r.category} ${r.relatedEntity}`}
        searchPlaceholder="Search documents"
      />
    </PortalPage>
  );
}
