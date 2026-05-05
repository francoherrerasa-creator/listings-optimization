import { config } from "@/lib/config";
import { loadHealthData } from "@/lib/loadHealth";
import { loadMaturityData } from "@/lib/loadMaturity";
import { MATURITY_LEVELS } from "@/lib/maturity";
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
      "Seguimos las 7 políticas oficiales de publicación de EasyBroker. Cada propiedad evaluada en 8 dimensiones ponderadas: fotos, descripción, precio, info actualizada, ubicación, características, amenidades y video.",
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

const levelDescriptions: Record<number, string> = {
  1: "Publicado pero invisible",
  2: "Compite en EasyBroker pero no califica para Pincali",
  3: "Listo para generar leads orgánicos",
  4: "Domina búsqueda, 3x más leads",
};

export default async function Home() {
  const health = await loadHealthData();
  const maturity = await loadMaturityData();

  const { aggregate } = health;
  const total = maturity.results.length;

  // Calculate avg health per maturity level
  const healthByPublicId: Record<string, number> = {};
  for (const r of health.results) {
    healthByPublicId[r.publicId] = r.overallHealthPercent;
  }
  const avgHealthByLevel: Record<number, number> = {};
  for (const ml of MATURITY_LEVELS) {
    const listingsAtLevel = maturity.results.filter((r) => r.level === ml.level);
    if (listingsAtLevel.length > 0) {
      const sum = listingsAtLevel.reduce((acc, r) => acc + (healthByPublicId[r.publicId] ?? 0), 0);
      avgHealthByLevel[ml.level] = Math.round(sum / listingsAtLevel.length);
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--eb-line)" }} className="px-6 py-4">
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-sm tracking-tight"
              style={{ color: "var(--eb-blue)" }}
            >
              {config.brand.shortName}
            </span>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>
              {config.project.name}
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--ink-3)" }}>v0.1 · Mayo 2026</span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Live badge */}
          <div
            className="badge inline-flex items-center gap-2 px-3 py-1.5 mb-4"
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--green)" }} />
            Live demo · {aggregate.totalListings} propiedades reales analizadas
          </div>

          <h1
            className="mb-2"
            style={{ color: "var(--eb-blue)", fontSize: "clamp(40px, 5.8vw, 78px)", fontWeight: 800, letterSpacing: "-0.045em" }}
          >
            Free-to-paid Engine
          </h1>
          <p
            className="text-xl md:text-2xl font-medium tracking-tight"
            style={{ color: "var(--eb-blue-deep)" }}
          >
            Property Optimization
          </p>
        </div>

        {/* Funnel de Madurez del Listing */}
        <div className="mt-10 max-w-3xl mx-auto w-full">
          <p className="section-tag">Pipeline de Calidad</p>
          <h2 style={{ color: "var(--eb-ink)" }} className="mb-1">
            Pipeline de Calidad
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--ink-3)" }}>Distribución de propiedades por nivel</p>

          <div className="space-y-3">
            {MATURITY_LEVELS.map((ml) => {
              const count = maturity.counts[String(ml.level)] ?? 0;
              const widthPercent = total > 0 ? Math.max((count / total) * 100, 4) : 4;
              const levelAvgHealth = avgHealthByLevel[ml.level];
              return (
                <div key={ml.level} className="card flex items-center gap-4" style={{ borderLeft: `4px solid ${ml.color}` }}>
                  <div className="text-3xl font-bold w-12 text-center" style={{ color: ml.color }}>{count}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium" style={{ color: "var(--eb-ink)" }}>Nivel {ml.level}: {ml.label}</p>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>{levelDescriptions[ml.level]}</p>
                    <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: "var(--eb-line)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${widthPercent}%`, background: ml.color, opacity: 0.6 }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs" style={{ color: "var(--ink-3)" }}>Calidad promedio</p>
                    <p className="text-lg font-bold" style={{ fontFamily: "var(--font-mono)", color: "var(--eb-ink)" }}>{levelAvgHealth !== undefined ? `${levelAvgHealth}%` : "-"}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Declarative paragraph */}
        <div className="mt-8 max-w-3xl mx-auto w-full">
          <div className="highlight-block">
            Sistema Eva (Quality + Reactivate + Match) optimiza el inventario hacia 80%+ de calidad. Target: 60% Pincali Ready.
          </div>
        </div>

        {/* Buttons - 7 in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 max-w-3xl mx-auto w-full">
          <Link href="/donde-estamos" className="card text-center font-medium text-sm" style={{ color: "var(--red)", borderColor: "var(--red)", background: "#FEF2F2" }}>MEDIMOS</Link>
          <Link href="/plan-de-accion" className="card text-center font-medium text-sm" style={{ color: "#fff", borderColor: "var(--eb-blue)", background: "var(--eb-blue)" }}>ACCIONAMOS</Link>
          <Link href="/road-to-excellence" className="card text-center font-medium text-sm" style={{ color: "var(--green)", borderColor: "var(--green)", background: "#F0FDF4" }}>ENTREGAMOS</Link>
          <Link href="/red-flags" className="card text-center font-medium text-sm" style={{ color: "var(--red)", borderColor: "var(--red)", background: "#FEF2F2" }}>RED FLAGS</Link>
          <Link href="/propiedades" className="card text-center font-medium text-sm" style={{ color: "#fff", borderColor: "var(--eb-blue)", background: "var(--eb-blue)" }}>PROPIEDADES</Link>
          <Link href="/pincali" className="card text-center font-medium text-sm" style={{ color: "var(--green)", borderColor: "var(--green)", background: "#F0FDF4" }}>PINCALI READY</Link>
        </div>

        {/* Futuro Roadmap */}
        <div className="mt-12 max-w-3xl mx-auto w-full">
          <p className="section-tag">Futuro Roadmap</p>
          <h2 className="mb-1" style={{ color: "var(--eb-blue)" }}>Lo que medimos cuando tengamos data interna</h2>
          <p className="text-sm mb-6" style={{ color: "var(--ink-2)" }}>Hoy lo estimamos con proxies de la API pública. En producción se conecta vía SQL directo a la base de datos de EasyBroker.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card" style={{ borderLeft: "4px solid var(--amber)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)", marginBottom: "8px" }}>MRR atribuido a Growth</p>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "28px", color: "var(--amber)", lineHeight: 1.2 }}>Data interna requerida</p>
              <p className="mt-2" style={{ fontSize: "12.5px", lineHeight: 1.45, color: "var(--ink-2)" }}>$$ generado por upgrades, expansion y nuevas activaciones causadas por Eva, lifecycle, SEO. Hoy lo estimamos con proxies (% asesores activos optimizados con Eva).</p>
            </div>
            <div className="card" style={{ borderLeft: "4px solid var(--red)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)", marginBottom: "8px" }}>Churn Proxy (inventario zombie)</p>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "36px", color: "var(--red)", lineHeight: 1 }}>100%</p>
              <p className="mt-2" style={{ fontSize: "12.5px", lineHeight: 1.45, color: "var(--ink-2)" }}>10 de 10 listings auditados llevan más de 90 días sin actualizar. Asesores con +180 días sin actividad son señal predictiva de churn próximo. Eva Reactivate los rescata antes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-8" style={{ background: "var(--eb-cream)" }}>
        <div className="container-main">
          <p className="section-tag">Arquitectura</p>
          <h2
            className="mb-10 text-center"
            style={{ color: "var(--eb-blue)" }}
          >
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card"
              >
                <h3 className="font-semibold text-lg mb-0.5" style={{ color: "var(--eb-ink)" }}>{feature.title}</h3>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: "var(--eb-blue-deep)" }}
                >
                  {feature.subtitle}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="px-6 py-16" style={{ background: "var(--paper-2)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="mb-6"
            style={{ color: "var(--eb-blue)" }}
          >
            Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="badge"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--eb-line)" }} className="px-6 py-8">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: "var(--ink-3)" }}>
          <p>
            Construido por{" "}
            <a
              href={config.brand.ownerLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "var(--ink-2)" }}
            >
              {config.brand.ownerName}
            </a>
          </p>
          <a
            href={config.urls.parentLabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:opacity-70"
            style={{ color: "var(--ink-2)" }}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
