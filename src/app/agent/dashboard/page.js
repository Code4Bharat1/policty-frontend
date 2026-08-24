"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Percent, Shield, Target, Users } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { SectionCard, StatCard, StatGrid, EmptyState } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { commissionService, customerService, followUpService, leadService, policyService } from "@/services";
import { formatDate, inr } from "@/lib/format";

const stageColors = ["var(--color-secondary)", "var(--color-accent)", "var(--color-info)", "var(--color-warning)", "var(--color-success)", "var(--color-destructive)", "var(--color-muted-foreground)"];

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId || user?.id || "";
  const enabled = !!user;

  const { data: leads } = useQuery({ queryKey: ["leads", agentId], queryFn: () => leadService.list(agentId), enabled });
  const { data: policies } = useQuery({ queryKey: ["agent-policies", agentId], queryFn: () => policyService.list({ agentId }), enabled });
  const { data: customers } = useQuery({ queryKey: ["agent-customers", agentId], queryFn: () => customerService.list(agentId), enabled });
  const { data: commissions } = useQuery({ queryKey: ["commissions", agentId], queryFn: () => commissionService.list(agentId), enabled });
  const { data: followUps } = useQuery({ queryKey: ["followups", agentId], queryFn: () => followUpService.list(agentId), enabled });

  const stages = Array.from(
    (leads ?? []).reduce((m, l) => m.set(l.stage, (m.get(l.stage) ?? 0) + 1), new Map()),
    ([name, value]) => ({ name, value }),
  );

  const premiumByMonth = Array.from(
    (policies ?? []).reduce((m, p) => {
      const key = formatDate(p.startDate).slice(3, 6);
      return m.set(key, (m.get(key) ?? 0) + p.premium);
    }, new Map()),
  ).slice(0, 8).map(([label, premium]) => ({ label, premium }));

  const pending = (commissions ?? []).filter((c) => c.status === "Pending");

  return (
    <PortalPage
      role="AGENT"
      eyebrow={`Hello, ${user?.name ? user.name.split(" ")[0] : "Advisor"}`}
      title="Advisor dashboard"
      description="Your pipeline, portfolio and earnings at a glance."
      actions={<Button asChild><Link href="/agent/leads">Manage leads</Link></Button>}
    >
      <StatGrid>
        <StatCard label="Customers" value={customers?.length ?? 0} icon={Users} hint="Assigned to you" />
        <StatCard label="Active leads" value={(leads ?? []).filter((l) => l.stage !== "Converted" && l.stage !== "Lost").length} icon={Target} tone="accent" hint={`${leads?.length ?? 0} total leads`} />
        <StatCard label="Policies sold" value={policies?.length ?? 0} icon={Shield} tone="success" hint={inr((policies ?? []).reduce((s, p) => s + (p.premium || 0), 0), true) + " premium"} />
        <StatCard label="Commission pending" value={inr(pending.reduce((s, c) => s + (c.amount || 0), 0), true)} icon={Percent} tone="warning" hint={`${pending.length} entries`} />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Premium booked" description="Premium written by month.">
          {premiumByMonth.length === 0 ? (
            <EmptyState icon={Shield} title="No policies yet" description="Sold policies will be charted here." />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={premiumByMonth} margin={{ left: -12, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => inr(v, true)} />
                  <Tooltip formatter={(v) => inr(v)} />
                  <Bar dataKey="premium" fill="var(--color-secondary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Lead pipeline" description="Distribution by stage.">
          {stages.length === 0 ? (
            <EmptyState icon={Target} title="No leads" description="Assigned leads appear here." />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stages} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {stages.map((s, i) => (
                      <Cell key={s.name} fill={stageColors[i % stageColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Today's follow-ups" action={<Link href="/agent/followups" className="text-xs font-semibold text-secondary hover:underline">View all</Link>}>
          {(followUps ?? []).length === 0 ? (
            <EmptyState icon={Target} title="No pending follow-ups" description="All tasks are up to date." />
          ) : (
            <ul className="divide-y divide-border">
              {(followUps ?? []).slice(0, 5).map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.type} · {formatDate(f.date)} at {f.time}</p>
                  </div>
                  <StatusBadge status={f.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <SectionCard title="Hot leads" action={<Link href="/agent/leads" className="text-xs font-semibold text-secondary hover:underline">View all</Link>}>
          {(leads ?? []).length === 0 ? (
            <EmptyState icon={Target} title="No active leads" description="New prospect enquiries will appear here." />
          ) : (
            <ul className="divide-y divide-border">
              {(leads ?? []).filter((l) => l.priority === "High").slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{l.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">{l.interest} · {inr(l.estimatedPremium)}</p>
                  </div>
                  <StatusBadge status={l.stage} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </PortalPage>
  );
}
