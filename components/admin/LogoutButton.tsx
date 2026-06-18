"use client";

import * as React from "react";
import { toast } from "sonner";

export function LogoutButton() {
  const [loading, setLoading] = React.useState(false);

  return (
    <button
      className="focus-ring w-full rounded-xl border border-stroke px-4 py-3 text-sm hover:bg-cream/5 disabled:opacity-60"
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/admin/auth/logout", { method: "POST" });
          const data = (await res.json().catch(() => null)) as
            | { ok?: boolean; error?: string }
            | null;

          if (!res.ok || !data?.ok) {
            toast.error(data?.error || "Logout gagal");
            return;
          }

          toast.success("Logout berhasil");
          window.location.href = "/admin/login";
        } catch {
          toast.error("Terjadi kesalahan jaringan");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Logging out…" : "Logout"}
    </button>
  );
}
