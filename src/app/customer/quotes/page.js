"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { quoteColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { quoteService, nameOfProduct } from "@/services";

export default function CustomerQuotesPage() {
  const { user } = useAuth();
  const customerId = user?.linkedId;
  const { data, isLoading } = useQuery({
    queryKey: ["quotes", customerId],
    queryFn: () => quoteService.list({ customerId: customerId ?? "" }),
    enabled: !!customerId,
  });

  return (
    <PortalPage
      role="CUSTOMER"
      title="Quotations"
      description="Track every quotation raised for you and accept the one that fits."
      actions={<Button asChild><Link href="/enquiry">Request a quote</Link></Button>}
    >
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={quoteColumns()}
        searchKeys={(r) => `${r.quoteNumber} ${nameOfProduct(r.productId)} ${r.status}`}
        searchPlaceholder="Search quotes"
        exportable
        emptyTitle="No quotations"
        emptyDescription="Request a quote and your advisor will respond within a working day."
      />
    </PortalPage>
  );
}
