import { config } from "@/lib/config";
import Link from "next/link";

async function loadBenchmarkData() {
  const data = await import("@/data/benchmark-data.json");
  return data.default;
}

export default async function BenchmarkPage() {
  const benchmarkData = await loadBenchmarkData();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--eb-line)" }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity" style={{ color: "var(--eb-blue)" }}>{config.brand.shortName}</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>Benchmark · {config.project.name}</span>
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
            <Link href="/benchmark" className="font-medium" style={{ color: "var(--eb-blue)" }}>Benchmark</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <section className="mb-12">
            <p className="section-tag">Mercado</p>
            <h1 style={{ color: "var(--eb-blue)" }}>
              ANÁLISIS COMPETITIVO + VOZ DEL CLIENTE
            </h1>
            <p className="text-sm" style={{ color: "var(--ink-3)" }}>
              Cómo se posiciona Pincali frente al mercado y qué dicen los usuarios de cada portal
            </p>
          </section>

          {/* El mapa del mercado */}
          <section className="mb-10">
            <h2 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>
              El mapa del mercado
            </h2>
            <div className="card min-h-[120px]" style={{ background: "var(--paper-2)" }}>
              <p className="text-sm italic" style={{ color: "var(--ink-3)" }}>Datos pendientes — se cargarán desde benchmark-data.json</p>
            </div>
          </section>

          {/* Timeline estratégico */}
          <section className="mb-10">
            <h2 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>
              Timeline estratégico
            </h2>
            <div className="card min-h-[120px]" style={{ background: "var(--paper-2)" }}>
              <p className="text-sm italic" style={{ color: "var(--ink-3)" }}>Datos pendientes — se cargarán desde benchmark-data.json</p>
            </div>
          </section>

          {/* Voz del cliente por portal */}
          <section className="mb-10">
            <h2 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>
              Voz del cliente por portal
            </h2>
            <div className="card min-h-[120px]" style={{ background: "var(--paper-2)" }}>
              <p className="text-sm italic" style={{ color: "var(--ink-3)" }}>Datos pendientes — se cargarán desde benchmark-data.json</p>
            </div>
          </section>

          {/* Oportunidades para Pincali */}
          <section className="mb-10">
            <h2 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>
              Oportunidades para Pincali
            </h2>
            <div className="card min-h-[120px]" style={{ background: "var(--paper-2)" }}>
              <p className="text-sm italic" style={{ color: "var(--ink-3)" }}>Datos pendientes — se cargarán desde benchmark-data.json</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
