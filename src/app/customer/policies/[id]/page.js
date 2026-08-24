"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileWarning } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DetailList, EmptyState, LoadingRows, SectionCard } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { policyService, nameOfAgent, nameOfCompany, nameOfProduct } from "@/services";
import { formatDate, inr } from "@/lib/format";

export default function PolicyDetailPage() {
  const params = useParams();
  const id = params.id;
  const { data, isLoading } = useQuery({ queryKey: ["policy", id], queryFn: () => policyService.get(id) });

  return (
    <PortalPage
      role="CUSTOMER"
      eyebrow="Policy"
      title={data?.policyNumber ?? "Policy details"}
      description={data ? `${data.planName} · ${nameOfCompany(data.companyId)}` : undefined}
      actions={
        <>
          <Button variant="outline" onClick={() => toast.success("Policy schedule download started.")}>Download schedule</Button>
          <Button asChild><Link href="/customer/renewals">Renew</Link></Button>
        </>
      }
    >
      {isLoading ? (
        <LoadingRows rows={5} />
      ) : !data ? (
        <EmptyState icon={FileWarning} title="Policy not found" description="This policy is not available on your account." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard className="lg:col-span-2" title="Cover summary" action={<StatusBadge status={data.status} />}>
            <DetailList
              items={[
                { label: "Product", value: nameOfProduct(data.productId) },
                { label: "Insurer", value: nameOfCompany(data.companyId) },
                { label: "Category", value: <span className="capitalize">{data.category}</span> },
                { label: "Plan", value: data.planName },
                { label: "Sum insured", value: inr(data.sumInsured) },
                { label: "Annual premium", value: inr(data.premium) },
                { label: "Start date", value: formatDate(data.startDate) },
                { label: "Expiry date", value: formatDate(data.expiryDate) },
                { label: "Servicing advisor", value: nameOfAgent(data.agentId) },
              ]}
            />
          </SectionCard>
          <div className="space-y-6">
            <SectionCard title="Nominees">
              {(data.nominees || []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No nominees registered for this policy.</p>
              ) : (
                <ul className="space-y-3">
                  {(data.nominees || []).map((n, idx) => (
                    <li key={n.name || idx} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold text-foreground">{n.name}</p>
                      <p className="text-xs text-muted-foreground">{n.relation} · {n.share}% share</p>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
            <SectionCard title="Quick actions">
              <div className="grid gap-2">
                <Button variant="outline" asChild><Link href="/customer/claims">File a claim</Link></Button>
                <Button variant="outline" asChild><Link href="/customer/documents">View documents</Link></Button>
                <Button variant="outline" asChild><Link href="/customer/support">Contact advisor</Link></Button>
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </PortalPage>
  );
}
