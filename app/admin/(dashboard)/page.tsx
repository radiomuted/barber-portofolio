import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [services, gallery, testimonials] = await Promise.all([
    prisma.service.count(),
    prisma.galleryItem.count(),
    prisma.testimonial.count(),
  ]);

  return (
    <div>
      <h1 className="font-heading text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">
        Ringkasan cepat untuk konten website.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Services", value: services },
          { label: "Gallery Items", value: gallery },
          { label: "Testimonials", value: testimonials },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-stroke bg-brown/15 p-6"
          >
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-2 font-heading text-3xl text-gold">
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

