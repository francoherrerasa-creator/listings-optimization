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
      if (contactKeywords.test(flag)) {
        violations.push({
          publicId: r.publicId,
          title: r.title,
          titleImageThumb: r.titleImageThumb,
          type: "Información de contacto",
          evidence: flag,
          action: "Remover datos de contacto de la descripción",
        });
      }
      if (brandKeywords.test(flag)) {
        violations.push({
          publicId: r.publicId,
          title: r.title,
          titleImageThumb: r.titleImageThumb,
          type: "Nombre comercial",
          evidence: flag,
          action: "Eliminar nombre de agencia/inmobiliaria del copy",
        });
        // Track brand patterns
        const match = flag.match(/['']([^'']+)['']/);
        if (match) {
          const name = match[1];
          if (!brandListings[name]) brandListings[name] = new Set();
          brandListings[name].add(r.publicId);
        }
      }
      if (ctaKeywords.test(flag)) {
        violations.push({
          publicId: r.publicId,
          title: r.title,
          titleImageThumb: r.titleImageThumb,
          type: "CTA comercial directo",
          evidence: flag,
          action: "Remover llamados a acción directos de la descripción",
        });
      }
    }
  }

  // Deduplicate violations per listing+type
  const seen = new Set<string>();
  const uniqueViolations = violations.filter((v) => {
    const key = `${v.publicId}:${v.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

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

  // Estimated impact
  const estimatedLeadsLost = Math.round(affectedListings * 5 * 0.3);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity" style={{ color: config.brand.primaryColor }}>{config.brand.shortName}</Link>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">Red Flags · {config.project.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/donde-estamos" className="hover:text-gray-900 transition-colors">Cómo estamos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/plan-de-accion" className="hover:text-gray-900 transition-colors">Plan de Acción</Link>
            <span className="text-gray-300">·</span>
            <Link href="/road-to-excellence" className="hover:text-gray-900 transition-colors">Road to Excellence</Link>
            <span className="text-gray-300">·</span>
            <Link href="/listings" className="hover:text-gray-900 transition-colors">Listings</Link>
            <span className="text-gray-300">·</span>
            <Link href="/pincali" className="hover:text-gray-900 transition-colors">Pincali</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1" style={{ color: config.brand.primaryColor }}>RED FLAGS</h1>
          <p className="text-sm text-gray-500 mb-8">Detección de violaciones a políticas comerciales</p>

          {/* Executive Summary */}
          <section className="mb-10">
            <div className="border border-red-200 bg-red-50 rounded-lg p-6">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-gray-800">{Math.round((affectedListings / results.length) * 100)}% del inventario tiene violaciones.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-gray-800">3 de 4 tipos de violación presentes.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-gray-800">{uniqueViolations.length} violaciones concentradas en {affectedListings} listings.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Violations Table */}
          <section className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: config.brand.secondaryColor }}>
              Listings que violan políticas
            </h3>
            <ViolationsTable listings={listingGroups} />
          </section>

          {/* Recurring Patterns */}
          <section className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: config.brand.secondaryColor }}>
              Asesores recurrentes
            </h3>
            {recurringBrands.length > 0 ? (
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3 font-medium">Nombre comercial</th>
                      <th className="px-4 py-3 font-medium text-center">Listings</th>
                      <th className="px-4 py-3 font-medium text-center">Violaciones</th>
                      <th className="px-4 py-3 font-medium">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recurringBrands.map((brand) => (
                      <tr key={brand.name} className="bg-red-50/30">
                        <td className="px-4 py-3 font-medium text-gray-900">{brand.name}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{brand.listings.length}</td>
                        <td className="px-4 py-3 text-center font-medium text-red-600">{brand.totalViolations}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">Contactar asesor, remover marca de todos los listings</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-gray-100 rounded-lg p-5 text-center">
                <p className="text-sm text-gray-500">
                  Ningún asesor recurrente detectado en muestra de {results.length}. Recomendamos correr análisis sobre el inventario completo (1,437 listings) para identificar patrones sistémicos.
                </p>
              </div>
            )}
          </section>

          {/* Impact */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: config.brand.secondaryColor }}>
              Impacto estimado
            </h3>
            <div className="border border-gray-100 rounded-lg p-6 text-center">
              <p className="text-4xl font-bold text-red-500">~{estimatedLeadsLost}</p>
              <p className="text-sm text-gray-600 mt-1">leads/mes potencialmente perdidos</p>
              <p className="text-xs text-gray-400 mt-3 max-w-md mx-auto">
                Asumiendo que cada listing recibe 5 contactos/mes y que el 30% se desvía por datos de contacto en descripción. Modelo conservador, ajustar con data real de Pincali.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <Link href="/donde-estamos" className="hover:text-gray-900">← Cómo estamos</Link>
          <Link href="/" className="hover:text-gray-900">{config.brand.shortName}</Link>
        </div>
      </footer>
    </div>
  );
}
