"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell, Building2, ClipboardList, CreditCard, FileText, Files, Gauge, HeartHandshake, LayoutGrid,
  LifeBuoy, ListChecks, LogOut, Menu, Percent, RefreshCw, ScrollText, Settings, Shield, ShieldCheck,
  ShoppingBag, Target, UserCircle, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const customerNav = [
  { label: "Dashboard", to: "/customer/dashboard", icon: Gauge },
  { label: "Insurance", to: "/customer/insurance", icon: ShoppingBag },
  { label: "My Policies", to: "/customer/policies", icon: Shield },
  { label: "Quotes", to: "/customer/quotes", icon: FileText },
  { label: "Renewals", to: "/customer/renewals", icon: RefreshCw },
  { label: "Claims", to: "/customer/claims", icon: ClipboardList },
  { label: "Payments", to: "/customer/payments", icon: CreditCard },
  { label: "Documents", to: "/customer/documents", icon: Files },
  { label: "Notifications", to: "/customer/notifications", icon: Bell },
  { label: "Support", to: "/customer/support", icon: LifeBuoy },
  { label: "Profile", to: "/customer/profile", icon: UserCircle },
];

export const agentNav = [
  { label: "Dashboard", to: "/agent/dashboard", icon: Gauge },
  { label: "Customers", to: "/agent/customers", icon: Users },
  { label: "Leads", to: "/agent/leads", icon: Target },
  { label: "Quotations", to: "/agent/quotations", icon: FileText },
  { label: "Policies", to: "/agent/policies", icon: Shield },
  { label: "Renewals", to: "/agent/renewals", icon: RefreshCw },
  { label: "Claims", to: "/agent/claims", icon: ClipboardList },
  { label: "Follow-ups", to: "/agent/followups", icon: ListChecks },
  { label: "Commissions", to: "/agent/commissions", icon: Percent },
  { label: "Notifications", to: "/agent/notifications", icon: Bell },
  { label: "Profile", to: "/agent/profile", icon: UserCircle },
];

export const adminNav = [
  { label: "Dashboard", to: "/admin/dashboard", icon: Gauge },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Agents", to: "/admin/agents", icon: HeartHandshake },
  { label: "Insurance Companies", to: "/admin/companies", icon: Building2 },
  { label: "Products", to: "/admin/products", icon: LayoutGrid },
  { label: "Quotes", to: "/admin/quotes", icon: FileText },
  { label: "Policies", to: "/admin/policies", icon: Shield },
  { label: "Renewals", to: "/admin/renewals", icon: RefreshCw },
  { label: "Claims", to: "/admin/claims", icon: ClipboardList },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "CRM / Leads", to: "/admin/leads", icon: Target },
  { label: "Commissions", to: "/admin/commissions", icon: Percent },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Reports", to: "/admin/reports", icon: ScrollText },
  { label: "CMS", to: "/admin/cms", icon: FileText },
  { label: "Documents", to: "/admin/documents", icon: Files },
  { label: "Roles & Permissions", to: "/admin/roles", icon: ShieldCheck },
  { label: "Audit Logs", to: "/admin/audit", icon: ScrollText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

const navByRole = {
  CUSTOMER: customerNav,
  AGENT: agentNav,
  ADMIN: adminNav,
  SUPER_ADMIN: adminNav,
};

const areaLabel = {
  CUSTOMER: "Customer Portal",
  AGENT: "Advisor Portal",
  ADMIN: "Admin Console",
  SUPER_ADMIN: "Admin Console",
};

const homeForRole = {
  SUPER_ADMIN: "/admin/dashboard",
  ADMIN: "/admin/dashboard",
  AGENT: "/agent/dashboard",
  CUSTOMER: "/customer/dashboard",
};

export function PortalShell({ role, children }) {
  const { user, ready, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const allowed = user && (user.role === role || (role === "ADMIN" && user.role === "SUPER_ADMIN"));

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (!allowed) router.replace("/unauthorized");
  }, [ready, user, allowed, router]);

  useEffect(() => setOpen(false), [pathname]);

  if (!ready || !user || !allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  const items = navByRole[user.role];
  const notifHref =
    user.role === "CUSTOMER"
      ? "/customer/notifications"
      : user.role === "AGENT"
      ? "/agent/notifications"
      : "/admin/notifications";

  return (
    <div className="flex min-h-dvh bg-background">
      {open ? (
        <button
          className="fixed inset-0 z-30 bg-primary/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-sidebar-border px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ShieldCheck className="size-4.5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-sidebar-accent-foreground">Policy Care</span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/70">
                {areaLabel[user.role]}
              </span>
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav aria-label="Portal" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
              {user.avatarInitials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-sidebar-accent-foreground">{user.name}</span>
              <span className="block truncate text-xs text-sidebar-foreground/70">{user.email}</span>
            </span>
          </div>
          <button
            onClick={() => {
              signOut();
              router.replace("/login");
            }}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu className="size-5" aria-hidden />
            </Button>
            <p className="text-sm font-semibold text-foreground">{areaLabel[user.role]}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild aria-label="Notifications">
              <Link href={notifHref}>
                <Bell className="size-5" aria-hidden />
              </Link>
            </Button>
            <span className="hidden text-right sm:block">
              <span className="block text-xs font-semibold text-foreground">{user.name}</span>
              <span className="block text-[11px] text-muted-foreground">{user.role.replace("_", " ")}</span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user.avatarInitials}
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
