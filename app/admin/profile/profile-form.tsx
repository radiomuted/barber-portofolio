"use client";

import type { Profile } from "@prisma/client";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

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

export function AdminProfileForm({ initial }: { initial: Profile | null }) {
  const [name, setName] = React.useState(initial?.name ?? "Ahmad Farid Setiawan");
  const [tagline, setTagline] = React.useState(
    initial?.tagline ?? "Precision Cuts. Timeless Style.",
  );
  const [bio, setBio] = React.useState(initial?.bio ?? "");
  const [experience, setExperience] = React.useState(initial?.experience ?? 0);
  const [clients, setClients] = React.useState(initial?.clients ?? 0);
  const [styles, setStyles] = React.useState(initial?.styles ?? 0);
  const [phone, setPhone] = React.useState(initial?.phone ?? "");
  const [instagram, setInstagram] = React.useState(initial?.instagram ?? "");
  const [linkedin, setLinkedin] = React.useState(initial?.linkedin ?? "");
  const [tiktok, setTiktok] = React.useState(initial?.tiktok ?? "");
  const [facebook, setFacebook] = React.useState(initial?.facebook ?? "");
  const [avatarUrl, setAvatarUrl] = React.useState(
    initial?.avatarUrl ?? "/uploads/placeholder.svg",
  );
  const [aboutImageUrl, setAboutImageUrl] = React.useState(
    initial?.aboutImageUrl ?? "/uploads/placeholder.svg",
  );
  const [saving, setSaving] = React.useState(false);
  const [uploadingTarget, setUploadingTarget] = React.useState<
    "avatar" | "about" | null
  >(null);

  async function handleUpload(
    file: File,
    target: "avatar" | "about",
  ) {
    setUploadingTarget(target);
    try {
      const path = await uploadFile(file);
      if (target === "avatar") setAvatarUrl(path);
      else setAboutImageUrl(path);
      toast.success(
        target === "avatar" ? "Foto hero terunggah" : "Foto about terunggah",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploadingTarget(null);
    }
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          const res = await fetch("/api/admin/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              tagline,
              bio,
              experience,
              clients,
              styles,
              phone: phone || null,
              instagram: instagram || null,
              linkedin: linkedin || null,
              tiktok: tiktok || null,
              facebook: facebook || null,
              avatarUrl: avatarUrl || null,
              aboutImageUrl: aboutImageUrl || null,
            }),
          });
          const data = (await res.json().catch(() => null)) as
            | { ok?: boolean; error?: string }
            | null;
          if (!res.ok || !data?.ok) throw new Error(data?.error || "Gagal menyimpan");
          toast.success("Profile tersimpan");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="grid gap-4">
          <PhotoUploadCard
            title="Foto Hero"
            description="Ditampilkan di bagian atas (hero)."
            imageUrl={avatarUrl}
            uploading={uploadingTarget === "avatar"}
            onUpload={(file) => handleUpload(file, "avatar")}
          />
          <PhotoUploadCard
            title="Foto About"
            description="Ditampilkan khusus di section About."
            imageUrl={aboutImageUrl}
            uploading={uploadingTarget === "about"}
            onUpload={(file) => handleUpload(file, "about")}
          />
        </div>

        <div className="grid gap-4">
          <Field label="Name">
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field label="Tagline">
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
            />
          </Field>
          <Field label="Bio">
            <textarea
              className="focus-ring min-h-32 rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Years of Experience">
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
              />
            </Field>
            <Field label="Happy Clients">
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                type="number"
                min={0}
                value={clients}
                onChange={(e) => setClients(Number(e.target.value))}
              />
            </Field>
            <Field label="Haircut Styles">
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                type="number"
                min={0}
                value={styles}
                onChange={(e) => setStyles(Number(e.target.value))}
              />
            </Field>
          </div>

          <Field label="Phone (E.164 recommended)">
            <input
              className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 8xx-xxxx-xxxx"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram">
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="LinkedIn">
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
            <Field label="TikTok">
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="https://tiktok.com/@..."
              />
            </Field>
            <Field label="Facebook">
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="focus-ring inline-flex items-center justify-center rounded-full bg-gold text-bg px-7 py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
          type="submit"
          disabled={saving || uploadingTarget !== null}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <div className="text-xs text-muted">
          Upload foto ke <code>/public/uploads</code>, lalu klik <b>Save</b> untuk menyimpannya ke database.
        </div>
      </div>
    </form>
  );
}

function PhotoUploadCard({
  title,
  description,
  imageUrl,
  uploading,
  onUpload,
}: {
  title: string;
  description: string;
  imageUrl: string;
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="rounded-2xl border border-stroke bg-brown/10 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-1 text-xs text-muted">{description}</p>
      <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-xl border border-stroke bg-bg/40">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <label className="mt-4 grid gap-2 text-sm">
        <span className="text-muted">Upload foto</span>
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onUpload(file);
            e.target.value = "";
          }}
        />
      </label>
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

