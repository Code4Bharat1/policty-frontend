"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserCheck, Mail, Phone, MapPin, ArrowLeft, Award, Star } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DetailList, EmptyState, LoadingRows, SectionCard } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { agentService, policyService, customerService } from "@/services";
import { formatDate, inr } from "@/lib/format";

export default function AdminAgentDetailPage() {
  const params = useParams();
  const id = params.id;

  const { data: agent, isLoading: agentLoading } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => agentService.get(id),
  });

  const { data: policies } = useQuery({
    queryKey: ["agent-policies", id],
    queryFn: () => policyService.list({ agentId: id }),
    enabled: Boolean(id),
  });

  const { data: customers } = useQuery({
    queryKey: ["agent-customers", id],
    queryFn: () => customerService.list(id),
    enabled: Boolean(id),
  });

  const totalPremium = policies ? policies.reduce((s, p) => s + (p.premium || 0), 0) : 0;

  return (
    <PortalPage
      role="ADMIN"
      eyebrow="Advisor Management"
      title={agent?.name ?? "Advisor profile"}
      description={agent ? `${agent.code || agent.id} · ${agent.branch || "Head Office"}` : undefined}
      actions={
        <Button variant="outline" asChild>
          <Link href="/admin/agents">
            <ArrowLeft className="mr-2 size-4" /> Back to advisors
          </Link>
        </Button>
      }
    >
      {agentLoading ? (
        <LoadingRows rows={5} />
      ) : !agent ? (
        <EmptyState icon={UserCheck} title="Advisor not found" description="No advisor with this ID exists." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="Advisor Credentials"
            action={<StatusBadge status={agent.status || "Active"} />}
          >
            <DetailList
              items={[
                { label: "Advisor code", value: agent.code || agent.id },
                { label: "Full name", value: agent.name },
                { label: "Email address", value: agent.email },
                { label: "Phone number", value: agent.phone || "—" },
                { label: "Branch / Region", value: agent.branch || "Mumbai" },
                {
                  label: "Advisor rating",
                  value: (
                    <div className="flex items-center gap-1.5 font-semibold text-amber-600">
                      <Star className="size-4 fill-amber-500 text-amber-500" />
                      {agent.rating || 4.8} / 5.0
                    </div>
                  ),
                },
                { label: "Joined platform", value: formatDate(agent.joinedDate || "2025-06-01") },
              ]}
            />
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Book Overview">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-2xl font-bold text-foreground">{customers?.length ?? 0}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Assigned Customers</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-2xl font-bold text-foreground">{policies?.length ?? 0}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Policies Written</p>
                </div>
                <div className="col-span-2 rounded-lg bg-accent/10 p-3 text-center">
                  <p className="text-xl font-extrabold text-accent-foreground">{inr(totalPremium)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Premium Under Management</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Advisor Contact">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{agent.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{agent.phone || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{agent.branch || "Mumbai"}</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </PortalPage>
  );
}
