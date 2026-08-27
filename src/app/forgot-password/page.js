"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(trimmedEmail);
      setSubmitted(true);
      toast.success("Password reset instructions dispatched to your email.");
    } catch (err) {
      setError(err.message || "Failed to process password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <span className="text-lg font-bold">Policy Care</span>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="size-7" />
            </div>
            <h1 className="text-xl font-bold">Check Your Email</h1>
            <p className="text-sm text-muted-foreground">
              If an account is associated with <strong>{email}</strong>, we have sent password reset instructions.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Return to Sign In</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reset-email">Email address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Mail className="size-4 mr-2" />}
                {loading ? "Sending link…" : "Send Reset Link"}
              </Button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="size-3.5" /> Back to sign in
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
