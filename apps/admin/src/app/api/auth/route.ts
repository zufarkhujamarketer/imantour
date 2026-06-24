import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@imantour/database";
import { createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
  }

  const token = await createToken(admin.id);
  const res = NextResponse.json({ success: true, name: admin.name });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}
