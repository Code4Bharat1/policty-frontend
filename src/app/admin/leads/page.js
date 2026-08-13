"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { leadColumns } from "@/components/app/columns";
import { leadService, nameOfAgent } from "@/services";

export default function AdminLeadsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["leads-all"], queryFn: () => leadService.list() });
  const columns = [...leadColumns];
  columns.splice(1, 0, { key: "agent", header: "Advisor", hideOnMobile: true, sortValue: (r) => nameOfAgent(r.agentId), cell: (r) => nameOfAgent(r.agentId) });
  return (
    <PortalPage role="ADMIN" title="CRM / Leads" description="Enquiry funnel across the whole distribution network.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={columns}
        searchKeys={(r) => `${r.name} ${r.phone} ${r.interest} ${r.stage} ${nameOfAgent(r.agentId)}`} searchPlaceholder="Search leads" exportable />
    </PortalPage>
  );
}
