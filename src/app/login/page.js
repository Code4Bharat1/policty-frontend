"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";


const demo = [
  { role: "Administrator", email: "admin@policycare.demo" },
  { role: "Advisor / Agent", email: "agent@policycare.demo" },
  { role: "Customer", email: "customer@policycare.demo" },
];

const homeForRole = {
  SUPER_ADMIN: "/admin/dashboard",
  ADMIN: "/admin/dashboard",
  AGENT: "/agent/dashboard",
  CUSTOMER: "/customer/dashboard",
};

export default function LoginPage() {
  const { signIn, user, ready } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("customer@policycare.demo");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ready && user) router.replace(homeForRole[user.role]);
  }, [ready, user, router]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const signed = await signIn(email, password);
      toast.success(`Welcome back, ${signed.name.split(" ")[0]}`);
      router.replace(homeForRole[signed.role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground"><ShieldCheck className="size-5" aria-hidden /></span>
          <span className="text-base font-extrabold">Policy Care</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">One platform for policies, renewals, claims and payments.</h2>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/75">
            Customers see their portfolio, advisors run their book, and operations sees the whole business — with
            role-based access and a complete audit trail.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">Demonstration environment with simulated data.</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><ShieldCheck className="size-4" aria-hidden /></span>
            <span className="font-extrabold">Policy Care</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your portal with your registered email.</p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email address <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(error)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <button type="button" className="text-xs font-medium text-secondary hover:underline" onClick={() => toast.info("A password reset link would be emailed in the production build.")}>
                  Forgot password?
                </button>
              </div>
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error ? <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Signing in…</> : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Demo accounts (development only)</p>
            <ul className="mt-3 space-y-2">
              {demo.map((d) => (
                <li key={d.email} className="flex items-center justify-between gap-3">
                  <span className="text-sm">
                    <span className="block font-semibold">{d.role}</span>
                    <span className="block text-xs text-muted-foreground">{d.email}</span>
                  </span>
                  <Button type="button" size="sm" variant="outline" onClick={() => { setEmail(d.email); setPassword("demo1234"); }}>Use</Button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">Password for every demo account: demo1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
