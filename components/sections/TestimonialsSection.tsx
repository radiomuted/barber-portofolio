"use client";

import type { Testimonial } from "@prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";
import { FadeIn } from "../ui/FadeIn";

function Stars({ rating }: { rating: number }) {
  const r = Math.max(1, Math.min(5, rating));
  return (
    <div className="text-gold text-sm" aria-label={`${r} stars`}>
      {"★".repeat(r)}
      <span className="text-muted">{"★".repeat(5 - r)}</span>
    </div>
  );
}

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: true,
  });
  const [selected, setSelected] = React.useState(0);
  const [snaps, setSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    setSnaps(embla.scrollSnapList());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", () => setSnaps(embla.scrollSnapList()));
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  return (
    <section id="testimonials" className="px-6 py-20">
      <div className="mx-auto w-full max-w-5xl">
        <FadeIn>
          <h2 className="font-heading text-3xl">Testimonials</h2>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mt-10 rounded-2xl border border-stroke bg-brown/10">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className="min-w-0 flex-[0_0_100%] p-6 sm:flex-[0_0_50%]"
                  >
                    <div className="h-full rounded-2xl border border-stroke bg-brown/15 p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="font-semibold">{t.author}</div>
                        <Stars rating={t.rating} />
                      </div>
                      <p className="mt-3 text-sm text-muted leading-6">
                        {t.review}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-6 pb-5">
              <div className="flex gap-2">
                {snaps.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={[
                      "h-2.5 w-2.5 rounded-full transition",
                      i === selected ? "bg-gold" : "bg-cream/20",
                    ].join(" ")}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => embla?.scrollTo(i)}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="focus-ring rounded-full border border-stroke px-4 py-2 text-sm hover:bg-cream/5"
                  onClick={() => embla?.scrollPrev()}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="focus-ring rounded-full border border-stroke px-4 py-2 text-sm hover:bg-cream/5"
                  onClick={() => embla?.scrollNext()}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

