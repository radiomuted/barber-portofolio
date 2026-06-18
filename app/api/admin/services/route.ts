import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const services = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });
  return NextResponse.json({ ok: true, services });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as
    | { title?: string; description?: string; price?: string; icon?: string | null }
    | null;

  if (!body?.title || !body?.description || !body?.price) {
    return NextResponse.json(
      { ok: false, error: "Missing fields" },
      { status: 400 },
    );
  }

  const max = await prisma.service.aggregate({ _max: { order: true } });
  const order = (max._max.order ?? 0) + 1;

  const service = await prisma.service.create({
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      icon: body.icon ?? null,
      order,
    },
  });

  return NextResponse.json({ ok: true, service });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return unauthorized();
  const body = (await req.json().catch(() => null)) as
    | { id?: string; title?: string; description?: string; price?: string; icon?: string | null }
    | null;

  if (!body?.id || !body.title || !body.description || !body.price) {
    return NextResponse.json(
      { ok: false, error: "Missing fields" },
      { status: 400 },
    );
  }

  const service = await prisma.service.update({
    where: { id: body.id },
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      icon: body.icon ?? null,
    },
  });
  return NextResponse.json({ ok: true, service });
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
  await prisma.service.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}

