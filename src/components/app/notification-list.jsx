"use client";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services";
import { formatDate } from "@/lib/format";

const typeColors = {
  Policy: "bg-secondary/12 text-secondary",
  Renewal: "bg-warning/20 text-warning-foreground",
  Payment: "bg-success/12 text-success",
  Claim: "bg-info/12 text-info",
  Document: "bg-accent/12 text-accent",
  Alert: "bg-destructive/10 text-destructive",
};

export function NotificationList({ scope }) {
  const { data: notifications } = useQuery({
    queryKey: ["notifications", scope],
    queryFn: () => notificationService.list(scope),
  });

  if (!notifications?.length) {
    return <p className="text-sm text-muted-foreground">No notifications.</p>;
  }

  return (
    <ul className="space-y-3">
      {notifications.slice(0, 5).map((n) => (
        <li key={n.id} className={`rounded-lg border border-border p-3 ${!n.read ? "bg-muted/40" : ""}`}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{n.title}</p>
            <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${typeColors[n.type] ?? "bg-muted text-muted-foreground"}`}>
              {n.type}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(n.date)}</p>
        </li>
      ))}
    </ul>
  );
}
