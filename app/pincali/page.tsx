import { config } from "@/lib/config";
import { loadScoringResults } from "@/lib/loadResults";
import Link from "next/link";

export default async function PincaliPage() {
  const data = await loadScoringResults();
  const passing = data.results.filter((r) => r.passes);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--eb-line)" }} className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
              Pincali · Propiedades filtradas
            </span>
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
            <Link href="/red-flags" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Red Flags</Link>
            <span style={{ color: "var(--eb-line)" }}>·</span>
            <Link href="/benchmark" className="hover:opacity-70 transition-opacity" style={{ color: "var(--ink-2)" }}>Benchmark</Link>
          </nav>
        </div>
      </header>

      {/* Filter bar */}
      <div style={{ borderBottom: "1px solid var(--eb-line)", background: "var(--paper-2)" }} className="px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="label-eyebrow">
            Filtro activo
          </span>
          <span className="badge">
            Score &ge; {config.scoring.passingThreshold}
          </span>
          <span className="text-sm" style={{ color: "var(--ink-3)" }}>
            {passing.length} de {data.totalInPincali.toLocaleString()} propiedades
          </span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {passing.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {passing.map((listing) => (
                <ListingCard key={listing.publicId} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState
              totalAnalyzed={data.totalInPincali}
              threshold={config.scoring.passingThreshold}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--eb-line)" }} className="px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm" style={{ color: "var(--ink-3)" }}>
          <p>
            Simulación de filtro de calidad para Pincali ·{" "}
            <Link href="/donde-estamos" className="hover:opacity-70" style={{ color: "var(--eb-blue)" }}>
              Ver Cómo estamos
            </Link>
          </p>
          <Link href="/" className="hover:opacity-70" style={{ color: "var(--eb-blue)" }}>
            {config.brand.shortName}
          </Link>
        </div>
      </footer>
    </div>
  );
}

function ListingCard({
  listing,
}: {
  listing: {
    publicId: string;
    title: string;
    propertyType: string;
    location: string;
    operations: Array<{ formatted_amount: string; type: string }>;
    titleImageThumb: string | null;
    totalScore: number;
  };
}) {
  const op = listing.operations[0];
  return (
    <div className="card overflow-hidden" style={{ padding: 0 }}>
      <div className="relative aspect-[4/3]" style={{ background: "var(--eb-cream)" }}>
        {listing.titleImageThumb ? (
          <img
            src={listing.titleImageThumb}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl" style={{ color: "var(--ink-3)" }}>
            &#8962;
          </div>
        )}
        <span className="absolute top-3 right-3 px-2 py-1 text-white text-xs font-medium rounded" style={{ background: "var(--green)", fontFamily: "var(--font-mono)" }}>
          {listing.totalScore}
        </span>
      </div>
      <div className="p-4">
        <p className="label-eyebrow mb-1">
          {listing.propertyType} · {op?.type === "sale" ? "Venta" : "Renta"}
        </p>
        <h3 className="font-medium text-sm leading-snug mb-2 line-clamp-2" style={{ color: "var(--eb-ink)" }}>
          {listing.title}
        </h3>
        <p className="text-sm mb-2" style={{ color: "var(--ink-3)" }}>{listing.location}</p>
        {op && (
          <p className="font-semibold" style={{ color: "var(--eb-ink)", fontFamily: "var(--font-mono)" }}>
            {op.formatted_amount}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  totalAnalyzed,
  threshold,
}: {
  totalAnalyzed: number;
  threshold: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6" style={{ background: "#FEF2F2" }}>
        &#8856;
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight mb-3" style={{ color: "var(--eb-ink)" }}>
        0 propiedades cumplen el mínimo esperado de calidad
      </h2>
      <p className="max-w-lg leading-relaxed mb-8" style={{ color: "var(--ink-3)" }}>
        De {totalAnalyzed.toLocaleString()} propiedades analizadas, ninguna
        alcanza el criterio mínimo (score &ge; {threshold}). Esta vista demuestra
        el filtro automático que se aplicaría en producción: solo propiedades de
        alta calidad llegan al buscador.
      </p>
      <Link
        href="/donde-estamos"
        className="btn-primary px-6 py-3"
      >
        Ver análisis detallado
      </Link>
    </div>
  );
}
