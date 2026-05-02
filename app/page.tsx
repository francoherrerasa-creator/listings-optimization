import { config } from "@/lib/config";

const features = [
  {
    title: "Google Sheet → Datos",
    description:
      "50 listings sintéticos con variaciones realistas de calidad. En producción se conecta a la API de EasyBroker.",
    icon: "📊",
  },
  {
    title: "Scorer IA → Evaluación",
    description:
      "Claude evalúa cada listing en 5 dimensiones (descripción, precio, completitud, fotos, ubicación) y genera un score 0–100.",
    icon: "🤖",
  },
  {
    title: "Dashboard dual → Acción",
    description:
      "Vista pública muestra solo listings con score >70. Vista interna muestra métricas agregadas para el Growth team.",
    icon: "📈",
  },
];

const stack = [
  "Next.js 14+",
  "TypeScript",
  "Tailwind CSS",
  "Google Sheets API",
  "Anthropic Claude",
  "n8n",
  "Vercel",
];

export default function Home() {
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
          <a
            href={config.urls.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-sm font-medium tracking-wide uppercase mb-4"
            style={{ color: config.brand.secondaryColor }}
          >
            {config.brand.name}
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6"
            style={{ color: config.brand.primaryColor }}
          >
            {config.project.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {config.project.description}
          </p>
          <p className="mt-3 text-sm text-gray-400">
            {config.project.context}
          </p>
        </div>
      </section>

      {/* Problema */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: config.brand.primaryColor }}
          >
            El problema
          </h2>
          <p className="text-gray-600 leading-relaxed">
            EasyBroker monetiza por tiers según anuncios publicados. Pincali
            genera leads que justifican upgrades, pero si el inventario tiene
            baja calidad, las búsquedas no convierten. La calidad del
            inventario es la palanca oculta del ARPU — y hoy no existe un
            sistema que la mida ni la mejore.
          </p>
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
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
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
            {config.brand.name} →
          </a>
        </div>
      </footer>
    </div>
  );
}
