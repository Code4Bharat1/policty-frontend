"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileWarning } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DetailList, EmptyState, LoadingRows, SectionCard, Timeline } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { claimService, nameOfAgent, policyNumberOf } from "@/services";
import { formatDate, inr } from "@/lib/format";

export default function ClaimDetailPage() {
  const params = useParams();
  const id = params.id;
  const { data, isLoading } = useQuery({ queryKey: ["claim", id], queryFn: () => claimService.get(id) });

  return (
    <PortalPage
      role="CUSTOMER"
      eyebrow="Claim"
      title={data?.claimNumber ?? "Claim details"}
      description={data ? `${data.type} · policy ${policyNumberOf(data.policyId)}` : undefined}
      actions={<Button variant="outline" onClick={() => toast.success("Document upload link sent to your email.")}>Upload documents</Button>}
    >
      {isLoading ? (
        <LoadingRows rows={5} />
      ) : !data ? (
        <EmptyState icon={FileWarning} title="Claim not found" description="This claim is not available on your account." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard title="Claim summary" action={<StatusBadge status={data.status} />}>
              <DetailList
                items={[
                  { label: "Policy", value: <Link href={`/customer/policies/${data.policyId}`} className="underline-offset-4 hover:underline">{policyNumberOf(data.policyId)}</Link> },
                  { label: "Claim type", value: data.type },
                  { label: "Amount claimed", value: inr(data.amount) },
                  { label: "Amount approved", value: data.approvedAmount ? inr(data.approvedAmount) : "Pending assessment" },
                  { label: "Submitted on", value: formatDate(data.submittedOn) },
                  { label: "Handling advisor", value: nameOfAgent(data.agentId) },
                ]}
              />
              <p className="mt-5 text-sm text-muted-foreground">{data.description}</p>
            </SectionCard>
            <SectionCard title="Assessor remarks">
              <p className="text-sm text-muted-foreground">{data.remarks}</p>
            </SectionCard>
          </div>
          <SectionCard title="Claim timeline" description="Live status of your assessment.">
            <Timeline items={data.timeline.map((t) => ({ label: t.label, date: formatDate(t.date), done: t.done, note: t.note }))} />
          </SectionCard>
        </div>
      )}
    </PortalPage>
  );
}
