import { config } from "@/lib/config";
import Link from "next/link";


export default async function NextStepsPage() {





  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity" style={{ color: config.brand.primaryColor }}>{config.brand.shortName}</Link>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">Accionamos · {config.project.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/donde-estamos" className="hover:text-gray-900 transition-colors">Medimos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/road-to-excellence" className="hover:text-gray-900 transition-colors">Entregamos</Link>
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
          <h1 className="text-2xl font-bold mb-1" style={{ color: config.brand.primaryColor }}>ACCIONAMOS</h1>
          <p className="text-sm text-gray-500 mb-8">Cada flag clasificado por equipo</p>

          <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 mb-10">
            <p className="text-base text-gray-700 leading-relaxed">
              El diagnóstico revela 5 frentes simultáneos que requieren acciones concretas. Growth resuelve 40 flags de calidad con Automatización y Mona AI. Sales, Customer Success y Trust & Safety atacan los hallazgos operativos: listings sin asesor, inventario inactivo y violaciones de política. Producto cierra los gaps de visibilidad en la API.
            </p>
          </div>

          {/* [1] Dónde estamos */}
          <section className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: config.brand.secondaryColor }}>Dónde estamos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Listings sin asesor */}
              <div className="border border-red-200 bg-red-50 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Listings sin asesor asignado</h4>
                <p className="text-2xl font-bold text-red-600">5 de 10 (50%)</p>
                <p className="text-xs text-gray-500 mt-1">agent: null. Riesgo operativo: lead llega y no hay quién atienda</p>
              </div>
              {/* Card 2: Sin actualizar */}
              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Inventario sin actualizar</h4>
                <p className="text-2xl font-bold text-yellow-700">{">"}90 días: 10</p>
                <p className="text-xs text-gray-500 mt-1">Todos los listings sin actualización desde agosto 2024</p>
              </div>
              {/* Card 3: Por operación */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Por operación</h4>
                <p className="text-2xl font-bold text-gray-700">Venta: 10 (100%)</p>
                <p className="text-xs text-gray-500 mt-1">Distribución por tipo de operación</p>
              </div>
              {/* Card 4: Pipeline de Calidad */}
              <div className="border border-green-200 bg-green-50 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Pipeline de Calidad</h4>
                <p className="text-sm font-medium text-gray-700">Básico: 5 · Completo: 5 · Optimizado: 0 · Premium: 0</p>
                <p className="text-xs text-gray-500 mt-1">Meta: todos en Optimizado o superior</p>
              </div>
              {/* Card 5: API GAP */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 relative">
                <span className="absolute top-2 right-2 text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">API GAP</span>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Por tipo de plan</h4>
                <p className="text-sm text-gray-500">Free / Basic / Pro: no expuesto por API pública</p>
              </div>
              {/* Card 6: API GAP */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 relative">
                <span className="absolute top-2 right-2 text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">API GAP</span>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Por tipo de asesor</h4>
                <p className="text-sm text-gray-500">Inmobiliaria / Independiente: no expuesto por API pública</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">* Métricas identificadas como críticas para el funnel free-to-paid. No expuestas en la API pública de EasyBroker.</p>
          </section>

          {/* [2] Qué hacemos */}
          <section className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: config.brand.secondaryColor }}>Qué hacemos</h3>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3 font-medium w-40">Equipo</th>
                      <th className="px-4 py-3 font-medium">Estrategia / Accionable</th>
                      <th className="px-4 py-3 font-medium text-right w-28">Impacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="bg-green-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-green-700">Growth</td>
                      <td className="px-4 py-3 text-gray-700">Automatización: optimizar descripciones, datos básicos, ubicación, fotos research vía API</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">31 flags</td>
                    </tr>
                    <tr className="bg-green-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-green-700">Growth</td>
                      <td className="px-4 py-3 text-gray-700">Mona AI: solicitar fotos premium y validaciones vía WhatsApp</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">9 flags</td>
                    </tr>
                    <tr className="bg-yellow-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-yellow-700">Sales</td>
                      <td className="px-4 py-3 text-gray-700">Asignar asesor responsable a listings sin agente</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">5 listings</td>
                    </tr>
                    <tr className="bg-cyan-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-cyan-700">Customer Success</td>
                      <td className="px-4 py-3 text-gray-700">Reactivar asesores con inventario sin actualizar {">"}90 días</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">10 listings</td>
                    </tr>
                    <tr className="bg-red-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-red-600">Trust & Safety</td>
                      <td className="px-4 py-3 text-gray-700">Resolver violaciones de política comercial</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">5 violaciones</td>
                    </tr>
                    <tr className="bg-purple-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-purple-700">Producto</td>
                      <td className="px-4 py-3 text-gray-700">Exponer plan del asesor y tipo de asesor en API pública</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700">API GAP</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-500">Marketing</td>
                      <td className="px-4 py-3 text-gray-500">Sin acciones derivadas del diagnóstico actual</td>
                      <td className="px-4 py-3 text-right text-gray-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* CTA to Road to Excellence */}
          <div className="text-center">
            <Link
              href="/road-to-excellence"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-medium text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: config.brand.primaryColor }}
            >
              Entregamos →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <Link href="/donde-estamos" className="hover:text-gray-900">← Medimos</Link>
          <Link href="/" className="hover:text-gray-900">{config.brand.shortName}</Link>
        </div>
      </footer>
    </div>
  );
}

