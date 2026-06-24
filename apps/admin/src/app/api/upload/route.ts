import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAdminId } from "@/lib/auth";

const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FORM_SIZE = process.env.VERCEL ? 4.5 * 1024 * 1024 : MAX_SIZE;

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
  const contentType = req.headers.get("content-type") || "";

  // Vercel Blob client upload
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
        onBeforeGenerateToken: async () => {
          const adminId = await getAdminId();
          if (!adminId) throw new Error("Ruxsat yo'q. Qayta login qiling.");
          return {
            allowedContentTypes: ALLOWED,
            maximumSizeInBytes: MAX_SIZE,
            addRandomSuffix: true,
          };
        },
        onUploadCompleted: async () => {},
      });
      return NextResponse.json(jsonResponse);
    } catch (error) {
      console.error("Blob upload error:", error);
      const message = error instanceof Error ? error.message : "Blob yuklash xatosi";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  // Form upload
  const adminId = await getAdminId();
  if (!adminId) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
    if (file.size > MAX_FORM_SIZE) {
      return NextResponse.json({
        error: `Fayl juda katta (max ${Math.floor(MAX_FORM_SIZE / 1024 / 1024)}MB). Kichikroq rasm tanlang.`,
      }, { status: 400 });
    }

    const mime = getMimeType(file);
    if (!ALLOWED.includes(mime)) {
      return NextResponse.json({ error: "Faqat JPG, PNG, WEBP, GIF, MP4 formatlar ruxsat etilgan" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "bin";
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const isVideo = mime.startsWith("video/");

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        error: "BLOB_READ_WRITE_TOKEN topilmadi. Vercel Storage → Blob ni imantour-admin ga ulang.",
      }, { status: 500 });
    }

    const blob = await put(filename, file, { access: "public" });
    return NextResponse.json({ url: blob.url, type: isVideo ? "video" : "image" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Yuklash xatosi. Faylni kichikroq qilib qayta urinib ko'ring." }, { status: 500 });
  }
}
