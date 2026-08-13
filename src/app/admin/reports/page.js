"use client";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PortalPage } from "@/components/app/portal-page";
import { SectionCard } from "@/components/app/primitives";
import { agentService, reportService } from "@/services";
import { inr } from "@/lib/format";

export default function AdminReportsPage() {
  const { data: series } = useQuery({ queryKey: ["series"], queryFn: reportService.series });
  const { data: performance } = useQuery({ queryKey: ["performance"], queryFn: agentService.performance });
  return (
    <PortalPage role="ADMIN" title="Reports" description="Business intelligence across revenue, claims and distribution.">
      <SectionCard title="Premium collected" description="Month on month.">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series ?? []} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => inr(v, true)} />
              <Tooltip formatter={(v) => inr(v)} />
              <Area type="monotone" dataKey="premium" stroke="var(--color-secondary)" fill="var(--color-secondary)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
      <SectionCard title="Advisor productivity" description="Policies issued per advisor.">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={(performance ?? []).map((p) => ({ name: p.agent.name.split(" ")[0], policies: p.policies, conversions: p.conversions }))} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="policies" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="conversions" fill="var(--color-secondary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </PortalPage>
  );
}
