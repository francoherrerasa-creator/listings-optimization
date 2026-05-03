"use client";

import { useState } from "react";
import type { ScoringResultEntry } from "@/lib/loadResults";

type Filter = "all" | "growth" | "mona";
type SortKey = "score" | "type" | "location" | "desc" | "price" | "data" | "photos" | "loc" | "passes";
type SortDir = "asc" | "desc";

const teamRules: Array<{ team: Exclude<Filter, "all">; keywords: RegExp }> = [
  { team: "growth", keywords: /descripci[oó]n|texto|truncad|incompleta|contenido|completar|datos|campos|amenidades|informaci[oó]n|m²|baño|contacto|agencia|promoci[oó]n|llame|marca|t[ií]tulo/i },
  { team: "mona", keywords: /foto|im[aá]gen|ubicaci[oó]n|mapa|geocod|coordenadas|geogr[aá]f/i },
  // Sales, Marketing, Trust & Safety: reactivar cuando el JSON tenga flags reales para estos equipos
];

function getListingTeams(result: ScoringResultEntry): Set<string> {
  const teams = new Set<string>();
  for (const flag of result.flagsForModerationTeam) {
    for (const rule of teamRules) {
      if (rule.keywords.test(flag)) { teams.add(rule.team); break; }
    }
  }
  return teams;
}

const filterConfig: Record<Exclude<Filter, "all">, { label: string; bg: string; bgActive: string; text: string }> = {
  growth: { label: "Growth", bg: "bg-[#F5F5FE]", bgActive: "bg-indigo-600", text: "text-indigo-700" },
  mona: { label: "Mona", bg: "bg-[#F0FDF4]", bgActive: "bg-green-600", text: "text-green-700" },
};

function getSortValue(r: ScoringResultEntry, key: SortKey): string | number {
  switch (key) {
    case "score": return r.totalScore;
    case "type": return r.propertyType;
    case "location": return r.location;
    case "desc": return r.dimensions.description_quality.score;
    case "price": return r.dimensions.price_plausibility.score;
    case "data": return r.dimensions.data_completeness.score;
    case "photos": return r.dimensions.photos_signal.score;
    case "loc": return r.dimensions.location_clarity.score;
    case "passes": return r.passes ? 1 : 0;
  }
}

export function ListingsView({ results }: { results: ScoringResultEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = filter === "all"
    ? results
    : results.filter((r) => getListingTeams(r).has(filter));

  const displayed = [...filtered].sort((a, b) => {
    const aVal = getSortValue(a, sortKey);
    const bVal = getSortValue(b, sortKey);
    const cmp = typeof aVal === "number" ? (aVal as number) - (bVal as number) : String(aVal).localeCompare(String(bVal));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortHeader = ({ label, sortId }: { label: string; sortId: SortKey }) => (
    <th
      className="px-4 py-3 font-medium cursor-pointer hover:text-gray-900 select-none"
      onClick={() => handleSort(sortId)}
    >
      {label} {sortKey === sortId ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === "all"
              ? "bg-[#2A2EBE] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Ver todos
        </button>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(filterConfig) as Exclude<Filter, "all">[]).map((team) => {
            const cfg = filterConfig[team];
            const isActive = filter === team;
            return (
              <button
                key={team}
                onClick={() => setFilter(isActive ? "all" : team)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  isActive ? `${cfg.bgActive} text-white` : `${cfg.bg} ${cfg.text}`
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Propiedad</th>
                <SortHeader label="Tipo" sortId="type" />
                <SortHeader label="Ubicación" sortId="location" />
                <SortHeader label="Score" sortId="score" />
                <SortHeader label="Desc" sortId="desc" />
                <SortHeader label="Precio" sortId="price" />
                <SortHeader label="Datos" sortId="data" />
                <SortHeader label="Fotos" sortId="photos" />
                <SortHeader label="Ubic" sortId="loc" />
                <SortHeader label="Pasa" sortId="passes" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                    Sin propiedades para este filtro
                  </td>
                </tr>
              ) : (
                displayed.map((r) => (
                  <TableRow
                    key={r.publicId}
                    result={r}
                    expanded={expandedId === r.publicId}
                    onToggle={() => setExpandedId(expandedId === r.publicId ? null : r.publicId)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ result, expanded, onToggle }: { result: ScoringResultEntry; expanded: boolean; onToggle: () => void }) {
  const r = result;
  return (
    <>
      <tr className="hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={onToggle}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {r.titleImageThumb ? (
              <img src={r.titleImageThumb} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">⌂</div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate max-w-[200px]">{r.publicId}</p>
              <p className="text-xs text-gray-400 truncate max-w-[200px]">{r.title}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{r.propertyType}</td>
        <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{r.location}</td>
        <td className="px-4 py-3 text-center"><ScoreBadge score={r.totalScore} /></td>
        <td className="px-4 py-3 text-center hidden sm:table-cell"><MiniScore value={r.dimensions.description_quality.score} /></td>
        <td className="px-4 py-3 text-center hidden sm:table-cell"><MiniScore value={r.dimensions.price_plausibility.score} /></td>
        <td className="px-4 py-3 text-center hidden sm:table-cell"><MiniScore value={r.dimensions.data_completeness.score} /></td>
        <td className="px-4 py-3 text-center hidden sm:table-cell"><MiniScore value={r.dimensions.photos_signal.score} /></td>
        <td className="px-4 py-3 text-center hidden sm:table-cell"><MiniScore value={r.dimensions.location_clarity.score} /></td>
        <td className="px-4 py-3 text-center">
          {r.passes ? <span className="text-emerald-600 font-medium">SI</span> : <span className="text-red-400 font-medium">NO</span>}
        </td>
      </tr>
      {expanded && <DetailRow result={r} />}
    </>
  );
}

function DetailRow({ result }: { result: ScoringResultEntry }) {
  const dims = result.dimensions;
  const policies = result.policyAlignment;
  return (
    <tr>
      <td colSpan={10} className="px-4 py-6 bg-gray-50/70">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          <div>
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Detalle por dimensión</h4>
            <div className="space-y-3">
              {Object.entries(dims).map(([key, dim]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-gray-700">{key.replace(/_/g, " ")}</span>
                    <ScoreBadge score={dim.score} small />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{dim.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Cumplimiento de políticas</h4>
            <div className="space-y-2 mb-6">
              {Object.entries(policies).map(([key, pol]) => (
                <div key={key} className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">{pol.compliant === true ? "✓" : pol.compliant === false ? "✗" : "?"}</span>
                  <div>
                    <span className="text-sm text-gray-700">{key.replace(/_/g, " ")}</span>
                    <p className="text-xs text-gray-400">{pol.note}</p>
                  </div>
                </div>
              ))}
            </div>
            {result.flagsForModerationTeam.length > 0 && (
              <>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Flags</h4>
                <ul className="space-y-1">
                  {result.flagsForModerationTeam.map((flag, i) => (
                    <li key={i} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">{flag}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function ScoreBadge({ score, small }: { score: number; small?: boolean }) {
  const color = score >= 85 ? "bg-emerald-100 text-emerald-700" : score >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-red-50 text-red-400";
  return <span className={`inline-block font-medium rounded ${color} ${small ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-0.5"}`}>{score}</span>;
}

function MiniScore({ value }: { value: number }) {
  const color = value >= 85 ? "text-emerald-600" : value >= 70 ? "text-yellow-600" : "text-red-400";
  return <span className={`text-xs font-medium ${color}`}>{value}</span>;
}
