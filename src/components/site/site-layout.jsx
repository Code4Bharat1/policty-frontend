"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, X, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", to: "/" },
  { label: "Insurance", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "FAQs", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const homeForRole = {
  SUPER_ADMIN: "/admin/dashboard",
  ADMIN: "/admin/dashboard",
  AGENT: "/agent/dashboard",
  CUSTOMER: "/customer/dashboard",
};

export function SiteLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block text-base font-extrabold tracking-tight text-foreground">Policy Care</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Insurance, organised
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "text-foreground bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" asChild>
              <Link href="/enquiry">Get a quote</Link>
            </Button>
            {user ? (
              <Button asChild>
                <Link href={homeForRole[user.role]}>Go to dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </Button>
        </div>

        {open ? (
          <div className="border-t border-border bg-card px-4 py-3 lg:hidden">
            <nav aria-label="Mobile" className="flex flex-col">
              {nav.map((item) => (
                <Link key={item.to} href={item.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/enquiry">Get a quote</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href={user ? homeForRole[user.role] : "/login"}>{user ? "Dashboard" : "Sign in"}</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <ShieldCheck className="size-5" aria-hidden />
              </span>
              <span className="text-base font-extrabold">Policy Care</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-primary-foreground/75">
              A digital insurance management platform for customers, advisors and operations teams — comparison,
              purchase, servicing, renewals and claims in one place.
            </p>
          </div>

          <nav aria-label="Products">
            <h2 className="text-sm font-bold">Insurance</h2>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
              {["Health Insurance", "Life Insurance", "Motor Insurance", "Travel Insurance", "Home Insurance", "Business Insurance"].map((l) => (
                <li key={l}>
                  <Link href="/products" className="hover:text-primary-foreground">{l}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-sm font-bold">Company</h2>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
              <li><Link href="/about" className="hover:text-primary-foreground">About us</Link></li>
              <li><Link href="/blog" className="hover:text-primary-foreground">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-primary-foreground">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-primary-foreground">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-foreground">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-foreground">Terms &amp; conditions</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold">Talk to us</h2>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
              <li className="flex items-center gap-2"><Phone className="size-4" aria-hidden /> 1800 200 4000</li>
              <li className="flex items-center gap-2"><Mail className="size-4" aria-hidden /> care@policycare.in</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4" aria-hidden /> Level 7, Trade Centre, Bandra Kurla Complex, Mumbai 400051</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <p className="mx-auto w-full max-w-7xl px-4 py-5 text-xs text-primary-foreground/60 lg:px-8">
            © 2026 Policy Care. All rights reserved. Insurance is the subject matter of solicitation.
          </p>
        </div>
      </footer>
    </div>
  );
}
