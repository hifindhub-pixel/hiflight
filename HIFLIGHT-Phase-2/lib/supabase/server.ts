import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "./config";

export const ACCESS_COOKIE = "hiflight_access_token";
export const REFRESH_COOKIE = "hiflight_refresh_token";

export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; avatar_url?: string };
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user: SupabaseUser;
};

export type AuthResult = {
  user: SupabaseUser;
  accessToken: string;
  refreshedSession?: SupabaseSession;
};

export function applySessionCookies(response: NextResponse, session: SupabaseSession) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(ACCESS_COOKIE, session.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: session.expires_in || 3600,
  });
  response.cookies.set(REFRESH_COOKIE, session.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

async function fetchUser(accessToken: string) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: supabaseHeaders(accessToken),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as SupabaseUser;
}

async function refreshSession(refreshToken: string) {
  const { url } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as SupabaseSession;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthResult | null> {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (accessToken) {
    const user = await fetchUser(accessToken);
    if (user) return { user, accessToken };
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;
  const session = await refreshSession(refreshToken);
  if (!session?.user) return null;
  return { user: session.user, accessToken: session.access_token, refreshedSession: session };
}

export function jsonWithAuth(body: unknown, status: number, auth?: AuthResult | null) {
  const response = NextResponse.json(body, { status });
  if (auth?.refreshedSession) applySessionCookies(response, auth.refreshedSession);
  return response;
}

export async function readSupabaseError(response: Response, fallback: string) {
  try {
    const payload = await response.json() as { msg?: string; message?: string; error_description?: string };
    return payload.msg || payload.message || payload.error_description || fallback;
  } catch {
    return fallback;
  }
}
