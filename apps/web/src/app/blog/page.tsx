import Link from "next/link";
import { prisma } from "@imantour/database";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="section-title">Sayohat blogi</h1>
      <p className="mt-2 text-gray-500">Foydali maslahatlar, yo'riqnomalar va sayohat hikoyalari</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover overflow-hidden rounded-2xl border bg-white">
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-sand-200 to-brand-200 text-5xl">📝</div>
            <div className="p-6">
              <time className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString("uz-UZ")}</time>
              <h2 className="mt-2 text-lg font-bold hover:text-brand-700">{post.title}</h2>
              <p className="mt-2 text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && <p className="mt-12 text-center text-gray-500">Hozircha blog yozuvlari yo'q.</p>}
    </div>
  );
}
