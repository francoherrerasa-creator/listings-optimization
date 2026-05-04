import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface ListingDates {
  publicId: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface DatesData {
  timestamp: string;
  results: ListingDates[];
}

export async function loadListingDates(): Promise<DatesData> {
  const filePath = resolve(process.cwd(), "data", "listing-dates.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as DatesData;
}
