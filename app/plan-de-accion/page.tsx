import { config } from "@/lib/config";
import { loadScoringResults } from "@/lib/loadResults";
import Link from "next/link";

// ─── Flag classification ───

interface ActionItem {
  channel: "quick_wins" | "bot_mona" | "comercial_team" | "marketing" | "trust_safety";
  action: string;
  count: number;
}

function classifyFlags(flags: string[]): ActionItem[] {
  const buckets: Record<string, { channel: ActionItem["channel"]; action: string; count: number }> = {};
  const rules: Array<{ keywords: RegExp; channel: ActionItem["channel"]; action: string }> = [
    { keywords: /descripci[oó]n|texto|truncad|incompleta|contenido|completar/i, channel: "quick_wins", action: "Optimización de descripciones: copy persuasivo basado en datos del listing" },
    { keywords: /datos|campos|amenidades|informaci[oó]n|m²|baño/i, channel: "quick_wins", action: "Auto-completado de campos vacíos: m², amenidades inferidos automáticamente" },
    { keywords: /contacto|agencia|promoci[oó]n|llame|marca/i, channel: "quick_wins", action: "Limpiar contenido no permitido: datos de contacto y texto promocional" },
    { keywords: /t[ií]tulo/i, channel: "quick_wins", action: "Optimización de títulos para SEO: tipo + operación + zona" },
    { keywords: /foto|im[aá]gen/i, channel: "bot_mona", action: "Solicitud de fotos faltantes vía WhatsApp: meta 6 fotos en 24h" },
    { keywords: /ubicaci[oó]n|coordenadas|geogr[aá]f/i, channel: "bot_mona", action: "Validación de ubicación con el asesor: confirmar pin en mapa" },
    { keywords: /precio|valor|mercado|discrepancia/i, channel: "comercial_team", action: "Validación de precio: confirmar alineación con mercado real" },
    { keywords: /zona|regional/i, channel: "marketing", action: "—" },
    { keywords: /fraude|duplicad|anzuelo|sospech|inconsisten/i, channel: "trust_safety", action: "—" },
  ];

  for (const flag of flags) {
    let matched = false;
    for (const rule of rules) {
      if (rule.keywords.test(flag)) {
        const key = `${rule.channel}:${rule.action}`;
        if (!buckets[key]) buckets[key] = { channel: rule.channel, action: rule.action, count: 0 };
        buckets[key].count++;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const key = "quick_wins:Revisar flag manualmente";
      if (!buckets[key]) buckets[key] = { channel: "quick_wins", action: "Revisar flag manualmente", count: 0 };
      buckets[key].count++;
    }
  }

  const channelOrder: ActionItem["channel"][] = ["quick_wins", "bot_mona", "comercial_team", "marketing", "trust_safety"];
  const placeholders: Record<string, string> = { comercial_team: "Validación de precio: confirmar alineación con mercado real", marketing: "—", trust_safety: "—" };
  for (const ch of channelOrder) {
    if (!Object.values(buckets).some((b) => b.channel === ch) && placeholders[ch]) {
      buckets[`${ch}:placeholder`] = { channel: ch, action: placeholders[ch], count: 0 };
    }
  }

  const order: Record<string, number> = { quick_wins: 0, bot_mona: 1, comercial_team: 2, marketing: 3, trust_safety: 4 };
  return Object.values(buckets).sort((a, b) => order[a.channel] - order[b.channel] || b.count - a.count);
}

const channelLabels: Record<string, string> = { quick_wins: "Growth", bot_mona: "Mona", comercial_team: "Sales", marketing: "Marketing", trust_safety: "Trust & Safety" };
const channelBg: Record<string, string> = { quick_wins: "bg-[#F5F5FE]", bot_mona: "bg-[#F0FDF4]", comercial_team: "bg-[#FFFBEB]", marketing: "bg-[#FDF2F8]", trust_safety: "bg-[#F9FAFB]" };
const channelText: Record<string, string> = { quick_wins: "text-indigo-700", bot_mona: "text-green-700", comercial_team: "text-amber-700", marketing: "text-pink-700", trust_safety: "text-slate-700" };

export default async function NextStepsPage() {
  const data = await loadScoringResults();
  const { aggregates, results } = data;

  const allFlags = results.flatMap((r) => r.flagsForModerationTeam);
  const totalFlags = allFlags.length;

  const teamKeywords: Record<string, RegExp> = {
    Growth: /descripci[oó]n|texto|truncad|incompleta|contenido|completar|datos|campos|amenidades|informaci[oó]n|m²|baño|contacto|agencia|promoci[oó]n|llame|marca|t[ií]tulo/i,
    Mona: /foto|im[aá]gen|ubicaci[oó]n|mapa|geocod|coordenadas|geogr[aá]f/i,
    Sales: /precio|valor|mercado|discrepancia/i,
    Marketing: /zona|regional/i,
    "Trust & Safety": /fraude|duplicad|anzuelo|sospech|inconsisten/i,
  };
  const teamCounts: Record<string, number> = { Growth: 0, Mona: 0, Sales: 0, Marketing: 0, "Trust & Safety": 0 };
  for (const flag of allFlags) {
    for (const [team, regex] of Object.entries(teamKeywords)) {
      if (regex.test(flag)) { teamCounts[team]++; break; }
    }
  }

  const dimKeywords: Record<string, RegExp> = {
    description_quality: /descripci[oó]n|texto|truncad|incompleta|contenido|t[ií]tulo/i,
    data_completeness: /datos|campos|amenidades|informaci[oó]n|m²|baño|contacto|agencia|promoci[oó]n|llame|marca/i,
    photos_signal: /foto|im[aá]gen/i,
    location_clarity: /ubicaci[oó]n|mapa|geocod|coordenadas|geogr[aá]f|zona/i,
    price_plausibility: /precio|valor|mercado|discrepancia/i,
  };
  const dimFlagCounts: Record<string, number> = {};
  for (const dim of Object.keys(dimKeywords)) dimFlagCounts[dim] = 0;
  for (const flag of allFlags) {
    for (const [dim, regex] of Object.entries(dimKeywords)) {
      if (regex.test(flag)) { dimFlagCounts[dim]++; break; }
    }
  }

  const dimensionLabels: Record<string, string> = {
    description_quality: "Descripción", price_plausibility: "Precio",
    data_completeness: "Datos faltantes", photos_signal: "Fotos", location_clarity: "Ubicación clara",
  };


  const actions = classifyFlags(allFlags);

  // Growth Insights data
  const flagsByPropertyType: Record<string, number> = {};
  for (const r of results) {
    flagsByPropertyType[r.propertyType] = (flagsByPropertyType[r.propertyType] ?? 0) + r.flagsForModerationTeam.length;
  }
  const mostAffected = results.reduce((worst, r) => r.flagsForModerationTeam.length > worst.flagsForModerationTeam.length ? r : worst, results[0]);

  // By state (last segment of location)
  const flagsByState: Record<string, number> = {};
  for (const r of results) {
    const parts = r.location.split(",").map((s) => s.trim());
    const state = parts[parts.length - 1] || "Desconocido";
    flagsByState[state] = (flagsByState[state] ?? 0) + r.flagsForModerationTeam.length;
  }

  // By operation type
  const flagsByOperation: Record<string, number> = {};
  for (const r of results) {
    const opType = r.operations[0]?.type === "sale" ? "Venta" : r.operations[0]?.type === "rental" ? "Renta" : "Otro";
    flagsByOperation[opType] = (flagsByOperation[opType] ?? 0) + r.flagsForModerationTeam.length;
  }

  // Top 2 dimensions
  const topDims = Object.entries(dimFlagCounts).sort((a, b) => b[1] - a[1]).slice(0, 2);
  const topDimsAffected = topDims.map(([dim]) => ({
    dim,
    flags: dimFlagCounts[dim],
    affected: results.filter((r) => r.dimensions[dim as keyof typeof r.dimensions]?.score < 70).length,
  }));

  // Percentages for causal paragraph
  const descPct = Math.round((dimFlagCounts.description_quality / totalFlags) * 100);
  const dataPct = Math.round((dimFlagCounts.data_completeness / totalFlags) * 100);
  const photosPct = Math.round((dimFlagCounts.photos_signal / totalFlags) * 100);
  const locationPct = Math.round((dimFlagCounts.location_clarity / totalFlags) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity" style={{ color: config.brand.primaryColor }}>{config.brand.shortName}</Link>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">Accionamos · {config.project.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/donde-estamos" className="hover:text-gray-900 transition-colors">Medimos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/road-to-excellence" className="hover:text-gray-900 transition-colors">Entregamos</Link>
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
          <h1 className="text-2xl font-bold mb-1" style={{ color: config.brand.primaryColor }}>ACCIONAMOS</h1>
          <p className="text-sm text-gray-500 mb-8">Cada flag clasificado por equipo</p>

          <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 mb-10">
            <p className="text-base text-gray-700 leading-relaxed">
              40 flags en 10 listings. La distribución no es aleatoria: hay patrones por tipo, por estado y por operación. El 78% se resuelve automáticamente por el equipo de Growth. El 22% restante requiere hablar con el asesor por WhatsApp, eso lo hace Mona. Sales, Marketing y Trust & Safety entran solo cuando los demás canales no resolvieron.
            </p>
          </div>

          {/* [1] Dónde estamos */}
          <section className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: config.brand.secondaryColor }}>Dónde estamos</h3>
            {/* Row 1: Dense cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Estatus Operativo */}
              <div className="border border-gray-100 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Estatus Operativo</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Publicada</span>
                    <span className="text-lg font-bold" style={{ color: config.brand.primaryColor }}>{results.length}</span>
                  </div>
                  {["No publicada", "Reservada", "Vendida", "Rentada", "Suspendida"].map((s) => (
                    <div key={s} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{s}</span>
                      <span className="text-xs text-gray-300">—</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">API pública solo expone listings publicados</p>
              </div>
              {/* Por tipo de propiedad */}
              <div className="border border-gray-100 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Por tipo de propiedad</h4>
                <div className="space-y-1.5">
                  {Object.entries(flagsByPropertyType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{type}</span>
                      <span className="text-xs font-medium" style={{ color: config.brand.primaryColor }}>{count} flags</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Listing más afectado */}
              <div className="border border-gray-100 rounded-lg p-5 flex flex-col justify-center items-center text-center">
                <h4 className="text-xs font-semibold text-gray-700 mb-3">Listing más afectado</h4>
                {mostAffected.titleImageThumb ? (
                  <img src={mostAffected.titleImageThumb} alt="" className="w-12 h-12 rounded object-cover mb-2" />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-300 mb-2">⌂</div>
                )}
                <p className="text-xs font-medium text-gray-900">{mostAffected.publicId}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: config.brand.primaryColor }}>{mostAffected.flagsForModerationTeam.length} <span className="text-xs font-normal text-gray-500">flags</span></p>
              </div>
            </div>

            {/* Row 2: Compact cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Por estado */}
              <div className="border border-gray-100 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Por estado</h4>
                <div className="space-y-1">
                  {Object.entries(flagsByState).sort((a, b) => b[1] - a[1]).map(([state, count]) => (
                    <div key={state} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{state}</span>
                      <span className="text-xs font-medium" style={{ color: config.brand.primaryColor }}>{count} flags</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Por operación */}
              <div className="border border-gray-100 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Por operación</h4>
                <div className="space-y-1">
                  {Object.entries(flagsByOperation).sort((a, b) => b[1] - a[1]).map(([op, count]) => (
                    <div key={op} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{op}</span>
                      <span className="text-xs font-medium" style={{ color: config.brand.primaryColor }}>{count} flags</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Top dimensiones */}
              <div className="border border-gray-100 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Top dimensiones afectadas</h4>
                <div className="space-y-1.5">
                  {topDimsAffected.map((d) => (
                    <div key={d.dim}>
                      <p className="text-xs font-medium" style={{ color: config.brand.primaryColor }}>{dimensionLabels[d.dim]}</p>
                      <p className="text-[11px] text-gray-500">{d.flags} flags · {d.affected} listings</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* [2] Qué hacemos */}
          <section className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: config.brand.secondaryColor }}>Qué hacemos</h3>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-3 font-medium w-36">Equipo</th>
                      <th className="px-4 py-3 font-medium">Accionables</th>
                      <th className="px-4 py-3 font-medium text-center w-24">Flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {actions.map((item, i) => (
                      <tr key={i} className={channelBg[item.channel]}>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${channelText[item.channel]}`}>{channelLabels[item.channel]}</span>
                        </td>
                        <td className={`px-4 py-3 ${item.count === 0 && item.action === "—" ? "text-gray-400" : "text-gray-700"}`}>
                          {item.action}
                          {item.count === 0 && item.action !== "—" && (
                            <span className="ml-2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">demo</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-gray-600">{item.count || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* CTA to Road to Excellence */}
          <div className="text-center">
            <Link
              href="/road-to-excellence"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-medium text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: config.brand.primaryColor }}
            >
              Entregamos →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <Link href="/donde-estamos" className="hover:text-gray-900">← Medimos</Link>
          <Link href="/" className="hover:text-gray-900">{config.brand.shortName}</Link>
        </div>
      </footer>
    </div>
  );
}

