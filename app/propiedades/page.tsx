import { config } from "@/lib/config";
import { loadListingDates } from "@/lib/loadDates";
import { loadMaturityData } from "@/lib/loadMaturity";
import { MATURITY_LEVELS } from "@/lib/maturity";
import Link from "next/link";
import FunnelStages from "./FunnelStages";

const FUNNEL_STAGE_DEFS = [
  { label: "Fresco", range: "< 30 días", maxDays: 30, color: "#10B981", width: "100%" },
  { label: "Saludable", range: "30 a 90 días", maxDays: 90, color: "#F59E0B", width: "80%" },
  { label: "Riesgo", range: "91 a 365 días", maxDays: 365, color: "#F97316", width: "60%" },
  { label: "Zombie", range: "> 365 días", maxDays: Infinity, color: "#EF4444", width: "40%" },
];

export default async function ListingsPage() {
  const datesData = await loadListingDates();
  const maturityData = await loadMaturityData();
  const now = new Date();

  // Build maturity lookup
  const maturityMap: Record<string, { level: number; label: string }> = {};
  for (const m of maturityData.results) {
    const info = MATURITY_LEVELS.find(ml => ml.level === m.level);
    maturityMap[m.publicId] = { level: m.level, label: info?.label ?? "Crítico" };
  }

  // Calculate days published for each listing
  const daysPerListing = datesData.results.map((d) => {
    const pubDate = d.published_at ? new Date(d.published_at) : new Date(d.created_at);
    const updDate = new Date(d.updated_at);
    return {
      publicId: d.publicId,
      daysPublished: Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24)),
      daysUpdated: Math.floor((now.getTime() - updDate.getTime()) / (1000 * 60 * 60 * 24)),
      level: maturityMap[d.publicId]?.level ?? 1,
      levelLabel: maturityMap[d.publicId]?.label ?? "Crítico",
    };
  });

  // Classify into funnel stages with listing details
  const stages = FUNNEL_STAGE_DEFS.map((def, i) => {
    const minDays = i === 0 ? 0 : FUNNEL_STAGE_DEFS[i - 1].maxDays;
    const listings = daysPerListing.filter((l) => {
      if (i === 0) return l.daysPublished < def.maxDays;
      if (def.maxDays === Infinity) return l.daysPublished > minDays;
      return l.daysPublished >= minDays && l.daysPublished <= def.maxDays;
    });
    return {
      label: def.label,
      range: def.range,
      color: def.color,
      width: def.width,
      listings: listings.map((l) => ({
        publicId: l.publicId,
        daysPublished: l.daysPublished,
        level: l.level,
        levelLabel: l.levelLabel,
      })),
    };
  });

  const total = daysPerListing.length;
  const avgDaysPublished = Math.round(daysPerListing.reduce((s, l) => s + l.daysPublished, 0) / total);
  const avgDaysUpdated = Math.round(daysPerListing.reduce((s, l) => s + l.daysUpdated, 0) / total);
  const sorted = [...daysPerListing].sort((a, b) => a.daysPublished - b.daysPublished);
  const median = sorted[Math.floor(sorted.length / 2)].daysPublished;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--eb-line)" }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity"
              style={{ color: "var(--eb-blue)" }}
            >
              {config.brand.shortName}
            </Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>
              Propiedades · {config.project.name}
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm" style={{ color: "var(--ink-2)" }}>
            <Link href="/donde-estamos" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Medimos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/plan-de-accion" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Accionamos</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/road-to-excellence" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Entregamos</Link>
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
          <p className="section-tag">Propiedades</p>
          <h1 className="mb-1" style={{ color: "var(--eb-blue)" }}>
            Antigüedad del inventario
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--ink-2)" }}>
            Cuánto tiempo lleva publicado cada listing. Este funnel revela la salud del inventario y dónde está el churn silencioso.
          </p>

          {/* Highlight block */}
          <div className="highlight-block mb-10">
            100% del inventario auditado lleva más de 1 año publicado sin actualización significativa. Inventario zombie = retention silenciosamente roto.
          </div>

          {/* Funnel */}
          <FunnelStages stages={stages} />

          {/* Stat row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="label-eyebrow mb-2">Antigüedad promedio</p>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "32px", color: "var(--eb-ink)" }}>{avgDaysPublished.toLocaleString()} días</p>
            </div>
            <div className="card text-center">
              <p className="label-eyebrow mb-2">Mediana</p>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "32px", color: "var(--eb-ink)" }}>{median.toLocaleString()} días</p>
            </div>
            <div className="card text-center">
              <p className="label-eyebrow mb-2">Última actualización promedio</p>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "32px", color: "var(--eb-ink)" }}>{avgDaysUpdated.toLocaleString()} días</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--eb-line)" }} className="px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm" style={{ color: "var(--ink-3)" }}>
          <Link href="/donde-estamos" className="hover:opacity-70" style={{ color: "var(--ink-2)" }}>
            Growth Dashboard
          </Link>
          <Link href="/" className="hover:opacity-70" style={{ color: "var(--eb-blue)" }}>
            {config.brand.shortName}
          </Link>
        </div>
      </footer>
    </div>
  );
}
