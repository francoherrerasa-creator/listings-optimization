/**
 * Recalculates scoring using the v2 model (8 dimensions, sub-factors).
 * Ejecutar: npx tsx scripts/recalculate-scoring-v2.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as fs from "node:fs";
import * as path from "node:path";
import { calculateScoreV2 } from "../lib/scorerV2";
import { calculateMaturityLevel } from "../lib/maturity";

async function main() {
  const apiKey = process.env.EASYBROKER_API_KEY!;
  const baseUrl = process.env.EASYBROKER_BASE_URL || "https://api.stagingeb.com";

  const scoringData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/scoring-results.json"), "utf-8"));

  const results = [];
  for (const sr of scoringData.results) {
    const res = await fetch(`${baseUrl}/v1/properties/${sr.publicId}`, {
      headers: { "X-Authorization": apiKey, "Accept": "application/json" }
    });
    const listing = await res.json();
    const scoreResult = calculateScoreV2(listing);

    results.push({
      ...sr,
      totalScore: scoreResult.totalScore,
      passes: scoreResult.totalScore >= 80,
      dimensionsV2: scoreResult.dimensions,
    });

    console.log(`${sr.publicId}: ${scoreResult.totalScore}/100 (photos:${scoreResult.dimensions.photos.score} desc:${scoreResult.dimensions.description.score} price:${scoreResult.dimensions.price.score} fresh:${scoreResult.dimensions.freshness.score} loc:${scoreResult.dimensions.location.score} chars:${scoreResult.dimensions.characteristics.score} amen:${scoreResult.dimensions.amenities.score} video:${scoreResult.dimensions.video.score})`);
  }

  // Update scoring-results.json
  const avgScore = Math.round((results.reduce((s, r) => s + r.totalScore, 0) / results.length) * 10) / 10;
  const passRate = Math.round((results.filter(r => r.passes).length / results.length) * 100);

  scoringData.results = results;
  scoringData.aggregates.avgScore = avgScore;
  scoringData.aggregates.passRate = passRate;

  // Recalculate avgByDimension using the old dimension keys for backwards compat display
  // Map new scores to old dimension names for the dimension bar display
  const dimAvgs: Record<string, number> = {};
  const dimKeys = ["description_quality", "price_plausibility", "data_completeness", "photos_signal", "location_clarity"];
  const dimMapping: Record<string, (r: any) => number> = {
    description_quality: (r) => Math.round((r.dimensionsV2?.description?.score ?? 0) / 20 * 100),
    price_plausibility: (r) => Math.round((r.dimensionsV2?.price?.score ?? 0) / 20 * 100),
    data_completeness: (r) => Math.round(((r.dimensionsV2?.characteristics?.score ?? 0) + (r.dimensionsV2?.freshness?.score ?? 0)) / 23 * 100),
    photos_signal: (r) => Math.round((r.dimensionsV2?.photos?.score ?? 0) / 20 * 100),
    location_clarity: (r) => Math.round((r.dimensionsV2?.location?.score ?? 0) / 10 * 100),
  };

  for (const dim of dimKeys) {
    const avg = Math.round(results.reduce((s, r) => s + dimMapping[dim](r), 0) / results.length);
    dimAvgs[dim] = avg;
  }
  scoringData.aggregates.avgByDimension = dimAvgs;

  fs.writeFileSync(path.join(process.cwd(), "data/scoring-results.json"), JSON.stringify(scoringData, null, 2));

  // Recalculate maturity with new scores
  const maturityResults = [];
  for (const r of results) {
    const res2 = await fetch(`${baseUrl}/v1/properties/${r.publicId}`, {
      headers: { "X-Authorization": apiKey, "Accept": "application/json" }
    });
    const listing = await res2.json();
    maturityResults.push(calculateMaturityLevel(listing, r.totalScore));
  }

  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const m of maturityResults) counts[m.level]++;

  const maturityOutput = { timestamp: new Date().toISOString(), results: maturityResults, counts };
  fs.writeFileSync(path.join(process.cwd(), "data/maturity-results.json"), JSON.stringify(maturityOutput, null, 2));

  console.log(`\n=== RESULTS ===`);
  console.log(`Average score: ${avgScore}/100`);
  console.log(`Pass rate (>=80): ${passRate}%`);
  console.log(`Crítico: ${counts[1]}, Standard: ${counts[2]}, Pincali Ready: ${counts[3]}, Top Performer: ${counts[4]}`);
  console.log("\n✓ Updated data/scoring-results.json and data/maturity-results.json");
}

main().catch(e => { console.error(e); process.exit(1); });
