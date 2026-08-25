import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { authenticateRequest, readSupabaseError } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "La session de récupération a expiré." }, { status: 401 });
  const { password } = await request.json() as { password?: string };
  if (!password || password.length < 8) return NextResponse.json({ error: "Utilisez au moins 8 caractères." }, { status: 400 });
  const { url } = getSupabaseConfig();
  const result = await fetch(`${url}/auth/v1/user`, {
    method: "PUT",
    headers: supabaseHeaders(auth.accessToken),
    body: JSON.stringify({ password }),
    cache: "no-store",
  });
  if (!result.ok) return NextResponse.json({ error: await readSupabaseError(result, "Modification impossible.") }, { status: result.status });
  return NextResponse.json({ updated: true });
}
