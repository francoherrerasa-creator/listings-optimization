"use client";

interface ScenarioToggleProps {
  scenario: "optimistic" | "conservative";
  onChange: (s: "optimistic" | "conservative") => void;
}

export default function ScenarioToggle({ scenario, onChange }: ScenarioToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-gray-200 overflow-hidden">
      <button
        onClick={() => onChange("conservative")}
        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
          scenario === "conservative"
            ? "bg-[#2A2EBE] text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        Conservador
      </button>
      <button
        onClick={() => onChange("optimistic")}
        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
          scenario === "optimistic"
            ? "bg-[#2A2EBE] text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        Optimista
      </button>
    </div>
  );
}
