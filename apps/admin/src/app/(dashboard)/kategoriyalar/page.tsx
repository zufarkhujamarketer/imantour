"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  order: number;
  _count: { tours: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      id: editing?.id,
      name: form.get("name") as string,
      description: form.get("description") as string,
      order: parseInt(form.get("order") as string) || 0,
    };

    await fetch("/api/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setShowForm(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Kategoriyani o'chirishni xohlaysizmi?")) return;
    await fetch("/api/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategoriyalar</h1>
          <p className="text-gray-500">Turlarni kategoriyalarga ajrating</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> Yangi kategoriya
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border bg-white p-6">
          <h2 className="font-semibold">{editing ? "Tahrirlash" : "Yangi kategoriya"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="label">Nomi</label><input name="name" required defaultValue={editing?.name} className="input" /></div>
            <div><label className="label">Tartib</label><input name="order" type="number" defaultValue={editing?.order || 0} className="input" /></div>
            <div className="sm:col-span-2"><label className="label">Tavsif</label><textarea name="description" defaultValue={editing?.description || ""} className="input" rows={2} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn-primary">Saqlash</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary">Bekor</button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-3">Nomi</th>
              <th className="px-6 py-3">Turlar</th>
              <th className="px-6 py-3">Tartib</th>
              <th className="px-6 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="px-6 py-3 font-medium">{cat.name}</td>
                <td className="px-6 py-3">{cat._count.tours}</td>
                <td className="px-6 py-3">{cat.order}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(cat); setShowForm(true); }} className="text-brand-600 hover:text-brand-800"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
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
