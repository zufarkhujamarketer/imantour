"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Post { id: string; title: string; excerpt: string | null; published: boolean; createdAt: string }

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/blog");
    setPosts(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      id: editing?.id,
      title: form.get("title"),
      excerpt: form.get("excerpt"),
      content: form.get("content"),
      published: form.get("published") === "on",
    };
    await fetch("/api/blog", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowForm(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("O'chirishni xohlaysizmi?")) return;
    await fetch("/api/blog", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-gray-500">Sayohat blogi yozuvlarini boshqaring</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" /> Yangi yozuv</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Tahrirlash" : "Yangi yozuv"}</h2>
          <div><label className="label">Sarlavha</label><input name="title" required defaultValue={editing?.title} className="input" /></div>
          <div><label className="label">Qisqa tavsif</label><input name="excerpt" defaultValue={editing?.excerpt || ""} className="input" /></div>
          <div><label className="label">Kontent (HTML)</label><textarea name="content" required defaultValue="" rows={8} className="input font-mono text-xs" placeholder="<p>Maqola matni...</p>" /></div>
          <label className="flex items-center gap-2"><input name="published" type="checkbox" defaultChecked={editing?.published} /> Nashr qilish</label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Saqlash</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary">Bekor</button>
          </div>
        </form>
      )}

      <div className="mt-6 rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr><th className="px-6 py-3">Sarlavha</th><th className="px-6 py-3">Holat</th><th className="px-6 py-3">Sana</th><th className="px-6 py-3">Amallar</th></tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-6 py-3 font-medium">{p.title}</td>
                <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${p.published ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{p.published ? "Nashr" : "Qoralama"}</span></td>
                <td className="px-6 py-3">{new Date(p.createdAt).toLocaleDateString("uz-UZ")}</td>
                <td className="px-6 py-3 flex gap-2">
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-brand-600"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
