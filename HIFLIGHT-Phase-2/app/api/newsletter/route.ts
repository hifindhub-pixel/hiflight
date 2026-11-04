import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig, supabaseHeaders } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  let body: { email?: string; website?: string; source?: string } = {};
  try { body = await request.json(); } catch { /* corps vide */ }
  // Champ piège : un robot le remplit, un humain non.
  if (body.website) return NextResponse.json({ ok: true });
  const email = (body.email || "").trim().toLowerCase();
  if (email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  const source = (body.source || "site").slice(0, 40);
  const { url } = getSupabaseConfig();
  const result = await fetch(`${url}/rest/v1/newsletter_subscribers`, {
    method: "POST",
    headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ email, source }),
    cache: "no-store",
  });
  // 409 = déjà inscrit : on répond comme pour une nouvelle inscription.
  if (result.ok || result.status === 409) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: "Inscription impossible pour le moment. Réessayez plus tard." }, { status: 502 });
}
