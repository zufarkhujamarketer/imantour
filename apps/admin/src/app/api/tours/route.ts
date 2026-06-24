import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@imantour/database";
import { slugify } from "@imantour/shared/src/utils";
import { getAdminId } from "@/lib/auth";

export async function GET() {
  const tours = await prisma.tour.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(tours);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const body = await req.json();
  const tour = await prisma.tour.create({
    data: {
      title: body.title,
      slug: slugify(body.title),
      description: body.description,
      shortDesc: body.shortDesc,
      price: parseFloat(body.price),
      duration: body.duration,
      destination: body.destination,
      maxPeople: parseInt(body.maxPeople) || 10,
      featured: body.featured || false,
      published: body.published !== false,
      categoryId: body.categoryId,
      images: JSON.stringify(body.images || []),
      videos: JSON.stringify(body.videos || []),
      includes: JSON.stringify(body.includes || []),
      excludes: JSON.stringify(body.excludes || []),
      itinerary: JSON.stringify(body.itinerary || []),
    },
  });
  return NextResponse.json(tour);
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const body = await req.json();
  const tour = await prisma.tour.update({
    where: { id: body.id },
    data: {
      title: body.title,
      slug: slugify(body.title),
      description: body.description,
      shortDesc: body.shortDesc,
      price: parseFloat(body.price),
      duration: body.duration,
      destination: body.destination,
      maxPeople: parseInt(body.maxPeople) || 10,
      featured: body.featured,
      published: body.published,
      categoryId: body.categoryId,
      images: JSON.stringify(body.images || []),
      videos: JSON.stringify(body.videos || []),
      includes: JSON.stringify(body.includes || []),
      excludes: JSON.stringify(body.excludes || []),
      itinerary: JSON.stringify(body.itinerary || []),
    },
  });
  return NextResponse.json(tour);
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const { id } = await req.json();
  await prisma.tour.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
