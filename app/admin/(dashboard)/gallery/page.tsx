import { prisma } from "@/lib/prisma";
import { AdminGalleryClient } from "../../gallery/gallery-client";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="font-heading text-3xl">Gallery</h1>
      <p className="mt-2 text-sm text-muted">
        Upload foto, atur kategori, caption, hapus, dan urutan.
      </p>
      <div className="mt-8">
        <AdminGalleryClient initial={items} />
      </div>
    </div>
  );
}

