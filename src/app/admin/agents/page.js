"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { StatusBadge } from "@/components/app/status-badge";
import { agentService } from "@/services";
import { inr } from "@/lib/format";

export default function AdminAgentsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["performance"], queryFn: agentService.performance });
  const columns = [
    { key: "name", header: "Advisor", sortValue: (r) => r.agent.name, cell: (r) => (
        <div><p className="font-semibold text-foreground">{r.agent.name}</p><p className="text-xs text-muted-foreground">{r.agent.code} · {r.agent.city}</p></div>
      ) },
    { key: "policies", header: "Policies", sortValue: (r) => r.policies, cell: (r) => r.policies },
    { key: "premium", header: "Premium", sortValue: (r) => r.premium, cell: (r) => inr(r.premium, true) },
    { key: "conv", header: "Conversions", hideOnMobile: true, sortValue: (r) => r.conversions, cell: (r) => `${r.conversions}/${r.leads}` },
    { key: "commission", header: "Commission", sortValue: (r) => r.commission, cell: (r) => inr(r.commission, true) },
    { key: "status", header: "Status", sortValue: (r) => r.agent.status, cell: (r) => <StatusBadge status={r.agent.status} /> },
  ];
  return (
    <PortalPage role="ADMIN" title="Advisors" description="Distribution network performance and status.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.agent.id} columns={columns}
        searchKeys={(r) => `${r.agent.name} ${r.agent.code} ${r.agent.city}`} searchPlaceholder="Search advisors" exportable />
    </PortalPage>
  );
}
