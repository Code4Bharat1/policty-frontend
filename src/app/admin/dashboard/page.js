"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ClipboardList, IndianRupee, Shield, Users } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { SectionCard, StatCard, StatGrid, EmptyState } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { NotificationList } from "@/components/app/notification-list";
import { agentService, claimService, customerService, paymentService, policyService, reportService } from "@/services";
import { inr } from "@/lib/format";

export default function AdminDashboardPage() {
  const { data: customers } = useQuery({ queryKey: ["customers"], queryFn: () => customerService.list() });
  const { data: agents } = useQuery({ queryKey: ["agents"], queryFn: agentService.list });
  const { data: policies } = useQuery({ queryKey: ["policies-all"], queryFn: () => policyService.list() });
  const { data: claims } = useQuery({ queryKey: ["claims-all"], queryFn: () => claimService.list() });
  const { data: payments } = useQuery({ queryKey: ["payments-all"], queryFn: () => paymentService.list() });
  const { data: series } = useQuery({ queryKey: ["series"], queryFn: reportService.series });
  const { data: performance } = useQuery({ queryKey: ["performance"], queryFn: agentService.performance });

  const revenue = (payments ?? []).filter((p) => p.status === "Successful").reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <PortalPage role="ADMIN" title="Operations dashboard" description="Portfolio health, distribution performance and revenue in real time.">
      <StatGrid>
        <StatCard label="Customers" value={customers?.length ?? 0} icon={Users} tone="accent" />
        <StatCard label="Active policies" value={(policies ?? []).filter((p) => p.status === "Active").length} icon={Shield} tone="success" hint={`${policies?.length ?? 0} total`} />
        <StatCard label="Open claims" value={(claims ?? []).filter((c) => c.status !== "Settled" && c.status !== "Rejected").length} icon={ClipboardList} tone="warning" />
        <StatCard label="Collected premium" value={inr(revenue, true)} icon={IndianRupee} />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Premium and claims trend" description="Monthly performance across the book.">
          {(series ?? []).length === 0 ? (
            <EmptyState icon={IndianRupee} title="No trend data yet" description="Monthly transaction metrics will appear here as policies are booked." />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series ?? []} margin={{ left: -12, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => inr(v, true)} />
                  <Tooltip formatter={(v) => inr(v)} />
                  <Line type="monotone" dataKey="premium" stroke="var(--color-secondary)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="claims" stroke="var(--color-destructive)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
        <SectionCard title="Alerts">
          <NotificationList scope="ADMIN" />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Advisor performance" description="Premium written by advisor.">
          {(performance ?? []).length === 0 ? (
            <EmptyState icon={Users} title="No advisor metrics yet" description="Advisor sales and conversion rates will appear here." />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(performance ?? []).map((p) => ({ name: p.agent?.name?.split(" ")[0] || "Advisor", premium: p.premium || 0 }))} margin={{ left: -12, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => inr(v, true)} />
                  <Tooltip formatter={(v) => inr(v)} />
                  <Bar dataKey="premium" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
        <SectionCard title="Top advisors" description={`${agents?.length ?? 0} advisors active`} action={<Link href="/admin/agents" className="text-xs font-semibold text-secondary hover:underline">View all</Link>}>
          {(performance ?? []).length === 0 ? (
            <EmptyState icon={Users} title="No advisors" description="Provisioned advisors will appear here." />
          ) : (
            <ul className="divide-y divide-border">
              {(performance ?? []).slice(0, 6).map((p) => (
                <li key={p.agent?.id || p.agent?._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.agent?.name}</p>
                    <p className="text-xs text-muted-foreground">{p.policies || 0} policies · {inr(p.premium || 0, true)}</p>
                  </div>
                  <StatusBadge status={p.agent?.status || "Active"} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </PortalPage>
  );
}
