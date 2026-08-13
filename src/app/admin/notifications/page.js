"use client";
import { PortalPage } from "@/components/app/portal-page";
import { NotificationList } from "@/components/app/notification-list";

export default function AdminNotificationsPage() {
  return (
    <PortalPage role="ADMIN" title="Notifications" description="Operational alerts for the console team.">
      <NotificationList scope="ADMIN" />
    </PortalPage>
  );
}
