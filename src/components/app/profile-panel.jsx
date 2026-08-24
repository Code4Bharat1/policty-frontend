"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionCard, DetailList } from "@/components/app/primitives";
import { useAuth, rolePermissions } from "@/lib/auth";
import { apiClient } from "@/services/apiClient";

export function ProfilePanel({ extra }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setSaving(true);
    try {
      const res = await apiClient.put("/auth/me", {
        name: name.trim(),
        phone: phone.trim(),
      });

      // Update session storage
      try {
        const raw = window.localStorage.getItem("policycare.session");
        if (raw) {
          const current = JSON.parse(raw);
          const updated = { ...current, name: res.name || name.trim(), phone: res.phone || phone.trim() };
          window.localStorage.setItem("policycare.session", JSON.stringify(updated));
        }
      } catch {}

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <SectionCard
        className="lg:col-span-2"
        title="Personal details"
        description="Keep your contact details current so we can reach you about claims and renewals."
      >
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
          <div className="space-y-1.5">
            <Label htmlFor="pf-name">Full name</Label>
            <Input
              id="pf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-email">Email (read only)</Label>
            <Input id="pf-email" type="email" readOnly value={email} className="bg-muted" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-phone">Phone number</Label>
            <Input
              id="pf-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-role">Role</Label>
            <Input
              id="pf-role"
              readOnly
              value={user.role?.replace("_", " ")}
              className="bg-muted font-medium"
            />
          </div>
          <div className="sm:col-span-2 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </SectionCard>

      <div className="space-y-6">
        <SectionCard title="Account">
          <DetailList
            items={[
              { label: "User ID", value: user.id || "Current" },
              { label: "Linked record", value: user.linkedId ?? "—" },
              ...(extra ?? []),
            ]}
          />
        </SectionCard>
        <SectionCard title="Notification preferences">
          <div className="space-y-4">
            {["Email alerts", "SMS reminders", "WhatsApp updates"].map((l) => (
              <div key={l} className="flex items-center justify-between gap-3">
                <Label htmlFor={l} className="text-sm font-medium">
                  {l}
                </Label>
                <Switch
                  id={l}
                  defaultChecked
                  onCheckedChange={() => toast.success("Preference saved.")}
                />
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Your permissions" description="Granted by your role.">
          <div className="flex flex-wrap gap-1.5">
            {(rolePermissions[user.role] || []).map((p) => (
              <span
                key={p}
                className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
