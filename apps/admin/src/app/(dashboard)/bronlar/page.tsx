"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: string; fullName: string; phone: string; email: string | null;
  people: number; date: string | null; status: string; createdAt: string;
  tour: { title: string };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/bookings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setBookings(bookings.map((b) => b.id === id ? { ...b, status } : b));
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Bronlar</h1>
      <p className="text-gray-500">Turistlarning bron so'rovlari</p>

      <div className="mt-6 rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-3">Ism</th>
              <th className="px-6 py-3">Tur</th>
              <th className="px-6 py-3">Telefon</th>
              <th className="px-6 py-3">Kishi</th>
              <th className="px-6 py-3">Holat</th>
              <th className="px-6 py-3">Sana</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="px-6 py-3 font-medium">{b.fullName}</td>
                <td className="px-6 py-3">{b.tour.title}</td>
                <td className="px-6 py-3">{b.phone}</td>
                <td className="px-6 py-3">{b.people}</td>
                <td className="px-6 py-3">
                  <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}
                    className={`rounded-full px-2 py-1 text-xs border-0 ${statusColors[b.status] || ""}`}>
                    <option value="pending">Kutilmoqda</option>
                    <option value="confirmed">Tasdiqlangan</option>
                    <option value="cancelled">Bekor</option>
                  </select>
                </td>
                <td className="px-6 py-3">{new Date(b.createdAt).toLocaleDateString("uz-UZ")}</td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Bronlar yo'q</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
