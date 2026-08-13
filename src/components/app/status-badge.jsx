"use client";
import { cn } from "@/lib/utils";

const statusMap = {
  // Policy statuses//
  Active: "bg-success/12 text-success",
  "Expiring Soon": "bg-warning/20 text-warning-foreground",
  Expired: "bg-destructive/10 text-destructive",
  Cancelled: "bg-muted text-muted-foreground",
  Pending: "bg-info/12 text-info",
  // Claim statuses
  Submitted: "bg-info/12 text-info",
  "Under Review": "bg-warning/20 text-warning-foreground",
  "Documents Required": "bg-warning/20 text-warning-foreground",
  Approved: "bg-success/12 text-success",
  Rejected: "bg-destructive/10 text-destructive",
  Settled: "bg-success/12 text-success",
  // Quote statuses
  Draft: "bg-muted text-muted-foreground",
  Requested: "bg-info/12 text-info",
  Quoted: "bg-secondary/12 text-secondary",
  Accepted: "bg-success/12 text-success",
  Expired: "bg-destructive/10 text-destructive",
  // Payment statuses
  Successful: "bg-success/12 text-success",
  Failed: "bg-destructive/10 text-destructive",
  Refunded: "bg-muted text-muted-foreground",
  // Lead stages
  New: "bg-info/12 text-info",
  Contacted: "bg-secondary/12 text-secondary",
  Qualified: "bg-accent/12 text-accent",
  Quotation: "bg-warning/20 text-warning-foreground",
  Negotiation: "bg-warning/20 text-warning-foreground",
  Converted: "bg-success/12 text-success",
  Lost: "bg-destructive/10 text-destructive",
  // Follow-up statuses
  Completed: "bg-success/12 text-success",
  Missed: "bg-destructive/10 text-destructive",
  // Commission statuses
  Paid: "bg-success/12 text-success",
  // KYC statuses
  Verified: "bg-success/12 text-success",
  // Agent statuses
  Inactive: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }) {
  const cls = statusMap[status] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        cls,
        className
      )}
    >
      {status}
    </span>
  );
}
