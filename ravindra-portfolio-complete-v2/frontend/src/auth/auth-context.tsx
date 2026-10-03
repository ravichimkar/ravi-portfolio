import { useQueryClient } from "@tanstack/react-query";
import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { authApi } from "@/api/authApi";
import { ApiError, tokenStore } from "@/api/client";
import type { AppRole, AuthUser } from "@/api/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus("unauthenticated");
    queryClient.removeQueries({ queryKey: ["admin"] });
  }, [queryClient]);

  useEffect(() => {
    let cancelled = false;
    const token = tokenStore.get();
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    authApi.me()
      .then((me) => {
        if (cancelled) return;
        setUser({
          id: String(me.id ?? me.email),
          email: me.email,
          name: me.name ?? "Ravindra Chimkar",
          roles: (me.roles ?? ["ADMIN"]) as AppRole[],
        });
        setStatus("authenticated");
      })
      .catch(() => {
        if (!cancelled) clearSession();
      });
    return () => { cancelled = true; };
  }, [clearSession]);

  useEffect(() => {
    tokenStore.setUnauthorizedHandler(() => clearSession());
    return () => tokenStore.setUnauthorizedHandler(null);
  }, [clearSession]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login({ email, password });
    if (!session?.accessToken) throw new ApiError("The server did not return a valid session.", 500);
    tokenStore.set(session.accessToken);
    setUser(session.user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    clearSession();
    queryClient.clear();
  }, [clearSession, queryClient]);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    user,
    isAuthenticated: status === "authenticated" && Boolean(user),
    login,
    logout,
    hasRole: (role) => Boolean(user?.roles.includes(role)),
    hasAnyRole: (roles) => Boolean(user?.roles.some((role) => roles.includes(role))),
  }), [status, user, login, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
