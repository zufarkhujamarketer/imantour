import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@imantour/database";
import { formatPrice, parseJsonArray, type ItineraryDay } from "@imantour/shared/src/utils";
import { MapPin, Clock, Users, Check, X } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await prisma.tour.findUnique({ where: { slug }, include: { category: true } });
  if (!tour || !tour.published) notFound();

  const images = parseJsonArray(tour.images);
  const videos = parseJsonArray(tour.videos);
  const includes = parseJsonArray(tour.includes);
  const excludes = parseJsonArray(tour.excludes);
  const itinerary = parseJsonArray<ItineraryDay>(tour.itinerary);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="text-sm font-medium text-brand-600">{tour.category.name}</span>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{tour.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{tour.destination}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{tour.duration}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />Maks. {tour.maxPeople} kishi</span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {images.length > 0 ? images.map((img, i) => (
              <div key={i} className="relative h-56 overflow-hidden rounded-xl">
                <Image src={img} alt={`${tour.title} ${i + 1}`} fill className="object-cover" />
              </div>
            )) : (
              <div className="col-span-2 flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-300 text-6xl">🏔️</div>
            )}
          </div>

          {videos.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {videos.map((vid, i) => (
                <video key={i} src={vid} controls className="w-full rounded-xl" />
              ))}
            </div>
          )}

          <div className="mt-8 prose max-w-none">
            <h2 className="text-xl font-bold">Tur haqida</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">{tour.description}</p>
          </div>

          {itinerary.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Kunlik dastur</h2>
              <div className="mt-4 space-y-4">
                {itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4 rounded-xl border bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="font-semibold">{day.title}</h3>
                      <p className="text-sm text-gray-500">{day.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {includes.length > 0 && (
              <div className="rounded-xl border bg-green-50 p-5">
                <h3 className="font-semibold text-green-800">Narxga kiritilgan</h3>
                <ul className="mt-3 space-y-2">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-green-700"><Check className="h-4 w-4" />{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {excludes.length > 0 && (
              <div className="rounded-xl border bg-red-50 p-5">
                <h3 className="font-semibold text-red-800">Narxga kiritilmagan</h3>
                <ul className="mt-3 space-y-2">
                  {excludes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-red-700"><X className="h-4 w-4" />{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-white p-6 shadow-lg">
            <p className="text-2xl font-bold text-brand-700">{formatPrice(tour.price)}</p>
            <p className="text-sm text-gray-500">bir kishi uchun</p>
            <BookingForm tourId={tour.id} tourTitle={tour.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
