import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminJwt } from "./auth";

const COOKIE_NAME = "admin_session";

export async function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = await verifyAdminJwt(token);
    if (payload.sub !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

