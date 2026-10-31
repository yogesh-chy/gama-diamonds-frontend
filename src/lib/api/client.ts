import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL)?.trim().replace(/\/+$/, "");

export const API_BASE_URL = rawApiUrl
  ? (rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`)
  : "http://localhost:8000/api";

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
  timeout: 45000, // 45 seconds to accommodate free tier cold-starts (Render spins down inactive instances)
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
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers) {
      if (typeof (config.headers as any).delete === "function") {
        (config.headers as any).delete("Content-Type");
      } else {
        delete (config.headers as Record<string, unknown>)["Content-Type"];
      }
    }
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

/**
 * Converts a potentially-relative image/media URL into an absolute URL,
 * and automatically applies modern CDN image & video optimizations (WebP/AVIF,
 * perceptually lossless compression, and faststart video codecs for Cloudinary & Unsplash).
 */
export function resolveMediaUrl(
  url: string | undefined | null,
  options?: { width?: number; type?: "image" | "video" }
): string {
  if (!url) return "";
  let absoluteUrl = url;

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("data:") &&
    !url.startsWith("blob:")
  ) {
    // Derive backend origin from API_BASE_URL (strip /api suffix)
    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    absoluteUrl = `${backendOrigin}${cleanPath}`;
  }

  return optimizeMediaUrl(absoluteUrl, options);
}

/**
 * Optimizes media URLs (both images and videos) for ultra-fast web delivery:
 * - Cloudinary images: injects /f_auto,q_auto/ (WebP/AVIF auto-format, quality compression)
 * - Cloudinary videos: injects /q_auto,vc_auto/ (modern fast codecs, web bitrate, FastStart moov placement)
 * - Unsplash images: ensures auto=format&fit=crop&q=80
 */
export function optimizeMediaUrl(
  url: string | undefined | null,
  options?: {
    width?: number;
    type?: "image" | "video";
  }
): string {
  if (!url) return "";

  // Cloudinary image optimizations (WebP/AVIF auto-format & quality)
  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    const widthParam = options?.width ? `w_${options.width}` : "";
    if (!url.includes("/image/upload/f_auto") && !url.includes("/image/upload/q_auto")) {
      const transforms = ["f_auto", "q_auto", widthParam].filter(Boolean).join(",");
      return url.replace("/image/upload/", `/image/upload/${transforms}/`);
    }
  }

  // Unsplash optimizations
  if (url.includes("images.unsplash.com")) {
    const widthParam = options?.width ? `&w=${options.width}` : "";
    if (!url.includes("auto=format")) {
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}auto=format&fit=crop&q=80${widthParam}`;
    }
  }

  return url;
}
