"use client";
import { Check, Minus } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { SectionCard } from "@/components/app/primitives";
import { rolePermissions } from "@/lib/auth";

const roles = ["SUPER_ADMIN", "ADMIN", "AGENT", "CUSTOMER"];
const permissions = Array.from(new Set(Object.values(rolePermissions).flat()));

export default function AdminRolesPage() {
  return (
    <PortalPage role="ADMIN" title="Roles & permissions" description="The permission matrix enforced across the console and portals.">
      <SectionCard title="Access matrix" description="Client-side rendering follows this matrix; the same map is mirrored server-side.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-semibold">Permission</th>
                {roles.map((r) => <th key={r} className="px-3 py-2 font-semibold">{r.replace("_", " ")}</th>)}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => (
                <tr key={p} className="border-b border-border/60">
                  <td className="py-2.5 pr-4 font-medium text-foreground">{p}</td>
                  {roles.map((r) => (
                    <td key={r} className="px-3 py-2.5">
                      {rolePermissions[r].includes(p)
                        ? <Check className="size-4 text-success" aria-label="Allowed" />
                        : <Minus className="size-4 text-muted-foreground" aria-label="Denied" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </PortalPage>
  );
}
