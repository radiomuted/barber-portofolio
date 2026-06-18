import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";

export function HeroSection({
  name,
  tagline,
  avatarUrl,
  experience,
  clients,
  styles,
}: {
  name: string;
  tagline: string;
  avatarUrl?: string | null;
  experience: number;
  clients: number;
  styles: number;
}) {
  return (
    <section
      id="home"
      className="relative min-h-[88svh] flex items-center px-6 pt-28 pb-16"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-brown/50 via-bg to-bg" />
      <div className="absolute top-24 right-0 hidden h-72 w-72 rounded-full bg-gold/5 blur-3xl lg:block" />
      <div className="absolute bottom-16 left-0 hidden h-64 w-64 rounded-full bg-brown/30 blur-3xl lg:block" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <FadeIn>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold/60" />
              <p className="text-gold tracking-[0.22em] uppercase text-xs">
                Barber Portfolio
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.06}>
            <h1 className="font-heading mt-5 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {name}
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="mt-5 max-w-xl text-muted text-lg sm:text-xl">{tagline}</p>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { label: "Experience", value: `${experience}+ yrs` },
                { label: "Clients", value: `${clients}+` },
                { label: "Styles", value: `${styles}+` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-full border border-stroke bg-brown/20 px-4 py-2 text-sm"
                >
                  <span className="text-gold font-semibold">{s.value}</span>
                  <span className="ml-2 text-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="focus-ring inline-flex items-center justify-center rounded-full bg-gold text-bg px-7 py-3 font-semibold transition hover:brightness-110"
                href="#contact"
              >
                Book Now
              </a>
              <a
                className="focus-ring inline-flex items-center justify-center rounded-full border border-stroke px-7 py-3 font-semibold text-cream transition hover:bg-cream/5"
                href="#gallery"
              >
                See My Work
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.18}>
            <p className="mt-8 text-xs tracking-[0.18em] uppercase text-muted">
              Bogor & Sekitarnya · Classic · Fade · Beard Grooming
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.08} className="hidden lg:block">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/25" />
            <div className="absolute -inset-6 rounded-[2.25rem] border border-stroke/60" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-stroke bg-brown/20 aspect-[4/5]">
              <Image
                src={avatarUrl || "/uploads/placeholder.svg"}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 360px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 left-6 right-6 rounded-xl border border-stroke bg-bg/90 px-4 py-3 text-center text-sm backdrop-blur">
              <span className="text-gold font-semibold">Precision</span>
              <span className="text-muted"> · Detail · Comfort</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

