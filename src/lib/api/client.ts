import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8000/api";

/** Dispatched on `window` whenever the session is force-ended (refresh failed,
 * no refresh token available, etc). AuthContext listens for this to sync
 * React state and redirect to /login. */
export const AUTH_LOGOUT_EVENT = "gama:auth-logout";

function broadcastLogout() {
  tokenStorage.clear();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach the current access token, if any.
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — on a 401, try exactly one silent refresh, replay
// the original request, and queue any requests that 401'd while a refresh
// was already in flight so they don't each trigger their own refresh call.
// ---------------------------------------------------------------------------
type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  refreshQueue = [];
}

const NO_REFRESH_PATHS = ["/auth/otp/request/", "/auth/otp/verify/", "/auth/token/refresh/"];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";
    const isExemptEndpoint = NO_REFRESH_PATHS.some((path) => url.includes(path));

    if (status !== 401 || !originalRequest || isExemptEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      broadcastLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another request already kicked off a refresh — wait for it.
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (newAccessToken) => {
            originalRequest.headers = originalRequest.headers ?? new AxiosHeaders();
            (originalRequest.headers as AxiosHeaders).set("Authorization", `Bearer ${newAccessToken}`);
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Use a bare axios call, not apiClient, so this doesn't loop through
      // the same request/response interceptors again.
      const { data } = await axios.post<{ access: string; refresh?: string }>(
        `${API_BASE_URL}/auth/token/refresh/`,
        { refresh: refreshToken }
      );

      // SIMPLE_JWT has ROTATE_REFRESH_TOKENS on, so a fresh refresh token
      // comes back too — the old one is blacklisted the moment this succeeds.
      tokenStorage.setTokens(data.access, data.refresh ?? refreshToken);
      flushQueue(null, data.access);

      originalRequest.headers = originalRequest.headers ?? new AxiosHeaders();
      (originalRequest.headers as AxiosHeaders).set("Authorization", `Bearer ${data.access}`);
      return apiClient(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      broadcastLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
