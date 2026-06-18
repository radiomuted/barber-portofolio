"use client";

import type { GalleryItem } from "@prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FadeIn } from "../ui/FadeIn";

const filters = [
  { key: "all", label: "All" },
  { key: "fade", label: "Fade" },
  { key: "classic", label: "Classic" },
  { key: "beard", label: "Beard" },
] as const;

function useScrollStep() {
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setStep(3);
      else if (window.matchMedia("(min-width: 640px)").matches) setStep(2);
      else setStep(1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return step;
}

export function GallerySection({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = React.useState<(typeof filters)[number]["key"]>(
    "all",
  );
  const [open, setOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [selected, setSelected] = React.useState(0);
  const scrollStep = useScrollStep();

  const filtered = React.useMemo(() => {
    if (active === "all") return items;
    return items.filter((it) => it.category.toLowerCase() === active);
  }, [items, active]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / scrollStep));
  const currentPage = Math.min(
    Math.floor(selected / scrollStep),
    pageCount - 1,
  );

  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });

  const lightboxSlides = React.useMemo(
    () =>
      filtered.map((it) => ({
        src: it.imageUrl,
        alt: it.caption ?? "Gallery",
        title: it.caption ?? undefined,
      })),
    [filtered],
  );

  const maxSnapIndex = Math.max(0, filtered.length - scrollStep);

  const scrollByStep = React.useCallback(
    (direction: "prev" | "next") => {
      if (!embla) return;
      const nextIndex =
        direction === "next"
          ? Math.min(selected + scrollStep, maxSnapIndex)
          : Math.max(selected - scrollStep, 0);
      embla.scrollTo(nextIndex);
    },
    [embla, selected, scrollStep, maxSnapIndex],
  );

  React.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  React.useEffect(() => {
    if (!embla) return;
    embla.reInit();
    embla.scrollTo(0, true);
    setSelected(0);
  }, [embla, active, filtered.length, scrollStep]);

  return (
    <section id="gallery" className="px-6 py-20">
      <div className="mx-auto w-full max-w-5xl">
        <FadeIn>
          <h2 className="font-heading text-3xl">Portfolio</h2>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = f.key === active;
              return (
                <button
                  key={f.key}
                  className={[
                    "focus-ring rounded-full px-4 py-2 text-sm transition",
                    isActive
                      ? "bg-gold text-bg"
                      : "border border-stroke hover:bg-cream/5",
                  ].join(" ")}
                  type="button"
                  onClick={() => setActive(f.key)}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mt-8 rounded-2xl border border-stroke bg-brown/10">
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted">
                Belum ada foto untuk kategori ini.
              </div>
            ) : (
              <>
                <div className="overflow-hidden p-6" ref={emblaRef}>
                  <div className="flex -ml-4">
                    {filtered.map((it, i) => (
                      <div
                        key={it.id}
                        className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                      >
                        <button
                          type="button"
                          className="group block w-full overflow-hidden rounded-xl border border-stroke bg-bg/40 text-left"
                          onClick={() => {
                            setLightboxIndex(i);
                            setOpen(true);
                          }}
                        >
                          <div className="relative aspect-[3/4]">
                            <Image
                              src={it.imageUrl}
                              alt={it.caption ?? "Gallery"}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg/55 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                          {it.caption ? (
                            <div className="px-4 py-3 text-sm text-muted line-clamp-1">
                              {it.caption}
                            </div>
                          ) : null}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 pb-5">
                  <div className="flex gap-2">
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={[
                          "h-2.5 w-2.5 rounded-full transition",
                          i === currentPage ? "bg-gold" : "bg-cream/20",
                        ].join(" ")}
                        aria-label={`Go to page ${i + 1}`}
                        onClick={() => embla?.scrollTo(i * scrollStep)}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="focus-ring rounded-full border border-stroke px-4 py-2 text-sm hover:bg-cream/5 disabled:opacity-40"
                      disabled={selected <= 0}
                      onClick={() => scrollByStep("prev")}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      className="focus-ring rounded-full border border-stroke px-4 py-2 text-sm hover:bg-cream/5 disabled:opacity-40"
                      disabled={selected >= maxSnapIndex}
                      onClick={() => scrollByStep("next")}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </FadeIn>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={lightboxIndex}
          slides={lightboxSlides}
        />
      </div>
    </section>
  );
}
