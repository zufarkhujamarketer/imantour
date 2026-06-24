import Link from "next/link";
import { prisma } from "@imantour/database";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });

  return (
    <footer className="bg-brand-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-bold">ImanTour</h3>
          <p className="mt-3 text-sm text-brand-200">{settings?.aboutText}</p>
        </div>
        <div>
          <h4 className="font-semibold">Sahifalar</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-200">
            <li><Link href="/turlar" className="hover:text-white">Turlar</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/aloqa" className="hover:text-white">Aloqa</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Aloqa</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-200">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" />{settings?.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" />{settings?.email}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" />{settings?.address}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Ijtimoiy tarmoqlar</h4>
          <div className="mt-3 flex gap-3">
            <a href={`https://instagram.com/${settings?.instagram?.replace("@", "")}`} className="rounded-full bg-brand-800 p-2 hover:bg-brand-700">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={`https://t.me/${settings?.telegram?.replace("@", "")}`} className="rounded-full bg-brand-800 px-3 py-2 text-sm hover:bg-brand-700">
              Telegram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-800 py-4 text-center text-sm text-brand-300">
        © {new Date().getFullYear()} ImanTour. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}
