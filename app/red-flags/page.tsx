import { config } from "@/lib/config";
import { loadScoringResults } from "@/lib/loadResults";
import Link from "next/link";
import { ViolationsTable } from "./ViolationsTable";

interface Violation {
  publicId: string;
  title: string;
  titleImageThumb: string | null;
  type: string;
  evidence: string;
  action: string;
}

interface RecurringBrand {
  name: string;
  listings: string[];
  totalViolations: number;
}

const contactKeywords = /llame|whatsapp|tel[eé]fono|contacto|comunicarse|@|http|\.com|\.mx|01-|55-/i;
const brandKeywords = /bienes ra[ií]ces|inmobiliaria|realtors?|hassaf/i;
const ctaKeywords = /llamar ya|llame!|no se quede|[uú]ltima oportunidad|urgente/i;

export default async function RedFlagsPage() {
  const data = await loadScoringResults();
  const { results } = data;

  // Detect violations
  const violations: Violation[] = [];
  const brandListings: Record<string, Set<string>> = {};

  for (const r of results) {
    for (const flag of r.flagsForModerationTeam) {
      let type: string | null = null;
      let action = "";
      if (contactKeywords.test(flag)) {
        type = "Información de contacto";
        action = "Remover datos de contacto de la descripción";
      } else if (brandKeywords.test(flag)) {
        type = "Nombre comercial";
        action = "Eliminar nombre de agencia/inmobiliaria del copy";
      } else if (ctaKeywords.test(flag)) {
        type = "CTA comercial directo";
        action = "Remover llamados a acción directos de la descripción";
      }

      if (type) {
        violations.push({
          publicId: r.publicId,
          title: r.title,
          titleImageThumb: r.titleImageThumb,
          type,
          evidence: flag,
          action,
        });
      }

      if (brandKeywords.test(flag)) {
        const match = flag.match(/['']([^'']+)['']/);
        if (match) {
          const name = match[1];
          if (!brandListings[name]) brandListings[name] = new Set();
          brandListings[name].add(r.publicId);
        }
      }
    }
  }

  const uniqueViolations = violations;
  const affectedListings = new Set(uniqueViolations.map((v) => v.publicId)).size;

  // Recurring brands
  const recurringBrands: RecurringBrand[] = Object.entries(brandListings)
    .filter(([, listings]) => listings.size >= 2)
    .map(([name, listings]) => ({
      name,
      listings: Array.from(listings),
      totalViolations: Array.from(listings).length,
    }));

  // Group violations by listing
  const groupedByListing: Record<string, { publicId: string; title: string; titleImageThumb: string | null; violations: Array<{ type: string; evidence: string; action: string }> }> = {};
  for (const v of uniqueViolations) {
    if (!groupedByListing[v.publicId]) {
      groupedByListing[v.publicId] = { publicId: v.publicId, title: v.title, titleImageThumb: v.titleImageThumb, violations: [] };
    }
    groupedByListing[v.publicId].violations.push({ type: v.type, evidence: v.evidence, action: v.action });
  }
  const listingGroups = Object.values(groupedByListing);

  const estimatedLeadsLost = Math.round(affectedListings * 5 * 0.3);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--eb-line)" }} className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity" style={{ color: "var(--eb-blue)" }}>{config.brand.shortName}</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>Red Flags · {config.project.name}</span>
          </div>
          <nav className="flex items-center gap-3 text-sm" style={{ color: "var(--ink-2)" }}>
            <Link href="/donde-estamos" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Medimos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/plan-de-accion" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Accionamos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/road-to-excellence" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Entregamos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/propiedades" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Propiedades</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/pincali" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Pincali</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/benchmark" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Benchmark</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="section-tag">Trust & Safety</p>
          <h1 style={{ color: "var(--eb-blue)" }}>RED FLAGS</h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-3)" }}>Detección de violaciones a políticas comerciales</p>

          {/* Executive Summary */}
          <section className="mb-10">
            <div className="card" style={{ borderColor: "var(--red)", background: "#FEF2F2" }}>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--red)" }} />
                  <p className="text-sm" style={{ color: "var(--eb-ink)" }}>{Math.round((affectedListings / results.length) * 100)}% de las propiedades tiene violaciones.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--red)" }} />
                  <p className="text-sm" style={{ color: "var(--eb-ink)" }}>3 de 4 tipos de violación presentes.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--red)" }} />
                  <p className="text-sm" style={{ color: "var(--eb-ink)" }}>{uniqueViolations.length} flags de violación concentrados en {affectedListings} propiedades.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Violations Table */}
          <section className="mb-10">
            <h3 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>
              Propiedades que violan políticas
            </h3>
            <ViolationsTable listings={listingGroups} />
          </section>

          {/* Recurring Patterns */}
          <section className="mb-10">
            <h3 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>
              Asesores recurrentes
            </h3>
            {recurringBrands.length > 0 ? (
              <div className="card overflow-hidden" style={{ padding: 0 }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--paper-2)" }}>
                      <th className="px-4 py-3 text-left">Nombre comercial</th>
                      <th className="px-4 py-3 text-center">Propiedades</th>
                      <th className="px-4 py-3 text-center">Violaciones</th>
                      <th className="px-4 py-3 text-left">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recurringBrands.map((brand) => (
                      <tr key={brand.name} style={{ background: "#FEF2F220" }}>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--eb-ink)" }}>{brand.name}</td>
                        <td className="px-4 py-3 text-center" style={{ color: "var(--ink-2)", fontFamily: "var(--font-mono)" }}>{brand.listings.length}</td>
                        <td className="px-4 py-3 text-center font-medium" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>{brand.totalViolations}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "var(--ink-2)" }}>Contactar asesor, remover marca de todas las propiedades</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card text-center">
                <p className="text-sm" style={{ color: "var(--ink-3)" }}>
                  Ningún asesor recurrente detectado en muestra de {results.length}. Recomendamos correr análisis sobre las 1,437 propiedades para identificar patrones sistémicos.
                </p>
              </div>
            )}
          </section>

          {/* Impact */}
          <section>
            <h3 className="label-eyebrow mb-4" style={{ opacity: 1, color: "var(--eb-blue-deep)" }}>
              Impacto estimado
            </h3>
            <div className="card text-center">
              <p className="text-4xl font-bold" style={{ color: "var(--red)", fontFamily: "var(--font-mono)" }}>~{estimatedLeadsLost}</p>
              <p className="text-sm mt-1" style={{ color: "var(--ink-2)" }}>leads/mes potencialmente perdidos</p>
              <p className="text-xs mt-3 max-w-md mx-auto" style={{ color: "var(--ink-3)" }}>
                Asumiendo que cada propiedad recibe 5 contactos/mes y que el 30% se desvía por datos de contacto en descripción. Modelo conservador, ajustar con data real de Pincali.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--eb-line)" }} className="px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm" style={{ color: "var(--ink-3)" }}>
          <Link href="/donde-estamos" className="hover:opacity-70" style={{ color: "var(--ink-2)" }}>Medimos</Link>
          <Link href="/" className="hover:opacity-70" style={{ color: "var(--eb-blue)" }}>{config.brand.shortName}</Link>
        </div>
      </footer>
    </div>
  );
}
