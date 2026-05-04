/**
 * Fetches created_at, updated_at, published_at for each listing in scoring-results.
 * Ejecutar: npx tsx scripts/fetch-listing-dates.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as fs from "node:fs";
import * as path from "node:path";

async function main() {
  const scoringData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/scoring-results.json"), "utf-8"));
  const apiKey = process.env.EASYBROKER_API_KEY!;
  const baseUrl = process.env.EASYBROKER_BASE_URL || "https://api.stagingeb.com";

  const results: Array<{
    publicId: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
  }> = [];

  for (const sr of scoringData.results) {
    const res = await fetch(`${baseUrl}/v1/properties/${sr.publicId}`, {
      headers: { "X-Authorization": apiKey, "Accept": "application/json" }
    });
    const listing = await res.json();
    results.push({
      publicId: sr.publicId,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
      published_at: listing.published_at ?? null,
    });
    console.log(`${sr.publicId}: published=${listing.published_at} updated=${listing.updated_at}`);
  }

  const output = { timestamp: new Date().toISOString(), results };
  fs.writeFileSync(path.join(process.cwd(), "data/listing-dates.json"), JSON.stringify(output, null, 2));
  console.log("\n✓ Saved to data/listing-dates.json");
}

main().catch(e => { console.error(e); process.exit(1); });
