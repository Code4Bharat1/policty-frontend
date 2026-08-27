"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw, BellRing } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { policyColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { policyService, nameOfCustomer } from "@/services";

export default function AgentRenewalsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId || user?.id || "";
  const [renewingId, setRenewingId] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["agent-renewals", agentId],
    queryFn: () => policyService.renewals({ agentId }),
    enabled: !!agentId,
  });

  const handleInstantRenew = async (policy) => {
    setRenewingId(policy.id);
    try {
      await policyService.renew(policy.id);
      toast.success(`Policy ${policy.policyNumber} renewed for 1 full year.`);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to renew policy.");
    } finally {
      setRenewingId(null);
    }
  };

  const columns = [
    ...policyColumns({ customer: true }),
    {
      key: "action",
      header: "Action",
      cell: (r) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => toast.success(`SMS & Email renewal reminder sent to ${nameOfCustomer(r.customerId)}.`)}
          >
            <BellRing className="mr-1 size-3.5" /> Remind
          </Button>
          <Button
            size="sm"
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={renewingId === r.id}
            onClick={() => handleInstantRenew(r)}
          >
            <RefreshCw className={`mr-1 size-3.5 ${renewingId === r.id ? "animate-spin" : ""}`} /> Renew
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PortalPage
      role="AGENT"
      title="Renewals"
      description="Protect persistency — chase renewals and extend policy tenure seamlessly."
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
