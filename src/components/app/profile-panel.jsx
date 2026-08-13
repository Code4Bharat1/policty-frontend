"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionCard, DetailList } from "@/components/app/primitives";
import { useAuth, rolePermissions } from "@/lib/auth";

export function ProfilePanel({ extra }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <SectionCard className="lg:col-span-2" title="Personal details" description="Keep your contact details current so we can reach you about claims and renewals.">
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Profile updated.");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">Full name</Label>
            <Input id="pf-name" defaultValue={user.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-email">Email</Label>
            <Input id="pf-email" type="email" defaultValue={user.email} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-phone">Phone</Label>
            <Input id="pf-phone" defaultValue={user.phone} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-role">Role</Label>
            <Input id="pf-role" readOnly value={user.role.replace("_", " ")} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </SectionCard>

      <div className="space-y-6">
        <SectionCard title="Account">
          <DetailList
            items={[
              { label: "User ID", value: user.id },
              { label: "Linked record", value: user.linkedId ?? "—" },
              ...(extra ?? []),
            ]}
          />
        </SectionCard>
        <SectionCard title="Notification preferences">
          <div className="space-y-4">
            {["Email alerts", "SMS reminders", "WhatsApp updates"].map((l) => (
              <div key={l} className="flex items-center justify-between gap-3">
                <Label htmlFor={l} className="text-sm font-medium">{l}</Label>
                <Switch id={l} defaultChecked onCheckedChange={() => toast.success("Preference saved.")} />
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Your permissions" description="Granted by your role.">
          <div className="flex flex-wrap gap-1.5">
            {rolePermissions[user.role].map((p) => (
              <span key={p} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{p}</span>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
