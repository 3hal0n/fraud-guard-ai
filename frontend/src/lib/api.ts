/**
 * Typed API client for the FraudGuard FastAPI backend.
 * Base URL is configured via NEXT_PUBLIC_BACKEND_URL (defaults to localhost for dev).
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export interface AnalyzeRequest {
  amount: number;
  merchant: string;
  category?: string;
  location?: string;
  time?: string;
  user_id?: string;
}

export interface AnalyzeResponse {
  risk_score: number;
  status: "APPROVED" | "PENDING_REVIEW" | "BLOCK_TRANSACTION";
  applied_rules?: RulesEngineSettings;
  risk_factors: RiskFactor[];
}

export interface RulesEngineSettings {
  profile: "GENERAL" | "CUSTOM";
  review_threshold: number;
  block_threshold: number;
  block_on_location_mismatch: boolean;
  location_mismatch_min_score: number;
  can_edit?: boolean;
}

export interface RiskFactor {
  feature: string;
  contribution: number;
}

interface AnalyzeRequestOptions {
  apiKey?: string;
}

export interface ApiError {
  status: number;
  detail: string;
}

function normalizeErrorDetail(detail: unknown, fallback: string): string {
  if (!detail) return fallback;
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const formatted = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (
          item &&
          typeof item === "object" &&
          "msg" in item &&
          typeof (item as { msg?: unknown }).msg === "string"
        ) {
          const loc = (item as { loc?: unknown }).loc;
          const locText = Array.isArray(loc) ? ` (${loc.join(".")})` : "";
          return `${(item as { msg: string }).msg}${locText}`;
        }
        try {
          return JSON.stringify(item);
        } catch {
          return String(item);
        }
      })
      .filter(Boolean)
      .join("; ");
    return formatted || fallback;
  }

  if (typeof detail === "object") {
    if ("msg" in detail && typeof (detail as { msg?: unknown }).msg === "string") {
      return (detail as { msg: string }).msg;
    }
    try {
      return JSON.stringify(detail);
    } catch {
      return fallback;
    }
  }

  return String(detail);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { headers: optionHeaders, ...restOptions } = options;
  const headers = new Headers(optionHeaders);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...restOptions,
    headers,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = normalizeErrorDetail(body.detail, detail);
    } catch {
      /* ignore parse error */
    }
    const err: ApiError = { status: res.status, detail };
    throw err;
  }

  return res.json() as Promise<T>;
}

