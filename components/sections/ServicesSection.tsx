import { FadeIn } from "../ui/FadeIn";

export function ServicesSection({
  services,
}: {
  services: Array<{
    id: string;
    title: string;
    description: string;
    price: string;
  }>;
}) {
  return (
    <section id="services" className="px-6 py-20">
      <div className="mx-auto w-full max-w-5xl">
        <FadeIn>
          <h2 className="font-heading text-3xl">Services</h2>
        </FadeIn>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, idx) => (
            <FadeIn key={s.id} delay={0.03 * Math.min(idx, 10)}>
              <div className="rounded-2xl border border-stroke bg-brown/15 p-6">
                <div className="font-heading text-xl">{s.title}</div>
                <p className="mt-2 text-sm text-muted leading-6">
                  {s.description}
                </p>
                <div className="mt-4 text-gold font-semibold">{s.price}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

