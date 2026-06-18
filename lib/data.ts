import { prisma } from "./prisma";

export async function getPublicContent() {
  const [profile, services, gallery, testimonials] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "profile" } }),
    prisma.service.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }] }),
    prisma.galleryItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { author: "asc" }],
    }),
  ]);

  return {
    profile,
    services,
    gallery,
    testimonials,
  };
}

