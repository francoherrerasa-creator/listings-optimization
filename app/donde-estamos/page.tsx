import { config } from "@/lib/config";
import { loadScoringResults } from "@/lib/loadResults";
import Link from "next/link";

export default async function GrowthPage() {
  const data = await loadScoringResults();
  const { aggregates, results } = data;

  const worstDim = Object.entries(aggregates.avgByDimension).sort(
    (a, b) => a[1] - b[1],
  )[0];

  const worstDimAffected = results.filter(
    (r) => r.dimensions[worstDim[0] as keyof typeof r.dimensions]?.score < 70
  ).length;

  const dimensionLabels: Record<string, string> = {
    description_quality: "Descripción",
    price_plausibility: "Precio",
    data_completeness: "Datos faltantes",
    photos_signal: "Fotos",
    location_clarity: "Ubicación clara",
  };

  const dimensionHints: Record<string, string> = {
    description_quality: "qué tan completa y útil",
    price_plausibility: "alineación con el mercado",
    data_completeness: "campos vacíos",
    photos_signal: "cantidad y calidad vs estándar oficial",
    location_clarity: "qué tan precisa para búsqueda y filtros",
  };

  // Flag counts by dimension
  const allFlags = results.flatMap((r) => r.flagsForModerationTeam);
  const totalFlags = allFlags.length;
  const dimKeywords: Record<string, RegExp> = {
    description_quality: /descripci[oó]n|texto|truncad|incompleta|contenido|t[ií]tulo/i,
    data_completeness: /datos|campos|amenidades|informaci[oó]n|m²|baño|contacto|agencia|promoci[oó]n|llame|marca/i,
    photos_signal: /foto|im[aá]gen/i,
    location_clarity: /ubicaci[oó]n|mapa|geocod|coordenadas|geogr[aá]f|zona/i,
    price_plausibility: /precio|valor|mercado|discrepancia/i,
  };

  const dimFlagCounts: Record<string, number> = {};
  for (const dim of Object.keys(dimKeywords)) dimFlagCounts[dim] = 0;
  for (const flag of allFlags) {
    for (const [dim, regex] of Object.entries(dimKeywords)) {
      if (regex.test(flag)) { dimFlagCounts[dim]++; break; }
    }
  }

  const activationRate = Math.round((results.filter((r) => r.passes).length / results.length) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity"
              style={{ color: config.brand.primaryColor }}
            >
              {config.brand.shortName}
            </Link>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">
              Cómo Estamos · {config.project.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/plan-de-accion" className="hover:text-gray-900 transition-colors">Plan de Acción</Link>
            <span className="text-gray-300">·</span>
            <Link href="/road-to-excellence" className="hover:text-gray-900 transition-colors">Road to Excellence</Link>
            <span className="text-gray-300">·</span>
            <Link href="/listings" className="hover:text-gray-900 transition-colors">Listings</Link>
            <span className="text-gray-300">·</span>
            <Link href="/red-flags" className="hover:text-gray-900 transition-colors">Red Flags</Link>
            <span className="text-gray-300">·</span>
            <Link href="/pincali" className="hover:text-gray-900 transition-colors">Pincali</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: config.brand.primaryColor }}>CÓMO ESTAMOS</h1>
            <p className="text-sm text-gray-500">Estado actual de EasyBroker</p>
          </div>

          <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 max-w-4xl">
            <p className="text-base text-gray-700 leading-relaxed">
              Analizamos 10 listings de los 1,437 publicados. Ninguno pasa el mínimo de calidad. Score promedio: 53. La calidad del inventario mueve directo el funnel free-to-paid: cada listing flojo es un lead que no llega y un upgrade de plan que no pasa.
            </p>
          </div>

          {/* Section 1: Aggregates */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AggregateCard
                label="Activation Rate"
                value={`${activationRate}%`}
                detail={`${results.filter((r) => r.passes).length} de ${results.length} activados`}
                numericScore={activationRate}
              />
              <AggregateCard
                label="Avg Score"
                value={`${aggregates.avgScore}`}
                detail={`Threshold: ${config.scoring.passingThreshold}`}
                numericScore={aggregates.avgScore}
              />
              <AggregateCard
                label="Analizados"
                value={String(data.sampled)}
                detail={`de ${data.totalInPincali.toLocaleString()} totales`}
              />
              <AggregateCard
                label="Flags"
                value={String(totalFlags)}
                detail={`promedio: ${(totalFlags / results.length).toFixed(1)}/listing`}
              />
              <AggregateCard
                label="Top Issue"
                value={dimensionLabels[worstDim[0]] ?? worstDim[0]}
                detail={`${worstDimAffected} listings afectados`}
              />
              <AggregateCard
                label="Estatus Operativo"
                value="10"
                detail="publicadas · de 6 estatus posibles"
              />
            </div>
          </section>

          {/* Section 2: Score by Dimension */}
          <section>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
              Score por dimensión
            </h2>

            {/* Column headers */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-32 shrink-0" />
              <span className="w-8 text-center text-[10px] text-gray-400 uppercase shrink-0">listings</span>
              <div className="flex-1" />
              <div className="w-10 shrink-0" />
            </div>

            <div className="space-y-4">
              {Object.entries(aggregates.avgByDimension).map(([dim, avg]) => {
                const belowThreshold = results.filter(
                  (r) => r.dimensions[dim as keyof typeof r.dimensions]?.score < 70
                ).length;
                return (
                  <DimensionBar
                    key={dim}
                    label={dimensionLabels[dim] ?? dim}
                    hint={dimensionHints[dim] ?? ""}
                    value={avg}
                    affected={belowThreshold}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-4 text-xs font-medium">
              <span className="text-green-700">Total: {data.sampled}</span>
              <span className="text-yellow-700">70 Mínimo  ·  90 Meta deseable</span>
              <span style={{ color: config.brand.primaryColor }}>Avg score: {aggregates.avgScore}</span>
            </div>
          </section>

          {/* Section 3: Flags by Dimension */}
          <section>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
              Flags por dimensión
            </h2>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Dimensión</th>
                    <th className="px-4 py-3 font-medium text-center">Flags</th>
                    <th className="px-4 py-3 font-medium text-center">Listings afectados</th>
                    <th className="px-4 py-3 font-medium text-center">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Object.entries(dimFlagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dim, flags]) => {
                      const avg = aggregates.avgByDimension[dim] ?? 0;
                      const affected = results.filter(
                        (r) => r.dimensions[dim as keyof typeof r.dimensions]?.score < 70
                      ).length;
                      const scoreBg = avg >= 85 ? "bg-emerald-50 text-emerald-700" : avg >= 70 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-400";
                      return (
                        <tr key={dim} className={flags > 10 ? "bg-red-50/30" : ""}>
                          <td className="px-4 py-3 text-gray-700">{dimensionLabels[dim] ?? dim}</td>
                          <td className="px-4 py-3 text-center font-medium text-gray-700">{flags}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{affected}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${scoreBg}`}>
                              {avg}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA to Next Steps */}
          <div className="text-center">
            <Link
              href="/plan-de-accion"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-medium text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: config.brand.primaryColor }}
            >
              Plan de Acción →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <p>
            Generado: {new Date(data.generatedAt).toLocaleString("es-MX")} ·
            Fuente: {data.source}
          </p>
          <Link href="/" className="hover:text-gray-900">
            {config.brand.shortName}
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ─── Components ───

function scoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-400";
}

function AggregateCard({
  label,
  value,
  detail,
  numericScore,
}: {
  label: string;
  value: string;
  detail: string;
  numericScore?: number;
}) {
  const valueClass = numericScore !== undefined ? scoreColor(numericScore) : "text-gray-900";

  return (
    <div className="border border-gray-100 rounded-lg p-5 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: config.brand.primaryColor }}
      />
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{detail}</p>
    </div>
  );
}

function barBgColor(value: number): string {
  if (value >= 85) return "bg-emerald-500";
  if (value >= 70) return "bg-yellow-400";
  return "bg-red-200";
}

function DimensionBar({
  label,
  hint,
  value,
  affected,
}: {
  label: string;
  hint: string;
  value: number;
  affected: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 shrink-0">
        <span className="text-sm text-gray-600">{label}</span>
        {hint && <p className="text-[11px] text-gray-400 leading-tight">{hint}</p>}
      </div>
      <span className="w-8 text-center text-sm font-medium text-gray-500 shrink-0">
        {affected}
      </span>
      <div className="flex-1 relative h-6 bg-gray-50 rounded overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${barBgColor(value)} rounded transition-all`}
          style={{ width: `${value}%` }}
        />
        <div className="absolute inset-y-0 w-0.5 bg-yellow-400 opacity-70" style={{ left: "70%" }} />
        <div className="absolute inset-y-0 w-[2px] bg-emerald-500 opacity-70" style={{ left: "90%" }} />
      </div>
      <span className="w-10 text-right text-sm font-bold text-gray-700 shrink-0">
        {value}
      </span>
    </div>
  );
}
