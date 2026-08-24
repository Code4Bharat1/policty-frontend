"use client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { policyService, nameOfCompany } from "@/services";
import { daysUntil } from "@/lib/format";

export default function CustomerRenewalsPage() {
  const { user } = useAuth();
  const customerId = user?.linkedId || user?.id;
  const scope = customerId ? { customerId } : {};

  const { data, isLoading } = useQuery({
    queryKey: ["renewals", customerId],
    queryFn: () => policyService.renewals(scope),
    enabled: !!user,
  });

  const columns = [
    ...policyColumns(),
    {
      key: "action",
      header: "Action",
      cell: (r) => (
        <Button size="sm" onClick={() => toast.success(`Renewal initiated for ${r.policyNumber}.`)}>
          {daysUntil(r.expiryDate) < 0 ? "Reinstate" : "Renew"}
        </Button>
      ),
    },
  ];

  return (
    <PortalPage role="CUSTOMER" title="Renewals" description="Policies expiring soon or already lapsed. Renew before expiry to retain continuity benefits.">
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.policyNumber} ${r.planName} ${nameOfCompany(r.companyId)}`}
        searchPlaceholder="Search renewals"
        emptyTitle="Nothing due"
        emptyDescription="No policy is expiring in the near term."
      />
    </PortalPage>
  );
}
