"use client";

import * as React from "react";
import { FadeIn } from "../ui/FadeIn";
import { toast } from "sonner";

function buildWaMessage(opts: {
  name: string;
  phone: string;
  service: string;
  date: string;
  message: string;
}) {
  const lines = [
    "Halo Ahmad Farid Setiawan, saya mau booking.",
    "",
    `Nama: ${opts.name || "-"}`,
    `No. HP: ${opts.phone || "-"}`,
    `Layanan: ${opts.service || "-"}`,
    `Tanggal: ${opts.date || "-"}`,
    "",
    `Catatan: ${opts.message || "-"}`,
  ];
  return lines.join("\n");
}

export function ContactSection({
  phoneE164,
  instagram,
  linkedin,
}: {
  phoneE164: string;
  instagram?: string | null;
  linkedin?: string | null;
}) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [service, setService] = React.useState("Classic Haircut");
  const [date, setDate] = React.useState("");
  const [message, setMessage] = React.useState("");

  const waLink = React.useMemo(() => {
    const text = encodeURIComponent(
      buildWaMessage({ name, phone, service, date, message }),
    );
    const digits = phoneE164.replace(/[^\d]/g, "");
    return `https://wa.me/${digits}?text=${text}`;
  }, [name, phone, service, date, message, phoneE164]);

  return (
    <section id="contact" className="px-6 py-20">
      <div className="mx-auto w-full max-w-5xl grid gap-10 lg:grid-cols-2">
        <div>
          <FadeIn>
            <h2 className="font-heading text-3xl">Booking / Contact</h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="mt-3 text-muted">
              Klik untuk chat WhatsApp atau isi form untuk membuat pesan otomatis.
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                className="focus-ring inline-flex items-center justify-center rounded-full bg-gold text-bg px-7 py-3 font-semibold transition hover:brightness-110"
                href={`https://wa.me/${phoneE164.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp: {phoneE164}
              </a>
              {instagram ? (
                <a
                  className="focus-ring inline-flex items-center justify-center rounded-full border border-stroke px-7 py-3 font-semibold text-cream transition hover:bg-cream/5"
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              ) : null}
              {linkedin ? (
                <a
                  className="focus-ring inline-flex items-center justify-center rounded-full border border-stroke px-7 py-3 font-semibold text-cream transition hover:bg-cream/5"
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              ) : null}
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-stroke">
              <iframe
                title="Maps"
                className="h-72 w-full"
                loading="lazy"
                src="https://www.google.com/maps?q=Bogor,+Jawa+Barat,+Indonesia&z=11&output=embed"
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.06}>
          <form
            className="rounded-2xl border border-stroke bg-brown/15 p-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(waLink, "_blank", "noopener,noreferrer");
              toast.success("Membuka WhatsApp…");
            }}
          >
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Name</span>
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                required
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Phone</span>
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xx..."
                required
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Preferred Service</span>
              <select
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option>Classic Haircut</option>
                <option>Fade & Taper</option>
                <option>Beard Trim & Shaping</option>
                <option>Hair Coloring</option>
                <option>Hot Towel Shave</option>
                <option>Kids Haircut</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Preferred Date</span>
              <input
                className="focus-ring rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-muted">Message</span>
              <textarea
                className="focus-ring min-h-28 rounded-xl border border-stroke bg-bg/40 px-4 py-3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tambahkan detail (jam, referensi style, dll)…"
              />
            </label>

            <button
              className="focus-ring mt-2 inline-flex items-center justify-center rounded-full bg-gold text-bg px-7 py-3 font-semibold transition hover:brightness-110"
              type="submit"
            >
              Send via WhatsApp
            </button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

