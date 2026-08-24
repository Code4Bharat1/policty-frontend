"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, FileWarning, ArrowLeft, Download } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DetailList, EmptyState, LoadingRows, SectionCard } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { policyService, nameOfCustomer, nameOfAgent, nameOfCompany, nameOfProduct } from "@/services";
import { formatDate, inr } from "@/lib/format";
import { toast } from "sonner";

export default function AdminPolicyDetailPage() {
  const params = useParams();
  const id = params.id;

  const { data: policy, isLoading } = useQuery({
    queryKey: ["admin-policy", id],
    queryFn: () => policyService.get(id),
  });

  return (
    <PortalPage
      role="ADMIN"
      eyebrow="Policy Master"
      title={policy?.policyNumber ?? "Policy details"}
      description={policy ? `${policy.planName} · ${nameOfCompany(policy.companyId)}` : undefined}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/policies">
              <ArrowLeft className="mr-2 size-4" /> Back to policies
            </Link>
          </Button>
          <Button variant="secondary" onClick={() => toast.success("Policy certificate generated.")}>
            <Download className="mr-2 size-4" /> Certificate
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <LoadingRows rows={5} />
      ) : !policy ? (
        <EmptyState icon={FileWarning} title="Policy not found" description="No policy matches this identifier." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="Coverage & Financial Specifications"
            action={<StatusBadge status={policy.status} />}
          >
            <DetailList
              items={[
                { label: "Policy number", value: policy.policyNumber },
                { label: "Policyholder", value: nameOfCustomer(policy.customerId) },
                { label: "Servicing advisor", value: nameOfAgent(policy.agentId) },
                { label: "Underwriting company", value: nameOfCompany(policy.companyId) },
                { label: "Product line", value: nameOfProduct(policy.productId) },
                { label: "Category", value: <span className="capitalize">{policy.category}</span> },
                { label: "Plan Tier", value: policy.planName },
                { label: "Sum insured (Coverage)", value: inr(policy.sumInsured) },
                { label: "Annual gross premium", value: inr(policy.premium) },
                { label: "Effective start date", value: formatDate(policy.startDate) },
                { label: "Policy expiry date", value: formatDate(policy.expiryDate) },
              ]}
            />
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Nominee Designation">
              {!policy.nominees || policy.nominees.length === 0 ? (
                <p className="text-xs text-muted-foreground">No nominees designated.</p>
              ) : (
                <ul className="space-y-3">
                  {policy.nominees.map((n, idx) => (
                    <li key={idx} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold">{n.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {n.relation} · {n.share ?? 100}% share
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard title="Underwriting Status">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={policy.status} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Policy ID</span>
                  <span className="font-mono text-xs">{policy.id}</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </PortalPage>
  );
}
