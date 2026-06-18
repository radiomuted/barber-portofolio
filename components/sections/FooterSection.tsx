import { FadeIn } from "../ui/FadeIn";

export function FooterSection({
  name,
  tagline,
  instagram,
  tiktok,
  facebook,
}: {
  name: string;
  tagline: string;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
}) {
  const links = [
    { label: "Instagram", href: instagram || "#" },
    { label: "TikTok", href: tiktok || "#" },
    { label: "Facebook", href: facebook || "#" },
  ];

  return (
    <footer className="px-6 py-10 border-t border-stroke bg-bg/60">
      <div className="mx-auto w-full max-w-5xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FadeIn>
          <div>
            <div className="font-heading">{name}</div>
            <div className="text-sm text-muted">{tagline}</div>
          </div>
        </FadeIn>

        <FadeIn delay={0.04}>
          <div className="flex items-center gap-4 text-sm">
            {links.map((l) => (
              <a
                key={l.label}
                className="hover:text-gold"
                href={l.href}
                target={l.href === "#" ? undefined : "_blank"}
                rel={l.href === "#" ? undefined : "noreferrer"}
                aria-label={l.label}
              >
                {l.label}
              </a>
            ))}
          </div>
        </FadeIn>
      </div>
      <div className="mx-auto w-full max-w-5xl mt-6 text-xs text-muted">
        © 2026 Ahmad Farid Setiawan. All rights reserved.
      </div>
    </footer>
  );
}

