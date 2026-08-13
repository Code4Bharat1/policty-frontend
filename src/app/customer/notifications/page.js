"use client";
import { PortalPage } from "@/components/app/portal-page";
import { NotificationList } from "@/components/app/notification-list";

export default function CustomerNotificationsPage() {
  return (
    <PortalPage role="CUSTOMER" title="Notifications" description="Everything that needs your attention, newest first.">
      <NotificationList scope="CUSTOMER" />
    </PortalPage>
  );
}
