"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { users } from "@/data/mock";

const STORAGE_KEY = "policycare.session";

export const rolePermissions = {
  SUPER_ADMIN: [
    "customers.view", "customers.create", "customers.edit", "customers.delete", "agents.manage",
    "products.manage", "policies.view", "policies.create", "policies.edit", "policies.delete",
    "claims.view", "claims.create", "claims.edit", "payments.view", "payments.manage",
    "leads.manage", "commissions.view", "reports.view", "cms.manage", "settings.manage", "audit.view",
  ],
  ADMIN: [
    "customers.view", "customers.create", "customers.edit", "agents.manage", "products.manage",
    "policies.view", "policies.create", "policies.edit", "claims.view", "claims.edit",
    "payments.view", "payments.manage", "leads.manage", "commissions.view", "reports.view",
    "cms.manage", "settings.manage", "audit.view",
  ],
  AGENT: [
    "customers.view", "customers.create", "customers.edit", "policies.view", "policies.create",
    "policies.edit", "claims.view", "claims.edit", "payments.view", "leads.manage", "commissions.view",
  ],
  CUSTOMER: ["policies.view", "claims.view", "claims.create", "payments.view"],
};

export const homeForRole = {
  SUPER_ADMIN: "/admin/dashboard",
  ADMIN: "/admin/dashboard",
  AGENT: "/agent/dashboard",
  CUSTOMER: "/customer/dashboard",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore corrupt session */
    }
    setReady(true);
  }, []);

  const signIn = useCallback(async (email, password) => {
    await new Promise((r) => setTimeout(r, 450));
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || password.length < 4) {
      throw new Error("Invalid email or password. Use a demo account listed below.");
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    setUser(found);
    return found;
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const can = useCallback(
    (permission) => (user ? rolePermissions[user.role].includes(permission) : false),
    [user],
  );

  const value = useMemo(() => ({ user, ready, signIn, signOut, can }), [user, ready, signIn, signOut, can]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
