"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TourForm } from "@/components/TourForm";

export default function EditTourPage() {
  const { id } = useParams();
  const [tour, setTour] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/tours").then((r) => r.json()).then((tours) => {
      const found = tours.find((t: { id: string }) => t.id === id);
      setTour(found || null);
    });
  }, [id]);

  if (!tour) return <p>Yuklanmoqda...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Turni tahrirlash</h1>
      <div className="mt-6 rounded-xl border bg-white p-6">
        <TourForm tour={tour} />
      </div>
    </div>
  );
}
