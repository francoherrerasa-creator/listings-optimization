import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as fs from "node:fs";
import * as path from "node:path";
import { calculateMaturityLevel } from "../lib/maturity";

async function main() {
  const scoringData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/scoring-results.json"), "utf-8"));
  const healthData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/health-results.json"), "utf-8"));

  const apiKey = process.env.EASYBROKER_API_KEY!;
  const baseUrl = process.env.EASYBROKER_BASE_URL || "https://api.stagingeb.com";

  const results = [];
  for (let i = 0; i < scoringData.results.length; i++) {
    const sr = scoringData.results[i];
    const res = await fetch(`${baseUrl}/v1/properties/${sr.publicId}`, {
      headers: { "X-Authorization": apiKey, "Accept": "application/json" }
    });
    const listing = await res.json();
    const healthPercent = healthData.results[i]?.overallHealthPercent ?? 0;
    results.push(calculateMaturityLevel(listing, healthPercent));
  }

  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const r of results) counts[r.level]++;

  const output = { timestamp: new Date().toISOString(), results, counts };
  fs.writeFileSync(path.join(process.cwd(), "data/maturity-results.json"), JSON.stringify(output, null, 2));

  console.log("=== MATURITY FUNNEL ===");
  console.log(`Crítico (nivel 1): ${counts[1]}`);
  console.log(`Standard (nivel 2): ${counts[2]}`);
  console.log(`Pincali Ready (nivel 3): ${counts[3]}`);
  console.log(`Top Performer (nivel 4): ${counts[4]}`);
  console.log("\nPer listing:");
  for (const r of results) {
    console.log(`${r.publicId}: Level ${r.level} (${r.levelLabel}) - agent:${r.criteria.hasAgent} photos5:${r.criteria.hasMinPhotos5} photos10:${r.criteria.hasMinPhotos10} health80:${r.criteria.healthAbove80}`);
  }
  console.log("\n✓ Saved to data/maturity-results.json");
}

main().catch(e => { console.error(e); process.exit(1); });
