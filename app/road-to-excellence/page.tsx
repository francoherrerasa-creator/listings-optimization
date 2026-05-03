import { config } from "@/lib/config";
import { loadHealthData } from "@/lib/loadHealth";
import Link from "next/link";
import EntregamosContent from "../components/EntregamosContent";

export default async function RoadToExcellencePage() {
  const health = await loadHealthData();
  const { aggregate, projections } = health;

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

          <EntregamosContent
            currentHealth={aggregate.averageHealth}
            totalListings={aggregate.totalListings}
            optimistic={{
              postAutomationHealth: projections.postAutomation.optimistic.avgHealth,
              postBotMonaHealth: projections.postAutomationAndBotMona.optimistic.avgHealth,
              automationRate: projections.postAutomationAndBotMona.optimistic.automationRate ?? 1,
              botMonaThreshold: projections.postAutomationAndBotMona.optimistic.botMonaThreshold ?? 0.8,
              pincaliReady: projections.postRedFlagsResolved.optimistic.pincaliReady,
            }}
            conservative={{
              postAutomationHealth: projections.postAutomation.conservative.avgHealth,
              postBotMonaHealth: projections.postAutomationAndBotMona.conservative.avgHealth,
              automationRate: projections.postAutomationAndBotMona.conservative.automationRate ?? 0.9,
              botMonaThreshold: projections.postAutomationAndBotMona.conservative.botMonaThreshold ?? 0.5,
              pincaliReady: projections.postRedFlagsResolved.conservative.pincaliReady,
            }}
          />

          {/* Lateral cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Sales</h4>
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">Sin acciones</span>
            </div>
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Marketing</h4>
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">Sin acciones</span>
            </div>
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 text-center">
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Trust & Safety</h4>
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">Sin acciones</span>
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
