"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { StatusBadge } from "@/components/app/status-badge";
import { catalogService } from "@/services";

const columns = [
  { key: "name", header: "Insurer", sortValue: (r) => r.name, cell: (r) => (
      <div><p className="font-semibold text-foreground">{r.name}</p><p className="text-xs text-muted-foreground">{r.shortName}</p></div>
    ) },
  { key: "email", header: "Contact", hideOnMobile: true, cell: (r) => `${r.email} · ${r.phone}` },
  { key: "csr", header: "Claim settlement", sortValue: (r) => r.claimSettlementRatio, cell: (r) => `${r.claimSettlementRatio}%` },
  { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
];

export default function AdminCompaniesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["companies"], queryFn: catalogService.companies });
  return (
    <PortalPage role="ADMIN" title="Insurance companies" description="Partner insurers available on the marketplace.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={columns} searchKeys={(r) => `${r.name} ${r.shortName}`} searchPlaceholder="Search insurers" />
    </PortalPage>
  );
}
