"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, X, Image as ImageIcon, Video, AlertCircle } from "lucide-react";

interface MediaUploaderProps {
  images: string[];
  videos: string[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
}

const MAX_MB = 10;

function isVideoUrl(url: string, file?: File) {
  if (file?.type.startsWith("video/")) return true;
  return /\.(mp4|webm|mov)$/i.test(url);
}

export function MediaUploader({ images, videos, onImagesChange, onVideosChange }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File): Promise<{ url: string; type: string } | null> {
    if (file.size > MAX_MB * 1024 * 1024) {
      throw new Error(`Fayl juda katta. Maksimum ${MAX_MB}MB`);
    }

    const isProd = window.location.hostname !== "localhost";

    if (isProd) {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      return { url: blob.url, type: isVideoUrl(blob.url, file) ? "video" : "image" };
    }

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Yuklash xatosi");
    return data;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    setError("");

    const newImages = [...images];
    const newVideos = [...videos];

    for (const file of Array.from(files)) {
      try {
        const data = await uploadFile(file);
        if (!data) continue;
        if (data.type === "video") {
          newVideos.push(data.url);
        } else {
          newImages.push(data.url);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Yuklash xatosi");
      }
    }

    onImagesChange(newImages);
    onVideosChange(newVideos);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 transition hover:border-brand-400 hover:bg-brand-50">
        <Upload className="h-8 w-8 text-gray-400" />
        <span className="mt-2 text-sm text-gray-500">
          {uploading ? "Yuklanmoqda..." : "Rasm yoki video yuklash (telefon/kompyuter)"}
        </span>
        <span className="mt-1 text-xs text-gray-400">JPG, PNG, WEBP, MP4 — maks. {MAX_MB}MB</span>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <p className="label flex items-center gap-1"><ImageIcon className="h-4 w-4" /> Rasmlar</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {images.map((url, i) => (
              <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => onImagesChange(images.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div className="mt-4">
          <p className="label flex items-center gap-1"><Video className="h-4 w-4" /> Videolar</p>
          <div className="mt-2 space-y-3">
            {videos.map((url, i) => (
              <div key={i} className="group relative">
                <video src={url} controls className="w-full rounded-lg" />
                <button type="button" onClick={() => onVideosChange(videos.filter((_, j) => j !== i))}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
