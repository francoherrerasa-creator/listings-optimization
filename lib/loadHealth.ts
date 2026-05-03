import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface HealthProjection {
  avgHealth: number;
  listingsAbove80: number;
  pincaliReady: number;
  successRate?: number;
  automationRate?: number;
  botMonaThreshold?: number;
  perListing: Array<{ publicId: string; before: number; after: number }>;
  botMonaBreakdown?: Record<string, boolean>;
}

export interface HealthData {
  timestamp: string;
  results: any[];
  aggregate: {
    totalListings: number;
    averageHealth: number;
    bySection: Record<string, any>;
    listingsByHealthBucket: { excellent: number; good: number; poor: number };
    totalRedFlags: number;
    listingsWithRedFlags: number;
  };
  projections: {
    postAutomation: { optimistic: HealthProjection; conservative: HealthProjection };
    postAutomationAndBotMona: { optimistic: HealthProjection; conservative: HealthProjection };
    postRedFlagsResolved: { optimistic: { pincaliReady: number }; conservative: { pincaliReady: number } };
  };
}

export async function loadHealthData(): Promise<HealthData> {
  const filePath = resolve(process.cwd(), "data", "health-results.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}
