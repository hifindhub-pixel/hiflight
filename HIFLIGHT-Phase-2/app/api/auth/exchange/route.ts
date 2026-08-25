import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { applySessionCookies, SupabaseSession } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = await request.json() as { accessToken?: string; refreshToken?: string };
  if (!accessToken || !refreshToken) return NextResponse.json({ error: "Lien de connexion incomplet." }, { status: 400 });
  const { url } = getSupabaseConfig();
  const validation = await fetch(`${url}/auth/v1/user`, { headers: supabaseHeaders(accessToken), cache: "no-store" });
  if (!validation.ok) return NextResponse.json({ error: "Ce lien a expiré. Demandez-en un nouveau." }, { status: 401 });
  const user = await validation.json();
  const response = NextResponse.json({ user });
  applySessionCookies(response, { access_token: accessToken, refresh_token: refreshToken, expires_in: 3600, user } as SupabaseSession);
  return response;
}
