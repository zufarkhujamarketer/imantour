import Link from "next/link";
import Image from "next/image";
import { prisma } from "@imantour/database";
import { formatPrice, parseJsonArray } from "@imantour/shared/src/utils";
import { MapPin, Clock, Users } from "lucide-react";

export default async function ToursPage({ searchParams }: { searchParams: Promise<{ kategoriya?: string }> }) {
  const { kategoriya } = await searchParams;
  const [categories, tours] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.tour.findMany({
      where: { published: true, ...(kategoriya ? { category: { slug: kategoriya } } : {}) },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="section-title">Tur katalogi</h1>
      <p className="mt-2 text-gray-500">Barcha mavjud tur paketlar</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/turlar" className={`rounded-full px-4 py-2 text-sm font-medium transition ${!kategoriya ? "bg-brand-600 text-white" : "bg-white border hover:bg-brand-50"}`}>
          Barchasi
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/turlar?kategoriya=${cat.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${kategoriya === cat.slug ? "bg-brand-600 text-white" : "bg-white border hover:bg-brand-50"}`}>
            {cat.name}
          </Link>
        ))}
      </div>

      {tours.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">Bu kategoriyada hozircha turlar yo'q.</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => {
            const images = parseJsonArray(tour.images);
            return (
              <Link key={tour.id} href={`/turlar/${tour.slug}`} className="card-hover overflow-hidden rounded-2xl border bg-white">
                <div className="relative h-48 bg-gradient-to-br from-brand-100 to-brand-300">
                  {images[0] ? <Image src={images[0]} alt={tour.title} fill className="object-cover" /> : <div className="flex h-full items-center justify-center text-5xl">🗺️</div>}
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-brand-600">{tour.category.name}</span>
                  <h2 className="mt-1 text-lg font-bold">{tour.title}</h2>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{tour.shortDesc || tour.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tour.destination}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tour.duration}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{tour.maxPeople}</span>
                  </div>
                  <p className="mt-4 font-bold text-brand-700">{formatPrice(tour.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
