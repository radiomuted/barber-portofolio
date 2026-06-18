import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin";

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as
    | { orderedIds?: string[] }
    | null;
  const orderedIds = body?.orderedIds ?? [];
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "orderedIds required" },
      { status: 400 },
    );
  }

  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.galleryItem.update({ where: { id }, data: { order: idx + 1 } }),
    ),
  );

  return NextResponse.json({ ok: true });
}

