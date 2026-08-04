/**
 * Persists JWT access/refresh tokens.
 *
 * Kept as a plain module (not React state) on purpose: the axios
 * interceptor in `client.ts` needs to read/write tokens outside of any
 * component tree, and `AuthContext` just mirrors this for React consumers.
 *
 * NOTE: localStorage is used here because this is a pure client-rendered
 * SPA with no backend-for-frontend proxy. It's vulnerable to XSS token
 * theft in a way an httpOnly cookie wouldn't be. If/when a Next.js route
 * handler is introduced to sit between the browser and the Django API,
 * migrate this to httpOnly cookies set by that route handler instead.
 */

const ACCESS_TOKEN_KEY = "gama_access_token";
const REFRESH_TOKEN_KEY = "gama_refresh_token";

const isBrowser = typeof window !== "undefined";

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(access: string, refresh: string): void {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  setAccessToken(access: string): void {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  },

  clear(): void {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasSession(): boolean {
    return Boolean(this.getAccessToken());
  },
};
