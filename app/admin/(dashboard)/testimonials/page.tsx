import { prisma } from "@/lib/prisma";
import { AdminTestimonialsClient } from "../../testimonials/testimonials-client";

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { author: "asc" }],
  });

  return (
    <div>
      <h1 className="font-heading text-3xl">Testimonials</h1>
      <p className="mt-2 text-sm text-muted">
        Kelola testimoni: tambah, edit, hapus, publish/unpublish, dan urutan.
      </p>
      <div className="mt-8">
        <AdminTestimonialsClient initial={items} />
      </div>
    </div>
  );
}

