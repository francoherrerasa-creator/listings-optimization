/**
 * Análisis de flags — Listings Optimization
 * Ejecutar con: npx tsx scripts/analyze-flags.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface ScoringResult {
  publicId: string;
  title: string;
  flagsForModerationTeam: string[];
  dimensions: Record<string, { score: number }>;
}

interface Data {
  sampled: number;
  results: ScoringResult[];
}

const teamKeywords: Record<string, RegExp> = {
  Growth: /descripci[oó]n|texto|truncad|incompleta|contenido|completar|datos|campos|amenidades|informaci[oó]n|m²|baño|contacto|agencia|promoci[oó]n|llame|marca|t[ií]tulo/i,
  Andrea: /foto|im[aá]gen|ubicaci[oó]n|mapa|geocod|coordenadas|geogr[aá]f/i,
  Sales: /precio|valor|mercado|discrepancia/i,
  Marketing: /zona|regional/i,
  Trust: /fraude|duplicad|anzuelo|sospech|inconsisten/i,
};

const dimensionKeywords: Record<string, RegExp> = {
  description_quality: /descripci[oó]n|texto|truncad|incompleta|contenido|t[ií]tulo/i,
  data_completeness: /datos|campos|amenidades|informaci[oó]n|m²|baño|contacto|agencia|promoci[oó]n|llame|marca/i,
  photos_signal: /foto|im[aá]gen/i,
  location_clarity: /ubicaci[oó]n|mapa|geocod|coordenadas|geogr[aá]f|zona/i,
  price_plausibility: /precio|valor|mercado|discrepancia/i,
};

function main() {
  const filePath = resolve(process.cwd(), "data", "scoring-results.json");
  const raw = readFileSync(filePath, "utf-8");
  const data: Data = JSON.parse(raw);

  const allFlags = data.results.flatMap((r) => r.flagsForModerationTeam);
  const totalFlags = allFlags.length;
  const totalListings = data.sampled;
  const avgFlags = (totalFlags / totalListings).toFixed(1);

  // Distribution by team
  const teamCounts: Record<string, number> = { Growth: 0, Andrea: 0, Sales: 0, Marketing: 0, Trust: 0 };
  const unclassified: string[] = [];

  for (const flag of allFlags) {
    let matched = false;
    for (const [team, regex] of Object.entries(teamKeywords)) {
      if (regex.test(flag)) {
        teamCounts[team]++;
        matched = true;
        break;
      }
    }
    if (!matched) {
      unclassified.push(flag);
    }
  }

  // Distribution by dimension
  const dimCounts: Record<string, number> = {};
  for (const dim of Object.keys(dimensionKeywords)) {
    dimCounts[dim] = 0;
  }
  for (const flag of allFlags) {
    for (const [dim, regex] of Object.entries(dimensionKeywords)) {
      if (regex.test(flag)) {
        dimCounts[dim]++;
        break;
      }
    }
  }

  // Top issue dimension
  const topDim = Object.entries(dimCounts).sort((a, b) => b[1] - a[1])[0];

  // Worst listing
  const worstListing = data.results.sort(
    (a, b) => b.flagsForModerationTeam.length - a.flagsForModerationTeam.length,
  )[0];

  // Print report
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  ANÁLISIS DE FLAGS — Listings Optimization");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log(`Listings analizados:        ${totalListings}`);
  console.log(`Flags detectados:           ${totalFlags}`);
  console.log(`Flags por listing:          ${avgFlags}\n`);

  console.log("Distribución por equipo:");
  for (const [team, count] of Object.entries(teamCounts)) {
    const pct = totalFlags > 0 ? Math.round((count / totalFlags) * 100) : 0;
    console.log(`  ${team.padEnd(12)} →  ${String(count).padStart(2)} flags  (${String(pct).padStart(2)}%)`);
  }

  if (unclassified.length > 0) {
    console.log(`\n  No clasificado →  ${unclassified.length} flags:`);
    for (const f of unclassified) {
      console.log(`    - "${f}"`);
    }
  }

  console.log(`\nDistribución por dimensión:`);
  for (const [dim, count] of Object.entries(dimCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${dim.padEnd(22)} →  ${count} flags`);
  }

  console.log(`\nTop issue:                  ${topDim[0].replace(/_/g, " ")} con ${topDim[1]} flags`);
  console.log(`Worst listing:              ${worstListing.publicId} con ${worstListing.flagsForModerationTeam.length} flags`);

  console.log("\n═══════════════════════════════════════════════════════════");
}

main();
