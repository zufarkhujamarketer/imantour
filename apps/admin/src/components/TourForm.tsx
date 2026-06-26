"use client";

import { useEffect, useState } from "react";
import { MediaUploader } from "./MediaUploader";
import { parseJsonArray, type ItineraryDay } from "@imantour/shared/src/utils";

interface Category { id: string; name: string }

export function TourForm({ tour }: { tour?: Record<string, unknown> }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(tour ? parseJsonArray(tour.images as string) : []);
  const [videos, setVideos] = useState<string[]>(tour ? parseJsonArray(tour.videos as string) : []);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    tour ? parseJsonArray<ItineraryDay>(tour.itinerary as string) : []
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const includes = (form.get("includes") as string).split("\n").filter(Boolean);
    const excludes = (form.get("excludes") as string).split("\n").filter(Boolean);

    const data = {
      id: tour?.id,
      title: form.get("title"),
      description: form.get("description"),
      shortDesc: form.get("shortDesc"),
      price: form.get("price"),
      duration: form.get("duration"),
      destination: form.get("destination"),
      maxPeople: form.get("maxPeople"),
      categoryId: form.get("categoryId"),
      featured: form.get("featured") === "on",
      published: form.get("published") === "on",
      images,
      videos,
      includes,
      excludes,
      itinerary,
    };

    await fetch("/api/tours", {
      method: tour ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    window.location.href = "/turlar";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label">Tur nomi</label><input name="title" required defaultValue={tour?.title as string} className="input" /></div>
        <div><label className="label">Kategoriya</label>
          <select name="categoryId" required defaultValue={tour?.categoryId as string} className="input">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div><label className="label">Narx (so'm)</label><input name="price" type="number" required defaultValue={tour?.price as number} className="input" /></div>
        <div><label className="label">Davomiyligi</label><input name="duration" required defaultValue={tour?.duration as string} placeholder="4 kun / 3 kecha" className="input" /></div>
        <div><label className="label">Manzil</label><input name="destination" required defaultValue={tour?.destination as string} className="input" /></div>
        <div><label className="label">Maks. odam soni</label><input name="maxPeople" type="number" defaultValue={(tour?.maxPeople as number) || 10} className="input" /></div>
        <div className="sm:col-span-2"><label className="label">Qisqa tavsif</label><input name="shortDesc" defaultValue={tour?.shortDesc as string} className="input" /></div>
        <div className="sm:col-span-2"><label className="label">To'liq tavsif</label><textarea name="description" required defaultValue={tour?.description as string} rows={4} className="input" /></div>
        <div><label className="label">Narxga kiritilgan (har qator — bitta)</label><textarea name="includes" defaultValue={tour ? parseJsonArray(tour.includes as string).join("\n") : ""} rows={3} className="input" /></div>
        <div><label className="label">Narxga kiritilmagan</label><textarea name="excludes" defaultValue={tour ? parseJsonArray(tour.excludes as string).join("\n") : ""} rows={3} className="input" /></div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Kunlik dastur (Itinerary)</label>
          <button
            type="button"
            onClick={() =>
              setItinerary([
                ...itinerary,
                { day: itinerary.length + 1, title: "", desc: "" },
              ])
            }
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            + Kun qo'shish
          </button>
        </div>
        <div className="space-y-4">
          {itinerary.map((item, index) => (
            <div key={index} className="rounded-lg border bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700">
                  {index + 1}-kun
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = itinerary.filter((_, i) => i !== index);
                    setItinerary(next.map((d, i) => ({ ...d, day: i + 1 })));
                  }}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  O'chirish
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Sarlavha (masalan: Toshkent — Samarqand)"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...itinerary];
                      next[index].title = e.target.value;
                      setItinerary(next);
                    }}
                    required
                    className="input bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    placeholder="Batafsil ma'lumot (boradigan joylar, reja...)"
                    value={item.desc}
                    onChange={(e) => {
                      const next = [...itinerary];
                      next[index].desc = e.target.value;
                      setItinerary(next);
                    }}
                    rows={2}
                    required
                    className="input bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
          {itinerary.length === 0 && (
            <p className="text-sm text-gray-500 italic py-2">Hozircha kunlik dastur yo'q. "+ Kun qo'shish" tugmasini bosing.</p>
          )}
        </div>
      </div>

      <div>
        <label className="label">Rasm va videolar</label>
        <MediaUploader images={images} videos={videos} onImagesChange={setImages} onVideosChange={setVideos} />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2"><input name="featured" type="checkbox" defaultChecked={tour?.featured as boolean} /> Mashhur tur</label>
        <label className="flex items-center gap-2"><input name="published" type="checkbox" defaultChecked={tour?.published !== false} /> Nashr qilish</label>
      </div>

      <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
    </form>
  );
}

