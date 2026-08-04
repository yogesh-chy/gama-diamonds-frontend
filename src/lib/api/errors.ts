import { AxiosError } from "axios";

/**
 * Shape produced by the backend's DRF custom_exception_handler:
 *   { "error": { "code": 400, "message": "...", "details": {...} | null } }
 */
interface BackendErrorEnvelope {
  error?: {
    code?: number;
    message?: string;
    details?: Record<string, string[] | string> | string | null;
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

/** Pulls the most useful single message out of an API error for display in a toast. */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!isAxiosError(error)) {
    if (error instanceof Error && error.message) return error.message;
    return fallback;
  }

  if (!error.response) {
    return "Can't reach the server. Check your connection and try again.";
  }

  const data = error.response.data as BackendErrorEnvelope | undefined;
  const envelope = data?.error;
  if (!envelope) return fallback;

  const { details, message } = envelope;

  if (details && typeof details === "object") {
    const firstKey = Object.keys(details)[0];
    const firstValue = firstKey ? details[firstKey] : undefined;
    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return String(firstValue[0]);
    }
    if (typeof firstValue === "string") return firstValue;
  } else if (typeof details === "string" && details) {
    return details;
  }

  return message || fallback;
}
