"use client";

import type { Service } from "@prisma/client";
import * as React from "react";
import { toast } from "sonner";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export function AdminServicesClient({ initial }: { initial: Service[] }) {
  const [items, setItems] = React.useState<Service[]>(initial);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const editing = items.find((x) => x.id === editingId) ?? null;

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (mode === "edit" && editing) {
      setTitle(editing.title);
      setDescription(editing.description);
      setPrice(editing.price);
    } else if (mode === "create") {
      setTitle("");
      setDescription("");
      setPrice("");
    }
  }, [mode, editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function refresh() {
    const res = await fetch("/api/admin/services");
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; services?: Service[]; error?: string }
      | null;
    if (!res.ok || !data?.ok || !data.services) throw new Error(data?.error || "Fetch failed");
    setItems(data.services);
  }

  async function persistReorder(next: Service[]) {
    setItems(next);
    try {
      const res = await fetch("/api/admin/services/reorder", {
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
          <div className="text-sm text-muted">Daftar layanan</div>
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
          {items.map((s, idx) => (
            <div
              key={s.id}
              className="rounded-xl border border-stroke bg-bg/30 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{s.title}</div>
                  <div className="mt-1 text-xs text-muted">{s.price}</div>
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

              <div className="mt-2 text-sm text-muted">{s.description}</div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  className="focus-ring rounded-full bg-gold text-bg px-4 py-2 text-xs font-semibold hover:brightness-110"
                  onClick={() => {
                    setMode("edit");
                    setEditingId(s.id);
                  }}
                >
                  Edit
                </button>

                <ConfirmButton
                  className="focus-ring rounded-full border border-stroke px-4 py-2 text-xs hover:bg-cream/5"
                  confirmText={`Hapus layanan \"${s.title}\"?`}
                  onConfirm={async () => {
                    try {
                      const res = await fetch("/api/admin/services", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: s.id }),
                      });
                      const data = (await res.json().catch(() => null)) as
                        | { ok?: boolean; error?: string }
                        | null;
                      if (!res.ok || !data?.ok) throw new Error(data?.error || "Delete failed");
                      toast.success("Service dihapus");
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
          {mode === "create" ? "Tambah layanan" : "Edit layanan"}
        </div>

        <form
          className="mt-4 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
              const isEdit = mode === "edit" && editingId;
              const res = await fetch("/api/admin/services", {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...(isEdit ? { id: editingId } : {}),
                  title,
                  description,
                  price,
                }),
              });
              const data = (await res.json().catch(() => null)) as
                | { ok?: boolean; error?: string }
                | null;
              if (!res.ok || !data?.ok) throw new Error(data?.error || "Save failed");
              toast.success(isEdit ? "Service diperbarui" : "Service ditambahkan");
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
          <Field label="Title">
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className="focus-ring min-h-28 rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Field>
          <Field label="Price">
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Mulai dari Rp 50.000"
              required
            />
          </Field>

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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}

