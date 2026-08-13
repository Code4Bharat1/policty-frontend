"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
import { useAuth } from "@/lib/auth";
import { policyService, nameOfCustomer } from "@/services";

export default function AgentPoliciesPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId ?? "";
  const { data, isLoading } = useQuery({ queryKey: ["agent-policies", agentId], queryFn: () => policyService.list({ agentId }), enabled: !!agentId });

  return (
    <PortalPage role="AGENT" title="Policies" description="Your issued book of business across all insurers.">
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={policyColumns({ customer: true })}
        searchKeys={(r) => `${r.policyNumber} ${nameOfCustomer(r.customerId)} ${r.planName} ${r.status}`}
        searchPlaceholder="Search policies"
        exportable
      />
    </PortalPage>
  );
}
