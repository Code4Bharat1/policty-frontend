"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
import { useAuth } from "@/lib/auth";
import { policyService, nameOfCompany } from "@/services";

export default function CustomerPoliciesPage() {
  const { user } = useAuth();
  const customerId = user?.linkedId;
  const { data, isLoading } = useQuery({
    queryKey: ["policies", customerId],
    queryFn: () => policyService.list({ customerId: customerId ?? "" }),
    enabled: !!customerId,
  });

  return (
    <PortalPage role="CUSTOMER" title="My policies" description="All active, pending and past policies issued through Policy Care.">
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={policyColumns({ href: (p) => `/customer/policies/${p.id}` })}
        searchKeys={(r) => `${r.policyNumber} ${r.planName} ${nameOfCompany(r.companyId)} ${r.status}`}
        searchPlaceholder="Search policies"
        exportable
        emptyTitle="No policies yet"
        emptyDescription="Buy your first policy from the insurance marketplace."
      />
    </PortalPage>
  );
}
