"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
import { policyService, nameOfCustomer } from "@/services";

export default function AdminPoliciesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["policies-all"], queryFn: () => policyService.list() });
  return (
    <PortalPage role="ADMIN" title="Policies" description="Every policy issued on the platform.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={policyColumns({ customer: true, agent: true })}
        searchKeys={(r) => `${r.policyNumber} ${nameOfCustomer(r.customerId)} ${r.planName} ${r.status}`} searchPlaceholder="Search policies" exportable />
    </PortalPage>
  );
}
