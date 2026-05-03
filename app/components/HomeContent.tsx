"use client";

import { useState } from "react";
import ScenarioToggle from "./ScenarioToggle";
import JourneyChart from "./JourneyChart";

interface ProjectionData {
  avgHealth: number;
  pincaliReady: number;
}

interface HomeContentProps {
  currentHealth: number;
  totalListings: number;
  listingsAbove80Today: number;
  optimistic: {
    postAutomation: ProjectionData;
    postBotMona: ProjectionData;
    postRedFlags: { pincaliReady: number };
  };
  conservative: {
    postAutomation: ProjectionData;
    postBotMona: ProjectionData;
    postRedFlags: { pincaliReady: number };
  };
}

export default function HomeContent(props: HomeContentProps) {
  const [scenario, setScenario] = useState<"optimistic" | "conservative">("conservative");

  const s = scenario === "optimistic" ? props.optimistic : props.conservative;

  const chartData = [
    { name: "Hoy", health: props.currentHealth, pincaliReady: props.listingsAbove80Today },
    { name: "Automatizacion", health: s.postAutomation.avgHealth, pincaliReady: s.postAutomation.pincaliReady },
    { name: "Mona AI", health: s.postBotMona.avgHealth, pincaliReady: s.postBotMona.pincaliReady },
    { name: "Red Flags", health: s.postBotMona.avgHealth, pincaliReady: s.postRedFlags.pincaliReady },
  ];

  const paragraph =
    scenario === "conservative"
      ? `De los ${props.totalListings} listings analizados, ${props.listingsAbove80Today} cumplen el estándar de calidad hoy (Calidad >=80%). Asumiendo 90% de éxito en automatización y 50% de respuesta del asesor a Mona AI, llevamos el inventario a Calidad ${s.postBotMona.avgHealth}% promedio. Resolviendo Red Flags llegamos a ${s.postRedFlags.pincaliReady} Pincali Ready.`
      : `De los ${props.totalListings} listings analizados, ${props.listingsAbove80Today} cumplen el estándar de calidad hoy (Calidad >=80%). En escenario optimista (100% éxito automatización + 80% respuesta a Mona AI), llevamos el inventario a Calidad ${s.postBotMona.avgHealth}% promedio. Resolviendo Red Flags llegamos a ${s.postRedFlags.pincaliReady} Pincali Ready.`;

  return (
    <div className="mt-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-center mb-6">
        <ScenarioToggle scenario={scenario} onChange={setScenario} />
      </div>
      <JourneyChart data={chartData} />
      <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto mt-6 text-center">
        {paragraph}
      </p>
    </div>
  );
}
