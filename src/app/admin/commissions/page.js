"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { commissionColumns } from "@/components/app/columns";
import { commissionService, nameOfAgent, nameOfCustomer } from "@/services";

export default function AdminCommissionsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["commissions-all"], queryFn: () => commissionService.list() });
  return (
    <PortalPage role="ADMIN" title="Commissions" description="Advisor payout ledger by policy and month.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={commissionColumns({ agent: true })}
        searchKeys={(r) => `${nameOfAgent(r.agentId)} ${nameOfCustomer(r.customerId)} ${r.month} ${r.status}`} searchPlaceholder="Search commissions" exportable />
    </PortalPage>
  );
}