/** POST /api/v1/analyze */
export async function analyzeTransaction(
  payload: AnalyzeRequest,
  options: AnalyzeRequestOptions = {}
): Promise<AnalyzeResponse> {
  const headers: HeadersInit = {};
  if (options.apiKey) {
    headers["X-API-Key"] = options.apiKey;
  }

  return request<AnalyzeResponse>("/api/v1/analyze", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

/** GET /api/v1/db-status — handy for health checks */
export async function dbStatus(): Promise<{ db: string; message: string }> {
  return request("/api/v1/db-status");
}

export interface UserInfo {
  user_id: string;
  email: string | null;
  plan: "FREE" | "PRO";
  daily_usage: number;
  daily_limit: number | null;
}

export interface TelemetrySummary {
  user_id: string;
  total_scans: number;
  high_risk_detected: number;
  db_available?: boolean;
}

/** GET /api/v1/user/:id */
export async function getUserInfo(userId: string): Promise<UserInfo> {
  return request<UserInfo>(`/api/v1/user/${userId}`);
}

/** GET /api/v1/user/:id/rules-engine */
export async function getRulesEngineSettings(userId: string): Promise<RulesEngineSettings> {
  return request<RulesEngineSettings>(`/api/v1/user/${userId}/rules-engine`);
}

/** PUT /api/v1/user/:id/rules-engine */
export async function updateRulesEngineSettings(
  userId: string,
  payload: RulesEngineSettings
): Promise<RulesEngineSettings> {
  return request<RulesEngineSettings>(`/api/v1/user/${userId}/rules-engine`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export interface TransactionRecord {
  id: string;
  amount: number;
  risk_score: number;
  status: "risk" | "safe";
  timestamp: string | null;
  location?: string | null;
}

/** GET /api/v1/transactions/:id */
export async function getTransactions(
  userId: string,
  limit = 20
): Promise<TransactionRecord[]> {
  return request<TransactionRecord[]>(
    `/api/v1/transactions/${userId}?limit=${limit}`
  );
}

/** GET /api/v1/telemetry/:id */
export async function getTelemetrySummary(userId: string): Promise<TelemetrySummary> {
  return request<TelemetrySummary>(`/api/v1/telemetry/${userId}`);
}

export interface ApiKeyResponse {
  user_id: string;
  api_key: string | null;
  has_api_key?: boolean;
  generated?: boolean;
  key_id?: number;
  key_prefix?: string | null;
  latest_key_prefix?: string | null;
  project_name?: string;
  keys?: ApiKeyItem[];
}

export interface ApiKeyItem {
  id: number;
  project_name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string | null;
  last_used_at: string | null;
  revoked_at: string | null;
}

export interface ApiKeyListResponse {
  user_id: string;
  keys: ApiKeyItem[];
}

export interface RevokeApiKeyResponse {
  user_id: string;
  key_id: number;
  revoked: boolean;
  revoked_at: string | null;
}

/** GET /api/v1/user/:id/api-key */
export async function getUserApiKey(userId: string): Promise<ApiKeyResponse> {
  return request<ApiKeyResponse>(`/api/v1/user/${userId}/api-key`);
}

/** POST /api/v1/user/:id/api-key */
export async function generateUserApiKey(userId: string, projectName: string): Promise<ApiKeyResponse> {
  return request<ApiKeyResponse>(`/api/v1/user/${userId}/api-key`, {
    method: "POST",
    body: JSON.stringify({ project_name: projectName }),
  });
}

/** GET /api/v1/user/:id/api-keys */
export async function listUserApiKeys(userId: string): Promise<ApiKeyListResponse> {
  return request<ApiKeyListResponse>(`/api/v1/user/${userId}/api-keys`);
}

/** POST /api/v1/user/:id/api-keys/:keyId/revoke */
export async function revokeUserApiKey(userId: string, keyId: number): Promise<RevokeApiKeyResponse> {
  return request<RevokeApiKeyResponse>(`/api/v1/user/${userId}/api-keys/${keyId}/revoke`, {
    method: "POST",
  });
}

export interface BulkAuditFlaggedRow {
  row_number: number;
  amount?: number;
  merchant?: string;
  location?: string;
  time?: string | null;
  risk_score?: number;
  status: "risk" | "invalid";
  error?: string;
}

export interface BulkAuditResponse {
  processed_rows: number;
  total_rows: number;
  flagged_rows: BulkAuditFlaggedRow[];
}

export interface CheckoutSessionResponse {
  checkout_url: string;
}

export interface BillingHistoryItem {
  id: number;
  invoice_id: string | null;
  amount: number;
  currency: string;
  status: "paid" | "failed" | string;
  paid_at: string | null;
  created_at: string | null;
}

export interface BillingOverview {
  user_id: string;
  plan: "FREE" | "PRO";
  subscription: {
    status: string;
    cancel_at_period_end: boolean;
    current_period_end: string | null;
    next_payment_at: string | null;
    stripe_subscription_id: string | null;
  };
  history: BillingHistoryItem[];
}

/** POST /api/v1/analyze/bulk-csv */
export async function uploadBulkAuditCsv(userId: string, file: File): Promise<BulkAuditResponse> {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/api/v1/analyze/bulk-csv`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = normalizeErrorDetail(body.detail, detail);
    } catch {
      /* ignore parse error */
    }
    const err: ApiError = { status: res.status, detail };
    throw err;
  }

  return res.json() as Promise<BulkAuditResponse>;
}

/** POST /api/v1/create-checkout-session */
export async function createCheckoutSession(userId: string): Promise<CheckoutSessionResponse> {
  return request<CheckoutSessionResponse>("/api/v1/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
}

/** GET /api/v1/billing/:id */
export async function getBillingOverview(userId: string): Promise<BillingOverview> {
  return request<BillingOverview>(`/api/v1/billing/${userId}`);
}
