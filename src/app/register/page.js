"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  MailCheck,
  ArrowRight,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/ui/otp-input";
import { useAuth, homeForRole } from "@/lib/auth";
import { apiClient } from "@/services/apiClient";

export default function RegisterPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  // Step 1 = Registration Form, Step 2 = OTP Verification
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // OTP State
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState(null);

  useEffect(() => {
    if (ready && user) router.replace(homeForRole[user.role]);
  }, [ready, user, router]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-submit OTP when 6 digits are typed
  useEffect(() => {
    if (otpCode.length === 6 && step === 2 && !loading) {
      handleVerifyOtp();
    }
  }, [otpCode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError(null);
  };

  // Password Strength Criteria
  const hasMinLength = form.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(form.password);
  const hasLowercase = /[a-z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(form.password);

  const criteriaCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const isPasswordStrong = criteriaCount === 5;
  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

  // Real-time Phone & Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const isPhoneValid = !form.phone.trim() || /^[6-9]\d{9}$/.test(form.phone.trim());

  const getStrengthLabel = () => {
    if (criteriaCount <= 2) return { label: "Weak", color: "bg-destructive", textColor: "text-destructive" };
    if (criteriaCount <= 4) return { label: "Moderate", color: "bg-amber-500", textColor: "text-amber-500" };
    return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-500" };
  };

  const strength = getStrengthLabel();

  // 1. Submit Registration Form
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }
    if (!isEmailValid) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }
    if (form.phone.trim() && !isPhoneValid) {
      setError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }
    if (!isPasswordStrong) {
      setError("Please ensure your password meets all 5 security requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match. Please ensure both passwords are identical.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        role: "CUSTOMER",
      });

      if (res?.devOtp) setDevOtpHint(res.devOtp);
      toast.success("Account created! Verification code sent to your email.");
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Registration failed. Please check your information and try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Email OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/verify-registration", {
        email: form.email.trim().toLowerCase(),
        otp: otpCode.trim(),
      });

      if (res?.token && res?.user) {
        window.localStorage.setItem("policycare.token", res.token);
        window.localStorage.setItem("policycare.session", JSON.stringify(res.user));
        toast.success(`Account verified! Welcome to Policy Care, ${res.user.name.split(" ")[0]}`);
        router.replace(homeForRole[res.user.role] || "/customer/dashboard");
      } else {
        toast.success("Account verified successfully! Please sign in with your email and password.");
        router.push(`/login?verified=true&email=${encodeURIComponent(form.email.trim())}`);
      }
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/resend-verification", {
        email: form.email.trim().toLowerCase(),
      });
      setCountdown(60);
      setOtpCode("");
      if (res?.devOtp) setDevOtpHint(res.devOtp);
      toast.success("A fresh 6-digit code has been sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to resend code.");
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
        <p className="text-xs text-primary-foreground/60">Secure customer registration with verified email authentication.</p>
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

          {step === 1 ? (
            /* ============================================================ */
            /* STEP 1: REGISTRATION FORM                                   */
            /* ============================================================ */
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign up for instant access to your personal insurance customer portal.
              </p>

              <form onSubmit={handleSubmitRegistration} className="mt-8 space-y-4" noValidate>
                <div className="space-y-1.5">
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
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">Email address <span className="text-destructive">*</span></Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={form.email}
                      onChange={handleChange("email")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-phone">Mobile number</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="10-digit number"
                      maxLength={10}
                      value={form.phone}
                      onChange={handleChange("phone")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-pass">Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      id="reg-pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create strong password"
                      required
                      value={form.password}
                      onChange={handleChange("password")}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Dynamic Password Strength Indicator */}
                {form.password ? (
                  <div className="rounded-xl border border-border bg-card p-3.5 text-xs space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Password strength:</span>
                      <span className={`font-bold ${strength.textColor}`}>{strength.label}</span>
                    </div>

                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            i <= criteriaCount ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {hasMinLength ? (
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={hasMinLength ? "text-foreground font-medium" : "text-muted-foreground"}>
                          8+ characters
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasUppercase ? (
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={hasUppercase ? "text-foreground font-medium" : "text-muted-foreground"}>
                          1 uppercase (A-Z)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasLowercase ? (
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={hasLowercase ? "text-foreground font-medium" : "text-muted-foreground"}>
                          1 lowercase (a-z)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasNumber ? (
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={hasNumber ? "text-foreground font-medium" : "text-muted-foreground"}>
                          1 number (0-9)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        {hasSpecial ? (
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={hasSpecial ? "text-foreground font-medium" : "text-muted-foreground"}>
                          1 special symbol (@, #, $, !, etc.)
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm-pass">Confirm password <span className="text-destructive">*</span></Label>
                  <Input
                    id="reg-confirm-pass"
                    type="password"
                    placeholder="Repeat password"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                  />
                  {form.confirmPassword && (
                    <div className="flex items-center gap-1.5 text-xs pt-1">
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3.5 text-destructive" />
                          <span className="text-destructive font-medium">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
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
                      <Loader2 className="size-4 animate-spin mr-2" aria-hidden /> Creating account…
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground pt-2">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-secondary hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            /* ============================================================ */
            /* STEP 2: EMAIL OTP VERIFICATION SCREEN                       */
            /* ============================================================ */
            <div>
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MailCheck className="size-6" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">Verify Your Email</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                We sent a 6-digit one-time verification code to{" "}
                <span className="font-semibold text-foreground">{form.email}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5" noValidate>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Enter 6-digit code</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtpCode("");
                      setError(null);
                    }}
                    className="inline-flex items-center gap-1 text-secondary hover:underline font-medium"
                  >
                    <Edit2 className="size-3" /> Edit details
                  </button>
                </div>

                <OtpInput
                  length={6}
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    if (error) setError(null);
                  }}
                  disabled={loading}
                />

                {error ? (
                  <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium flex items-start gap-2">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={loading || otpCode.length !== 6}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" /> Activating Account…
                    </>
                  ) : (
                    "Verify & Complete Registration"
                  )}
                </Button>

                <div className="text-center text-xs text-muted-foreground pt-2">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || loading}
                    className={`font-semibold ${
                      countdown > 0
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-secondary hover:underline cursor-pointer"
                    }`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend code now"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
