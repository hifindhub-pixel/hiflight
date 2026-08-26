import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { authenticateRequest, clearSessionCookies, readSupabaseError } from "@/lib/supabase/server";

export async function DELETE(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ error: "La suppression automatique du compte n’est pas encore activée. Contactez contact@hiflight.fr." }, { status: 503 });
  }

  const { url } = getSupabaseConfig();
  const result = await fetch(`${url}/auth/v1/admin/users/${auth.user.id}`, {
    method: "DELETE",
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    cache: "no-store",
  });
  if (!result.ok) return NextResponse.json({ error: await readSupabaseError(result, "Suppression impossible.") }, { status: result.status });

  const response = NextResponse.json({ deleted: true });
  clearSessionCookies(response);
  return response;
}
