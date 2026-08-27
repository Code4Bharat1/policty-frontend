"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
          <Link
            href={`/checkout?productId=${r.productId || "PR-1001"}&planName=${encodeURIComponent(r.planName)}&sumInsured=${r.sumInsured}&premium=${r.premium}&category=${r.category}&isRenewal=true`}
          >
            {daysUntil(r.expiryDate) < 0 ? "Reinstate" : "⚡ Renew Online"}
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <PortalPage
      role="CUSTOMER"
      title="Renewals"
      description="Policies expiring soon or already lapsed. Renew before expiry to retain continuity benefits."
    >
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
