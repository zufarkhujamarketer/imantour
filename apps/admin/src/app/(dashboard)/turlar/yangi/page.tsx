"use client";

import { TourForm } from "@/components/TourForm";

export default function NewTourPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Yangi tur qo'shish</h1>
      <p className="text-gray-500">Tur paket ma'lumotlarini kiriting</p>
      <div className="mt-6 rounded-xl border bg-white p-6">
        <TourForm />
      </div>
    </div>
  );
}
