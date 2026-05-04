import { config } from "@/lib/config";
import { loadHealthData } from "@/lib/loadHealth";
import Link from "next/link";

export default async function RoadToExcellencePage() {
  const health = await loadHealthData();
  const { aggregate } = health;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--eb-line)" }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity" style={{ color: "var(--eb-blue)" }}>{config.brand.shortName}</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>Entregamos · {config.project.name}</span>
          </div>
          <nav className="flex items-center gap-3 text-sm" style={{ color: "var(--ink-2)" }}>
            <Link href="/plan-de-accion" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Accionamos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/donde-estamos" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Medimos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/propiedades" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Propiedades</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/pincali" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Pincali</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/red-flags" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Red Flags</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/benchmark" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Benchmark</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="section-tag">Sección 03 · Ejecución</p>
          <h1 style={{ color: "var(--eb-blue)" }}>ENTREGAMOS</h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-3)" }}>One team: de 0 a 10 Pincali Ready</p>

          {/* Executive Summary */}
          <div className="highlight-block mb-10">
            Cada equipo entrega su slice del sistema. Growth lleva la calidad de 54% a 93% con Automatización y Eva Quality. Sales asigna asesor a las 5 propiedades huérfanas. Customer Success reactiva las 10 propiedades inactivas. Trust & Safety resuelve las 5 violaciones de política. Resultado: de 0 propiedades Pincali Ready hoy, llegamos a 10 cuando los frentes ejecutan en paralelo.
          </div>

          {/* KPI Tracking Table */}
          <p className="section-tag">KPIs de Seguimiento</p>
          <h2 className="mb-4" style={{ color: "var(--eb-blue)" }}>Cómo medimos el éxito</h2>
          <div className="card overflow-hidden mb-10" style={{ padding: 0 }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--paper-2)" }}>
                    <th className="px-4 py-3 text-left">KPI</th>
                    <th className="px-4 py-3 text-left">Métrica</th>
                    <th className="px-4 py-3 text-center">Frecuencia</th>
                    <th className="px-4 py-3 text-center">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>Pincali Ready %</td>
                    <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>(Listings con calidad &ge;80%) / (Total listings activos)</td>
                    <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>Semanal</td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--eb-blue)" }}>Growth</td>
                  </tr>
                  <tr style={{ background: "var(--paper-2)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>Inventario zombie %</td>
                    <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>(Listings {">"}90 días sin actualizar) / (Total listings)</td>
                    <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>Semanal</td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--eb-blue)" }}>Growth + CS</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>Listings sin asesor %</td>
                    <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>(Listings con agent:null) / (Total listings)</td>
                    <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>Semanal</td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--eb-blue)" }}>Growth + Sales</td>
                  </tr>
                  <tr style={{ background: "var(--paper-2)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>MRR por upgrades</td>
                    <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>$$ atribuido a actividad de Growth (Eva, lifecycle, SEO)</td>
                    <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>Mensual</td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--eb-blue)" }}>Growth</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>NPS post-Eva</td>
                    <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>Score de asesor después de interacción con cualquier versión de Eva</td>
                    <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>Mensual</td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--eb-blue)" }}>Growth + CS</td>
                  </tr>
                  <tr style={{ background: "var(--paper-2)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>Lead response rate</td>
                    <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>% conversaciones con respuesta del asesor en &lt;24h</td>
                    <td className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>Semanal</td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--eb-blue)" }}>Sales</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Estado Meta */}
          <section className="mb-10">
            <p className="section-tag">Estado Meta</p>
            <h2 className="mb-1" style={{ color: "var(--eb-blue)" }}>De dónde venimos, a dónde llegamos en 90 días</h2>
            <p className="text-sm mb-6" style={{ color: "var(--ink-2)" }}>El motor free-to-paid en 3 KPIs. Hoy vs el target del Plan 90 días.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pincali Ready */}
              <div className="card" style={{ borderLeft: "3px solid var(--eb-blue)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)", marginBottom: "12px" }}>Pincali Ready %</p>
                <div className="flex items-center justify-between gap-2">
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "36px", color: "var(--red)", lineHeight: 1 }}>0%</p>
                  <span style={{ fontSize: "28px", color: "var(--green)" }}>&rarr;</span>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "36px", color: "var(--green)", lineHeight: 1 }}>60%+</p>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)", marginTop: "12px" }}>Growth + Eva Quality</p>
              </div>
              {/* Inventario Zombie */}
              <div className="card" style={{ borderLeft: "3px solid var(--eb-blue)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)", marginBottom: "12px" }}>Inventario Zombie</p>
                <div className="flex items-center justify-between gap-2">
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "36px", color: "var(--red)", lineHeight: 1 }}>100%</p>
                  <span style={{ fontSize: "28px", color: "var(--green)" }}>&rarr;</span>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "36px", color: "var(--green)", lineHeight: 1 }}>&lt;30%</p>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)", marginTop: "12px" }}>Growth + Eva Reactivate</p>
              </div>
              {/* Listings sin asesor */}
              <div className="card" style={{ borderLeft: "3px solid var(--eb-blue)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)", marginBottom: "12px" }}>Listings sin Asesor</p>
                <div className="flex items-center justify-between gap-2">
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "36px", color: "var(--red)", lineHeight: 1 }}>50%</p>
                  <span style={{ fontSize: "28px", color: "var(--green)" }}>&rarr;</span>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "36px", color: "var(--green)", lineHeight: 1 }}>&lt;10%</p>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)", marginTop: "12px" }}>Growth + Eva Match</p>
              </div>
            </div>
          </section>

          {/* Impacto en Revenue */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px" style={{ background: "var(--eb-line)" }} />
            <span className="text-xs" style={{ color: "var(--ink-3)" }}>Impacto en Revenue</span>
            <div className="flex-1 h-px" style={{ background: "var(--eb-line)" }} />
          </div>

          <section className="mb-10">
            <p className="section-tag">Revenue</p>
            <h2 className="mb-1" style={{ color: "var(--eb-blue)" }}>Impacto en Revenue</h2>
            <p className="text-sm mb-4" style={{ color: "var(--ink-3)" }}>Cómo la calidad de la propiedad se convierte en MRR para EasyBroker</p>
            <p className="text-xs mb-6" style={{ color: "var(--ink-3)" }}>
              Pricing oficial: Emprendedor $490/mes (10 anuncios), Independiente $990/mes (25 anuncios), Agencia $1,490/mes (50 anuncios). Free no publica en Pincali. Proyecciones basadas en plan Independiente como ancla (Most popular).
            </p>

            {/* Flywheel */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              <div className="card text-center" style={{ borderBottom: "3px solid var(--red)" }}>
                <p className="text-lg font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>1</p>
                <p className="text-[10px]" style={{ color: "var(--ink-2)" }}>Calidad sube</p>
              </div>
              <div className="card text-center" style={{ borderBottom: "3px solid var(--amber)" }}>
                <p className="text-lg font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>2</p>
                <p className="text-[10px]" style={{ color: "var(--ink-2)" }}>Más leads desde Pincali</p>
              </div>
              <div className="card text-center" style={{ borderBottom: "3px solid var(--amber)" }}>
                <p className="text-lg font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>3</p>
                <p className="text-[10px]" style={{ color: "var(--ink-2)" }}>Asesor cierra ventas</p>
              </div>
              <div className="card text-center" style={{ borderBottom: "3px solid var(--green)" }}>
                <p className="text-lg font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>4</p>
                <p className="text-[10px]" style={{ color: "var(--ink-2)" }}>Llega al límite del plan</p>
              </div>
              <div className="card text-center" style={{ borderBottom: "3px solid #047857" }}>
                <p className="text-lg font-bold" style={{ color: "#047857", fontFamily: "var(--font-mono)" }}>5</p>
                <p className="text-[10px]" style={{ color: "var(--ink-2)" }}>Upgrade = MRR</p>
              </div>
            </div>
            <p className="text-[11px] mb-8 text-center" style={{ color: "var(--ink-3)" }}>Free Plan no aparece en Pincali: cero leads del marketplace, nunca upgradea. Este sistema desbloquea ese ciclo.</p>

            {/* Bloque A: Revenue Nuevo */}
            <p className="label-eyebrow mb-3">Revenue nuevo · upgrade del plan</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--ink-2)", fontFamily: "var(--font-mono)" }}>$4,950 MXN/mes</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>MRR estimado actual (sample)</p>
                <p className="text-[10px] mt-2" style={{ color: "var(--ink-3)" }}>5 asesores x $990 plan Independiente</p>
              </div>
              <div className="card text-center" style={{ borderColor: "var(--amber)", background: "#FFFBEB" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>+$1,000 MXN/mes</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>MRR adicional con 30% upgrade rate</p>
                <p className="text-[10px] mt-2" style={{ color: "var(--ink-3)" }}>1 Emprendedor a Independiente (+$500) + 1 Independiente a Agencia (+$500)</p>
              </div>
              <div className="card text-center" style={{ borderColor: "var(--green)", background: "#F0FDF4" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>+$1.3M MXN/año</p>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>MRR adicional proyectado en producción</p>
                <p className="text-[10px] mt-2" style={{ color: "var(--ink-3)" }}>~720 asesores x 30% upgrade x $500 promedio = $108,000 MXN/mes</p>
              </div>
            </div>

            {/* Bloque B: Revenue Recuperado (API GAP) */}
            <p className="label-eyebrow mb-3 mt-8">Revenue recuperado · prevención de churn</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center" style={{ background: "var(--paper-2)" }}>
                <span className="badge inline-block mb-2">API GAP</span>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Revenue en riesgo (sample)</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Requiere acceso al plan actual de cada asesor en EasyBroker</p>
                <p className="text-[10px] mt-2" style={{ color: "var(--ink-3)" }}>5 asesores con publicaciones inactivas {">"}90 días son candidatos a churn</p>
              </div>
              <div className="card text-center" style={{ background: "var(--paper-2)" }}>
                <span className="badge inline-block mb-2">API GAP</span>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Revenue recuperado con reactivación</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Requiere historial de win-back interno</p>
                <p className="text-[10px] mt-2" style={{ color: "var(--ink-3)" }}>Benchmark industria SaaS B2B: 50% win-back rate</p>
              </div>
              <div className="card text-center" style={{ background: "var(--paper-2)" }}>
                <span className="badge inline-block mb-2">API GAP</span>
                <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Revenue protegido (escala 1,437)</p>
                <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Proyección requiere data interna del cohort completo</p>
                <p className="text-[10px] mt-2" style={{ color: "var(--ink-3)" }}>Con acceso a producción se calcula impacto real</p>
              </div>
            </div>

            <p className="text-[10px] mt-6 text-center" style={{ color: "var(--ink-3)" }}>
              Revenue Nuevo defendible con pricing oficial (verificado en easybroker.com/mx/planes). Revenue Recuperado requiere acceso a datos internos: plan del asesor, historial transaccional, y cohorts de win-back. Estos cálculos se construyen en día 1 con acceso al producto.
            </p>
          </section>

          {/* Final phrase */}
          <p className="text-3xl font-bold text-center mt-12" style={{ color: "var(--eb-blue)" }}>
            Growth
          </p>

          {/* Back button */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ border: "1px solid var(--eb-line)", color: "var(--ink-2)" }}
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--eb-line)" }} className="px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm" style={{ color: "var(--ink-3)" }}>
          <Link href="/plan-de-accion" className="hover:opacity-70" style={{ color: "var(--ink-2)" }}>Accionamos</Link>
          <Link href="/" className="hover:opacity-70" style={{ color: "var(--eb-blue)" }}>{config.brand.shortName}</Link>
        </div>
      </footer>
    </div>
  );
}
