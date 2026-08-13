"use client";
import { useQuery } from "@tanstack/react-query";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { catalogService, nameOfCompany } from "@/services";
import { inr } from "@/lib/format";

const columns = [
  { key: "name", header: "Product", sortValue: (r) => r.name, cell: (r) => (
      <div><p className="font-semibold text-foreground">{r.name}</p><p className="text-xs text-muted-foreground">{nameOfCompany(r.companyId)}</p></div>
    ) },
  { key: "category", header: "Category", sortValue: (r) => r.category, cell: (r) => <span className="capitalize">{r.category}</span> },
  { key: "planType", header: "Plan type", hideOnMobile: true, cell: (r) => r.planType },
  { key: "minPremium", header: "From", sortValue: (r) => r.minPremium, cell: (r) => inr(r.minPremium) },
  { key: "maxCoverage", header: "Max cover", sortValue: (r) => r.maxCoverage, cell: (r) => inr(r.maxCoverage, true) },
  { key: "rating", header: "Rating", sortValue: (r) => r.rating, cell: (r) => r.rating.toFixed(1) },
];

export default function AdminProductsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["products-all"], queryFn: () => catalogService.products() });
  return (
    <PortalPage role="ADMIN" title="Products" description="Everything published on the insurance marketplace.">
      <DataTable data={data} loading={isLoading} rowKey={(r) => r.id} columns={columns} searchKeys={(r) => `${r.name} ${r.category} ${nameOfCompany(r.companyId)}`} searchPlaceholder="Search products" exportable />
    </PortalPage>
  );
}
