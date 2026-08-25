import { NextRequest } from "next/server";
import { authenticateRequest, jsonWithAuth } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return jsonWithAuth({ user: null }, 200);
  return jsonWithAuth({ user: auth.user }, 200, auth);
}
