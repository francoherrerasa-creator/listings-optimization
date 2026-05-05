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

          {/* Section 3: Cómo medimos la calidad */}
          <section>
            <p className="section-tag">Metodología</p>
            <h2 className="mb-1" style={{ color: "var(--eb-blue)" }}>
              Cómo medimos la calidad
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--ink-2)" }}>
              Score ponderado de 100 puntos basado en los campos que EasyBroker pide y los que más pesan en match de búsqueda y SEO. No incluye campos obligatorios (título, ubicación básica, precio): esos son condición de existencia.
            </p>

            <div className="card mb-6" style={{ padding: "20px 24px" }}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--ink-2)" }}>Descripción optimizada</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "13px", color: "var(--eb-ink)" }}>30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--ink-2)" }}>10+ fotos de calidad</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "13px", color: "var(--eb-ink)" }}>25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--ink-2)" }}>Ubicación granular</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "13px", color: "var(--eb-ink)" }}>15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--ink-2)" }}>Características numéricas</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "13px", color: "var(--eb-ink)" }}>15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--ink-2)" }}>Amenidades (mín 3)</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "13px", color: "var(--eb-ink)" }}>10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--ink-2)" }}>Comisión compartida</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "13px", color: "var(--eb-ink)" }}>5%</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--eb-line)", marginTop: "16px", paddingTop: "16px" }}>
                <p className="text-sm mb-1" style={{ color: "var(--eb-ink)" }}><strong>Pincali Ready (80%)</strong> = descripción + fotos + ubicación + características</p>
                <p className="text-sm" style={{ color: "var(--eb-ink)" }}><strong>Top Performer (95%+)</strong> = Pincali Ready + amenidades + comisión + video/tour virtual</p>
              </div>
            </div>

            <p className="text-xs" style={{ color: "var(--ink-3)" }}>
              Disclaimer: este modelo de scoring es una propuesta y se ajustaría con Producto, Customer Success, Brand y Sales una vez dentro del equipo, según data interna que no está en la API pública.
            </p>
          </section>

          {/* Section 4: Qué más medimos */}
          <section>
            <p className="section-tag">Qué más medimos</p>
            <h2 className="mb-1" style={{ color: "var(--eb-blue)" }}>
              Salud del inventario
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--ink-2)" }}>
              Más allá de la calidad: cuánto tiempo lleva publicado, cuánto sin actualización, cuántos canales activos. Estas métricas anticipan churn y oportunidad.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Antigüedad promedio */}
              <div className="card">
                <p className="label-eyebrow mb-2">Antigüedad promedio</p>
                <p className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--eb-ink)" }}>1,179 días</p>
                <p className="text-[12.5px] mt-2" style={{ color: "var(--ink-2)" }}>Listings publicados desde febrero 2023. Indicador de retention silenciosamente roto.</p>
              </div>
              {/* Card 2: Última actualización promedio */}
              <div className="card">
                <p className="label-eyebrow mb-2">Última actualización promedio</p>
                <p className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--eb-ink)" }}>629 días</p>
                <p className="text-[12.5px] mt-2" style={{ color: "var(--ink-2)" }}>Tiempo promedio desde el último cambio en cualquier campo. {">"}90 días = inventario zombie.</p>
              </div>
              {/* Card 3: Calidad promedio */}
              <div className="card">
                <p className="label-eyebrow mb-2">Calidad promedio</p>
                <p className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--red)" }}>53.6%</p>
                <p className="text-[12.5px] mt-2" style={{ color: "var(--ink-2)" }}>Lejos del estándar Pincali Ready (&ge;80%). Eva Quality cierra el gap.</p>
              </div>
              {/* Card 4: Distribución por nivel */}
              <div className="card">
                <p className="label-eyebrow mb-2">Distribución por nivel</p>
                <div className="space-y-1.5 text-sm" style={{ color: "var(--ink-2)" }}>
                  <p><span style={{ color: "#EF4444" }}>&#9679;</span> Crítico (&lt;50%): <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>7 listings (70%)</span></p>
                  <p><span style={{ color: "#F59E0B" }}>&#9679;</span> Standard (50-79%): <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>3 listings (30%)</span></p>
                  <p><span style={{ color: "#10B981" }}>&#9679;</span> Pincali Ready (&ge;80%): <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>0 listings</span></p>
                  <p><span style={{ color: "#1E3AD9" }}>&#9679;</span> Top Performer: <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>0 listings</span></p>
                </div>
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
