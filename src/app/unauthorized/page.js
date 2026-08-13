"use client";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, homeForRole } from "@/lib/auth";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role does not include permission for this area. If you believe this is an error, contact your administrator.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild><Link href={user ? homeForRole[user.role] : "/login"}>Back to my dashboard</Link></Button>
          <Button variant="outline" asChild><Link href="/">Public site</Link></Button>
        </div>
      </div>
    </div>
  );
}
