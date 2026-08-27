"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Megaphone, Loader2 } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { NotificationList } from "@/components/app/notification-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { notificationService } from "@/services";

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    userScope: "ALL",
    type: "Alert",
    title: "",
    body: "",
    link: "",
  });

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Please enter both a title and announcement message.");
      return;
    }

    setSending(true);
    try {
      await notificationService.broadcast(form);
      toast.success(
        `Announcement dispatched to ${
          form.userScope === "ALL"
            ? "all users"
            : form.userScope === "CUSTOMER"
            ? "all customers"
            : "all advisors"
        }.`
      );
      setForm({ userScope: "ALL", type: "Alert", title: "", body: "", link: "" });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-bell"] });
    } catch (err) {
      toast.error(err.message || "Failed to dispatch broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <PortalPage
      role="ADMIN"
      title="Notification Center"
      description="System alerts, customer lifecycle events, and broadcast announcements."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Megaphone className="mr-2 size-4" /> Send Broadcast Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Send Broadcast Announcement</DialogTitle>
              <DialogDescription>
                Push real-time notifications to customers, advisors, or all platform users.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBroadcast} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bc-scope">Target Audience <span className="text-destructive">*</span></Label>
                  <select
                    id="bc-scope"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.userScope}
                    onChange={(e) => setForm({ ...form, userScope: e.target.value })}
                  >
                    <option value="ALL">All Users (Customers &amp; Advisors)</option>
                    <option value="CUSTOMER">Customers Only</option>
                    <option value="AGENT">Advisors Only</option>
                    <option value="ADMIN">Admin Console Only</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bc-type">Category</Label>
                  <select
                    id="bc-type"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="Alert">📢 General Alert</option>
                    <option value="Policy">🛡️ Policy Notice</option>
                    <option value="Renewal">🔄 Renewal Campaign</option>
                    <option value="Payment">💳 Payment &amp; Payouts</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bc-title">Notification Title <span className="text-destructive">*</span></Label>
                <Input
                  id="bc-title"
                  required
                  placeholder="e.g. New Comprehensive Health Cover Available"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bc-body">Notification Message <span className="text-destructive">*</span></Label>
                <Textarea
                  id="bc-body"
                  rows={3}
                  required
                  placeholder="Write the alert message that recipients will see..."
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bc-link">Action Link (Optional URL)</Label>
                <Input
                  id="bc-link"
                  placeholder="e.g. /customer/insurance or /agent/renewals"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Dispatching…
                    </>
                  ) : (
                    "Dispatch Announcement"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="surface p-6 rounded-2xl">
        <NotificationList scope="ADMIN" />
      </div>
    </PortalPage>
  );
}
