"use client";

import { useState } from "react";

interface ListingInfo {
  publicId: string;
  daysPublished: number;
  level: number;
  levelLabel: string;
}

interface FunnelStage {
  label: string;
  range: string;
  color: string;
  width: string;
  listings: ListingInfo[];
}

export default function FunnelStages({ stages }: { stages: FunnelStage[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const total = stages.reduce((s, st) => s + st.listings.length, 0);

  return (
    <div className="flex flex-col items-center gap-5 mb-12">
      {stages.map((stage, i) => {
        const count = stage.listings.length;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const isExpanded = expanded === i;

        return (
          <div key={stage.label} className="w-full" style={{ maxWidth: stage.width }}>
            <button
              type="button"
              onClick={() => setExpanded(isExpanded ? null : i)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-lg text-left transition-all"
              style={{
                background: isExpanded ? `${stage.color}28` : `${stage.color}18`,
                borderLeft: `4px solid ${stage.color}`,
                cursor: "pointer",
              }}
            >
              <div className="flex-1">
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-3)" }}>{stage.label} · {stage.range}</p>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "40px", color: stage.color, lineHeight: 1.1, marginTop: "4px" }}>{count}</p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 600, color: stage.color }}>{pct}%</p>
                <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "4px" }}>{isExpanded ? "▲" : "▼"}</p>
              </div>
            </button>

            {/* Expandable list */}
            <div
              style={{
                maxHeight: isExpanded ? `${stage.listings.length * 44 + 16}px` : "0px",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              {stage.listings.length > 0 ? (
                <div className="mt-2 space-y-1 px-2">
                  {stage.listings.map((l) => {
                    const levelColor = l.level === 1 ? "#EF4444" : l.level === 2 ? "#F59E0B" : l.level === 3 ? "#10B981" : "#1E3AD9";
                    return (
                      <div
                        key={l.publicId}
                        className="flex items-center gap-4 px-3 py-2 rounded"
                        style={{ background: "var(--paper-2)" }}
                      >
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 500, color: "var(--eb-ink)" }}>{l.publicId}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)" }}>{l.daysPublished} días</span>
                        <span
                          className="ml-auto px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{ fontFamily: "var(--font-mono)", background: `${levelColor}18`, color: levelColor, textTransform: "uppercase", letterSpacing: "0.04em" }}
                        >
                          {l.levelLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 px-3 py-2 text-xs" style={{ color: "var(--ink-3)" }}>
                  Sin listings en esta etapa
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
