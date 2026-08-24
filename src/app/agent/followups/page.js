"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarCheck, CalendarClock, CalendarX, PlusCircle, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DataTable } from "@/components/app/data-table";
import { followUpColumns } from "@/components/app/columns";
import { StatCard, StatGrid } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { followUpService } from "@/services";

export default function AgentFollowUpsPage() {
  const { user } = useAuth();
  const agentId = user?.linkedId || user?.id || "";
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "Call",
    date: new Date().toISOString().slice(0, 10),
    time: "11:00 AM",
    priority: "Medium",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["followups", agentId],
    queryFn: () => followUpService.list(agentId),
    enabled: !!user,
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Please enter a task title.");
      return;
    }

    setSaving(true);
    try {
      await followUpService.create({
        agentId: agentId || undefined,
        title: form.title.trim(),
        type: form.type,
        date: form.date,
        time: form.time,
        priority: form.priority,
        status: "Pending",
      });

      toast.success("Task scheduled successfully.");
      setForm({
        title: "",
        type: "Call",
        date: new Date().toISOString().slice(0, 10),
        time: "11:00 AM",
        priority: "Medium",
      });
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to schedule task.");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async (task) => {
    try {
      await followUpService.update(task.id, { status: "Completed" });
      toast.success(`"${task.title}" marked complete.`);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update task.");
    }
  };

  const columns = [
    ...followUpColumns,
    {
      key: "action",
      header: "",
      cell: (r) =>
        r.status === "Pending" ? (
          <Button size="sm" variant="outline" onClick={() => handleMarkComplete(r)}>
            Complete
          </Button>
        ) : null,
    },
  ];

  return (
    <PortalPage
      role="AGENT"
      title="Follow-ups"
      description="Never miss a callback, renewal chase or payment reminder."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" /> Schedule task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Follow-up Task</DialogTitle>
              <DialogDescription>
                Create a reminder for client callback, document chase, or renewal discussion.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tsk-title">Task Title <span className="text-destructive">*</span></Label>
                <Input
                  id="tsk-title"
                  required
                  placeholder="e.g. Call Rahul re: Optima Health proposal"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tsk-type">Interaction Type</Label>
                  <select
                    id="tsk-type"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Meeting">Client Meeting</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Renewal Chase">Renewal Chase</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tsk-pri">Priority</Label>
                  <select
                    id="tsk-pri"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tsk-date">Date <span className="text-destructive">*</span></Label>
                  <Input
                    id="tsk-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tsk-time">Time</Label>
                  <Input
                    id="tsk-time"
                    placeholder="e.g. 11:30 AM"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Scheduling…
                    </>
                  ) : (
                    "Schedule Task"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
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
        exportable
      />
    </PortalPage>
  );
}
