import { prisma } from "@/lib/prisma";
import { AdminServicesClient } from "../../services/services-client";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });

  return (
    <div>
      <h1 className="font-heading text-3xl">Services</h1>
      <p className="mt-2 text-sm text-muted">
        Tambah, edit, hapus, dan atur urutan layanan.
      </p>
      <div className="mt-8">
        <AdminServicesClient initial={services} />
      </div>
    </div>
  );
}

