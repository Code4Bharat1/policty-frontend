"use client";
import { PortalPage } from "@/components/app/portal-page";
import { ProfilePanel } from "@/components/app/profile-panel";

export default function AdminSettingsPage() {
  return (
    <PortalPage role="ADMIN" title="Settings" description="Your console profile and platform preferences.">
      <ProfilePanel />
    </PortalPage>
  );
}
