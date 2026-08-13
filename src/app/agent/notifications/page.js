"use client";
import { PortalPage } from "@/components/app/portal-page";
import { NotificationList } from "@/components/app/notification-list";

export default function AgentNotificationsPage() {
  return (
    <PortalPage role="AGENT" title="Notifications" description="Assignments and alerts for your book of business.">
      <NotificationList scope="AGENT" />
    </PortalPage>
  );
}
