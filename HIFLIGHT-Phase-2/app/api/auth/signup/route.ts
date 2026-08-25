import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { applySessionCookies, readSupabaseError, SupabaseSession } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { email, password, fullName } = await request.json() as { email?: string; password?: string; fullName?: string };
  if (!email || !password || password.length < 8) return NextResponse.json({ error: "Utilisez un mot de passe d’au moins 8 caractères." }, { status: 400 });
  const { url } = getSupabaseConfig();
  const redirectTo = `${request.nextUrl.origin}/connexion`;
  const result = await fetch(`${url}/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({ email: email.trim().toLowerCase(), password, data: { full_name: fullName?.trim() || "" } }),
    cache: "no-store",
  });
  if (!result.ok) return NextResponse.json({ error: await readSupabaseError(result, "Création du compte impossible.") }, { status: result.status });
  const payload = await result.json() as Partial<SupabaseSession> & { user?: SupabaseSession["user"] };
  const response = NextResponse.json({ user: payload.user, confirmationRequired: !payload.access_token });
  if (payload.access_token && payload.refresh_token && payload.user) applySessionCookies(response, payload as SupabaseSession);
  return response;
}
