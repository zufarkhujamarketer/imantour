import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, Map, FileText, Calendar, Settings, LogOut, Plane } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kategoriyalar", label: "Kategoriyalar", icon: FolderOpen },
  { href: "/turlar", label: "Turlar", icon: Map },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/bronlar", label: "Bronlar", icon: Calendar },
  { href: "/sozlamalar", label: "Sozlamalar", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/login";
  }

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-2 border-b px-6 py-5">
        <Plane className="h-6 w-6 text-brand-600" />
        <span className="font-bold text-brand-800">ImanTour Admin</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50"}`}>
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} className="m-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50">
        <LogOut className="h-4 w-4" /> Chiqish
      </button>
    </aside>
  );
}
