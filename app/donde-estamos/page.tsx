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


  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--eb-line)" }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity"
              style={{ color: "var(--eb-blue)" }}
            >
              {config.brand.shortName}
            </Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>
              Medimos · {config.project.name}
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm" style={{ color: "var(--ink-2)" }}>
            <Link href="/plan-de-accion" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Accionamos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/road-to-excellence" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Entregamos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/propiedades" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Propiedades</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/red-flags" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Red Flags</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/pincali" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Pincali</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/benchmark" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Benchmark</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <p className="section-tag">Sección 01 · Diagnóstico</p>
            <h1 style={{ color: "var(--eb-blue)" }}>MEDIMOS</h1>
            <p className="text-sm" style={{ color: "var(--ink-3)" }}>Estado actual de EasyBroker</p>
          </div>

          {/* Executive Summary */}
          <div className="highlight-block">
            Analizamos 10 propiedades de las 1,437 publicadas. Ninguna pasa control de calidad. Promedio actual: Calidad 54% con 40 flags totales, 4 flags por propiedad. La descripción es el cuello de botella claro: afecta a las 10 propiedades auditadas con 19 flags.
          </div>

          {/* Section 1: Stat boxes */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AggregateCard
                label="Activation Rate"
                value="0%"
                detail="0 de 10 activados"
                numericScore={0}
              />
              <AggregateCard
                label="Calidad Promedio"
                value="54%"
                detail="Estándar de calidad: 80%"
                numericScore={54}
              />
              <AggregateCard
                label="Analizados"
                value="10"
                detail="de 1,437 totales"
              />
              <AggregateCard
                label="Flags"
                value={String(totalFlags)}
                detail={`promedio: ${(totalFlags / results.length).toFixed(1)}/propiedad`}
              />
              <AggregateCard
                label="Top Issue"
                value={dimensionLabels[worstDim[0]] ?? worstDim[0]}
                detail={`${worstDimAffected} propiedades afectadas`}
              />
              <AggregateCard
                label="Estatus Operativo"
                value="10"
                detail="publicadas, de 6 estatus posibles"
              />
            </div>
          </section>

          {/* Section 2: Calidad por Dimensión */}
          <section>
            <p className="section-tag">Calidad por Dimensión</p>
            <h2 className="mb-4" style={{ color: "var(--eb-blue)" }}>
              Calidad por dimensión
            </h2>

            {/* Column headers */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-32 shrink-0" />
              <span className="w-8 text-center label-eyebrow shrink-0">prop.</span>
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
              <span style={{ color: "var(--green)" }}>Total: {data.sampled}</span>
              <span style={{ color: "var(--amber)" }}>80 · estándar de calidad</span>
              <span style={{ color: "var(--eb-blue)" }}>Calidad promedio: 54</span>
            </div>
          </section>

          {/* Section 3: Flags by Dimension */}
          <section>
            <p className="section-tag">Flags por Dimensión</p>
            <h2 className="mb-4" style={{ color: "var(--eb-blue)" }}>
              Flags por dimensión
            </h2>
            <div className="card overflow-hidden" style={{ padding: 0 }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--paper-2)" }}>
                    <th className="px-4 py-3 text-left">Dimensión</th>
                    <th className="px-4 py-3 text-center">Flags</th>
                    <th className="px-4 py-3 text-center">Propiedades afectadas</th>
                    <th className="px-4 py-3 text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dimFlagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dim, flags]) => {
                      const avg = aggregates.avgByDimension[dim] ?? 0;
                      const affected = results.filter(
                        (r) => r.dimensions[dim as keyof typeof r.dimensions]?.score < 70
                      ).length;
                      const scoreBg = avg >= 85 ? { background: "#D1FAE5", color: "#065F46" } : avg >= 70 ? { background: "#FEF3C7", color: "#92400E" } : { background: "#FEE2E2", color: "#991B1B" };
                      return (
                        <tr key={dim} style={flags > 10 ? { background: "#FEF2F220" } : {}}>
                          <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>{dimensionLabels[dim] ?? dim}</td>
                          <td className="px-4 py-3 text-center font-medium" style={{ fontFamily: "var(--font-mono)", color: "var(--eb-ink)" }}>{flags}</td>
                          <td className="px-4 py-3 text-center" style={{ color: "var(--ink-2)" }}>{affected}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={scoreBg}>
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

          {/* Funnel de Optimización */}
          <section>
            <p className="section-tag">Funnel de Optimización</p>
            <h2 className="mb-4" style={{ color: "var(--eb-blue)" }}>
              Funnel de Optimización
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="card text-center" style={{ borderBottom: "4px solid var(--ink-3)" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--ink-2)", fontFamily: "var(--font-mono)" }}>10</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Propiedades revisadas</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>muestra auditada</p>
                <span className="badge inline-block mt-2">40 flags encontradas</span>
              </div>
              <div className="card text-center" style={{ borderBottom: "4px solid var(--red)" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>19</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>flags por descripción incompleta</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>10 de 10 propiedades afectadas</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded" style={{ background: "#FEE2E2", color: "var(--red)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>CUELLO DE BOTELLA</span>
              </div>
              <div className="card text-center" style={{ borderBottom: "4px solid var(--green)" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>9</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Optimizables por Automatización</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>9 propiedades a activar</p>
                <span className="badge inline-block mt-2">vía API</span>
              </div>
              <div className="card text-center" style={{ borderBottom: "4px solid #059669" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>10</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Optimizables por Eva Quality</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>10 propiedades a activar</p>
                <span className="badge inline-block mt-2">vía WhatsApp</span>
              </div>
              <div className="card text-center" style={{ borderBottom: "4px solid #047857" }}>
                <p className="text-2xl font-bold" style={{ color: "#047857", fontFamily: "var(--font-mono)" }}>{results.length - 4}</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Pincali Ready</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>después de optimizaciones</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded" style={{ background: "#FEE2E2", color: "var(--red)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>4 con Red Flags</span>
              </div>
            </div>
          </section>


          {/* CTA to Next Steps */}
          <div className="text-center">
            <Link
              href="/plan-de-accion"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              Accionamos
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--eb-line)" }} className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm" style={{ color: "var(--ink-3)" }}>
          <p>
            Generado: {new Date(data.generatedAt).toLocaleString("es-MX")} ·
            Fuente: {data.source}
          </p>
          <Link href="/" className="hover:opacity-70" style={{ color: "var(--eb-blue)" }}>
            {config.brand.shortName}
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ─── Components ───

function scoreColor(score: number): string {
  if (score >= 85) return "var(--green)";
  if (score >= 70) return "var(--amber)";
  return "var(--red)";
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
  const valueColor = numericScore !== undefined ? scoreColor(numericScore) : "var(--eb-ink)";

  return (
    <div className="card relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: "var(--eb-blue)" }}
      />
      <p className="label-eyebrow mb-2">
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: valueColor, fontFamily: "var(--font-mono)" }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: "var(--ink-3)" }}>{detail}</p>
    </div>
  );
}

function barBgColor(value: number): string {
  if (value >= 85) return "var(--green)";
  if (value >= 70) return "var(--amber)";
  return "#FCA5A5";
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
        <span className="text-sm" style={{ color: "var(--ink-2)" }}>{label}</span>
        {hint && <p className="text-[11px] leading-tight" style={{ color: "var(--ink-3)" }}>{hint}</p>}
      </div>
      <span className="w-8 text-center text-sm font-medium shrink-0" style={{ color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
        {affected}
      </span>
      <div className="flex-1 relative h-6 rounded overflow-hidden" style={{ background: "var(--paper-2)" }}>
        <div
          className="absolute inset-y-0 left-0 rounded transition-all"
          style={{ width: `${value}%`, background: barBgColor(value) }}
        />
        <div className="absolute inset-y-0 w-[2px] opacity-70" style={{ left: "80%", background: "var(--green)" }} />
      </div>
      <span className="w-10 text-right text-sm font-bold shrink-0" style={{ color: "var(--eb-ink)", fontFamily: "var(--font-mono)" }}>
        {value}
      </span>
    </div>
  );
}

function FunnelCard({
  value,
  label,
  detail,
  borderColor,
  badge,
}: {
  value: string;
  label: string;
  detail: string;
  borderColor: string;
  badge?: string;
}) {
  return (
    <div className="card text-center" style={{ borderBottom: `4px solid ${borderColor}` }}>
      <p className="text-3xl font-bold" style={{ color: "var(--eb-ink)", fontFamily: "var(--font-mono)" }}>{value}</p>
      {badge && (
        <span className="badge inline-block mt-1">{badge}</span>
      )}
      <p className="text-sm font-medium mt-1" style={{ color: "var(--ink-2)" }}>{label}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>{detail}</p>
    </div>
  );
}
