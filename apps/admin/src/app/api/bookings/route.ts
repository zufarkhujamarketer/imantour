import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@imantour/database";
import { getAdminId } from "@/lib/auth";

export async function GET() {
  const bookings = await prisma.booking.findMany({ include: { tour: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(bookings);
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const { id, status } = await req.json();
  const booking = await prisma.booking.update({ where: { id }, data: { status } });
  return NextResponse.json(booking);
}
