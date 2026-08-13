"use client";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, CheckCircle2, XCircle, FileClock } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { claimColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { claimService, nameOfCustomer } from "@/services";

export default function AdminClaimsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["claims-all"], queryFn: () => claimService.list() });
  return (
    <PortalPage role="ADMIN" title="Claims" description="Every claim in assessment, approved, rejected or settled.">
      <StatGrid>
        <StatCard label="Total claims" value={data?.length ?? 0} icon={ClipboardList} />
        <StatCard label="Under review" value={(data ?? []).filter((c) => c.status === "Under Review").length} icon={FileClock} tone="warning" />
        <StatCard label="Settled" value={(data ?? []).filter((c) => c.status === "Settled").length} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected" value={(data ?? []).filter((c) => c.status === "Rejected").length} icon={XCircle} tone="danger" />
      </StatGrid>
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={claimColumns({ customer: true })}
        searchKeys={(r) => `${r.claimNumber} ${nameOfCustomer(r.customerId)} ${r.type} ${r.status}`} searchPlaceholder="Search claims" exportable />
    </PortalPage>
  );
}
