"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { DollarSign, CheckCircle2, Clock, Banknote, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { commissionColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { commissionService, nameOfAgent, nameOfCustomer } from "@/services";
import { inr } from "@/lib/format";

export default function AdminCommissionsPage() {
  const [payingId, setPayingId] = useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["commissions-all"],
    queryFn: () => commissionService.list(),
  });

  const commissions = data ?? [];
  const totalAmount = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const paidAmount = commissions
    .filter((c) => c.status === "Paid")
    .reduce((sum, c) => sum + (c.amount || 0), 0);
  const pendingAmount = totalAmount - paidAmount;

  const handleMarkPaid = async (comm) => {
    setPayingId(comm.id);
    try {
      await commissionService.pay(comm.id);
      toast.success(`Commission payout for ${nameOfAgent(comm.agentId)} marked as Paid.`);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to disburse commission.");
    } finally {
      setPayingId(null);
    }
  };

  const columns = [
    ...commissionColumns({ agent: true }),
    {
      key: "actions",
      header: "Action",
      cell: (r) => (
        <div onClick={(e) => e.stopPropagation()}>
          {r.status === "Paid" ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <CheckCircle2 className="mr-1 size-3.5" /> Disbursed
            </span>
          ) : (
            <Button
              size="sm"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={payingId === r.id}
              onClick={() => handleMarkPaid(r)}
            >
              {payingId === r.id ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Banknote className="mr-1 size-3.5" />
              )}
              Disburse
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PortalPage
      role="ADMIN"
      title="Commissions Ledger"
      description="Advisor payout ledger by policy, conversion rate, and disbursement status."
    >
      <StatGrid>
        <StatCard label="Total Commission Ledger" value={inr(totalAmount)} icon={DollarSign} />
        <StatCard label="Disbursed / Paid" value={inr(paidAmount)} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending Payouts" value={inr(pendingAmount)} icon={Clock} tone="warning" />
      </StatGrid>

      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${nameOfAgent(r.agentId)} ${nameOfCustomer(r.customerId)} ${r.month} ${r.status}`}
        searchPlaceholder="Search commissions"
        exportable
      />
    </PortalPage>
  );
}
