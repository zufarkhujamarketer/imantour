import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@imantour/database";
import { slugify } from "@imantour/shared/src/utils";
import { getAdminId } from "@/lib/auth";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const body = await req.json();
  const post = await prisma.blogPost.create({
    data: { title: body.title, slug: slugify(body.title), excerpt: body.excerpt, content: body.content, published: body.published || false },
  });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const body = await req.json();
  const post = await prisma.blogPost.update({
    where: { id: body.id },
    data: { title: body.title, slug: slugify(body.title), excerpt: body.excerpt, content: body.content, published: body.published },
  });
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const { id } = await req.json();
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
