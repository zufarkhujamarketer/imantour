import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAdminId } from "@/lib/auth";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB — Vercel uchun xavfsiz limit

const ALLOWED = [
  "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "video/quicktime",
];

function getMimeType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    webp: "image/webp", gif: "image/gif", mp4: "video/mp4", mov: "video/quicktime",
  };
  return map[ext || ""] || "";
}

export async function POST(req: NextRequest) {
  const adminId = await getAdminId();
  if (!adminId) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const contentType = req.headers.get("content-type") || "";

  // Vercel Blob — client-side upload (production)
  if (contentType.includes("application/json")) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        error: "Vercel Blob ulanmagan. Storage → Blob → imantour-admin ga ulang.",
      }, { status: 500 });
    }

    try {
      const body = (await req.json()) as HandleUploadBody;
      const jsonResponse = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
        }),
        onUploadCompleted: async () => {},
      });
      return NextResponse.json(jsonResponse);
    } catch (error) {
      console.error("Blob upload error:", error);
      return NextResponse.json({ error: "Blob yuklash xatosi" }, { status: 500 });
    }
  }

  // Form upload — local development
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: `Fayl juda katta (max ${MAX_SIZE / 1024 / 1024}MB)` }, { status: 400 });

    const mime = getMimeType(file);
    if (!ALLOWED.includes(mime)) {
      return NextResponse.json({ error: "Faqat JPG, PNG, WEBP, GIF, MP4 formatlar ruxsat etilgan" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "bin";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const isVideo = mime.startsWith("video/");

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
    return NextResponse.json({ error: "Yuklash xatosi. Vercel Blob ulanganini tekshiring." }, { status: 500 });
  }
}
