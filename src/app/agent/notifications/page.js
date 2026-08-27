"use client";
import { PortalPage } from "@/components/app/portal-page";
import { NotificationList } from "@/components/app/notification-list";

export default function AgentNotificationsPage() {
  return (
    <PortalPage
      role="AGENT"
      title="Notification Center"
      description="Lead allocations, client policy issuances, and commission payout alerts."
    >
      <div className="surface p-6 rounded-2xl">
        <NotificationList scope="AGENT" />
      </div>
    </PortalPage>
  );
}
