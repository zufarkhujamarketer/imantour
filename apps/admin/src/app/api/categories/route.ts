import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@imantour/database";
import { slugify } from "@imantour/shared/src/utils";
import { getAdminId } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { tours: true } } } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const body = await req.json();
  const slug = slugify(body.name);
  const category = await prisma.category.create({ data: { name: body.name, slug, description: body.description, order: body.order || 0 } });
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const body = await req.json();
  const category = await prisma.category.update({
    where: { id: body.id },
    data: { name: body.name, slug: slugify(body.name), description: body.description, order: body.order },
  });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const { id } = await req.json();
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
