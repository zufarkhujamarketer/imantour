"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface Props {
  tourId: string;
  tourTitle: string;
}

export function BookingForm({ tourId, tourTitle }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      tourId,
      fullName: form.get("fullName") as string,
      phone: form.get("phone") as string,
      email: form.get("email") as string,
      people: Number(form.get("people")),
      date: form.get("date") as string,
      message: form.get("message") as string,
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Xatolik yuz berdi");
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch {
      setError("Bron qilishda xatolik. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-6 rounded-xl bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-3 font-bold text-green-800">Bron qabul qilindi!</h3>
        <p className="mt-1 text-sm text-green-600">Tez orada siz bilan bog'lanamiz.</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-brand-600 hover:underline">
          Yana bron qilish
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <p className="text-sm text-gray-500">«{tourTitle}» turini bron qilish</p>
      <input name="fullName" required placeholder="To'liq ismingiz" className="w-full rounded-lg border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
      <input name="phone" required type="tel" placeholder="Telefon (+998...)" className="w-full rounded-lg border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
      <input name="email" type="email" placeholder="Email (ixtiyoriy)" className="w-full rounded-lg border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
      <div className="grid grid-cols-2 gap-3">
        <input name="people" type="number" min={1} defaultValue={1} required placeholder="Kishi soni" className="w-full rounded-lg border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
        <input name="date" type="date" className="w-full rounded-lg border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
      </div>
      <textarea name="message" rows={3} placeholder="Qo'shimcha xabar..." className="w-full rounded-lg border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? "Yuborilmoqda..." : <><Send className="h-4 w-4" /> Bron qilish</>}
      </button>
    </form>
  );
}
