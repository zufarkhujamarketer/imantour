import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@imantour/database";
import { getAdminId } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  if (!(await getAdminId())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const body = await req.json();
  const settings = await prisma.siteSettings.update({ where: { id: "main" }, data: body });
  return NextResponse.json(settings);
}
