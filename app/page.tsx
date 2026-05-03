import { config } from "@/lib/config";
import { loadScoringResults } from "@/lib/loadResults";
import { loadHealthData } from "@/lib/loadHealth";
import Link from "next/link";
import HomeContent from "./components/HomeContent";

const features = [
  {
    title: "API EasyBroker",
    subtitle: "Datos Reales",
    description:
      "Conexion directa al inventario. 1,437 propiedades reales del entorno staging. La transicion a produccion es cambiar una API key.",
  },
  {
    title: "Evaluacion Automatica",
    subtitle: "Safety Compliance",
    description:
      "Seguimos las 7 politicas oficiales de publicacion de EasyBroker. Cada listing evaluado en 5 dimensiones: descripcion, precio, datos faltantes, fotos y ubicacion.",
  },
  {
    title: "Next Steps",
    subtitle: "Acciones Claras",
    description:
      "Canales de accion derivados de los datos: cada flag detectado se convierte en un ticket accionable para el equipo.",
  },
];

const stack = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS",
  "EasyBroker API",
  "Vercel",
];

export default async function Home() {
  const data = await loadScoringResults();
  const health = await loadHealthData();

  const { aggregate, projections } = health;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-sm tracking-tight"
              style={{ color: config.brand.primaryColor }}
            >
              {config.brand.shortName}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">
              {config.project.name}
            </span>
          </div>
          <span className="text-xs text-gray-400">v0.1 · Mayo 2026</span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm mb-4"
            style={{
              backgroundColor: "#5B5FE610",
              borderColor: "#5B5FE640",
              color: config.brand.primaryColor,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.brand.secondaryColor }} />
            Live demo · {data.sampled} listings reales analizados
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-2"
            style={{ color: config.brand.primaryColor }}
          >
            Free-to-paid Engine
          </h1>
          <p
            className="text-xl md:text-2xl font-medium tracking-tight"
            style={{ color: config.brand.secondaryColor }}
          >
            Listings Optimization
          </p>
        </div>

        {/* Dynamic section: toggle + chart + paragraph */}
        <HomeContent
          currentHealth={aggregate.averageHealth}
          totalListings={aggregate.totalListings}
          listingsAbove80Today={aggregate.listingsByHealthBucket.excellent}
          optimistic={{
            postAutomation: {
              avgHealth: projections.postAutomation.optimistic.avgHealth,
              pincaliReady: projections.postAutomation.optimistic.pincaliReady,
            },
            postBotMona: {
              avgHealth: projections.postAutomationAndBotMona.optimistic.avgHealth,
              pincaliReady: projections.postAutomationAndBotMona.optimistic.pincaliReady,
            },
            postRedFlags: {
              pincaliReady: projections.postRedFlagsResolved.optimistic.pincaliReady,
            },
          }}
          conservative={{
            postAutomation: {
              avgHealth: projections.postAutomation.conservative.avgHealth,
              pincaliReady: projections.postAutomation.conservative.pincaliReady,
            },
            postBotMona: {
              avgHealth: projections.postAutomationAndBotMona.conservative.avgHealth,
              pincaliReady: projections.postAutomationAndBotMona.conservative.pincaliReady,
            },
            postRedFlags: {
              pincaliReady: projections.postRedFlagsResolved.conservative.pincaliReady,
            },
          }}
        />

        {/* Buttons - 6 in 3x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-4xl mx-auto w-full">
          <Link href="/donde-estamos" className="px-4 py-4 rounded-lg font-medium text-center bg-red-100 text-red-700 hover:bg-red-200 transition-colors">1) MEDIMOS</Link>
          <Link href="/plan-de-accion" className="px-4 py-4 rounded-lg font-medium text-center text-white transition-opacity hover:opacity-90" style={{ backgroundColor: config.brand.primaryColor }}>2) ACCIONAMOS</Link>
          <Link href="/road-to-excellence" className="px-4 py-4 rounded-lg font-medium text-center bg-green-100 text-green-800 hover:bg-green-200 transition-colors">3) ENTREGAMOS</Link>
          <Link href="/red-flags" className="px-4 py-4 rounded-lg font-medium text-center bg-red-100 text-red-700 hover:bg-red-200 transition-colors">RED FLAGS</Link>
          <Link href="/listings" className="px-4 py-4 rounded-lg font-medium text-center text-white transition-opacity hover:opacity-90" style={{ backgroundColor: config.brand.primaryColor }}>LISTINGS</Link>
          <Link href="/pincali" className="px-4 py-4 rounded-lg font-medium text-center bg-green-100 text-green-800 hover:bg-green-200 transition-colors">PINCALI READY</Link>
        </div>
      </section>

      {/* Como funciona */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl font-bold mb-10 text-center"
            style={{ color: config.brand.primaryColor }}
          >
            Como funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-gray-100 rounded-xl p-6 hover:border-gray-200 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-0.5">{feature.title}</h3>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: config.brand.secondaryColor }}
                >
                  {feature.subtitle}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: config.brand.primaryColor }}
          >
            Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            Construido por{" "}
            <a
              href={config.brand.ownerLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              {config.brand.ownerName}
            </a>
          </p>
          <a
            href={config.urls.parentLabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
}
