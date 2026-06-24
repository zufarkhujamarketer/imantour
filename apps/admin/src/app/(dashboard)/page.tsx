import { prisma } from "@imantour/database";
import { Map, FolderOpen, FileText, Calendar } from "lucide-react";

export default async function DashboardPage() {
  const [tours, categories, posts, bookings] = await Promise.all([
    prisma.tour.count(),
    prisma.category.count(),
    prisma.blogPost.count(),
    prisma.booking.count({ where: { status: "pending" } }),
  ]);

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { tour: true },
  });

  const stats = [
    { label: "Turlar", value: tours, icon: Map, color: "bg-blue-100 text-blue-600" },
    { label: "Kategoriyalar", value: categories, icon: FolderOpen, color: "bg-green-100 text-green-600" },
    { label: "Blog yozuvlari", value: posts, icon: FileText, color: "bg-purple-100 text-purple-600" },
    { label: "Kutilayotgan bronlar", value: bookings, icon: Calendar, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500">ImanTour boshqaruv paneli</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="mt-1 text-3xl font-bold">{s.value}</p>
              </div>
              <div className={`rounded-full p-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">So'nggi bronlar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3">Ism</th>
                <th className="px-6 py-3">Tur</th>
                <th className="px-6 py-3">Telefon</th>
                <th className="px-6 py-3">Sana</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-6 py-3">{b.fullName}</td>
                  <td className="px-6 py-3">{b.tour.title}</td>
                  <td className="px-6 py-3">{b.phone}</td>
                  <td className="px-6 py-3">{new Date(b.createdAt).toLocaleDateString("uz-UZ")}</td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Hozircha bronlar yo'q</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
