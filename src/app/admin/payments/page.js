"use client";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, CreditCard, RefreshCw, AlertTriangle } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { paymentColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { paymentService, nameOfCustomer } from "@/services";
import { inr } from "@/lib/format";

export default function AdminPaymentsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["payments-all"], queryFn: () => paymentService.list() });
  const ok = (data ?? []).filter((p) => p.status === "Successful");
  return (
    <PortalPage role="ADMIN" title="Payments" description="Premium collections across gateways and payment methods.">
      <StatGrid>
        <StatCard label="Collected" value={inr(ok.reduce((s, p) => s + p.amount, 0), true)} icon={IndianRupee} tone="success" />
        <StatCard label="Transactions" value={data?.length ?? 0} icon={CreditCard} />
        <StatCard label="Failed" value={(data ?? []).filter((p) => p.status === "Failed").length} icon={AlertTriangle} tone="danger" />
        <StatCard label="Refunds" value={(data ?? []).filter((p) => p.type === "Refund").length} icon={RefreshCw} tone="warning" />
      </StatGrid>
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={paymentColumns({ customer: true })}
        searchKeys={(r) => `${r.transactionId} ${nameOfCustomer(r.customerId)} ${r.method} ${r.gateway} ${r.status}`} searchPlaceholder="Search transactions" exportable />
    </PortalPage>
  );
}
