"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { customerColumns } from "@/components/app/columns";
import { customerService, nameOfAgent } from "@/services";

export default function AdminCustomersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["customers"], queryFn: () => customerService.list() });
  return (
    <PortalPage role="ADMIN" title="Customers" description="Master customer register across all advisors.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={customerColumns}
        searchKeys={(r) => `${r.name} ${r.email} ${r.phone} ${r.city} ${nameOfAgent(r.agentId)}`} searchPlaceholder="Search customers" exportable />
    </PortalPage>
  );
}
