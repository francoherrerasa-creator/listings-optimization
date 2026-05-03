import { config } from "@/lib/config";
import { loadScoringResults } from "@/lib/loadResults";
import Link from "next/link";
import { ListingsView } from "./ListingsView";

export default async function ListingsPage() {
  const data = await loadScoringResults();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
              Propiedades · {config.project.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/donde-estamos" className="hover:text-gray-900 transition-colors">Medimos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/plan-de-accion" className="hover:text-gray-900 transition-colors">Accionamos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/road-to-excellence" className="hover:text-gray-900 transition-colors">Entregamos</Link>
            <span className="text-gray-300">·</span>
            <Link href="/pincali" className="hover:text-gray-900 transition-colors">Pincali</Link>
            <span className="text-gray-300">·</span>
            <Link href="/red-flags" className="hover:text-gray-900 transition-colors">Red Flags</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-2xl font-bold mb-6"
            style={{ color: config.brand.primaryColor }}
          >
            PROPIEDADES
          </h1>

          <ListingsView results={data.results} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <Link href="/donde-estamos" className="hover:text-gray-900">
            Growth Dashboard
          </Link>
          <Link href="/" className="hover:text-gray-900">
            {config.brand.shortName}
          </Link>
        </div>
      </footer>
    </div>
  );
}
