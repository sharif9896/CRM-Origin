/**
 * Thin fetch wrapper around the backend REST API.
 *
 * - Reads the base URL from VITE_API_BASE_URL (see .env).
 * - Attaches the JWT (stored in localStorage after login) as a Bearer token.
 * - Unwraps the backend's `{ success, data, ... }` envelope and throws a
 *   typed ApiError with the backend's message on failure.
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api/v1";

export const AUTH_TOKEN_KEY = "crm_auth_token";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    void 0;
  }
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
};

const buildUrl = (path: string, params?: RequestOptions["params"]) => {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

/**
 * Low-level request helper. Returns the full parsed JSON body (the
 * backend's envelope: `{ success, data, ... }` or `{ success, token, user }`
 * for auth routes) so callers can read whichever fields they need.
 */
export async function apiRequest<T = unknown>(
  path: string,
  { method = "GET", body, params }: RequestOptions = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(buildUrl(path, params), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: { success?: boolean; message?: string; [key: string]: unknown } | null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || json?.success === false) {
    const message = json?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return (json ?? {}) as T;
}
