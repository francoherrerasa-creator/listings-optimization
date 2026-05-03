import { config } from "@/lib/config";
import { loadScoringResults, type ScoringResultEntry } from "@/lib/loadResults";
import Link from "next/link";

// ──��� Recovery calculation ───

function calcWeightedScore(dims: Record<string, number>): number {
  const weights = config.scoring.dimensions;
  const totalWeight = weights.reduce((s, d) => s + d.weight, 0);
  return Math.round(
    weights.reduce((s, d) => s + (dims[d.id] ?? 0) * d.weight, 0) / totalWeight
  );
}

function getDims(r: ScoringResultEntry): Record<string, number> {
  return {
    description_quality: r.dimensions.description_quality.score,
    price_plausibility: r.dimensions.price_plausibility.score,
    data_completeness: r.dimensions.data_completeness.score,
    photos_signal: r.dimensions.photos_signal.score,
    location_clarity: r.dimensions.location_clarity.score,
  };
}

function simulateLevel(
  results: ScoringResultEntry[],
  overrides: Record<string, number>,
  prevScores?: number[],
): { newScores: number[]; recovered: number; avgScore: number } {
  const baseScores = prevScores ?? results.map((r) => r.totalScore);
  const newScores = results.map((r) => {
    const dims = getDims(r);
    for (const [key, target] of Object.entries(overrides)) {
      dims[key] = Math.max(dims[key], target);
    }
    return calcWeightedScore(dims);
  });
  const recovered = newScores.filter((s, i) => s >= 70 && baseScores[i] < 70).length;
  const avgScore = Math.round(newScores.reduce((s, v) => s + v, 0) / newScores.length);
  return { newScores, recovered, avgScore };
}

