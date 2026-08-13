"use client";
import { PortalPage } from "@/components/app/portal-page";
import { ProfilePanel } from "@/components/app/profile-panel";

export default function AgentProfilePage() {
  return (
    <PortalPage role="AGENT" title="Advisor profile" description="Your details, code and channel settings.">
      <ProfilePanel extra={[{ label: "Advisor code", value: "PC-ADV-1001" }, { label: "Branch / City", value: "Mumbai" }]} />
    </PortalPage>
  );
}
