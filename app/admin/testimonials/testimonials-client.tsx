"use client";

import type { Testimonial } from "@prisma/client";
import * as React from "react";
import { toast } from "sonner";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export function AdminTestimonialsClient({ initial }: { initial: Testimonial[] }) {
  const [items, setItems] = React.useState<Testimonial[]>(initial);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const editing = items.find((x) => x.id === editingId) ?? null;

  const [author, setAuthor] = React.useState("");
  const [review, setReview] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [published, setPublished] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (mode === "edit" && editing) {
      setAuthor(editing.author);
      setReview(editing.review);
      setRating(editing.rating);
      setPublished(editing.published);
    } else if (mode === "create") {
      setAuthor("");
      setReview("");
      setRating(5);
      setPublished(true);
    }
  }, [mode, editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function refresh() {
    const res = await fetch("/api/admin/testimonials");
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; items?: Testimonial[]; error?: string }
      | null;
    if (!res.ok || !data?.ok || !data.items)
      throw new Error(data?.error || "Fetch failed");
    setItems(data.items);
  }

  async function persistReorder(next: Testimonial[]) {
    setItems(next);
    try {
      const res = await fetch("/api/admin/testimonials/reorder", {
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
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="rounded-2xl border border-stroke bg-brown/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted">Daftar testimoni</div>
          <button
            type="button"
            className="focus-ring rounded-full border border-stroke px-4 py-2 text-sm hover:bg-cream/5"
            onClick={() => {
              setMode("create");
              setEditingId(null);
            }}
          >
            + Add
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {items.map((t, idx) => (
            <div
              key={t.id}
              className="rounded-xl border border-stroke bg-bg/30 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {t.author}
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[10px] border",
                        t.published
                          ? "border-gold/40 text-gold"
                          : "border-stroke text-muted",
                      ].join(" ")}
                    >
                      {t.published ? "PUBLISHED" : "HIDDEN"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Rating: {t.rating}/5
                  </div>
                </div>
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

              <p className="mt-3 text-sm text-muted leading-6">{t.review}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="focus-ring rounded-full bg-gold text-bg px-4 py-2 text-xs font-semibold hover:brightness-110"
                    onClick={() => {
                      setMode("edit");
                      setEditingId(t.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="focus-ring rounded-full border border-stroke px-4 py-2 text-xs hover:bg-cream/5"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/admin/testimonials/toggle", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: t.id,
                            published: !t.published,
                          }),
                        });
                        const data = (await res.json().catch(() => null)) as
                          | { ok?: boolean; error?: string }
                          | null;
                        if (!res.ok || !data?.ok)
                          throw new Error(data?.error || "Toggle failed");
                        toast.success(t.published ? "Disembunyikan" : "Dipublish");
                        await refresh();
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Gagal");
                      }
                    }}
                  >
                    {t.published ? "Unpublish" : "Publish"}
                  </button>
                </div>

                <ConfirmButton
                  className="focus-ring rounded-full border border-stroke px-4 py-2 text-xs hover:bg-cream/5"
                  confirmText={`Hapus testimoni dari \"${t.author}\"?`}
                  onConfirm={async () => {
                    try {
                      const res = await fetch("/api/admin/testimonials", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: t.id }),
                      });
                      const data = (await res.json().catch(() => null)) as
                        | { ok?: boolean; error?: string }
                        | null;
                      if (!res.ok || !data?.ok)
                        throw new Error(data?.error || "Delete failed");
                      toast.success("Dihapus");
                      await refresh();
                      setMode("create");
                      setEditingId(null);
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Delete gagal");
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

      <div className="rounded-2xl border border-stroke bg-brown/10 p-4">
        <div className="text-sm text-muted">
          {mode === "create" ? "Tambah testimoni" : "Edit testimoni"}
        </div>

        <form
          className="mt-4 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
              const isEdit = mode === "edit" && editingId;
              const res = await fetch("/api/admin/testimonials", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...(isEdit ? { id: editingId } : {}),
                  author,
                  review,
                  rating,
                  ...(isEdit ? {} : { published }),
                }),
              });
              const data = (await res.json().catch(() => null)) as
                | { ok?: boolean; error?: string }
                | null;
              if (!res.ok || !data?.ok) throw new Error(data?.error || "Save failed");
              toast.success(isEdit ? "Testimoni diperbarui" : "Testimoni ditambahkan");
              await refresh();
              setMode("create");
              setEditingId(null);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
            } finally {
              setSaving(false);
            }
          }}
        >
          <Field label="Author">
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </Field>
          <Field label="Rating (1-5)">
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </Field>
          <Field label="Review">
            <textarea
              className="focus-ring min-h-28 rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </Field>

          {mode === "create" ? (
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span className="text-muted">Published</span>
            </label>
          ) : null}

          <button
            className="focus-ring mt-2 inline-flex items-center justify-center rounded-full bg-gold text-bg px-7 py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving…" : mode === "create" ? "Add" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}

