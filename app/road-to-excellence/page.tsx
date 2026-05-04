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

          {/* Ownership */}
          <p className="section-tag">Ownership</p>
          <h2 className="mb-4" style={{ color: "var(--eb-blue)" }}>Ownership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Growth */}
            <div className="card" style={{ borderColor: "var(--green)", background: "#F0FDF4" }}>
              <p className="label-eyebrow">OWNER: GROWTH</p>
              <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--eb-ink)" }}>Calidad de la Propiedad</h3>
              <div className="mt-3 space-y-2 text-xs" style={{ color: "var(--ink-2)" }}>
                <p>Automatización · 90% éxito · resuelve 31 flags</p>
                <p>Eva Quality · 50% respuesta · resuelve 9 flags</p>
              </div>
              <p className="text-sm font-medium mt-3" style={{ color: "var(--eb-blue)" }}>Calidad: 54% → 93%</p>
            </div>
            {/* Sales */}
            <div className="card" style={{ borderColor: "var(--amber)", background: "#FFFBEB" }}>
              <p className="label-eyebrow">OWNER: SALES</p>
              <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--eb-ink)" }}>Asignación de Asesor</h3>
              <div className="mt-3 space-y-3 text-xs" style={{ color: "var(--ink-2)" }}>
                <div>
                  <p>Identificar y asignar asesor responsable a las 5 propiedades sin agente</p>
                  <p className="text-sm font-medium mt-1" style={{ color: "var(--amber)" }}>5 → 0 propiedades sin asesor</p>
                </div>
                <div>
                  <p>Intervención humana cuando el equipo de Growth no obtiene respuesta del asesor</p>
                  <p className="text-sm font-medium mt-1" style={{ color: "var(--eb-blue)" }}>Calidad: 93% → 100%</p>
                </div>
              </div>
            </div>
            {/* Customer Success */}
            <div className="card" style={{ borderColor: "var(--eb-blue)", background: "var(--eb-blue-soft)" }}>
              <p className="label-eyebrow">OWNER: CUSTOMER SUCCESS</p>
              <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--eb-ink)" }}>Reactivación de Propiedades</h3>
              <p className="text-xs mt-3" style={{ color: "var(--ink-2)" }}>Contactar a los asesores con propiedades sin actualizar {">"}90 días</p>
              <p className="text-sm font-medium mt-3" style={{ color: "var(--eb-blue)" }}>10 → 0 propiedades inactivas</p>
            </div>
            {/* Trust & Safety */}
            <div className="card" style={{ borderColor: "var(--red)", background: "#FEF2F2" }}>
              <p className="label-eyebrow">OWNER: TRUST & SAFETY</p>
              <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--eb-ink)" }}>Resolución de Violaciones</h3>
              <p className="text-xs mt-3" style={{ color: "var(--ink-2)" }}>Limpieza editorial de descripciones con datos de contacto, nombres comerciales, CTAs directos</p>
              <p className="text-sm font-medium mt-3" style={{ color: "var(--red)" }}>5 → 0 violaciones de política</p>
              <p className="text-xs italic mt-2" style={{ color: "var(--ink-3)" }}>Habilita: Pincali Ready en las 4 propiedades con Red Flags</p>
            </div>
          </div>
          {/* Marketing */}
          <div className="card mb-8" style={{ background: "var(--paper-2)" }}>
            <p className="label-eyebrow">MARKETING</p>
            <h3 className="text-sm font-medium mt-1" style={{ color: "var(--ink-3)" }}>Sin acciones derivadas del diagnóstico actual</h3>
          </div>

          {/* Resultado Final */}
          <p className="section-tag mt-10">Resultado Final</p>
          <h2 className="mb-1" style={{ color: "var(--eb-blue)" }}>Resultado Final</h2>
          <p className="text-xs mb-4" style={{ color: "var(--ink-3)" }}>Foto del inventario después de la ejecución multi-equipo</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {/* Pincali Ready */}
            <div className="card" style={{ borderColor: "var(--green)", background: "#F0FDF4" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>10</p>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Pincali Ready activadas</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>100% del inventario auditado listo para marketplace</p>
            </div>
            {/* Sin asesor */}
            <div className="card" style={{ borderColor: "var(--green)", background: "#F0FDF4" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>0</p>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Propiedades sin asesor</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Sales asignó asesor a las 5 propiedades huérfanas</p>
            </div>
            {/* Inactivas */}
            <div className="card" style={{ borderColor: "var(--green)", background: "#F0FDF4" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>0</p>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Propiedades inactivas</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Customer Success reactivó las 10 propiedades {">"}90 días</p>
            </div>
            {/* Churn */}
            <div className="card" style={{ borderColor: "var(--green)", background: "#F0FDF4" }}>
              <p className="text-2xl font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>0 de 10</p>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Riesgo de Churn del Asesor</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Inventario activo, asesores conectados</p>
            </div>
            {/* API GAP 1 */}
            <div className="card" style={{ background: "var(--paper-2)" }}>
              <span className="badge inline-block mb-2">API GAP</span>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Por tipo de plan</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Pendiente: requiere acceso a datos internos de Producto</p>
            </div>
            {/* API GAP 2 */}
            <div className="card" style={{ background: "var(--paper-2)" }}>
              <span className="badge inline-block mb-2">API GAP</span>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--ink-2)" }}>Por tipo de asesor</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>Pendiente: requiere acceso a datos internos de Producto</p>
            </div>
          </div>
          <p className="text-xs mb-8" style={{ color: "var(--ink-3)" }}>* Las 2 métricas marcadas como API GAP no se resuelven con el sistema actual. Requieren exposición de datos en API pública por parte del equipo de Producto.</p>

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
