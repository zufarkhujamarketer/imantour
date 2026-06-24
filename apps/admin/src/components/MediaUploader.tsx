"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Video } from "lucide-react";

interface MediaUploaderProps {
  images: string[];
  videos: string[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
}

export function MediaUploader({ images, videos, onImagesChange, onVideosChange }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.type === "video") {
          onVideosChange([...videos, data.url]);
        } else {
          onImagesChange([...images, data.url]);
        }
      }
    }
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
        <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

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
