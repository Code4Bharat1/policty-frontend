"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { policyService, nameOfCustomer } from "@/services";

export default function AdminRenewalsPage() {
  const [renewingId, setRenewingId] = useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["renewals-all"],
    queryFn: () => policyService.renewals(),
  });

  const handleRenewPolicy = async (policy) => {
    setRenewingId(policy.id);
    try {
      await policyService.renew(policy.id);
      toast.success(`Policy ${policy.policyNumber} renewed for 1 year in database.`);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to renew policy.");
    } finally {
      setRenewingId(null);
    }
  };

  const columns = [
    ...policyColumns({ customer: true, agent: true }),
    {
      key: "action",
      header: "Action",
      cell: (r) => (
        <Button
          size="sm"
          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={renewingId === r.id}
          onClick={(e) => {
            e.stopPropagation();
            handleRenewPolicy(r);
          }}
        >
          <RefreshCw className={`mr-1 size-3.5 ${renewingId === r.id ? "animate-spin" : ""}`} /> Renew Policy
        </Button>
      ),
    },
  ];

  return (
    <PortalPage
      role="ADMIN"
      title="Renewals"
      description="Persistency watchlist and policy extension manager across all advisors."
    >
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
