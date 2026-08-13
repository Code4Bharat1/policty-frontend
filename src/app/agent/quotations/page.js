"use client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { quoteColumns } from "@/components/app/columns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { quoteService, nameOfCustomer, nameOfProduct } from "@/services";

export default function AgentQuotationsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId ?? "";
  const { data, isLoading } = useQuery({ queryKey: ["agent-quotes", agentId], queryFn: () => quoteService.list({ agentId }), enabled: !!agentId });

  const columns = [
    ...quoteColumns({ customer: true }),
    { key: "action", header: "", cell: (r) => <Button size="sm" variant="outline" onClick={() => toast.success(`Quotation ${r.quoteNumber} re-sent.`)}>Send</Button> },
  ];

  return (
    <PortalPage
      role="AGENT"
      title="Quotations"
      description="Quotes you have raised, with validity and customer response."
      actions={<Button onClick={() => toast.success("New quotation drafted.")}>New quotation</Button>}
    >
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.quoteNumber} ${nameOfCustomer(r.customerId)} ${nameOfProduct(r.productId)} ${r.status}`}
        searchPlaceholder="Search quotations"
        exportable
      />
    </PortalPage>
  );
}