export default async function RoadToExcellencePage() {
  const data = await loadScoringResults();
  const { results } = data;

  const currentScores = results.map((r) => r.totalScore);

  // GO: description + data to 100
  const level1 = simulateLevel(results, { description_quality: 100, data_completeness: 100 }, currentScores);

  // PRO (cumulative): photos + location + price to 100
  const level2 = simulateLevel(results, { description_quality: 100, data_completeness: 100, photos_signal: 100, location_clarity: 100, price_plausibility: 100 }, level1.newScores);

  const descBelow70 = results.filter((r) => r.dimensions.description_quality.score < 70).length;
  const dataBelow70 = results.filter((r) => r.dimensions.data_completeness.score < 70).length;
  const photosBelow70 = results.filter((r) => r.dimensions.photos_signal.score < 70).length;
  const locBelow70 = results.filter((r) => r.dimensions.location_clarity.score < 70).length;
  const priceBelow70 = results.filter((r) => r.dimensions.price_plausibility.score < 70).length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity" style={{ color: config.brand.primaryColor }}>{config.brand.shortName}</Link>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">Entregamos · {config.project.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/plan-de-accion" className="hover:text-gray-900 transition-colors">Accionamos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/donde-estamos" className="hover:text-gray-900 transition-colors">Medimos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/listings" className="hover:text-gray-900 transition-colors">Listings</Link>
            <span className="text-gray-300">·</span>
            <Link href="/pincali" className="hover:text-gray-900 transition-colors">Pincali</Link>
            <span className="text-gray-300">·</span>
            <Link href="/red-flags" className="hover:text-gray-900 transition-colors">Red Flags</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-1" style={{ color: config.brand.primaryColor }}>ENTREGAMOS</h1>
          <p className="text-sm text-gray-500 mb-8">De score 53 a 100</p>

          <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 mb-10">
            <p className="text-base text-gray-700 leading-relaxed">
              100% de listings al 100. El equipo de Growth optimiza descripción y datos automáticamente, después, Mona pide fotos y valida ubicación por WhatsApp. En paralelo, atacamos las Red Flags: 4 listings con violaciones de política que requieren acción inmediata. Mínimo esperado: 70. Meta deseable: 100.
            </p>
          </div>

          <div className="space-y-6">
            {/* TIER GO */}
            <div className="border border-gray-100 rounded-lg p-6 bg-[#A7F3D0]">
              <div className="mb-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER</p>
                <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">Acción: <strong>Optimizar Descripción + Datos faltantes</strong></p>
              <div className="flex items-center gap-3 mb-1 text-[10px] text-gray-400 uppercase">
                <span className="w-24 shrink-0" />
                <span className="w-8 text-right shrink-0">Listings</span>
                <span className="flex-1" />
                <span className="w-16 shrink-0" />
              </div>
              <div className="space-y-2">
                <ProgressBar label="Descripción" before={40} after={100} affected={descBelow70} color="bg-green-700" />
                <ProgressBar label="Datos" before={60} after={100} affected={dataBelow70} color="bg-green-700" />
              </div>
              <p className="text-sm font-medium text-gray-800 mt-4">Avg total: 53 → {level1.avgScore}</p>
            </div>

            {/* TIER PRO */}
            <div className="border border-gray-100 rounded-lg p-6 bg-[#DCFCE7]">
              <div className="mb-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER</p>
                <h3 className="text-lg font-semibold text-gray-900">Mona</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Acción: <strong>Pedir Fotos + Validar Ubicación + Confirmar Precio</strong></p>
              <div className="flex items-center gap-3 mb-1 text-[10px] text-gray-400 uppercase">
                <span className="w-24 shrink-0" />
                <span className="w-8 text-right shrink-0">Listings</span>
                <span className="flex-1" />
                <span className="w-16 shrink-0" />
              </div>
              <div className="space-y-2">
                <ProgressBar label="Fotos" before={51} after={100} affected={photosBelow70} color="bg-green-600" />
                <ProgressBar label="Ubicación" before={69} after={100} affected={locBelow70} color="bg-green-600" />
                <ProgressBar label="Precio" before={50} after={100} affected={priceBelow70} color="bg-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 mt-4">Avg total: {level1.avgScore} → {level2.avgScore}</p>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Acción Inmediata</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* LEAK */}
          <div className="border border-red-200 bg-red-50 rounded-lg p-6">
            <div className="mb-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER</p>
              <h3 className="text-lg font-semibold text-gray-900">Red Flags</h3>
              <p className="text-xs text-red-600 mt-1">Growth · Limpieza editorial automática</p>
            </div>
            <p className="text-sm text-gray-600 mb-3">Acción: Limpieza editorial automática de descripciones</p>
            <ul className="text-xs text-gray-600 space-y-1 mb-4 list-disc list-inside">
              <li>Datos de contacto en descripción (teléfonos, emails, URLs)</li>
              <li>Nombres comerciales/inmobiliarias promocionados en copy</li>
              <li>Llamados a acción comerciales directos</li>
              <li>Fraude potencial (precios anzuelo, remates clasificados)</li>
            </ul>
            <p className="text-sm font-medium text-red-700 mb-4">
              4 de 10 listings con violaciones · 12 violaciones detectadas
            </p>
            <Link
              href="/red-flags"
              className="inline-block px-4 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-700 hover:bg-red-100 transition-colors"
            >
              Ver Red Flags →
            </Link>
          </div>

          {/* Lateral cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Sales</h4>
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">0 flags</span>
            </div>
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Marketing</h4>
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">sin acciones</span>
            </div>
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Trust & Safety</h4>
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">0 alertas</span>
            </div>
          </div>

          {/* Summary - 4 escalated lines */}
          <div className="mt-10 space-y-2">
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm font-medium text-red-400">Hoy: 0 de {results.length} listings activados · Score 53</p>
            </div>
            <div className="px-4 py-3 rounded-lg bg-[#BBF7D0] border border-green-200">
              <p className="text-sm font-medium text-green-800">Con TIER GO: {level1.newScores.filter((s) => s >= 70).length} listings activados · Score {level1.avgScore}</p>
            </div>
            <div className="px-4 py-3 rounded-lg bg-[#10B981] border border-green-600">
              <p className="text-sm font-medium text-white">Con TIER GO + PRO: {level2.newScores.filter((s) => s >= 70).length} listings activados · Score {level2.avgScore}</p>
            </div>
            <div className="px-4 py-3 rounded-lg bg-red-50/50 border border-red-100/50">
              <p className="text-sm font-medium text-red-500">Con Red Flags fix: 0 listings con violaciones de política · base limpia</p>
            </div>
          </div>

          {/* Final phrase */}
          <p className="text-3xl font-bold text-center mt-12" style={{ color: config.brand.primaryColor }}>
            Ready to go.
          </p>

          {/* Back button */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Volver al inicio →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <Link href="/plan-de-accion" className="hover:text-gray-900">← Accionamos</Link>
          <Link href="/" className="hover:text-gray-900">{config.brand.shortName}</Link>
        </div>
      </footer>
    </div>
  );
}

function ProgressBar({
  label, before, after, affected, color,
}: {
  label: string; before: number; after: number; affected: number; color: string;
}) {
  const beforeColor = before >= 85 ? "bg-emerald-500" : before >= 70 ? "bg-yellow-400" : "bg-red-200";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-24 shrink-0">{label}</span>
      <span className="text-sm font-bold w-8 text-right shrink-0" style={{ color: "#2A2EBE" }}>{affected}</span>
      <div className="flex-1 relative h-5 bg-white/50 rounded overflow-hidden">
        <div className={`absolute inset-y-0 left-0 ${color} opacity-25 rounded`} style={{ width: `${after}%` }} />
        <div className={`absolute inset-y-0 left-0 ${beforeColor} rounded`} style={{ width: `${before}%` }} />
      </div>
      <span className="text-xs text-gray-600 w-16 shrink-0 text-right">{before} → {after}</span>
    </div>
  );
}
