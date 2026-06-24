export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function parseJsonArray<T = string>(json: string): T[] {
  try {
    return JSON.parse(json) as T[];
  } catch {
    return [];
  }
}

export function formatPrice(price: number, currency = "UZS"): string {
  if (currency === "UZS") {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

export interface ItineraryDay {
  day: number;
  title: string;
  desc: string;
}
