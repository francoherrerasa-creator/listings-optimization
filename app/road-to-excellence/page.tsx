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
          <p className="text-sm text-gray-500 mb-8">Resultado del sistema multi-equipo: 0 a 10 Pincali Ready</p>

          {/* Executive Summary */}
          <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 mb-10">
            <p className="text-base text-gray-700 leading-relaxed">
              Cada equipo entrega su slice del sistema. Growth lleva la calidad de 54% a 93% con Automatización y Mona AI. Sales asigna asesor a los 5 listings huérfanos. Customer Success reactiva los 10 listings inactivos. Trust & Safety resuelve las 5 violaciones de política. Producto expone los KPIs faltantes en API. Resultado: de 0 listings Pincali Ready hoy, llegamos a 10 cuando los 5 frentes ejecutan en paralelo.
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Growth */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: GROWTH</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Calidad del Listing</h3>
              <div className="mt-3 space-y-2 text-xs text-gray-600">
                <p>Automatización · 90% éxito · resuelve 31 flags</p>
                <p>Mona AI · 50% respuesta · resuelve 9 flags</p>
              </div>
              <p className="text-sm font-medium text-green-700 mt-3">Calidad: 54% a 93%</p>
            </div>
            {/* Sales */}
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: SALES</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Asignación de Asesor</h3>
              <p className="text-xs text-gray-600 mt-3">Identificar y asignar asesor responsable a los 5 listings sin agente</p>
              <p className="text-sm font-medium text-yellow-700 mt-3">5 a 0 listings sin asesor</p>
            </div>
            {/* Customer Success */}
            <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: CUSTOMER SUCCESS</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Reactivación de Inventario</h3>
              <p className="text-xs text-gray-600 mt-3">Contactar a los asesores con listings sin actualizar {">"}90 días</p>
              <p className="text-sm font-medium text-cyan-700 mt-3">10 a 0 listings inactivos</p>
            </div>
            {/* Trust & Safety */}
            <div className="border border-red-200 bg-red-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: TRUST & SAFETY</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Resolución de Violaciones</h3>
              <p className="text-xs text-gray-600 mt-3">Limpieza editorial de descripciones con datos de contacto, nombres comerciales, CTAs directos</p>
              <p className="text-sm font-medium text-red-600 mt-3">5 a 0 violaciones de política</p>
            </div>
            {/* Producto */}
            <div className="border border-purple-200 bg-purple-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER: PRODUCTO</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Exposición de KPIs en API</h3>
              <p className="text-xs text-gray-600 mt-3">Exponer plan del asesor (Free/Basic/Pro) y tipo de asesor (Inmobiliaria/Independiente) en API pública</p>
              <p className="text-sm font-medium text-purple-700 mt-3">Habilita 2 KPIs estratégicos</p>
            </div>
            {/* Marketing */}
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">MARKETING</p>
              <h3 className="text-sm font-medium text-gray-500 mt-1">Sin acciones derivadas del diagnóstico actual</h3>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Acción Inmediata</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Red Flags */}
          <div className="border border-red-200 bg-red-50 rounded-lg p-6">
            <div className="mb-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER</p>
              <h3 className="text-lg font-semibold text-gray-900">Red Flags</h3>
              <p className="text-xs text-red-600 mt-1">Growth, limpieza editorial automática</p>
            </div>
            <p className="text-sm text-gray-600 mb-3">Acción: Limpieza editorial automática de descripciones</p>
            <ul className="text-xs text-gray-600 space-y-1 mb-4 list-disc list-inside">
              <li>Datos de contacto en descripción (teléfonos, emails, URLs)</li>
              <li>Nombres comerciales/inmobiliarias promocionados en copy</li>
              <li>Llamados a acción comerciales directos</li>
              <li>Fraude potencial (precios anzuelo, remates clasificados)</li>
            </ul>
            <p className="text-sm font-medium text-red-700 mb-4">
              {aggregate.listingsWithRedFlags} de {aggregate.totalListings} listings con violaciones · {aggregate.totalRedFlags} flags detectados
            </p>
            <Link
              href="/red-flags"
              className="inline-block px-4 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-700 hover:bg-red-100 transition-colors"
            >
              Ver Red Flags →
            </Link>
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
