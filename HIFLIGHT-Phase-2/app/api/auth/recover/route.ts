import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { readSupabaseError } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json() as { email?: string };
  if (!email) return NextResponse.json({ error: "Renseignez votre adresse e-mail." }, { status: 400 });
  const { url } = getSupabaseConfig();
  const redirectTo = `${request.nextUrl.origin}/connexion?recovery=1`;
  const result = await fetch(`${url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
    cache: "no-store",
  });
  if (!result.ok) return NextResponse.json({ error: await readSupabaseError(result, "Envoi impossible.") }, { status: result.status });
  return NextResponse.json({ sent: true });
}
