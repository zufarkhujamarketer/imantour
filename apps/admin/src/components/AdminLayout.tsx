"use client";

import { Sidebar } from "./Sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
