/**
 * Calcula Health Score por sección + proyecciones con tasas asimétricas.
 * Ejecutar: npx tsx scripts/calculate-health.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as fs from "node:fs";
import * as path from "node:path";
import { calculateListingHealth, type ListingHealth } from "../lib/healthScorer";

const RED_FLAG_KEYWORDS = [
  "contacto", "agencia", "promoción", "promocion", "llame", "marca", "anzuelo", "remate",
];

// Deterministic pseudo-random based on listing ID string
function seededRandom(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % 10000) / 10000;
}

const AUTOMATION_FIELDS = new Set([
  "title", "description", "property_type",
  "operations[0].amount", "operations[0].commission.type",
  "bedrooms", "bathrooms", "parking_spaces", "construction_size", "lot_size",
  "location.street", "location.postal_code", "location.latitude",
  "property_images_min_1",
]);

const BOT_MONA_FIELDS = new Set([
  "property_images_min_10",
]);

interface SimResult {
  perListing: Array<{ publicId: string; before: number; after: number }>;
  avgHealth: number;
  botMonaBreakdown: Record<string, boolean>;
}

function simulateAsymmetric(
  healthResults: ListingHealth[],
  automationRate: number,
  botMonaThreshold: number, // binary: if seededRandom < threshold, resolve ALL mona fields
): SimResult {
  const perListing: Array<{ publicId: string; before: number; after: number }> = [];
  const botMonaBreakdown: Record<string, boolean> = {};

  for (const listing of healthResults) {
    let automationUnhealthy = 0;
    let botMonaUnhealthy = 0;

    for (const section of listing.sections) {
      if (!section.apiAvailable) continue;
      for (const field of section.fieldStatus) {
        if (!field.healthy) {
          if (AUTOMATION_FIELDS.has(field.key)) automationUnhealthy++;
          else if (BOT_MONA_FIELDS.has(field.key)) botMonaUnhealthy++;
        }
      }
    }

    const automationResolved = Math.floor(automationUnhealthy * automationRate);

    // Binary Mona: resolve all or nothing based on seeded random
    const rand = seededRandom(listing.publicId);
    const botMonaResolves = botMonaUnhealthy > 0 && rand < botMonaThreshold;
    const botMonaResolved = botMonaResolves ? botMonaUnhealthy : 0;
    botMonaBreakdown[listing.publicId] = botMonaResolves;

    const additionalHealthy = automationResolved + botMonaResolved;
    const newHealthy = Math.min(listing.totalHealthy + additionalHealthy, listing.totalFields);
    const newPercent = listing.totalFields > 0 ? Math.min(Math.round((newHealthy / listing.totalFields) * 100), 100) : 0;

    perListing.push({ publicId: listing.publicId, before: listing.overallHealthPercent, after: newPercent });
  }

  const avgHealth = Math.round(perListing.reduce((s, l) => s + l.after, 0) / perListing.length);
  return { perListing, avgHealth, botMonaBreakdown };
}

async function main() {
  const scoringPath = path.join(process.cwd(), "data/scoring-results.json");
  const scoringData = JSON.parse(fs.readFileSync(scoringPath, "utf-8"));

  const apiKey = process.env.EASYBROKER_API_KEY;
  const baseUrl = process.env.EASYBROKER_BASE_URL || "https://api.stagingeb.com";

  const healthResults: ListingHealth[] = [];

  for (const result of scoringData.results) {
    const res = await fetch(`${baseUrl}/v1/properties/${result.publicId}`, {
      headers: { "X-Authorization": apiKey!, Accept: "application/json" },
    });
    const fullListing = await res.json();
    const flags = result.flagsForModerationTeam || [];
    const redFlags = flags.filter((f: string) =>
      RED_FLAG_KEYWORDS.some((kw) => f.toLowerCase().includes(kw)),
    );
    healthResults.push(calculateListingHealth(fullListing, flags, redFlags));
  }

  // Aggregate
  const aggregate = {
    totalListings: healthResults.length,
    averageHealth: Math.round(healthResults.reduce((s, h) => s + h.overallHealthPercent, 0) / healthResults.length),
    bySection: {} as Record<string, { sectionLabel: string; apiAvailable: boolean; apiGapNote?: string; averageHealth: number; totalListings: number; listingsAt100: number; listingsAt0: number }>,
    listingsByHealthBucket: {
      excellent: healthResults.filter((h) => h.overallHealthPercent >= 80).length,
      good: healthResults.filter((h) => h.overallHealthPercent >= 60 && h.overallHealthPercent < 80).length,
      poor: healthResults.filter((h) => h.overallHealthPercent < 60).length,
    },
    totalRedFlags: healthResults.reduce((s, h) => s + h.redFlagsCount, 0),
    listingsWithRedFlags: healthResults.filter((h) => h.hasRedFlags).length,
  };

  for (const result of healthResults) {
    for (const section of result.sections) {
      if (!aggregate.bySection[section.sectionId]) {
        aggregate.bySection[section.sectionId] = { sectionLabel: section.sectionLabel, apiAvailable: section.apiAvailable, apiGapNote: section.apiGapNote, averageHealth: 0, totalListings: 0, listingsAt100: 0, listingsAt0: 0 };
      }
      const s = aggregate.bySection[section.sectionId];
      s.averageHealth += section.healthPercent;
      s.totalListings += 1;
      if (section.healthPercent === 100) s.listingsAt100 += 1;
      if (section.healthPercent === 0) s.listingsAt0 += 1;
    }
  }
  for (const id in aggregate.bySection) {
    aggregate.bySection[id].averageHealth = Math.round(aggregate.bySection[id].averageHealth / aggregate.bySection[id].totalListings);
  }

  // Projections with asymmetric rates (Bot Mona is binary per-listing)
  const postAutoOptimistic = simulateAsymmetric(healthResults, 1.0, 0); // Automatización 100%, no Bot Mona
  const postAutoConservative = simulateAsymmetric(healthResults, 0.9, 0); // Automatización 90%, no Bot Mona
  const postFullOptimistic = simulateAsymmetric(healthResults, 1.0, 0.8); // Automatización 100% + Bot Mona 80%
  const postFullConservative = simulateAsymmetric(healthResults, 0.9, 0.5); // Automatización 90% + Bot Mona 50%

  const redFlagIds = new Set(healthResults.filter((h) => h.hasRedFlags).map((h) => h.publicId));
  function pincaliReady(perListing: Array<{ publicId: string; after: number }>): number {
    return perListing.filter((l) => l.after >= 80 && !redFlagIds.has(l.publicId)).length;
  }

  const projections = {
    postAutomation: {
      optimistic: { successRate: 1.0, avgHealth: postAutoOptimistic.avgHealth, listingsAbove80: postAutoOptimistic.perListing.filter((l) => l.after >= 80).length, pincaliReady: pincaliReady(postAutoOptimistic.perListing), perListing: postAutoOptimistic.perListing },
      conservative: { successRate: 0.9, avgHealth: postAutoConservative.avgHealth, listingsAbove80: postAutoConservative.perListing.filter((l) => l.after >= 80).length, pincaliReady: pincaliReady(postAutoConservative.perListing), perListing: postAutoConservative.perListing },
    },
    postAutomationAndBotMona: {
      optimistic: { automationRate: 1.0, botMonaThreshold: 0.8, avgHealth: postFullOptimistic.avgHealth, listingsAbove80: postFullOptimistic.perListing.filter((l) => l.after >= 80).length, pincaliReady: pincaliReady(postFullOptimistic.perListing), perListing: postFullOptimistic.perListing, botMonaBreakdown: postFullOptimistic.botMonaBreakdown },
      conservative: { automationRate: 0.9, botMonaThreshold: 0.5, avgHealth: postFullConservative.avgHealth, listingsAbove80: postFullConservative.perListing.filter((l) => l.after >= 80).length, pincaliReady: pincaliReady(postFullConservative.perListing), perListing: postFullConservative.perListing, botMonaBreakdown: postFullConservative.botMonaBreakdown },
    },
    postRedFlagsResolved: {
      optimistic: { pincaliReady: postFullOptimistic.perListing.filter((l) => l.after >= 80).length },
      conservative: { pincaliReady: postFullConservative.perListing.filter((l) => l.after >= 80).length },
    },
  };

  // Save
  const output = { timestamp: new Date().toISOString(), results: healthResults, aggregate, projections };
  fs.writeFileSync(path.join(process.cwd(), "data/health-results.json"), JSON.stringify(output, null, 2));

  // Console
  console.log("=== HEALTH ANALYSIS COMPLETE ===");
  console.log(`Total listings: ${aggregate.totalListings}`);
  console.log(`Average Health: ${aggregate.averageHealth}%`);
  console.log(`Excellent (≥80%): ${aggregate.listingsByHealthBucket.excellent}`);
  console.log(`Good (60-79%): ${aggregate.listingsByHealthBucket.good}`);
  console.log(`Poor (<60%): ${aggregate.listingsByHealthBucket.poor}`);
  console.log(`Red Flags: ${aggregate.totalRedFlags} en ${aggregate.listingsWithRedFlags} listings`);

  console.log("\n=== BY SECTION ===");
  for (const id in aggregate.bySection) {
    const s = aggregate.bySection[id];
    console.log(`${s.sectionLabel}${s.apiAvailable ? "" : " [API GAP]"}: ${s.averageHealth}% avg, ${s.listingsAt100}/${aggregate.totalListings} al 100%`);
  }

  console.log("\n=== PER LISTING (HOY) ===");
  for (const h of healthResults) console.log(`${h.publicId}: ${h.overallHealthPercent}% (${h.totalHealthy}/${h.totalFields})`);

  console.log("\n=== PROYECCIÓN POST-OPTIMIZACIÓN ===");

  console.log("\nESCENARIO: HOY");
  console.log(`Average Health: ${aggregate.averageHealth}%`);
  console.log(`Listings ≥80%: ${aggregate.listingsByHealthBucket.excellent} de 10`);
  console.log(`Listings 60-79%: ${aggregate.listingsByHealthBucket.good} de 10`);
  console.log(`Listings <60%: ${aggregate.listingsByHealthBucket.poor} de 10`);
  console.log(`Pincali Ready (≥80% Y sin Red Flags): ${healthResults.filter((h) => h.overallHealthPercent >= 80 && !h.hasRedFlags).length} de 10`);

  console.log("\nESCENARIO: POST-AUTOMATIZACIÓN");
  console.log(`- Optimista (100% éxito automatización): Health ${postAutoOptimistic.avgHealth}% · ≥80%: ${projections.postAutomation.optimistic.listingsAbove80} · Pincali Ready: ${projections.postAutomation.optimistic.pincaliReady}`);
  console.log(`- Conservador (90% éxito automatización): Health ${postAutoConservative.avgHealth}% · ≥80%: ${projections.postAutomation.conservative.listingsAbove80} · Pincali Ready: ${projections.postAutomation.conservative.pincaliReady}`);

  console.log("\nESCENARIO: POST-AUTOMATIZACIÓN+BOT MONA");
  console.log(`- Optimista (Automatización 100% + Bot Mona 80%): Health ${postFullOptimistic.avgHealth}% · ≥80%: ${projections.postAutomationAndBotMona.optimistic.listingsAbove80} · Pincali Ready: ${projections.postAutomationAndBotMona.optimistic.pincaliReady}`);
  console.log(`- Conservador (Automatización 90% + Bot Mona 50%): Health ${postFullConservative.avgHealth}% · ≥80%: ${projections.postAutomationAndBotMona.conservative.listingsAbove80} · Pincali Ready: ${projections.postAutomationAndBotMona.conservative.pincaliReady}`);

  console.log("\nESCENARIO: POST-AUTOMATIZACIÓN+BOT MONA + RED FLAGS RESUELTOS");
  console.log(`- Optimista: Pincali Ready: ${projections.postRedFlagsResolved.optimistic.pincaliReady} de 10`);
  console.log(`- Conservador: Pincali Ready: ${projections.postRedFlagsResolved.conservative.pincaliReady} de 10`);

  console.log("\n=== POR LISTING (Post-Automatización+Bot Mona, Optimista) ===");
  for (const l of postFullOptimistic.perListing) console.log(`${l.publicId}: ${l.before}% → ${l.after}%`);

  console.log("\n=== POR LISTING (Post-Automatización+Bot Mona, Conservador) ===");
  for (const l of postFullConservative.perListing) console.log(`${l.publicId}: ${l.before}% → ${l.after}%`);

  console.log("\n=== DESGLOSE BOT MONA POR LISTING ===");
  console.log("\nOPTIMISTA (umbral 0.8):");
  let botMonaOptCount = 0;
  for (const h of healthResults) {
    const rand = seededRandom(h.publicId);
    const resolves = postFullOptimistic.botMonaBreakdown[h.publicId];
    console.log(`${h.publicId}: random=${rand.toFixed(4)} → Bot Mona ${resolves ? "✓ resuelve" : "✗ no resuelve"}`);
    if (resolves) botMonaOptCount++;
  }
  console.log(`Total Bot Mona ✓: ${botMonaOptCount} de 10 listings`);

  console.log("\nCONSERVADOR (umbral 0.5):");
  let botMonaConsCount = 0;
  for (const h of healthResults) {
    const rand = seededRandom(h.publicId);
    const resolves = postFullConservative.botMonaBreakdown[h.publicId];
    console.log(`${h.publicId}: random=${rand.toFixed(4)} → Bot Mona ${resolves ? "✓ resuelve" : "✗ no resuelve"}`);
    if (resolves) botMonaConsCount++;
  }
  console.log(`Total Bot Mona ✓: ${botMonaConsCount} de 10 listings`);

  console.log("\n✓ Guardado en data/health-results.json");
}

main().catch((err) => { console.error("Error:", err); process.exit(1); });
