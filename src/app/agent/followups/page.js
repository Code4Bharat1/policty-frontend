"use client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarCheck, CalendarClock, CalendarX } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { followUpColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { followUpService } from "@/services";

export default function AgentFollowUpsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId ?? "";
  const { data, isLoading } = useQuery({ queryKey: ["followups", agentId], queryFn: () => followUpService.list(agentId), enabled: !!agentId });

  const columns = [
    ...followUpColumns,
    { key: "action", header: "", cell: (r) => <Button size="sm" variant="outline" onClick={() => toast.success(`"${r.title}" marked complete.`)}>Complete</Button> },
  ];

  return (
    <PortalPage
      role="AGENT"
      title="Follow-ups"
      description="Never miss a callback, renewal chase or payment reminder."
      actions={<Button onClick={() => toast.success("New task scheduled.")}>Schedule task</Button>}
    >
      <StatGrid>
        <StatCard label="Pending" value={(data ?? []).filter((f) => f.status === "Pending").length} icon={CalendarClock} tone="warning" />
        <StatCard label="Completed" value={(data ?? []).filter((f) => f.status === "Completed").length} icon={CalendarCheck} tone="success" />
        <StatCard label="Missed" value={(data ?? []).filter((f) => f.status === "Missed").length} icon={CalendarX} tone="danger" />
        <StatCard label="High priority" value={(data ?? []).filter((f) => f.priority === "High").length} icon={CalendarClock} tone="accent" />
      </StatGrid>
      <DataTable
        data={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={columns}
        searchKeys={(r) => `${r.title} ${r.type} ${r.status}`}
        searchPlaceholder="Search tasks"
      />
    </PortalPage>
  );
}
