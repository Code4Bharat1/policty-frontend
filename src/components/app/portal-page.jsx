"use client";
import { PortalShell } from "@/components/app/portal-shell";
import { PageHeader } from "@/components/app/primitives";

export function PortalPage({ role, title, description, eyebrow, actions, children }) {
  return (
    <PortalShell role={role}>
      <PageHeader
        title={title}
        {...(description ? { description } : {})}
        {...(eyebrow ? { eyebrow } : {})}
        {...(actions ? { actions } : {})}
      />
      {children}
    </PortalShell>
  );
}
