import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";
import { authenticateRequest, jsonWithAuth, readSupabaseError } from "@/lib/supabase/server";

const SLUG = /^[a-z0-9-]{3,80}$/;
const MAX_FAVORITES = 100;

async function listSlugs(url: string, accessToken: string, userId: string) {
  const query = new URLSearchParams({ select: "route_slug,created_at", user_id: `eq.${userId}`, order: "created_at.desc", limit: String(MAX_FAVORITES + 1) });
  const result = await fetch(`${url}/rest/v1/favorite_routes?${query}`, { headers: supabaseHeaders(accessToken), cache: "no-store" });
  return result;
}

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  const { url } = getSupabaseConfig();
  const result = await listSlugs(url, auth.accessToken, auth.user.id);
  if (!result.ok) return jsonWithAuth({ error: await readSupabaseError(result, "Impossible de charger vos favoris.") }, result.status, auth);
  const rows = await result.json() as { route_slug: string }[];
  return jsonWithAuth({ slugs: rows.map((row) => row.route_slug) }, 200, auth);
}

/** Ajoute un favori ({ slug }) ou fusionne une liste locale ({ slugs }) : les doublons sont ignorés. */
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { slug?: string; slugs?: string[] };
  const wanted = [...new Set((body.slugs ?? (body.slug ? [body.slug] : [])).filter((slug) => typeof slug === "string" && SLUG.test(slug)))].slice(0, MAX_FAVORITES);
  if (!wanted.length) return jsonWithAuth({ error: "Trajet invalide." }, 400, auth);

  const { url } = getSupabaseConfig();
  const existing = await listSlugs(url, auth.accessToken, auth.user.id);
  if (!existing.ok) return jsonWithAuth({ error: await readSupabaseError(existing, "Sauvegarde impossible.") }, existing.status, auth);
  const current = new Set(((await existing.json()) as { route_slug: string }[]).map((row) => row.route_slug));
  const fresh = wanted.filter((slug) => !current.has(slug));
  if (current.size + fresh.length > MAX_FAVORITES) return jsonWithAuth({ error: `Vous avez atteint la limite de ${MAX_FAVORITES} favoris.` }, 400, auth);
  if (!fresh.length) return jsonWithAuth({ added: 0 }, 200, auth);

  const result = await fetch(`${url}/rest/v1/favorite_routes?on_conflict=user_id,route_slug`, {
    method: "POST",
    headers: { ...supabaseHeaders(auth.accessToken), Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify(fresh.map((route_slug) => ({ user_id: auth.user.id, route_slug }))),
    cache: "no-store",
  });
  if (!result.ok) return jsonWithAuth({ error: await readSupabaseError(result, "Sauvegarde impossible.") }, result.status, auth);
  return jsonWithAuth({ added: fresh.length }, 200, auth);
}

export async function DELETE(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { slug?: string };
  if (!body.slug || !SLUG.test(body.slug)) return jsonWithAuth({ error: "Trajet invalide." }, 400, auth);
  const { url } = getSupabaseConfig();
  const filter = new URLSearchParams({ user_id: `eq.${auth.user.id}`, route_slug: `eq.${body.slug}` });
  const result = await fetch(`${url}/rest/v1/favorite_routes?${filter}`, { method: "DELETE", headers: supabaseHeaders(auth.accessToken), cache: "no-store" });
  if (!result.ok) return jsonWithAuth({ error: await readSupabaseError(result, "Suppression impossible.") }, result.status, auth);
  return jsonWithAuth({ removed: true }, 200, auth);
}
