import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@imantour/database";
import { ArrowLeft } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Blogga qaytish
      </Link>
      <time className="mt-6 block text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString("uz-UZ")}</time>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{post.title}</h1>
      <p className="mt-2 text-gray-500">Muallif: {post.author}</p>
      <div className="prose mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
