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
  status: "risk" | "safe";
}

interface AnalyzeRequestOptions {
  apiKey?: string;
}

export interface ApiError {
  status: number;
  detail: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
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

export interface TransactionRecord {
  id: string;
  amount: number;
  risk_score: number;
  status: "risk" | "safe";
  timestamp: string | null;
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
}

/** GET /api/v1/user/:id/api-key */
export async function getUserApiKey(userId: string): Promise<ApiKeyResponse> {
  return request<ApiKeyResponse>(`/api/v1/user/${userId}/api-key`);
}

/** POST /api/v1/user/:id/api-key */
export async function generateUserApiKey(userId: string): Promise<ApiKeyResponse> {
  return request<ApiKeyResponse>(`/api/v1/user/${userId}/api-key`, {
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
      detail = body.detail || detail;
    } catch {
      /* ignore parse error */
    }
    const err: ApiError = { status: res.status, detail };
    throw err;
  }

  return res.json() as Promise<BulkAuditResponse>;
}
