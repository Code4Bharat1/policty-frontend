"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { customerColumns } from "@/components/app/columns";
import { useAuth } from "@/lib/auth";
import { customerService } from "@/services";

export default function AgentCustomersPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId ?? "";
  const { data, isLoading } = useQuery({ queryKey: ["agent-customers", agentId], queryFn: () => customerService.list(agentId), enabled: !!agentId });

  return (
    <PortalPage role="AGENT" title="My customers" description="Every household and business in your book of service.">
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={customerColumns}
        searchKeys={(r) => `${r.name} ${r.email} ${r.phone} ${r.city}`}
        searchPlaceholder="Search customers"
        exportable
      />
    </PortalPage>
  );
}
