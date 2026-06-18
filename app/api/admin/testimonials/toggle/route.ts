import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin";

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as
    | { id?: string; published?: boolean }
    | null;
  if (!body?.id || typeof body.published !== "boolean") {
    return NextResponse.json(
      { ok: false, error: "Missing fields" },
      { status: 400 },
    );
  }

  const item = await prisma.testimonial.update({
    where: { id: body.id },
    data: { published: body.published },
  });
  return NextResponse.json({ ok: true, item });
}

