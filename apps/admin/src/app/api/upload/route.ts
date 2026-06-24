import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { getAdminId } from "@/lib/auth";

const MAX_SIZE = 50 * 1024 * 1024;

const ALLOWED = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "video/quicktime",
];

export async function POST(req: NextRequest) {
  const adminId = await getAdminId();
  if (!adminId) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "Fayl juda katta (max 50MB)" }, { status: 400 });
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Faqat rasm va video fayllar ruxsat etilgan" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const isVideo = file.type.startsWith("video/");

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, file, { access: "public" });
      return NextResponse.json({ url: blob.url, type: isVideo ? "video" : "image" });
    }

    const uploadDir = path.join(process.cwd(), "..", "..", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}`, type: isVideo ? "video" : "image" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Yuklash xatosi" }, { status: 500 });
  }
}
