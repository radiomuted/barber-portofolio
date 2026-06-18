import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const profile = await prisma.profile.findUnique({ where: { id: "profile" } });
  return NextResponse.json({ ok: true, profile });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const body = (await req.json().catch(() => null)) as
    | Partial<{
        name: string;
        tagline: string;
        bio: string;
        experience: number;
        clients: number;
        styles: number;
        phone: string | null;
        instagram: string | null;
        linkedin: string | null;
        tiktok: string | null;
        facebook: string | null;
        avatarUrl: string | null;
        aboutImageUrl: string | null;
      }>
    | null;

  if (!body?.bio) {
    return NextResponse.json(
      { ok: false, error: "Bio is required" },
      { status: 400 },
    );
  }

  const profile = await prisma.profile.upsert({
    where: { id: "profile" },
    update: {
      name: body.name,
      tagline: body.tagline,
      bio: body.bio,
      experience: Number(body.experience ?? 0),
      clients: Number(body.clients ?? 0),
      styles: Number(body.styles ?? 0),
      phone: body.phone ?? null,
      instagram: body.instagram ?? null,
      linkedin: body.linkedin ?? null,
      tiktok: body.tiktok ?? null,
      facebook: body.facebook ?? null,
      avatarUrl: body.avatarUrl ?? null,
      aboutImageUrl: body.aboutImageUrl ?? null,
    },
    create: {
      id: "profile",
      name: body.name ?? "Ahmad Farid Setiawan",
      tagline: body.tagline ?? "Precision Cuts. Timeless Style.",
      bio: body.bio,
      experience: Number(body.experience ?? 0),
      clients: Number(body.clients ?? 0),
      styles: Number(body.styles ?? 0),
      phone: body.phone ?? null,
      instagram: body.instagram ?? null,
      linkedin: body.linkedin ?? null,
      tiktok: body.tiktok ?? null,
      facebook: body.facebook ?? null,
      avatarUrl: body.avatarUrl ?? null,
      aboutImageUrl: body.aboutImageUrl ?? null,
    },
  });

  return NextResponse.json({ ok: true, profile });
}

