import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { authenticateRequest, jsonWithAuth, readSupabaseError } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  const { url } = getSupabaseConfig();
  const query = new URLSearchParams({
    select: "country_code,visited,wishlist,visited_at",
    user_id: `eq.${auth.user.id}`,
    order: "country_code.asc",
  });
  const result = await fetch(`${url}/rest/v1/visited_countries?${query}`, { headers: supabaseHeaders(auth.accessToken), cache: "no-store" });
  if (!result.ok) return jsonWithAuth({ error: await readSupabaseError(result, "Impossible de charger votre carte.") }, result.status, auth);
  return jsonWithAuth({ countries: await result.json() }, 200, auth);
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  const body = await request.json() as { countryCode?: string; visited?: boolean; wishlist?: boolean; visitedAt?: string | null };
  const countryCode = body.countryCode?.trim().toUpperCase();
  if (!countryCode || !/^[A-Z]{3}$/.test(countryCode)) return NextResponse.json({ error: "Code pays invalide." }, { status: 400 });
  const { url } = getSupabaseConfig();
  const payload = {
    user_id: auth.user.id,
    country_code: countryCode,
    visited: Boolean(body.visited),
    wishlist: Boolean(body.wishlist),
    visited_at: body.visited ? body.visitedAt || new Date().toISOString().slice(0, 10) : null,
  };
  const filter = new URLSearchParams({ user_id: `eq.${auth.user.id}`, country_code: `eq.${countryCode}` });
  const removeExisting = () => fetch(`${url}/rest/v1/visited_countries?${filter}`, {
    method: "DELETE", headers: supabaseHeaders(auth.accessToken), cache: "no-store",
  });

  if (!payload.visited && !payload.wishlist) {
    const removal = await removeExisting();
    if (!removal.ok) return jsonWithAuth({ error: await readSupabaseError(removal, "Sauvegarde impossible.") }, removal.status, auth);
    return jsonWithAuth({ country: payload }, 200, auth);
  }

  let result = await fetch(`${url}/rest/v1/visited_countries?on_conflict=user_id,country_code`, {
    method: "POST",
    headers: { ...supabaseHeaders(auth.accessToken), Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!result.ok) {
    const errorMessage = await readSupabaseError(result.clone(), "Sauvegarde impossible.");
    if (!errorMessage.includes("updated_at")) return jsonWithAuth({ error: errorMessage }, result.status, auth);
    const removal = await removeExisting();
    if (!removal.ok) return jsonWithAuth({ error: await readSupabaseError(removal, "Sauvegarde impossible.") }, removal.status, auth);
    result = await fetch(`${url}/rest/v1/visited_countries`, {
      method: "POST",
      headers: { ...supabaseHeaders(auth.accessToken), Prefer: "return=representation" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  }
  if (!result.ok) return jsonWithAuth({ error: await readSupabaseError(result, "Sauvegarde impossible.") }, result.status, auth);
  const rows = await result.json() as unknown[];
  return jsonWithAuth({ country: rows[0] || payload }, 200, auth);
}
