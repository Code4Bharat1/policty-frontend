"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { claimColumns } from "@/components/app/columns";
import { useAuth } from "@/lib/auth";
import { claimService, nameOfCustomer } from "@/services";

export default function AgentClaimsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId ?? "";
  const { data, isLoading } = useQuery({ queryKey: ["agent-claims", agentId], queryFn: () => claimService.list({ agentId }), enabled: !!agentId });

  return (
    <PortalPage role="AGENT" title="Claims" description="Support your customers through assessment and settlement.">
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={claimColumns({ customer: true })}
        searchKeys={(r) => `${r.claimNumber} ${nameOfCustomer(r.customerId)} ${r.type} ${r.status}`}
        searchPlaceholder="Search claims"
        exportable
      />
    </PortalPage>
  );
}
