import { config } from "@/lib/config";
import { loadScoringResults } from "@/lib/loadResults";
import Link from "next/link";

const features = [
  {
    title: "API EasyBroker",
    subtitle: "Datos Reales",
    description:
      "Conexión directa al inventario. 1,437 propiedades reales del entorno staging. La transición a producción es cambiar una API key.",
  },
  {
    title: "Evaluación Automática",
    subtitle: "Safety Compliance",
    description:
      "Seguimos las 7 políticas oficiales de publicación de EasyBroker. Cada listing evaluado en 5 dimensiones: descripción, precio, datos faltantes, fotos y ubicación.",
  },
  {
    title: "Next Steps",
    subtitle: "Acciones Claras",
    description:
      "Canales de acción derivados de los datos: cada flag detectado se convierte en un ticket accionable para el equipo.",
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
  const { results } = data;

  const totalFlags = results.reduce((s, r) => s + r.flagsForModerationTeam.length, 0);
  const flagsPerListing = (totalFlags / results.length).toFixed(1);
  const activationRate = Math.round((results.filter((r) => r.passes).length / results.length) * 100);

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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto w-full">
          <StatBox label="Listings analizados" value={String(data.sampled)} />
          <StatBox label="Flags detectados" value={String(totalFlags)} highlight />
          <StatBox label="Flags por listing" value={flagsPerListing} />
          <StatBox label="Activation rate" value={`${activationRate}%`} subtitle={`${results.filter((r) => r.passes).length} activados`} />
        </div>

        {/* Buttons - 6 in 3x2 grid, columns color-matched */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-4xl mx-auto w-full">
          <Link href="/donde-estamos" className="px-4 py-4 rounded-lg font-medium text-center bg-red-100 text-red-700 hover:bg-red-200 transition-colors">1) CÓMO ESTAMOS</Link>
          <Link href="/plan-de-accion" className="px-4 py-4 rounded-lg font-medium text-center text-white transition-opacity hover:opacity-90" style={{ backgroundColor: config.brand.primaryColor }}>2) PLAN DE ACCIÓN</Link>
          <Link href="/road-to-excellence" className="px-4 py-4 rounded-lg font-medium text-center bg-green-100 text-green-800 hover:bg-green-200 transition-colors">3) ROAD TO EXCELLENCE</Link>
          <Link href="/red-flags" className="px-4 py-4 rounded-lg font-medium text-center bg-red-100 text-red-700 hover:bg-red-200 transition-colors">RED FLAGS</Link>
          <Link href="/listings" className="px-4 py-4 rounded-lg font-medium text-center text-white transition-opacity hover:opacity-90" style={{ backgroundColor: config.brand.primaryColor }}>LISTINGS</Link>
          <Link href="/pincali" className="px-4 py-4 rounded-lg font-medium text-center bg-green-100 text-green-800 hover:bg-green-200 transition-colors">PINCALI READY</Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl font-bold mb-10 text-center"
            style={{ color: config.brand.primaryColor }}
          >
            Cómo funciona
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

function StatBox({
  label,
  value,
  small,
  highlight,
  subtitle,
}: {
  label: string;
  value: string;
  small?: boolean;
  highlight?: boolean;
  subtitle?: string;
}) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className={`font-semibold ${small ? "text-sm" : "text-xl"}`}
        style={{ color: highlight ? config.brand.secondaryColor : config.brand.primaryColor }}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
