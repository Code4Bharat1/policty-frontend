"use client";
import { PortalPage } from "@/components/app/portal-page";
import { ProfilePanel } from "@/components/app/profile-panel";

export default function CustomerProfilePage() {
  return (
    <PortalPage role="CUSTOMER" title="Profile & settings" description="Your details, KYC status and how we contact you.">
      <ProfilePanel extra={[{ label: "KYC status", value: "Verified" }]} />
    </PortalPage>
  );
}
