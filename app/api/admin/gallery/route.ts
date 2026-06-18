import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as
    | { imageUrl?: string; category?: string; caption?: string | null }
    | null;

  if (!body?.imageUrl) {
    return NextResponse.json(
      { ok: false, error: "imageUrl required" },
      { status: 400 },
    );
  }

  const max = await prisma.galleryItem.aggregate({ _max: { order: true } });
  const order = (max._max.order ?? 0) + 1;

  const item = await prisma.galleryItem.create({
    data: {
      imageUrl: body.imageUrl,
      category: (body.category ?? "all").toLowerCase(),
      caption: body.caption ?? null,
      order,
    },
  });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as
    | {
        id?: string;
        imageUrl?: string;
        category?: string;
        caption?: string | null;
      }
    | null;
  if (!body?.id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }

  const item = await prisma.galleryItem.update({
    where: { id: body.id },
    data: {
      imageUrl: body.imageUrl,
      category: body.category ? body.category.toLowerCase() : undefined,
      caption: body.caption ?? null,
    },
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) {
    return NextResponse.json(
      { ok: false, error: "Missing id" },
      { status: 400 },
    );
  }
  await prisma.galleryItem.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}

