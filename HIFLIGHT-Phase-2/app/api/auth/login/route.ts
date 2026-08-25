import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { applySessionCookies, readSupabaseError, SupabaseSession } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json() as { email?: string; password?: string };
  if (!email || !password) return NextResponse.json({ error: "Renseignez votre e-mail et votre mot de passe." }, { status: 400 });

  const { url } = getSupabaseConfig();
  const result = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    cache: "no-store",
  });
  if (!result.ok) {
    const detail = await readSupabaseError(result, "Connexion impossible.");
    const message = /invalid login/i.test(detail) ? "E-mail ou mot de passe incorrect." : detail;
    return NextResponse.json({ error: message }, { status: result.status });
  }
  const session = await result.json() as SupabaseSession;
  const response = NextResponse.json({ user: session.user });
  applySessionCookies(response, session);
  return response;
}
