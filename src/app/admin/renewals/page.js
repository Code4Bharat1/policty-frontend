"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
import { policyService, nameOfCustomer } from "@/services";

export default function AdminRenewalsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["renewals-all"], queryFn: () => policyService.renewals() });
  return (
    <PortalPage role="ADMIN" title="Renewals" description="Persistency watchlist across every advisor.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={policyColumns({ customer: true, agent: true })}
        searchKeys={(r) => `${r.policyNumber} ${nameOfCustomer(r.customerId)} ${r.status}`} searchPlaceholder="Search renewals" exportable />
    </PortalPage>
  );
}
