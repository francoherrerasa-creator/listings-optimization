import { config } from "@/lib/config";
import Link from "next/link";


export default async function NextStepsPage() {

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--eb-line)" }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity" style={{ color: "var(--eb-blue)" }}>{config.brand.shortName}</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>Accionamos · {config.project.name}</span>
          </div>
          <nav className="flex items-center gap-3 text-sm" style={{ color: "var(--ink-2)" }}>
            <Link href="/donde-estamos" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Medimos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/road-to-excellence" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Entregamos</Link>
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
          <p className="section-tag">Sección 02 · Estrategia</p>
          <h1 style={{ color: "var(--eb-blue)" }}>ACCIONAMOS</h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-3)" }}>Cada flag clasificado por equipo</p>

          <div className="highlight-block mb-10">
            El diagnóstico revela 5 frentes simultáneos que requieren acciones concretas. Growth resuelve 40 flags de calidad con Automatización y Eva Quality. Sales, Customer Success y Trust & Safety atacan los hallazgos operativos: propiedades sin asesor, propiedades inactivas y violaciones de política. Producto cierra los gaps de visibilidad en la API.
          </div>

          {/* [1] Dónde estamos */}
          <section className="mb-10">
            <h3 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>Dónde estamos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Pincali Ready */}
              <div className="card" style={{ borderColor: "var(--red)", background: "#FEF2F2" }}>
                <h4 className="label-eyebrow mb-2" style={{ opacity: 1 }}>Pincali Ready</h4>
                <p className="text-2xl font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>0</p>
                <p className="text-xs mt-1" style={{ color: "var(--ink-2)" }}>Pincali Ready hoy</p>
                <p className="text-[10px] mt-1" style={{ color: "var(--ink-3)" }}>40 flags en 10 publicaciones bloquean activación</p>
              </div>
              {/* Card 2: Propiedades sin asesor */}
              <div className="card" style={{ borderColor: "var(--red)", background: "#FEF2F2" }}>
                <h4 className="label-eyebrow mb-2" style={{ opacity: 1 }}>Propiedades sin asesor asignado</h4>
                <p className="text-2xl font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>5 de 10 (50%)</p>
                <p className="text-xs mt-1" style={{ color: "var(--ink-3)" }}>agent: null. Riesgo operativo: lead llega y no hay quién atienda</p>
              </div>
              {/* Card 3: Sin actualizar */}
              <div className="card" style={{ borderColor: "var(--amber)", background: "#FFFBEB" }}>
                <h4 className="label-eyebrow mb-2" style={{ opacity: 1 }}>Propiedades sin actualizar</h4>
                <p className="text-2xl font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>{">"}90 días: 10</p>
                <p className="text-xs mt-1" style={{ color: "var(--ink-3)" }}>Todas las propiedades sin actualización desde agosto 2024</p>
              </div>
              {/* Card 4: Riesgo de Churn */}
              <div className="card" style={{ borderColor: "var(--red)", background: "#FEF2F2" }}>
                <h4 className="label-eyebrow mb-2" style={{ opacity: 1 }}>Riesgo de Churn del Asesor</h4>
                <p className="text-2xl font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>10 de 10</p>
                <p className="text-xs mt-1" style={{ color: "var(--ink-3)" }}>propiedades con señales de riesgo</p>
                <p className="text-[10px] mt-1" style={{ color: "var(--ink-3)" }}>inactivas, asesor con 1 sola publicación, perfil incompleto</p>
              </div>
              {/* Card 5: API GAP */}
              <div className="card relative" style={{ background: "var(--paper-2)" }}>
                <span className="badge absolute top-2 right-2">API GAP</span>
                <h4 className="label-eyebrow mb-2" style={{ opacity: 1 }}>Por tipo de plan</h4>
                <p className="text-sm" style={{ color: "var(--ink-3)" }}>Free / Basic / Pro: no expuesto por API pública</p>
              </div>
              {/* Card 6: API GAP */}
              <div className="card relative" style={{ background: "var(--paper-2)" }}>
                <span className="badge absolute top-2 right-2">API GAP</span>
                <h4 className="label-eyebrow mb-2" style={{ opacity: 1 }}>Por tipo de asesor</h4>
                <p className="text-sm" style={{ color: "var(--ink-3)" }}>Inmobiliaria / Independiente: no expuesto por API pública</p>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: "var(--ink-3)" }}>* Métricas identificadas como críticas para el funnel free-to-paid. No expuestas en la API pública de EasyBroker.</p>
          </section>

          {/* [2] Sistema Eva Multi-Bot */}
          <section className="mb-10">
            <h3 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>Plan de acción · Sistema Eva</h3>
            <div className="card overflow-hidden" style={{ padding: 0 }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--paper-2)" }}>
                      <th className="px-4 py-3 text-left">KPI</th>
                      <th className="px-4 py-3 text-center">Estado actual</th>
                      <th className="px-4 py-3 text-left">Quién mueve</th>
                      <th className="px-4 py-3 text-left">Acción concreta</th>
                      <th className="px-4 py-3 text-center">Target 90 días</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>Pincali Ready %</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>0/10 (0%)</td>
                      <td className="px-4 py-3" style={{ color: "var(--eb-blue)" }}>Growth + Eva Quality</td>
                      <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>Eva Quality contacta asesor por WhatsApp, completa descripción y datos faltantes vía API EasyBroker en menos de 3 minutos</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>60%+</td>
                    </tr>
                    <tr style={{ background: "var(--paper-2)" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>Inventario zombie {">"}90 días sin actualizar</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>10/10 (100%)</td>
                      <td className="px-4 py-3" style={{ color: "var(--eb-blue)" }}>Growth + Eva Reactivate</td>
                      <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>Eva Reactivate contacta asesor inactivo con data de zona (&ldquo;3 ventas cerca este mes&rdquo;), reactiva o reasigna</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>&lt;30%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>Listings sin asesor (agent:null)</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>5/10 (50%)</td>
                      <td className="px-4 py-3" style={{ color: "var(--eb-blue)" }}>Growth + Eva Match</td>
                      <td className="px-4 py-3" style={{ color: "var(--ink-2)" }}>Eva Match conecta lead/comprador con asesores activos de la zona en menos de 5 minutos. Sales valida match</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>&lt;10%</td>
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
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              Entregamos
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--eb-line)" }} className="px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm" style={{ color: "var(--ink-3)" }}>
          <Link href="/donde-estamos" className="hover:opacity-70" style={{ color: "var(--ink-2)" }}>Medimos</Link>
          <Link href="/" className="hover:opacity-70" style={{ color: "var(--eb-blue)" }}>{config.brand.shortName}</Link>
        </div>
      </footer>
    </div>
  );
}
