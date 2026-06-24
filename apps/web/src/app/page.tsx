import Link from "next/link";
import Image from "next/image";
import { prisma } from "@imantour/database";
import { formatPrice, parseJsonArray } from "@imantour/shared/src/utils";
import { MapPin, Clock, Users, ArrowRight, Star } from "lucide-react";

export default async function HomePage() {
  const [featuredTours, categories, latestPosts] = await Promise.all([
    prisma.tour.findMany({ where: { featured: true, published: true }, include: { category: true }, take: 4 }),
    prisma.category.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { tours: true } } } }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-400 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-teal-300 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center md:py-32">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur">✈️ O'zbekistonning #1 sayohat agentligi</span>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl animate-slide-up">
            Dunyoni kashf eting<br />
            <span className="text-brand-200">ImanTour</span> bilan
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-100">
            Samarqanddan Dubaygacha — professional gidlar, qulay narxlar va unutilmas taassurotlar sizni kutmoqda.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/turlar" className="btn-primary bg-white text-brand-800 hover:bg-brand-50">
              Turlarni ko'rish <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/aloqa" className="btn-outline border-white text-white hover:bg-white/10">
              Biz bilan bog'laning
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title text-center">Kategoriyalar</h2>
        <p className="mt-2 text-center text-gray-500">O'zingizga mos tur turini tanlang</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/turlar?kategoriya=${cat.slug}`} className="card-hover group rounded-2xl border bg-white p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl group-hover:bg-brand-200 transition">
                {cat.slug.includes("ichki") ? "🏛️" : cat.slug.includes("xalqaro") ? "🌍" : cat.slug.includes("pilgrim") ? "🕌" : "🌿"}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{cat.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{cat._count.tours} ta tur</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-title">Mashhur turlar</h2>
              <p className="mt-2 text-gray-500">Eng ko'p tanlangan sayohatlar</p>
            </div>
            <Link href="/turlar" className="hidden text-brand-600 hover:underline md:block">Barchasini ko'rish →</Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {featuredTours.map((tour) => {
              const images = parseJsonArray(tour.images);
              return (
                <Link key={tour.id} href={`/turlar/${tour.slug}`} className="card-hover group overflow-hidden rounded-2xl border bg-sand-50">
                  <div className="relative h-56 bg-gradient-to-br from-brand-200 to-brand-400">
                    {images[0] ? (
                      <Image src={images[0]} alt={tour.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">🏔️</div>
                    )}
                    <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Mashhur
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-brand-600">{tour.category.name}</span>
                    <h3 className="mt-1 text-xl font-bold group-hover:text-brand-700">{tour.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{tour.destination}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{tour.duration}</span>
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" />{tour.maxPeople} kishi</span>
                    </div>
                    <p className="mt-4 text-lg font-bold text-brand-700">{formatPrice(tour.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="section-title text-center">Sayohat blogi</h2>
          <p className="mt-2 text-center text-gray-500">Foydali maslahatlar va yo'riqnomalar</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover rounded-2xl border bg-white overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-sand-200 to-brand-200 flex items-center justify-center text-4xl">📝</div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 hover:text-brand-700">{post.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-brand-800 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold">Sayohatingizni rejalashtirishga tayyormisiz?</h2>
          <p className="mt-4 text-brand-200">Bizning mutaxassislarimiz sizga eng yaxshi tur paketni tanlashda yordam beradi.</p>
          <Link href="/turlar" className="btn-primary mt-8 bg-white text-brand-800 hover:bg-brand-50">
            Hozir bron qiling
          </Link>
        </div>
      </section>
    </>
  );
}
