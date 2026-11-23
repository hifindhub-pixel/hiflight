import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, applySessionCookies } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth) {
      const response = NextResponse.next();
      if (auth.refreshedSession) applySessionCookies(response, auth.refreshedSession);
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  } catch {
    // Fail closed when a session cannot be verified.
  }
  const login = new URL("/connexion", request.url);
  login.searchParams.set("next", request.nextUrl.searchParams.get("view") === "passport"
    ? "/world-map?view=passport" : "/world-map");
  const response = NextResponse.redirect(login);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/world-map/:path*"] };
