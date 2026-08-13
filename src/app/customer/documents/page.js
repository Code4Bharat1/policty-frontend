"use client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { documentColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { documentService } from "@/services";

export default function CustomerDocumentsPage() {
  const { user } = useAuth();
  const customerId = user?.linkedId;
  const { data, isLoading } = useQuery({
    queryKey: ["documents", customerId],
    queryFn: () => documentService.list(customerId ?? ""),
    enabled: !!customerId,
  });

  const columns = [
    ...documentColumns,
    { key: "action", header: "", cell: (r) => <Button size="sm" variant="outline" onClick={() => toast.success(`Downloading ${r.name}…`)}>Download</Button> },
  ];

  return (
    <PortalPage
      role="CUSTOMER"
      title="Document vault"
      description="Securely stored documents linked to your policies and claims."
      actions={<Button onClick={() => toast.success("Upload link opened.")}>Upload document</Button>}
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
