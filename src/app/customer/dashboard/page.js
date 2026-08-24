"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ClipboardList, CreditCard, RefreshCw, Shield } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { SectionCard, StatCard, StatGrid, LoadingRows, EmptyState } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { NotificationList } from "@/components/app/notification-list";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { claimService, paymentService, policyService } from "@/services";
import { formatDate, inr } from "@/lib/format";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const customerId = user?.linkedId || user?.id;
  const scope = customerId ? { customerId } : {};

  const { data: policies, isLoading } = useQuery({
    queryKey: ["policies", customerId],
    queryFn: () => policyService.list(scope),
    enabled: !!user,
  });

  const { data: claims } = useQuery({
    queryKey: ["claims", customerId],
    queryFn: () => claimService.list(scope),
    enabled: !!user,
  });

  const { data: payments } = useQuery({
    queryKey: ["payments", customerId],
    queryFn: () => paymentService.list(scope),
    enabled: !!user,
  });

  const active = (policies ?? []).filter((p) => p.status === "Active");
  const renewals = (policies ?? []).filter((p) => p.status === "Expiring Soon" || p.status === "Expired");
  const openClaims = (claims ?? []).filter((c) => c.status !== "Settled" && c.status !== "Rejected");
  const coverage = (policies ?? []).reduce((s, p) => s + (p.sumInsured || 0), 0);

  const series = (payments ?? [])
    .filter((p) => p.status === "Successful")
    .slice(0, 8)
    .map((p) => ({ label: formatDate(p.date || p.createdAt).slice(0, 6), amount: p.amount || 0 }))
    .reverse();

  return (
    <PortalPage
      role="CUSTOMER"
      eyebrow={`Welcome back, ${user?.name ? user.name.split(" ")[0] : "Customer"}`}
      title="Your insurance at a glance"
      description="Cover, renewals, claims and payments across every policy you hold with Policy Care."
      actions={
        <Button asChild>
          <Link href="/customer/insurance">Buy new cover</Link>
        </Button>
      }
    >
      <StatGrid>
        <StatCard label="Active policies" value={active.length} icon={Shield} tone="success" hint={`${policies?.length ?? 0} total policies`} />
        <StatCard label="Total sum insured" value={inr(coverage, true)} icon={Shield} hint="Across all products" />
        <StatCard label="Open claims" value={openClaims.length} icon={ClipboardList} tone="warning" hint={`${claims?.length ?? 0} claims filed`} />
        <StatCard label="Renewals due" value={renewals.length} icon={RefreshCw} tone="danger" hint="Next 45 days" />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Premium payments" description="Successful transactions over recent months.">
          {series.length === 0 ? (
            <EmptyState icon={CreditCard} title="No payments yet" description="Your premium payment transactions will be charted here." />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ left: -12, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="premiumFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => inr(v, true)} />
                  <Tooltip formatter={(v) => inr(v)} />
                  <Area type="monotone" dataKey="amount" stroke="var(--color-accent)" strokeWidth={2} fill="url(#premiumFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Upcoming renewals" description="Keep your cover unbroken." action={<Link href="/customer/renewals" className="text-xs font-semibold text-secondary hover:underline">View all</Link>}>
          {isLoading ? (
            <LoadingRows rows={3} />
          ) : renewals.length === 0 ? (
            <EmptyState icon={RefreshCw} title="Nothing due" description="No policy is expiring in the near term." />
          ) : (
            <ul className="space-y-3">
              {renewals.slice(0, 4).map((p) => (
                <li key={p.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{p.policyNumber}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.planName} · expires {formatDate(p.expiryDate)}</p>
                  <p className="mt-2 text-sm font-bold text-foreground">{inr(p.premium)}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Recent claims" action={<Link href="/customer/claims" className="text-xs font-semibold text-secondary hover:underline">View all</Link>}>
          {(claims ?? []).length === 0 ? (
            <EmptyState icon={ClipboardList} title="No claims" description="You have not filed any claim yet." />
          ) : (
            <ul className="divide-y divide-border">
              {(claims ?? []).slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <Link href={`/customer/claims/${c.id}`} className="text-sm font-semibold text-foreground hover:underline">{c.claimNumber}</Link>
                    <p className="text-xs text-muted-foreground">{c.type} · {inr(c.amount)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <SectionCard title="Notifications">
          <NotificationList scope="CUSTOMER" />
        </SectionCard>
      </div>
    </PortalPage>
  );
}
