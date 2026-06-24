"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Login yoki parol noto'g'ri");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-800 to-brand-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <Plane className="mx-auto h-10 w-10 text-brand-600" />
          <h1 className="mt-3 text-2xl font-bold">ImanTour Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Boshqaruv paneliga kirish</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label">Login</label>
            <input name="email" type="text" required autoComplete="username" className="input" placeholder="admin1" />
          </div>
          <div>
            <label className="label">Parol</label>
            <input name="password" type="password" required className="input" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <Lock className="h-4 w-4" /> {loading ? "Kirish..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}
