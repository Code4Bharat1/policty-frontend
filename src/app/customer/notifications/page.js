"use client";
import { PortalPage } from "@/components/app/portal-page";
import { NotificationList } from "@/components/app/notification-list";

export default function CustomerNotificationsPage() {
  return (
    <PortalPage
      role="CUSTOMER"
      title="Notification Center"
      description="Policy updates, claim milestones, and renewal reminders."
    >
      <div className="surface p-6 rounded-2xl">
        <NotificationList scope="CUSTOMER" />
      </div>
    </PortalPage>
  );
}
