"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string | number>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const data = {
      phone: form.get("phone") as string,
      email: form.get("email") as string,
      address: form.get("address") as string,
      telegram: form.get("telegram") as string,
      instagram: form.get("instagram") as string,
      workingHours: form.get("workingHours") as string,
      aboutText: form.get("aboutText") as string,
      mapLat: parseFloat(form.get("mapLat") as string),
      mapLng: parseFloat(form.get("mapLng") as string),
    };
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Sozlamalar</h1>
      <p className="text-gray-500">Aloqa ma'lumotlari va lokatsiya</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4 rounded-xl border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Telefon</label><input name="phone" defaultValue={settings.phone as string} className="input" /></div>
          <div><label className="label">Email</label><input name="email" defaultValue={settings.email as string} className="input" /></div>
          <div className="sm:col-span-2"><label className="label">Manzil</label><input name="address" defaultValue={settings.address as string} className="input" /></div>
          <div><label className="label">Telegram</label><input name="telegram" defaultValue={settings.telegram as string} className="input" /></div>
          <div><label className="label">Instagram</label><input name="instagram" defaultValue={settings.instagram as string} className="input" /></div>
          <div><label className="label">Ish vaqti</label><input name="workingHours" defaultValue={settings.workingHours as string} className="input" /></div>
          <div><label className="label">Xarita kengligi (lat)</label><input name="mapLat" type="number" step="any" defaultValue={settings.mapLat as number} className="input" /></div>
          <div><label className="label">Xarita uzunligi (lng)</label><input name="mapLng" type="number" step="any" defaultValue={settings.mapLng as number} className="input" /></div>
          <div className="sm:col-span-2"><label className="label">Kompaniya haqida</label><textarea name="aboutText" defaultValue={settings.aboutText as string} rows={3} className="input" /></div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
        {saved && <span className="ml-3 text-sm text-green-600">Saqlandi!</span>}
      </form>
    </div>
  );
}
