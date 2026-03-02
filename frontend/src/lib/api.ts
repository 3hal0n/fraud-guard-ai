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
  payload: AnalyzeRequest
): Promise<AnalyzeResponse> {
  return request<AnalyzeResponse>("/api/v1/analyze", {
    method: "POST",
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
