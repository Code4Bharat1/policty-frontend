"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/services/apiClient";

const STORAGE_KEY = "policycare.session";
const TOKEN_KEY = "policycare.token";

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
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch {
      /* ignore corrupt session */
    } finally {
      setReady(true);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    if (!res || !res.user || !res.token) {
      throw new Error("Invalid response from authentication server");
    }

    window.localStorage.setItem(TOKEN_KEY, res.token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  }, []);

  const sendOtp = useCallback(async (email) => {
    return apiClient.post("/auth/send-otp", { email });
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    const res = await apiClient.post("/auth/verify-otp", { email, otp });
    if (!res || !res.user || !res.token) {
      throw new Error("Invalid response from authentication server");
    }

    window.localStorage.setItem(TOKEN_KEY, res.token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  }, []);

  const resendOtp = useCallback(async (email) => {
    return apiClient.post("/auth/resend-otp", { email });
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const can = useCallback(
    (permission) => (user ? rolePermissions[user.role]?.includes(permission) ?? false : false),
    [user]
  );

  const value = useMemo(
    () => ({ user, ready, signIn, sendOtp, verifyOtp, resendOtp, signOut, can }),
    [user, ready, signIn, sendOtp, verifyOtp, resendOtp, signOut, can]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
