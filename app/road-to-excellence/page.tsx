import { config } from "@/lib/config";
import { loadHealthData } from "@/lib/loadHealth";
import Link from "next/link";

export default async function RoadToExcellencePage() {
  const health = await loadHealthData();
  const { aggregate } = health;

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
            <Link href="/propiedades" className="hover:text-gray-900 transition-colors">Propiedades</Link>
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
          <p className="text-sm text-gray-500 mb-8">One team: de 0 a 10 Pincali Ready</p>

          {/* Executive Summary */}
          <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 mb-10">
            <p className="text-base text-gray-700 leading-relaxed">
              Cada equipo entrega su slice del sistema. Growth lleva la calidad de 54% a 93% con Automatización y Mona AI. Sales asigna asesor a las 5 propiedades huérfanas. Customer Success reactiva las 10 propiedades inactivas. Trust & Safety resuelve las 5 violaciones de política. Resultado: de 0 propiedades Pincali Ready hoy, llegamos a 10 cuando los frentes ejecutan en paralelo.
            </p>
          </div>

          {/* Ownership */}
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: config.brand.primaryColor }}>Ownership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Growth */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: GROWTH</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Calidad de la Propiedad</h3>
              <div className="mt-3 space-y-2 text-xs text-gray-600">
                <p>Automatización · 90% éxito · resuelve 31 flags</p>
                <p>Mona AI · 50% respuesta · resuelve 9 flags</p>
              </div>
              <p className="text-sm font-medium mt-3" style={{ color: config.brand.primaryColor }}>Calidad: 54% → 93%</p>
            </div>
            {/* Sales */}
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: SALES</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Asignación de Asesor</h3>
              <div className="mt-3 space-y-3 text-xs text-gray-600">
                <div>
                  <p>▸ Identificar y asignar asesor responsable a las 5 propiedades sin agente</p>
                  <p className="text-sm font-medium text-yellow-700 mt-1">5 → 0 propiedades sin asesor</p>
                </div>
                <div>
                  <p>▸ Intervención humana cuando el equipo de Growth no obtiene respuesta del asesor</p>
                  <p className="text-sm font-medium mt-1" style={{ color: config.brand.primaryColor }}>Calidad: 93% → 100%</p>
                </div>
              </div>
            </div>
            {/* Customer Success */}
            <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: CUSTOMER SUCCESS</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Reactivación de Propiedades</h3>
              <p className="text-xs text-gray-600 mt-3">Contactar a los asesores con propiedades sin actualizar {">"}90 días</p>
              <p className="text-sm font-medium text-cyan-700 mt-3">10 → 0 propiedades inactivas</p>
            </div>
            {/* Trust & Safety */}
            <div className="border border-red-200 bg-red-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: TRUST & SAFETY</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Resolución de Violaciones</h3>
              <p className="text-xs text-gray-600 mt-3">Limpieza editorial de descripciones con datos de contacto, nombres comerciales, CTAs directos</p>
              <p className="text-sm font-medium text-red-600 mt-3">5 → 0 violaciones de política</p>
              <p className="text-xs text-gray-400 italic mt-2">Habilita: Pincali Ready en las 4 propiedades con Red Flags</p>
            </div>
          </div>
          {/* Marketing */}
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 mb-8">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">MARKETING</p>
            <h3 className="text-sm font-medium text-gray-500 mt-1">Sin acciones derivadas del diagnóstico actual</h3>
          </div>

          {/* Resultado Final */}
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-1 mt-10" style={{ color: config.brand.primaryColor }}>Resultado Final</h2>
          <p className="text-xs text-gray-500 mb-4">Foto del inventario después de la ejecución multi-equipo</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {/* Pincali Ready */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-5">
              <p className="text-2xl font-bold text-green-700">10 ✓</p>
              <p className="text-xs font-medium text-gray-700 mt-1">Pincali Ready activadas</p>
              <p className="text-[11px] text-gray-500 mt-1">100% del inventario auditado listo para marketplace</p>
            </div>
            {/* Sin asesor */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-5">
              <p className="text-2xl font-bold text-green-700">0 ✓</p>
              <p className="text-xs font-medium text-gray-700 mt-1">Propiedades sin asesor</p>
              <p className="text-[11px] text-gray-500 mt-1">Sales asignó asesor a las 5 propiedades huérfanas</p>
            </div>
            {/* Inactivas */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-5">
              <p className="text-2xl font-bold text-green-700">0 ✓</p>
              <p className="text-xs font-medium text-gray-700 mt-1">Propiedades inactivas</p>
              <p className="text-[11px] text-gray-500 mt-1">Customer Success reactivó las 10 propiedades {">"}90 días</p>
            </div>
            {/* Churn */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-5">
              <p className="text-2xl font-bold text-green-700">0 de 10 ✓</p>
              <p className="text-xs font-medium text-gray-700 mt-1">Riesgo de Churn del Asesor</p>
              <p className="text-[11px] text-gray-500 mt-1">Inventario activo, asesores conectados</p>
            </div>
            {/* API GAP 1 */}
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-600 rounded mb-2">API GAP</span>
              <p className="text-xs font-medium text-gray-700 mt-1">Por tipo de plan</p>
              <p className="text-[11px] text-gray-500 mt-1">Pendiente: requiere acceso a datos internos de Producto</p>
            </div>
            {/* API GAP 2 */}
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-600 rounded mb-2">API GAP</span>
              <p className="text-xs font-medium text-gray-700 mt-1">Por tipo de asesor</p>
              <p className="text-[11px] text-gray-500 mt-1">Pendiente: requiere acceso a datos internos de Producto</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-8">* Las 2 métricas marcadas como API GAP no se resuelven con el sistema actual. Requieren exposición de datos en API pública por parte del equipo de Producto.</p>

          {/* Impacto en Revenue */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Impacto en Revenue</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: config.brand.primaryColor }}>Impacto en Revenue</h2>
            <p className="text-sm text-gray-500 mb-4">Cómo la calidad de la propiedad se convierte en MRR para EasyBroker</p>
            <p className="text-xs text-gray-400 mb-6">
              Pricing oficial: Emprendedor $490/mes (10 anuncios), Independiente $990/mes (25 anuncios), Agencia $1,490/mes (50 anuncios). Free no publica en Pincali. Proyecciones basadas en plan Independiente como ancla (Most popular).
            </p>

            {/* Flywheel */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              <div className="rounded-lg p-3 text-center bg-red-50 border border-red-100">
                <p className="text-lg font-bold text-red-600">1</p>
                <p className="text-[10px] text-gray-600">Calidad sube</p>
              </div>
              <div className="rounded-lg p-3 text-center bg-orange-50 border border-orange-100">
                <p className="text-lg font-bold text-orange-600">2</p>
                <p className="text-[10px] text-gray-600">Más leads desde Pincali</p>
              </div>
              <div className="rounded-lg p-3 text-center bg-yellow-50 border border-yellow-100">
                <p className="text-lg font-bold text-yellow-700">3</p>
                <p className="text-[10px] text-gray-600">Asesor cierra ventas</p>
              </div>
              <div className="rounded-lg p-3 text-center bg-green-50 border border-green-100">
                <p className="text-lg font-bold text-green-600">4</p>
                <p className="text-[10px] text-gray-600">Llega al límite del plan</p>
              </div>
              <div className="rounded-lg p-3 text-center bg-emerald-50 border border-emerald-200">
                <p className="text-lg font-bold text-emerald-700">5</p>
                <p className="text-[10px] text-gray-600">Upgrade = MRR</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mb-8 text-center">Free Plan no aparece en Pincali: cero leads del marketplace, nunca upgradea. Este sistema desbloquea ese ciclo.</p>

            {/* Bloque A: Revenue Nuevo */}
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">Revenue nuevo · upgrade del plan</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-5 text-center">
                <p className="text-2xl font-bold text-gray-700">$4,950 MXN/mes</p>
                <p className="text-xs font-medium text-gray-600 mt-1">MRR estimado actual (sample)</p>
                <p className="text-[10px] text-gray-400 mt-2">5 asesores x $990 plan Independiente</p>
              </div>
              <div className="border border-yellow-200 bg-yellow-50/30 rounded-lg p-5 text-center">
                <p className="text-2xl font-bold text-yellow-700">+$1,000 MXN/mes</p>
                <p className="text-xs font-medium text-gray-600 mt-1">MRR adicional con 30% upgrade rate</p>
                <p className="text-[10px] text-gray-400 mt-2">1 Emprendedor a Independiente (+$500) + 1 Independiente a Agencia (+$500)</p>
              </div>
              <div className="border border-green-200 bg-green-50/30 rounded-lg p-5 text-center">
                <p className="text-2xl font-bold text-green-700">+$1.3M MXN/año</p>
                <p className="text-xs font-medium text-gray-600 mt-1">MRR adicional proyectado en producción</p>
                <p className="text-[10px] text-gray-400 mt-2">~720 asesores x 30% upgrade x $500 promedio = $108,000 MXN/mes</p>
              </div>
            </div>

            {/* Bloque B: Revenue Recuperado (API GAP) */}
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-3 mt-8">Revenue recuperado · prevención de churn</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 text-center">
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-600 rounded mb-2">API GAP</span>
                <p className="text-xs font-medium text-gray-700 mt-1">Revenue en riesgo (sample)</p>
                <p className="text-[11px] text-gray-500 mt-1">Requiere acceso al plan actual de cada asesor en EasyBroker</p>
                <p className="text-[10px] text-gray-400 mt-2">5 asesores con publicaciones inactivas {">"}90 días son candidatos a churn</p>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 text-center">
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-600 rounded mb-2">API GAP</span>
                <p className="text-xs font-medium text-gray-700 mt-1">Revenue recuperado con reactivación</p>
                <p className="text-[11px] text-gray-500 mt-1">Requiere historial de win-back interno</p>
                <p className="text-[10px] text-gray-400 mt-2">Benchmark industria SaaS B2B: 50% win-back rate</p>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 text-center">
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-600 rounded mb-2">API GAP</span>
                <p className="text-xs font-medium text-gray-700 mt-1">Revenue protegido (escala 1,437)</p>
                <p className="text-[11px] text-gray-500 mt-1">Proyección requiere data interna del cohort completo</p>
                <p className="text-[10px] text-gray-400 mt-2">Con acceso a producción se calcula impacto real</p>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-6 text-center">
              Revenue Nuevo defendible con pricing oficial (verificado en easybroker.com/mx/planes). Revenue Recuperado requiere acceso a datos internos: plan del asesor, historial transaccional, y cohorts de win-back. Estos cálculos se construyen en día 1 con acceso al producto.
            </p>
          </section>

          {/* Final phrase */}
          <p className="text-3xl font-bold text-center mt-12" style={{ color: config.brand.primaryColor }}>
            Growth
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
