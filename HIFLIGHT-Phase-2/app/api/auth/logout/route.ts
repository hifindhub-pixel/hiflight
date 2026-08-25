import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { ACCESS_COOKIE, clearSessionCookies } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (token) {
    const { url } = getSupabaseConfig();
    await fetch(`${url}/auth/v1/logout`, { method: "POST", headers: supabaseHeaders(token), cache: "no-store" }).catch(() => null);
  }
  const response = NextResponse.json({ signedOut: true });
  clearSessionCookies(response);
  return response;
}
