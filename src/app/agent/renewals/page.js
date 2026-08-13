"use client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { policyService, nameOfCustomer } from "@/services";

export default function AgentRenewalsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId ?? "";
  const { data, isLoading } = useQuery({ queryKey: ["agent-renewals", agentId], queryFn: () => policyService.renewals({ agentId }), enabled: !!agentId });

  const columns = [
    ...policyColumns({ customer: true }),
    { key: "action", header: "", cell: (r) => <Button size="sm" variant="outline" onClick={() => toast.success(`Renewal reminder sent to ${nameOfCustomer(r.customerId)}.`)}>Remind</Button> },
  ];

  return (
    <PortalPage role="AGENT" title="Renewals" description="Protect persistency — chase these policies before they lapse.">
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.policyNumber} ${nameOfCustomer(r.customerId)} ${r.status}`}
        searchPlaceholder="Search renewals"
        exportable
      />
    </PortalPage>
  );
}
