"use client";

import type { GalleryItem } from "@prisma/client";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; path?: string; error?: string }
    | null;
  if (!res.ok) {
    throw new Error(data?.error || `Upload failed (${res.status})`);
  }
  if (!data?.ok || !data.path) {
    throw new Error(data?.error || "Upload failed (invalid response)");
  }
  return data.path;
}

const categoryOptions = [
  { value: "fade", label: "Fade" },
  { value: "classic", label: "Classic" },
  { value: "beard", label: "Beard" },
] as const;

export function AdminGalleryClient({ initial }: { initial: GalleryItem[] }) {
  const [items, setItems] = React.useState<GalleryItem[]>(initial);
  const [uploading, setUploading] = React.useState(false);
  const [replacingId, setReplacingId] = React.useState<string | null>(null);

  const [category, setCategory] = React.useState<string>("fade");
  const [caption, setCaption] = React.useState<string>("");

  async function refresh() {
    const res = await fetch("/api/admin/gallery");
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; items?: GalleryItem[]; error?: string }
      | null;
    if (!res.ok || !data?.ok || !data.items)
      throw new Error(data?.error || "Fetch failed");
    setItems(data.items);
  }

  async function replaceImage(itemId: string, file: File) {
    setReplacingId(itemId);
    try {
      const path = await uploadFile(file);
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, imageUrl: path }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Gagal mengganti foto");
      toast.success("Foto diganti");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengganti foto");
    } finally {
      setReplacingId(null);
    }
  }

  async function persistReorder(next: GalleryItem[]) {
    setItems(next);
    try {
      const res = await fetch("/api/admin/gallery/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: next.map((x) => x.id) }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Reorder failed");
      toast.success("Urutan tersimpan");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reorder gagal");
      await refresh();
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-stroke bg-brown/10 p-4">
        <div className="text-sm text-muted">Upload foto baru</div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_260px_1fr]">
          <label className="grid gap-2 text-sm">
            <span className="text-muted">File</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const path = await uploadFile(file);
                  const res = await fetch("/api/admin/gallery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      imageUrl: path,
                      category,
                      caption: caption || null,
                    }),
                  });
                  const data = (await res.json().catch(() => null)) as
                    | { ok?: boolean; error?: string }
                    | null;
                  if (!res.ok || !data?.ok)
                    throw new Error(data?.error || "Create failed");
                  toast.success("Foto ditambahkan");
                  setCaption("");
                  await refresh();
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "Upload gagal",
                  );
                } finally {
                  setUploading(false);
                  e.target.value = "";
                }
              }}
              className="text-sm"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted">Category</span>
            <select
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted">Caption (optional)</span>
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Mis. Low fade + textured crop"
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-stroke bg-brown/10 p-4">
        <div className="text-sm text-muted">Daftar foto</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="rounded-xl border border-stroke bg-bg/30 overflow-hidden"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={it.imageUrl}
                  alt={it.caption ?? "Gallery"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 grid gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted">
                    {it.category.toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="focus-ring rounded-lg border border-stroke px-3 py-1.5 text-xs hover:bg-cream/5 disabled:opacity-40"
                      disabled={idx === 0}
                      onClick={() => {
                        const next = items.slice();
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        void persistReorder(next);
                      }}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="focus-ring rounded-lg border border-stroke px-3 py-1.5 text-xs hover:bg-cream/5 disabled:opacity-40"
                      disabled={idx === items.length - 1}
                      onClick={() => {
                        const next = items.slice();
                        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                        void persistReorder(next);
                      }}
                    >
                      Down
                    </button>
                  </div>
                </div>

                <label className="grid gap-2 text-sm">
                  <span className="text-muted">Ganti foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="focus-ring rounded-xl border border-stroke bg-bg/40 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-bg"
                    disabled={replacingId === it.id || uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await replaceImage(it.id, file);
                      e.target.value = "";
                    }}
                  />
                  {replacingId === it.id ? (
                    <span className="text-xs text-gold">Mengunggah foto baru…</span>
                  ) : null}
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-muted">Caption</span>
                  <input
                    className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                    defaultValue={it.caption ?? ""}
                    onBlur={async (e) => {
                      const nextCaption = e.target.value.trim();
                      try {
                        const res = await fetch("/api/admin/gallery", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: it.id,
                            caption: nextCaption || null,
                            category: it.category,
                          }),
                        });
                        const data = (await res.json().catch(() => null)) as
                          | { ok?: boolean; error?: string }
                          | null;
                        if (!res.ok || !data?.ok)
                          throw new Error(data?.error || "Update failed");
                        toast.success("Tersimpan");
                        await refresh();
                      } catch (err) {
                        toast.error(
                          err instanceof Error ? err.message : "Gagal menyimpan",
                        );
                      }
                    }}
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-muted">Category</span>
                  <select
                    className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                    value={it.category}
                    onChange={async (e) => {
                      try {
                        const res = await fetch("/api/admin/gallery", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: it.id,
                            category: e.target.value,
                            caption: it.caption ?? null,
                          }),
                        });
                        const data = (await res.json().catch(() => null)) as
                          | { ok?: boolean; error?: string }
                          | null;
                        if (!res.ok || !data?.ok)
                          throw new Error(data?.error || "Update failed");
                        toast.success("Tersimpan");
                        await refresh();
                      } catch (err) {
                        toast.error(
                          err instanceof Error ? err.message : "Gagal menyimpan",
                        );
                      }
                    }}
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>

                <ConfirmButton
                  className="focus-ring rounded-full border border-stroke px-4 py-2 text-xs hover:bg-cream/5"
                  confirmText="Hapus item gallery ini?"
                  onConfirm={async () => {
                    try {
                      const res = await fetch("/api/admin/gallery", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: it.id }),
                      });
                      const data = (await res.json().catch(() => null)) as
                        | { ok?: boolean; error?: string }
                        | null;
                      if (!res.ok || !data?.ok)
                        throw new Error(data?.error || "Delete failed");
                      toast.success("Dihapus");
                      await refresh();
                    } catch (err) {
                      toast.error(
                        err instanceof Error ? err.message : "Delete gagal",
                      );
                    }
                  }}
                >
                  Delete
                </ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

