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
    { keywords: /zona|regional/i, channel: "marketing", action: "-" },
    { keywords: /fraude|duplicad|anzuelo|sospech|inconsisten/i, channel: "trust_safety", action: "-" },
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
  const placeholders: Record<string, string> = { comercial_team: "Validación de precio: confirmar alineación con mercado real", marketing: "-", trust_safety: "-" };
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
  const { results } = data;

  const allFlags = results.flatMap((r) => r.flagsForModerationTeam);





  const actions = classifyFlags(allFlags);


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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Listings sin asesor */}
              <div className="border border-red-200 bg-red-50 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Listings sin asesor asignado</h4>
                <p className="text-2xl font-bold text-red-600">5 de 10 (50%)</p>
                <p className="text-xs text-gray-500 mt-1">agent: null. Riesgo operativo: lead llega y no hay quién atienda</p>
              </div>
              {/* Card 2: Sin actualizar */}
              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Inventario sin actualizar</h4>
                <p className="text-2xl font-bold text-yellow-700">{">"}90 días: 10</p>
                <p className="text-xs text-gray-500 mt-1">Todos los listings sin actualización desde agosto 2024</p>
              </div>
              {/* Card 3: Por operación */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Por operación</h4>
                <p className="text-2xl font-bold text-gray-700">Venta: 10 (100%)</p>
                <p className="text-xs text-gray-500 mt-1">Distribución por tipo de operación</p>
              </div>
              {/* Card 4: Pipeline de Calidad */}
              <div className="border border-green-200 bg-green-50 rounded-lg p-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Pipeline de Calidad</h4>
                <p className="text-sm font-medium text-gray-700">Básico: 5 · Completo: 5 · Optimizado: 0 · Premium: 0</p>
                <p className="text-xs text-gray-500 mt-1">Meta: todos en Optimizado o superior</p>
              </div>
              {/* Card 5: API GAP */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 relative">
                <span className="absolute top-2 right-2 text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">API GAP</span>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Por tipo de plan</h4>
                <p className="text-sm text-gray-500">Free / Basic / Pro: no expuesto por API pública</p>
              </div>
              {/* Card 6: API GAP */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 relative">
                <span className="absolute top-2 right-2 text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">API GAP</span>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Por tipo de asesor</h4>
                <p className="text-sm text-gray-500">Inmobiliaria / Independiente: no expuesto por API pública</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">* Métricas identificadas como críticas para el funnel free-to-paid. No expuestas en la API pública de EasyBroker.</p>
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
                        <td className={`px-4 py-3 ${item.count === 0 && item.action === "-" ? "text-gray-400" : "text-gray-700"}`}>
                          {item.action}
                          {item.count === 0 && item.action !== "-" && (
                            <span className="ml-2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">demo</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-gray-600">{item.count || "-"}</td>
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

