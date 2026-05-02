/**
 * Script de prueba end-to-end.
 * Ejecutar con: npm run test:api
 *
 * 1. Trae 10 propiedades de EasyBroker staging
 * 2. Obtiene detalle de cada una
 * 3. Pasa cada una por el scorer
 * 4. Imprime tabla de resultados y resumen agregado
 * 5. Guarda resultado completo en data/scoring-results.json
 */

import "dotenv/config";
import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { listProperties, getProperty } from "../lib/easybroker";
import { scoreProperty, type ScoringResult } from "../lib/scorer";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Listing Quality Sync — Test E2E con API de EasyBroker");
  console.log("═══════════════════════════════════════════════════════════\n");

  // 1. Listar propiedades
  console.log("→ Obteniendo 10 propiedades de staging...\n");
  const { pagination, content: properties } = await listProperties({ limit: 10 });
  console.log(`  Total en staging: ${pagination.total} propiedades`);
  console.log(`  Obtenidas: ${properties.length}\n`);

  // 2. Obtener detalle y scorear cada una
  const results: ScoringResult[] = [];

  for (const prop of properties) {
    process.stdout.write(`  Scoring ${prop.public_id} (${prop.property_type})... `);
    const detail = await getProperty(prop.public_id);
    const result = await scoreProperty(detail);
    results.push(result);
    console.log(`${result.totalScore}/100 ${result.passes ? "✓" : "✗"}`);
  }

  // 3. Tabla de resultados
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  RESULTADOS");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log(
    padRight("ID", 12) +
      padRight("Tipo", 16) +
      padRight("Score", 8) +
      padRight("Pasa", 6) +
      "Issue principal",
  );
  console.log("─".repeat(80));

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const prop = properties[i];
    const topIssue = getTopIssue(r);
    console.log(
      padRight(r.publicId, 12) +
        padRight(prop.property_type, 16) +
        padRight(`${r.totalScore}/100`, 8) +
        padRight(r.passes ? "SI" : "NO", 6) +
        topIssue,
    );
  }

  // 4. Resumen agregado
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  RESUMEN AGREGADO");
  console.log("═══════════════════════════════════════════════════════════\n");

  const passing = results.filter((r) => r.passes).length;
  const avgTotal = Math.round(results.reduce((s, r) => s + r.totalScore, 0) / results.length);

  console.log(`  Listings que pasan (>=70): ${passing}/${results.length} (${Math.round((passing / results.length) * 100)}%)`);
  console.log(`  Score promedio total: ${avgTotal}/100\n`);

  console.log("  Score promedio por dimensión:");
  const dimensionKeys = [
    "description_quality",
    "price_plausibility",
    "data_completeness",
    "photos_signal",
    "location_clarity",
  ] as const;

  const avgByDimension: Record<string, number> = {};
  for (const dim of dimensionKeys) {
    const avg = Math.round(results.reduce((s, r) => s + r.dimensions[dim].score, 0) / results.length);
    avgByDimension[dim] = avg;
    console.log(`    ${padRight(dim, 24)} ${avg}/100`);
  }

  console.log("\n  Flags de moderación frecuentes:");
  const allFlags = results.flatMap((r) => r.flagsForModerationTeam);
  const flagCounts = new Map<string, number>();
  for (const flag of allFlags) {
    flagCounts.set(flag, (flagCounts.get(flag) ?? 0) + 1);
  }
  const topFlags: Array<{ flag: string; count: number }> = [];
  if (flagCounts.size === 0) {
    console.log("    (ninguna)");
  } else {
    for (const [flag, count] of Array.from(flagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
      console.log(`    ${count}x — ${flag}`);
      topFlags.push({ flag, count });
    }
  }

  // 5. Guardar resultados en disco
  const output = {
    generatedAt: new Date().toISOString(),
    source: "easybroker_api_staging",
    totalInPincali: pagination.total,
    sampled: results.length,
    results: results.map((r, i) => ({
      publicId: r.publicId,
      title: properties[i].title,
      propertyType: properties[i].property_type,
      location: properties[i].location,
      operations: properties[i].operations,
      titleImageThumb: properties[i].title_image_thumb,
      totalScore: r.totalScore,
      passes: r.passes,
      dimensions: r.dimensions,
      policyAlignment: r.policyAlignment,
      flagsForModerationTeam: r.flagsForModerationTeam,
    })),
    aggregates: {
      passRate: Math.round((passing / results.length) * 100) / 100,
      avgScore: avgTotal,
      avgByDimension,
      topFlags,
    },
  };

  try {
    const dataDir = resolve(__dirname, "..", "data");
    await mkdir(dataDir, { recursive: true });
    const outPath = resolve(dataDir, "scoring-results.json");
    await writeFile(outPath, JSON.stringify(output, null, 2), "utf-8");
    console.log(`\n✓ Resultados guardados en data/scoring-results.json`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n✗ No se pudo guardar en disco: ${msg}`);
  }

  console.log("\n═══════════════════════════════════════════════════════════");
}

function getTopIssue(result: ScoringResult): string {
  const dims = result.dimensions;
  let lowest = { key: "", score: 101 };
  for (const [key, val] of Object.entries(dims)) {
    if (val.score < lowest.score) {
      lowest = { key, score: val.score };
    }
  }
  return `${lowest.key} (${lowest.score})`;
}

function padRight(str: string, len: number): string {
  return str.length >= len ? str.slice(0, len) : str + " ".repeat(len - str.length);
}

main().catch((err) => {
  console.error("\n✗ Error:", err.message ?? err);
  process.exit(1);
});
