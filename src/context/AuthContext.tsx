"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, type AuthUser } from "@/lib/api/auth";
import { AUTH_LOGOUT_EVENT } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import { tokenStorage } from "@/lib/api/tokenStorage";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  /** True once the initial session check has settled — use to avoid flashing
   *  the wrong header icon / redirecting before we actually know. */
  isLoading: boolean;
  isAuthenticated: boolean;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<AuthUser>;
  adminLogin: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // On first mount, if a token is already stored (returning visitor), verify
  // it's still good by hitting /me/ — the axios interceptor will silently
  // refresh it first if the access token itself has expired.
  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      if (!tokenStorage.hasSession()) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const { data } = await authApi.me();
        if (!cancelled) {
          setUser(data);
          setStatus("authenticated");
        }
      } catch {
        if (!cancelled) {
          tokenStorage.clear();
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    }

    hydrateSession();
    return () => {
      cancelled = true;
    };
  }, []);

  // If the axios layer force-logs-out (refresh token invalid/expired anywhere
  // in the app), reflect that in state immediately.
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setStatus("unauthenticated");
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, []);

  const requestOtp = useCallback(async (email: string) => {
    try {
      await authApi.requestOtp(email);
    } catch (err) {
      throw new Error(getApiErrorMessage(err, "Couldn't send the code. Please try again."));
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, code: string) => {
    try {
      const { data } = await authApi.verifyOtp(email, code);
      tokenStorage.setTokens(data.access, data.refresh);
      setUser(data.user);
      setStatus("authenticated");
      return data.user;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, "That code didn't work. Please try again."));
    }
  }, []);

  const adminLogin = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await authApi.adminLogin(email, password);
      tokenStorage.setTokens(data.access, data.refresh);
      setUser(data.user);
      setStatus("authenticated");
      return data.user;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, "Admin login failed. Please check your credentials."));
    }
  }, []);

  const logout = useCallback(async () => {
    const refresh = tokenStorage.getRefreshToken();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // Best-effort: even if the server call fails (token already expired,
      // network hiccup, etc), the local session still needs to end.
    } finally {
      tokenStorage.clear();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data);
    } catch {
      // Leave existing state as-is; the response interceptor already
      // handles forced logout on an actual auth failure.
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      requestOtp,
      verifyOtp,
      adminLogin,
      logout,
      refreshUser,
    }),
    [user, status, requestOtp, verifyOtp, adminLogin, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
