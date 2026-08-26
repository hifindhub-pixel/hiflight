import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

const ALLOWED_PROVIDERS = new Set(["google", "apple"]);

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider") || "";
  if (!ALLOWED_PROVIDERS.has(provider)) {
    return NextResponse.redirect(new URL("/connexion?oauth=invalid", request.url));
  }

  const { url } = getSupabaseConfig();
  const authorizeUrl = new URL(`${url}/auth/v1/authorize`);
  authorizeUrl.searchParams.set("provider", provider);
  authorizeUrl.searchParams.set("redirect_to", `${request.nextUrl.origin}/connexion`);
  return NextResponse.redirect(authorizeUrl);
}
