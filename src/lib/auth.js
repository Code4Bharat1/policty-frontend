"use client";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { apiClient } from "@/services/apiClient";

const STORAGE_KEY = "policycare.session";
const TOKEN_KEY = "policycare.token";

export const rolePermissions = {
  SUPER_ADMIN: ["ALL_ACCESS", "SYSTEM_CONFIG", "MANAGE_ADMINS", "AUDIT_LOGS"],
  ADMIN: [
    "MANAGE_POLICIES",
    "MANAGE_CLAIMS",
    "MANAGE_AGENTS",
    "MANAGE_CUSTOMERS",
    "MANAGE_PRODUCTS",
    "MANAGE_COMPANIES",
    "VIEW_REPORTS",
    "COMMISSIONS_PAYOUT",
    "CMS_EDIT",
  ],
  AGENT: [
    "VIEW_ASSIGNED_POLICIES",
    "CREATE_POLICY_PROPOSAL",
    "SUBMIT_CLAIM",
    "VIEW_COMMISSIONS",
    "MANAGE_LEADS",
    "GENERATE_QUOTES",
  ],
  CUSTOMER: [
    "VIEW_OWN_POLICIES",
    "DOWNLOAD_DOCUMENTS",
    "SUBMIT_CLAIM",
    "TRACK_CLAIMS",
    "PAY_PREMIUM",
    "REQUEST_RENEWAL",
    "GET_QUOTES",
  ],
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
    let sessionUser = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        sessionUser = JSON.parse(raw);
      }
    } catch {
      /* ignore corrupt session */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(sessionUser);
    setReady(true);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    if (!res || !res.user || !res.token) {
      throw new Error("Invalid response from authentication server");
    }

    window.localStorage.setItem(TOKEN_KEY, res.token);
    if (res.refreshToken) {
      window.localStorage.setItem("policycare.refreshToken", res.refreshToken);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      /* ignore logout error */
    } finally {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem("policycare.refreshToken");
      window.localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      // Full hard reload on signOut to purge memory caches
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }
  }, []);

  const hasPermission = useCallback(
    (perm) => {
      if (!user) return false;
      const perms = rolePermissions[user.role] || [];
      return perms.includes("ALL_ACCESS") || perms.includes(perm);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      ready,
      signIn,
      signOut,
      hasPermission,
    }),
    [user, ready, signIn, signOut, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
