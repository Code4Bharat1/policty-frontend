"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, homeForRole } from "@/lib/auth";

function LoginForm() {
  const { signIn, user, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isJustVerified = searchParams.get("verified") === "true";
  const initialEmail = searchParams.get("email") || "";

  // Tab: 'customer' | 'staff'
  const [activeTab, setActiveTab] = useState("customer");

  // Customer State
  const [customerEmail, setCustomerEmail] = useState(initialEmail);
  const [customerPassword, setCustomerPassword] = useState("");
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);

  // Staff Login State
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ready && user) router.replace(homeForRole[user.role] || "/customer/dashboard");
  }, [ready, user, router]);

  // 1. Customer Password Login
  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const email = customerEmail.trim();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!customerPassword) {
      setError("Please enter your account password.");
      return;
    }

    setLoading(true);
    try {
      const signed = await signIn(email, customerPassword);
      toast.success(`Welcome back, ${signed.name.split(" ")[0]}!`);
      router.replace(homeForRole[signed.role] || "/customer/dashboard");
    } catch (err) {
      setError(err.message || "Incorrect email or password. Please verify your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Staff Password Login
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const email = staffEmail.trim();
    if (!email) {
      setError("Please enter your work email address.");
      return;
    }
    if (!staffPassword) {
      setError("Please enter your account password.");
      return;
    }

    setLoading(true);
    try {
      const signed = await signIn(email, staffPassword);
      toast.success(`Welcome back, ${signed.name.split(" ")[0]}`);
      router.replace(homeForRole[signed.role]);
    } catch (err) {
      setError(err.message || "Incorrect work email or password.");
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
          <h2 className="text-3xl font-bold leading-tight">
            One unified platform for policies, renewals, claims, and advisory.
          </h2>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/75">
            Customers manage policies, payments, and instant claims with secure credentials. Advisors and administrators access their operational consoles with role-based security.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">Protected by 256-bit encrypted authentication.</p>
      </div>

      {/* Right Login Panel */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-4" aria-hidden />
            </span>
            <span className="font-extrabold">Policy Care</span>
          </Link>

          {/* Mode Selector Tabs */}
          <div className="mb-8 flex rounded-xl bg-muted p-1 border border-border">
            <button
              type="button"
              onClick={() => {
                setActiveTab("customer");
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === "customer"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-4" /> Customer Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("staff");
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === "staff"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KeyRound className="size-4" /> Staff & Advisor
            </button>
          </div>

          {isJustVerified && (
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2.5">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
              <span>Your account has been verified! Please sign in with your email and password.</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 1: CUSTOMER LOGIN (EMAIL & PASSWORD)                    */}
          {/* ============================================================ */}
          {activeTab === "customer" ? (
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sign in to Customer Portal</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your registered email and password to access your account.
              </p>

              <form onSubmit={handleCustomerLogin} className="mt-6 space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="cust-email">Email address <span className="text-destructive">*</span></Label>
                  <Input
                    id="cust-email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cust-pass">Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      id="cust-pass"
                      type={showCustomerPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={customerPassword}
                      onChange={(e) => {
                        setCustomerPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showCustomerPassword ? "Hide password" : "Show password"}
                    >
                      {showCustomerPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium flex items-start gap-2">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" /> Authenticating…
                    </>
                  ) : (
                    "Sign In to Customer Portal"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-secondary hover:underline">
                  Create account
                </Link>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* TAB 2: STAFF LOGIN (ADMINS & ADVISORS WITH PASSWORD)        */
            /* ============================================================ */
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Staff &amp; Advisor Portal</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in with your enterprise credentials issued by administration.
              </p>

              <form onSubmit={handleStaffLogin} className="mt-6 space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="staff-email">Work email <span className="text-destructive">*</span></Label>
                  <Input
                    id="staff-email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={staffEmail}
                    onChange={(e) => {
                      setStaffEmail(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="staff-pass">Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      id="staff-pass"
                      type={showStaffPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={staffPassword}
                      onChange={(e) => {
                        setStaffPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showStaffPassword ? "Hide password" : "Show password"}
                    >
                      {showStaffPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium flex items-start gap-2">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" /> Authenticating…
                    </>
                  ) : (
                    "Sign In to Console"
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
