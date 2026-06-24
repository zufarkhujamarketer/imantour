"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Plane } from "lucide-react";

const links = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/turlar", label: "Turlar" },
  { href: "/blog", label: "Blog" },
  { href: "/aloqa", label: "Aloqa" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/50 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-800">
          <Plane className="h-7 w-7 text-brand-600" />
          <span className="font-display">Iman<span className="text-brand-600">Tour</span></span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-600 transition hover:text-brand-600">
              {l.label}
            </Link>
          ))}
          <Link href="/turlar" className="btn-primary text-sm !py-2 !px-5">
            Bron qilish
          </Link>
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menyu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t bg-white px-4 py-4 md:hidden animate-fade-in">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-gray-700 hover:text-brand-600">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
