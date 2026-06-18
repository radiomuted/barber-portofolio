import { prisma } from "@/lib/prisma";
import { AdminProfileForm } from "../../profile/profile-form";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findUnique({ where: { id: "profile" } });
  return (
    <div>
      <h1 className="font-heading text-3xl">Profile</h1>
      <p className="mt-2 text-sm text-muted">Edit informasi publik barber.</p>
      <div className="mt-8">
        <AdminProfileForm initial={profile} />
      </div>
    </div>
  );
}

