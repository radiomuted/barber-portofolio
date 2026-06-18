"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  return (
    <main className="min-h-[100svh] px-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-stroke bg-brown/15 p-6">
        <h1 className="font-heading text-3xl">Admin Login</h1>
        <p className="mt-2 text-sm text-muted">
          Masuk untuk mengelola profil, layanan, galeri, dan testimoni.
        </p>

        <form
          className="mt-8 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const res = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
              });
              const data = (await res.json().catch(() => null)) as
                | { ok?: boolean; error?: string }
                | null;

              if (!res.ok || !data?.ok) {
                toast.error(data?.error || "Login gagal");
                return;
              }
              toast.success("Login berhasil");
              window.location.href = "/admin";
            } catch {
              toast.error("Terjadi kesalahan jaringan");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Username</span>
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Password</span>
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button
            className="focus-ring mt-2 inline-flex items-center justify-center rounded-full bg-gold text-bg px-7 py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link
          href="/"
          className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-full border border-stroke px-7 py-3 text-sm font-semibold text-cream transition hover:bg-cream/5"
        >
          Kembali ke Website Portofolio
        </Link>
      </div>
    </main>
  );
}

