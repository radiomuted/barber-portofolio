"use client";

import * as React from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function HeaderNav() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-stroke bg-bg/70 backdrop-blur">
      <div className="mx-auto w-full max-w-5xl px-6 py-4 flex items-center justify-between">
        <a href="#home" className="font-heading text-lg">
          Ahmad Farid Setiawan
        </a>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gold">
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="focus-ring rounded-full bg-gold text-bg px-4 py-2 font-semibold hover:brightness-110"
          >
            Book
          </a>
        </nav>

        <button
          className="md:hidden focus-ring rounded-xl border border-stroke px-3 py-2 text-sm"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>
      {open ? (
        <div className="md:hidden px-6 pb-4">
          <div className="rounded-2xl border border-stroke bg-brown/10 p-4 grid gap-3 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-gold"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

