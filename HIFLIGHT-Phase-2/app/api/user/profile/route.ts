import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { authenticateRequest, jsonWithAuth, readSupabaseError } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  return jsonWithAuth({ profile: {
    id: auth.user.id,
    full_name: auth.user.user_metadata?.full_name || "",
    avatar_url: auth.user.user_metadata?.avatar_url || "",
    preferred_language: "fr",
    preferred_currency: "EUR",
  } }, 200, auth);
}

export async function PATCH(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  const body = await request.json() as { fullName?: string; language?: string; currency?: string };
  const payload = {
    id: auth.user.id,
    full_name: body.fullName?.trim().slice(0, 100) || "",
    preferred_language: body.language === "en" ? "en" : "fr",
    preferred_currency: ["EUR", "USD", "GBP"].includes(body.currency || "") ? body.currency : "EUR",
  };
  const { url } = getSupabaseConfig();
  const result = await fetch(`${url}/rest/v1/profiles?on_conflict=id`, {
    method: "POST",
    headers: { ...supabaseHeaders(auth.accessToken), Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!result.ok) return jsonWithAuth({ error: await readSupabaseError(result, "Enregistrement impossible.") }, result.status, auth);
  const rows = await result.json() as unknown[];
  return jsonWithAuth({ profile: rows[0] || payload }, 200, auth);
}
