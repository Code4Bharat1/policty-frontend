"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { quoteColumns } from "@/components/app/columns";
import { quoteService, nameOfCustomer, nameOfProduct } from "@/services";

export default function AdminQuotesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["quotes-all"], queryFn: () => quoteService.list() });
  return (
    <PortalPage role="ADMIN" title="Quotations" description="Pipeline of quotes and their conversion status.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={quoteColumns({ customer: true })}
        searchKeys={(r) => `${r.quoteNumber} ${nameOfCustomer(r.customerId)} ${nameOfProduct(r.productId)} ${r.status}`} searchPlaceholder="Search quotes" exportable />
    </PortalPage>
  );
}
