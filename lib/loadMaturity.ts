import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { MaturityResult } from "./maturity";

export interface MaturityData {
  timestamp: string;
  results: MaturityResult[];
  counts: Record<string, number>;
}

export async function loadMaturityData(): Promise<MaturityData> {
  const filePath = resolve(process.cwd(), "data", "maturity-results.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}
