import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const items = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { author: "asc" }],
  });
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as
    | { author?: string; review?: string; rating?: number; published?: boolean }
    | null;

  if (!body?.author || !body.review) {
    return NextResponse.json(
      { ok: false, error: "Missing fields" },
      { status: 400 },
    );
  }

  const max = await prisma.testimonial.aggregate({ _max: { order: true } });
  const order = (max._max.order ?? 0) + 1;

  const item = await prisma.testimonial.create({
    data: {
      author: body.author,
      review: body.review,
      rating: Math.max(1, Math.min(5, Number(body.rating ?? 5))),
      published: body.published ?? true,
      order,
    },
  });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as
    | { id?: string; author?: string; review?: string; rating?: number }
    | null;

  if (!body?.id || !body.author || !body.review) {
    return NextResponse.json(
      { ok: false, error: "Missing fields" },
      { status: 400 },
    );
  }

  const item = await prisma.testimonial.update({
    where: { id: body.id },
    data: {
      author: body.author,
      review: body.review,
      rating: Math.max(1, Math.min(5, Number(body.rating ?? 5))),
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
  await prisma.testimonial.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}

