/**
 * Carga los resultados de scoring desde disco.
 * Solo para uso en server components (usa fs).
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { PropertyOperation } from "./easybroker";
import type { DimensionScore, PolicyCompliance } from "./scorer";

export interface ScoringResultEntry {
  publicId: string;
  title: string;
  propertyType: string;
  location: string;
  operations: PropertyOperation[];
  titleImageThumb: string | null;
  totalScore: number;
  passes: boolean;
  dimensions: {
    description_quality: DimensionScore;
    price_plausibility: DimensionScore;
    data_completeness: DimensionScore;
    photos_signal: DimensionScore;
    location_clarity: DimensionScore;
  };
  policyAlignment: {
    no_duplicates: PolicyCompliance;
    available_properties: PolicyCompliance;
    images_promote_property: PolicyCompliance;
    real_price_location: PolicyCompliance;
    matching_characteristics: PolicyCompliance;
    no_fraudulent: PolicyCompliance;
    bank_auctions_classified: PolicyCompliance;
  };
  flagsForModerationTeam: string[];
}

export interface ScoringResults {
  generatedAt: string;
  source: string;
  totalInPincali: number;
  sampled: number;
  results: ScoringResultEntry[];
  aggregates: {
    passRate: number;
    avgScore: number;
    avgByDimension: Record<string, number>;
    topFlags: Array<{ flag: string; count: number }>;
  };
}

export async function loadScoringResults(): Promise<ScoringResults> {
  const filePath = resolve(process.cwd(), "data", "scoring-results.json");
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as ScoringResults;
}
