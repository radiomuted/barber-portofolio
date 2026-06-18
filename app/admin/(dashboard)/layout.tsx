import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-stroke bg-bg/70 px-5 py-6">
        <div className="font-heading text-2xl">Admin</div>
        <div className="mt-1 text-xs text-muted">
          Ahmad Farid Setiawan — Dashboard
        </div>

        <nav className="mt-8 grid gap-2 text-sm">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/profile", label: "Profile" },
            { href: "/admin/services", label: "Services" },
            { href: "/admin/gallery", label: "Gallery" },
            { href: "/admin/testimonials", label: "Testimonials" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="focus-ring rounded-xl border border-stroke bg-brown/10 px-4 py-3 hover:bg-cream/5"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <LogoutButton />
        </div>
      </aside>

      <main className="px-6 py-8">{children}</main>
    </div>
  );
}

