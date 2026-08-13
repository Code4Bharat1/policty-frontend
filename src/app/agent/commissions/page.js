"use client";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, Percent, Wallet } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { commissionColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { useAuth } from "@/lib/auth";
import { commissionService, nameOfCustomer, policyNumberOf } from "@/services";
import { inr } from "@/lib/format";

export default function AgentCommissionsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId ?? "";
  const { data, isLoading } = useQuery({ queryKey: ["commissions", agentId], queryFn: () => commissionService.list(agentId), enabled: !!agentId });

  const paid = (data ?? []).filter((c) => c.status === "Paid");
  const pending = (data ?? []).filter((c) => c.status === "Pending");

  return (
    <PortalPage role="AGENT" title="Commissions" description="What you have earned, what is due and on which policies.">
      <StatGrid>
        <StatCard label="Total earned" value={inr((data ?? []).reduce((s, c) => s + c.amount, 0), true)} icon={IndianRupee} tone="success" />
        <StatCard label="Paid out" value={inr(paid.reduce((s, c) => s + c.amount, 0), true)} icon={Wallet} />
        <StatCard label="Pending payout" value={inr(pending.reduce((s, c) => s + c.amount, 0), true)} icon={Wallet} tone="warning" />
        <StatCard label="Average rate" value={`${((data ?? []).reduce((s, c) => s + c.percentage, 0) / Math.max(1, (data ?? []).length)).toFixed(1)}%`} icon={Percent} />
      </StatGrid>
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={commissionColumns()}
        searchKeys={(r) => `${policyNumberOf(r.policyId)} ${nameOfCustomer(r.customerId)} ${r.month} ${r.status}`}
        searchPlaceholder="Search commissions"
        exportable
      />
    </PortalPage>
  );
}
