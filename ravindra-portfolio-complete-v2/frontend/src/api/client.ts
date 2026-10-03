/**
 * Centralized HTTP client for the Spring Boot REST API.
 *
 * - Single configurable base URL (VITE_API_BASE_URL). Never hardcode it elsewhere.
 * - Bearer token attached from an in-memory token provider (no secrets in code).
 * - Timeout + limited retry for safe GET requests only.
 * - Uniform ApiEnvelope handling and typed ApiError for every HTTP status.
 * - When VITE_USE_MOCK_API is enabled, requests are dispatched to the local
 *   mock implementation instead of the network. No component ever calls fetch().
 */

import { mockDispatch } from "./mock/handlers";
import type { ApiEnvelope } from "./types";

export const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] ?? "";

export const USE_MOCK_API: boolean =
  String(import.meta.env["VITE_USE_MOCK_API"] ?? "").toLowerCase() === "true";

export const DEFAULT_TIMEOUT_MS = 15_000;
const GET_RETRIES = 2;
const RETRY_DELAY_MS = 500;

export class ApiError extends Error {
  readonly status: number;
  readonly kind: "network" | "timeout" | "http";

  constructor(message: string, status = 0, kind: ApiError["kind"] = "http") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
  }

  get isAuthError() {
    return this.status === 401 || this.status === 403;
  }

  get isRetryable() {
    return this.kind !== "http" || this.status === 429 || this.status >= 500;
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "The request was invalid.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This conflicts with existing data.",
  422: "Some fields failed validation.",
  429: "Too many requests. Please slow down and try again.",
  500: "The server encountered an error. Please try again.",
  503: "The service is temporarily unavailable.",
};

export function messageForStatus(status: number, fallback?: string | null) {
  return fallback || STATUS_MESSAGES[status] || `Request failed (${status}).`;
}

/* ----------------------------- token provider ---------------------------- */

let accessToken: string | null =
  typeof window !== "undefined" ? window.sessionStorage.getItem("portfolio_access_token") : null;
let onUnauthorized: (() => void) | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
    if (typeof window !== "undefined") {
      if (token) window.sessionStorage.setItem("portfolio_access_token", token);
      else window.sessionStorage.removeItem("portfolio_access_token");
    }
  },
  clear: () => {
    accessToken = null;
    if (typeof window !== "undefined") window.sessionStorage.removeItem("portfolio_access_token");
  },
  /** Registered by the AuthProvider so a 401 can force a re-login. */
  setUnauthorizedHandler: (handler: (() => void) | null) => {
    onUnauthorized = handler;
  },
};

/* -------------------------------- request -------------------------------- */

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Attach the bearer token. Defaults to true for admin/auth paths. */
  auth?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  /** Raw FormData for uploads. */
  formData?: FormData;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function performFetch<T>(path: string, options: RequestOptions): Promise<T> {
  const method = options.method ?? "GET";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  const headers: Record<string, string> = { Accept: "application/json" };
  const useAuth = options.auth ?? (path.startsWith("/api/admin") || path.startsWith("/api/auth"));
  if (useAuth && accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ?? null,
      credentials: "include",
      signal: options.signal ?? controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    if (controller.signal.aborted) {
      throw new ApiError("The request timed out. Please try again.", 0, "timeout");
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed.",
      0,
      "network",
    );
  }
  clearTimeout(timeout);

  if (response.status === 204) return undefined as T;

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    envelope = null;
  }

  if (!response.ok || envelope?.success === false) {
    if (response.status === 401) onUnauthorized?.();
    throw new ApiError(messageForStatus(response.status, envelope?.message), response.status);
  }

  return (envelope ? envelope.data : null) as T;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? "GET";

  if (USE_MOCK_API) {
    const envelope = await mockDispatch<T>(method, path, options.body, {
      token: accessToken,
      formData: options.formData ?? null,
    });
    if (!envelope.success) {
      const status = envelope.status ?? 400;
      if (status === 401) onUnauthorized?.();
      throw new ApiError(messageForStatus(status, envelope.message), status);
    }
    return envelope.data as T;
  }

  const attempts = method === "GET" ? GET_RETRIES + 1 : 1;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await performFetch<T>(path, options);
    } catch (error) {
      lastError = error;
      const retryable = error instanceof ApiError && error.isRetryable && error.status !== 401;
      if (!retryable || attempt === attempts - 1) break;
      await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
