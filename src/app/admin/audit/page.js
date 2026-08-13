"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { auditColumns } from "@/components/app/columns";
import { auditService } from "@/services";

export default function AdminAuditPage() {
  const { data, isLoading } = useQuery({ queryKey: ["audit"], queryFn: auditService.list });
  return (
    <PortalPage role="ADMIN" title="Audit logs" description="Who did what, when and from where.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={auditColumns}
        searchKeys={(r) => `${r.user} ${r.action} ${r.module} ${r.ip}`} searchPlaceholder="Search audit trail" exportable pageSize={12} />
    </PortalPage>
  );
}
