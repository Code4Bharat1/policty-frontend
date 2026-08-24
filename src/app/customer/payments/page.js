"use client";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, IndianRupee, RefreshCw } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { paymentColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { useAuth } from "@/lib/auth";
import { paymentService, policyNumberOf } from "@/services";
import { inr } from "@/lib/format";

export default function CustomerPaymentsPage() {
  const { user } = useAuth();
  const customerId = user?.linkedId || user?.id;
  const scope = customerId ? { customerId } : {};

  const { data, isLoading } = useQuery({
    queryKey: ["payments", customerId],
    queryFn: () => paymentService.list(scope),
    enabled: !!user,
  });

  const paid = (data ?? []).filter((p) => p.status === "Successful");
  const pending = (data ?? []).filter((p) => p.status === "Pending");

  return (
    <PortalPage role="CUSTOMER" title="Payments" description="Every premium, renewal and refund transaction on your account.">
      <StatGrid>
        <StatCard label="Total paid" value={inr(paid.reduce((s, p) => s + (p.amount || 0), 0), true)} icon={IndianRupee} tone="success" />
        <StatCard label="Successful payments" value={paid.length} icon={CreditCard} />
        <StatCard label="Pending" value={pending.length} icon={RefreshCw} tone="warning" />
        <StatCard label="Refunds" value={(data ?? []).filter((p) => p.type === "Refund").length} icon={RefreshCw} />
      </StatGrid>
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={paymentColumns()}
        searchKeys={(r) => `${r.transactionId} ${policyNumberOf(r.policyId)} ${r.method} ${r.status}`}
        searchPlaceholder="Search transactions"
        exportable
      />
    </PortalPage>
  );
}
