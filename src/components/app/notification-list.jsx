"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bell, CheckCheck, Trash2, Shield, RefreshCw, AlertCircle, FileText, CheckCircle2,
  ExternalLink, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services";
import { formatDate } from "@/lib/format";

const typeMeta = {
  Policy: { icon: Shield, style: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800" },
  Renewal: { icon: RefreshCw, style: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800" },
  Payment: { icon: CheckCircle2, style: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800" },
  Claim: { icon: AlertCircle, style: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800" },
  Lead: { icon: Bell, style: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800" },
  Document: { icon: FileText, style: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800" },
  Alert: { icon: Bell, style: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800" },
};

export function NotificationList({ scope, limit, showActions = true }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("ALL"); // ALL | UNREAD
  const [actionId, setActionId] = useState(null);

  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ["notifications", scope],
    queryFn: () => notificationService.list(scope),
    refetchInterval: 15000,
  });

  const list = (notifications ?? []).filter((n) => {
    if (filter === "UNREAD") return !n.read;
    return true;
  });

  const displayedList = limit ? list.slice(0, limit) : list;
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    setActionId(id);
    try {
      await notificationService.markRead(id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-bell"] });
    } catch (err) {
      toast.error(err.message || "Failed to mark as read");
    } finally {
      setActionId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-bell"] });
    } catch (err) {
      toast.error(err.message || "Failed to mark all as read");
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    setActionId(id);
    try {
      await notificationService.delete(id);
      toast.success("Notification removed");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-bell"] });
    } catch (err) {
      toast.error(err.message || "Failed to delete notification");
    } finally {
      setActionId(null);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.read) {
      handleMarkAsRead(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div className="space-y-4">
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter("ALL")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                filter === "ALL"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({notifications?.length ?? 0})
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                filter === "UNREAD"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="mr-1.5 size-3.5" /> Mark all read
            </Button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : displayedList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <Bell className="mx-auto size-8 text-muted-foreground/40" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            {filter === "UNREAD" ? "No unread notifications" : "No notifications yet"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            You will be alerted here when policies, claims, or renewals require action.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {displayedList.map((n) => {
            const meta = typeMeta[n.type] || typeMeta.Alert;
            const Icon = meta.icon;

            return (
              <li
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`group relative flex cursor-pointer items-start gap-3.5 rounded-xl border p-3.5 transition-all hover:border-primary/40 hover:bg-muted/30 ${
                  !n.read
                    ? "border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${meta.style}`}
                >
                  <Icon className="size-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!n.read ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="size-2 rounded-full bg-primary" title="Unread" />
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {formatDate(n.date)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.body}</p>

                  {n.link && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                      <span>View details</span>
                      <ExternalLink className="size-3" />
                    </div>
                  )}
                </div>

                <div
                  className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      title="Mark as read"
                    >
                      <CheckCheck className="size-3.5" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleDelete(n.id, e)}
                    title="Delete notification"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
