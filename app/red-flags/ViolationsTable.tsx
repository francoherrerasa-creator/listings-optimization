"use client";

import { useState } from "react";

interface ViolationDetail {
  type: string;
  evidence: string;
  action: string;
}

interface ListingGroup {
  publicId: string;
  title: string;
  titleImageThumb: string | null;
  violations: ViolationDetail[];
}

type ViolationFilter = "all" | "Información de contacto" | "Nombre comercial" | "CTA comercial directo";
type SortKey = "id" | "count" | "action";
type SortDir = "asc" | "desc";

const badgeColors: Record<string, string> = {
  "Información de contacto": "bg-red-50 text-red-700 border border-red-200",
  "Nombre comercial": "bg-amber-50 text-amber-700 border border-amber-200",
  "CTA comercial directo": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "Fraude potencial": "bg-red-100 text-red-800 border border-red-300",
};

export function ViolationsTable({ listings }: { listings: ListingGroup[] }) {
  const [filter, setFilter] = useState<ViolationFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = filter === "all"
    ? listings
    : listings.filter((l) => l.violations.some((v) => v.type === filter));

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "id") cmp = a.publicId.localeCompare(b.publicId);
    else if (sortKey === "count") cmp = a.violations.length - b.violations.length;
    else cmp = (a.violations[0]?.action ?? "").localeCompare(b.violations[0]?.action ?? "");
    return sortDir === "asc" ? cmp : -cmp;
  });

  const filters: Array<{ key: ViolationFilter; label: string }> = [
    { key: "all", label: "Todos los listings" },
    { key: "Información de contacto", label: "Información de contacto" },
    { key: "Nombre comercial", label: "Nombre comercial" },
    { key: "CTA comercial directo", label: "CTA comercial" },
  ];

  const SortHeader = ({ label, id }: { label: string; id: SortKey }) => (
    <th className="px-4 py-3 font-medium cursor-pointer hover:text-gray-900 select-none" onClick={() => handleSort(id)}>
      {label} {sortKey === id ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === f.key
                ? "bg-red-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <SortHeader label="Listing" id="id" />
                <SortHeader label="Violaciones" id="count" />
                <SortHeader label="Acción sugerida" id="action" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((listing) => (
                <ListingRow
                  key={listing.publicId}
                  listing={listing}
                  expanded={expandedId === listing.publicId}
                  onToggle={() => setExpandedId(expandedId === listing.publicId ? null : listing.publicId)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ListingRow({ listing, expanded, onToggle }: { listing: ListingGroup; expanded: boolean; onToggle: () => void }) {
  const actionSummary = `Limpieza editorial: remover ${listing.violations.length} elemento${listing.violations.length > 1 ? "s" : ""} comercial${listing.violations.length > 1 ? "es" : ""}`;

  return (
    <>
      <tr className="hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={onToggle}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {listing.titleImageThumb ? (
              <img src={listing.titleImageThumb} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-300 shrink-0 text-xs">⌂</div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900">{listing.publicId}</p>
              <p className="text-[11px] text-gray-400 truncate max-w-[180px]">{listing.title}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {listing.violations.map((v, i) => (
              <span key={i} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${badgeColors[v.type] ?? "bg-gray-100 text-gray-700"}`}>
                {v.type}
              </span>
            ))}
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">{actionSummary}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={3} className="px-4 py-4 bg-red-50/30">
            <div className="space-y-3">
              {listing.violations.map((v, i) => (
                <div key={i} className="border-l-2 border-red-200 pl-3">
                  <p className="text-xs font-medium text-gray-700">{v.type}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.evidence}</p>
                  <p className="text-xs text-gray-600 mt-1">→ {v.action}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
