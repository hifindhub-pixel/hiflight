import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

const OAUTH_PROVIDERS = new Set(["google", "apple"]);

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider");
  if (!provider || !OAUTH_PROVIDERS.has(provider)) {
    const errorUrl = new URL("/connexion", request.nextUrl.origin);
    errorUrl.searchParams.set("oauth_error", "Ce fournisseur de connexion n’est pas disponible.");
    return NextResponse.redirect(errorUrl);
  }

  const { url } = getSupabaseConfig();
  const authorizeUrl = new URL(`${url}/auth/v1/authorize`);
  authorizeUrl.searchParams.set("provider", provider);
  authorizeUrl.searchParams.set("redirect_to", new URL("/connexion", request.nextUrl.origin).toString());

  return NextResponse.redirect(authorizeUrl);
}
