"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, homeForRole } from "@/lib/auth";
import { apiClient } from "@/services/apiClient";

export default function RegisterPage() {
  const { user, ready, signIn } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ready && user) router.replace(homeForRole[user.role]);
  }, [ready, user, router]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isLengthValid = form.password.length >= 6;
  const passwordsMatch = form.password && form.password === form.confirmPassword;

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isLengthValid) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1. Call Register API
      await apiClient.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        role: "CUSTOMER",
      });

      // 2. Automatically sign in
      const signed = await signIn(form.email.trim(), form.password);
      toast.success(`Account created! Welcome, ${signed.name.split(" ")[0]}`);
      router.replace(homeForRole[signed.role] || "/customer/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left Brand Panel */}
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <span className="text-base font-extrabold">Policy Care</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Join Policy Care today.</h2>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/75">
            Discover tailored insurance coverage, manage active policies, submit seamless claims, and track renewals in real-time.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">Secure customer registration with bank-grade encryption.</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-4" aria-hidden />
            </span>
            <span className="font-extrabold">Policy Care</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign up for instant access to your personal insurance customer portal.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="reg-name">Full name <span className="text-destructive">*</span></Label>
              <Input
                id="reg-name"
                type="text"
                placeholder="e.g. Rahul Sharma"
                required
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="rahul@example.com"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone">Mobile</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-pass">Password <span className="text-destructive">*</span></Label>
              <Input
                id="reg-pass"
                type="password"
                placeholder="Minimum 6 characters"
                required
                value={form.password}
                onChange={handleChange("password")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-confirm-pass">Confirm password <span className="text-destructive">*</span></Label>
              <Input
                id="reg-confirm-pass"
                type="password"
                placeholder="Repeat password"
                required
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
            </div>

            {/* Validation helper status */}
            {form.password ? (
              <div className="rounded-lg border border-border bg-card p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  {isLengthValid ? (
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="size-3.5 text-muted-foreground" />
                  )}
                  <span className={isLengthValid ? "text-foreground font-medium" : "text-muted-foreground"}>
                    At least 6 characters
                  </span>
                </div>
                {form.confirmPassword ? (
                  <div className="flex items-center gap-2">
                    {passwordsMatch ? (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="size-3.5 text-destructive" />
                    )}
                    <span className={passwordsMatch ? "text-foreground font-medium" : "text-destructive font-medium"}>
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {error ? (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive font-medium">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-secondary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
