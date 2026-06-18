import Image from "next/image";
import { FadeIn } from "../ui/FadeIn";

export function AboutSection({
  bio,
  experience,
  clients,
  styles,
  aboutImageUrl,
}: {
  bio: string;
  experience: number;
  clients: number;
  styles: number;
  aboutImageUrl?: string | null;
}) {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto w-full max-w-5xl grid gap-10 md:grid-cols-[minmax(0,240px)_1fr] md:items-start">
        <FadeIn className="relative mx-auto w-full max-w-[220px] overflow-hidden rounded-2xl border border-stroke bg-brown/20 aspect-[4/5] sm:max-w-[240px] md:mx-0">
          <Image
            src={aboutImageUrl || "/uploads/placeholder.svg"}
            alt="Ahmad Farid Setiawan"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 220px, 240px"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/65 to-transparent" />
        </FadeIn>

        <div>
          <FadeIn>
            <h2 className="font-heading text-3xl">About</h2>
          </FadeIn>
          <FadeIn delay={0.06}>
            <p className="mt-4 text-muted leading-7">{bio}</p>
          </FadeIn>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Years of Experience", value: `${experience}+` },
              { label: "Happy Clients", value: `${clients}+` },
              { label: "Haircut Styles", value: `${styles}+` },
            ].map((s, idx) => (
              <FadeIn key={s.label} delay={0.08 + idx * 0.04}>
                <div className="rounded-xl border border-stroke bg-bg/40 px-4 py-4">
                  <div className="font-heading text-2xl text-gold">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

