import { config } from "@/lib/config";
import { loadScoringResults } from "@/lib/loadResults";
import Link from "next/link";

export default async function PincaliPage() {
  const data = await loadScoringResults();
  const passing = data.results.filter((r) => r.passes);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity"
              style={{ color: config.brand.primaryColor }}
            >
              {config.brand.shortName}
            </Link>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">
              Pincali · Propiedades filtradas
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/donde-estamos" className="hover:text-gray-900 transition-colors">Medimos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/plan-de-accion" className="hover:text-gray-900 transition-colors">Accionamos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/road-to-excellence" className="hover:text-gray-900 transition-colors">Entregamos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/propiedades" className="hover:text-gray-900 transition-colors">Propiedades</Link>
            <span className="text-gray-300">·</span>
            <Link href="/red-flags" className="hover:text-gray-900 transition-colors">Red Flags</Link>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div className="border-b border-gray-50 bg-gray-50/50 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Filtro activo
          </span>
          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-sm text-gray-700">
            Score ≥ {config.scoring.passingThreshold}
          </span>
          <span className="text-sm text-gray-400">
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
      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <p>
            Simulación de filtro de calidad para Pincali ·{" "}
            <Link href="/donde-estamos" className="text-gray-600 hover:text-gray-900">
              Ver Cómo estamos
            </Link>
          </p>
          <Link href="/" className="hover:text-gray-900">
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
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors">
      <div className="relative aspect-[4/3] bg-gray-100">
        {listing.titleImageThumb ? (
          <img
            src={listing.titleImageThumb}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            ⌂
          </div>
        )}
        <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
          {listing.totalScore}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {listing.propertyType} · {op?.type === "sale" ? "Venta" : "Renta"}
        </p>
        <h3 className="font-medium text-sm text-gray-900 leading-snug mb-2 line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{listing.location}</p>
        {op && (
          <p className="font-semibold text-gray-900">
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
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-3xl mb-6">
        ⊘
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        0 propiedades cumplen el mínimo esperado de calidad
      </h2>
      <p className="text-gray-500 max-w-lg leading-relaxed mb-8">
        De {totalAnalyzed.toLocaleString()} propiedades analizadas, ninguna
        alcanza el criterio mínimo (score ≥ {threshold}). Esta vista demuestra
        el filtro automático que se aplicaría en producción: solo propiedades de
        alta calidad llegan al buscador.
      </p>
      <Link
        href="/donde-estamos"
        className="px-6 py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: config.brand.secondaryColor }}
      >
        Ver análisis detallado →
      </Link>
    </div>
  );
}
