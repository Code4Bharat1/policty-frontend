"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { leadColumns } from "@/components/app/columns";
import { SectionCard } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { leadService } from "@/services";
import { inr } from "@/lib/format";

const stages = ["New", "Contacted", "Qualified", "Quotation", "Negotiation", "Converted", "Lost"];

export default function AgentLeadsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId ?? "";
  const [view, setView] = useState("table");
  const { data, isLoading } = useQuery({ queryKey: ["leads", agentId], queryFn: () => leadService.list(agentId), enabled: !!agentId });

  const columns = [
    ...leadColumns,
    { key: "action", header: "", cell: (r) => <Button size="sm" variant="outline" onClick={() => toast.success(`Follow-up logged for ${r.name}.`)}>Log call</Button> },
  ];

  return (
    <PortalPage role="AGENT" title="Leads" description="Your pipeline from first enquiry to issued policy.">
      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="table">List</TabsTrigger>
          <TabsTrigger value="board">Pipeline board</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-4">
          <DataTable
            data={data}
            loading={isLoading}
            rowKey={(r) => r.id}
            columns={columns}
            searchKeys={(r) => `${r.name} ${r.email} ${r.phone} ${r.interest} ${r.stage}`}
            searchPlaceholder="Search leads"
            exportable
          />
        </TabsContent>
        <TabsContent value="board" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage) => {
              const items = (data ?? []).filter((l) => l.stage === stage);
              return (
                <SectionCard key={stage} title={stage} description={`${items.length} leads · ${inr(items.reduce((s, l) => s + l.estimatedPremium, 0), true)}`} contentClassName="space-y-3 p-4">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No leads in this stage.</p>
                  ) : (
                    items.map((l) => (
                      <div key={l.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{l.name}</p>
                          <StatusBadge status={l.priority} />
                        </div>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">{l.interest} · {l.source}</p>
                        <p className="mt-2 text-sm font-bold text-foreground">{inr(l.estimatedPremium)}</p>
                      </div>
                    ))
                  )}
                </SectionCard>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </PortalPage>
  );
}
