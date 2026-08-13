"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { documentColumns } from "@/components/app/columns";
import { documentService, nameOfCustomer } from "@/services";

export default function AdminDocumentsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["documents-all"], queryFn: () => documentService.list() });
  return (
    <PortalPage role="ADMIN" title="Documents" description="All uploaded files with owner and linked record.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={documentColumns}
        searchKeys={(r) => `${r.name} ${r.category} ${nameOfCustomer(r.customerId)} ${r.relatedEntity}`} searchPlaceholder="Search documents" exportable />
    </PortalPage>
  );
}
