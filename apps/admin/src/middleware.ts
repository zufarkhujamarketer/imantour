import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const publicPaths = ["/login", "/api/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
