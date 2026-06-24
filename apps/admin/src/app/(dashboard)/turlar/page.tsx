"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Category { id: string; name: string }
interface Tour {
  id: string; title: string; price: number; destination: string;
  duration: string; published: boolean; featured: boolean;
  category: Category; images: string;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/tours").then((r) => r.json()).then(setTours);
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Turni o'chirishni xohlaysizmi?")) return;
    await fetch("/api/tours", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTours(tours.filter((t) => t.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Turlar</h1>
          <p className="text-gray-500">Tur paketlarni boshqaring</p>
        </div>
        <Link href="/turlar/yangi" className="btn-primary"><Plus className="h-4 w-4" /> Yangi tur</Link>
      </div>

      <div className="mt-6 rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-3">Nomi</th>
              <th className="px-6 py-3">Kategoriya</th>
              <th className="px-6 py-3">Narx</th>
              <th className="px-6 py-3">Holat</th>
              <th className="px-6 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="border-t">
                <td className="px-6 py-3 font-medium">{tour.title}</td>
                <td className="px-6 py-3">{tour.category.name}</td>
                <td className="px-6 py-3">{tour.price.toLocaleString()} so'm</td>
                <td className="px-6 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${tour.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {tour.published ? "Faol" : "Yashirin"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <Link href={`/turlar/${tour.id}`} className="text-brand-600"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => handleDelete(tour.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
