"use client";

import { useState } from "react";
import ScenarioToggle from "./ScenarioToggle";

interface EntregamosContentProps {
  currentHealth: number;
  totalListings: number;
  optimistic: {
    postAutomationHealth: number;
    postBotMonaHealth: number;
    automationRate: number;
    botMonaThreshold: number;
    pincaliReady: number;
  };
  conservative: {
    postAutomationHealth: number;
    postBotMonaHealth: number;
    automationRate: number;
    botMonaThreshold: number;
    pincaliReady: number;
  };
}

export default function EntregamosContent(props: EntregamosContentProps) {
  const [scenario, setScenario] = useState<"optimistic" | "conservative">("conservative");

  const s = scenario === "optimistic" ? props.optimistic : props.conservative;

  const subtitle = `De Health ${props.currentHealth}% a ${s.postBotMonaHealth}%`;

  const executiveSummary =
    scenario === "conservative"
      ? `Con automatizacion al ${Math.round(s.automationRate * 100)}% de exito y Bot Mona con ${Math.round(s.botMonaThreshold * 100)}% de respuesta del asesor, llevamos el inventario de Health ${props.currentHealth}% a ${s.postBotMonaHealth}% promedio. ${s.pincaliReady} de ${props.totalListings} listings quedan Pincali Ready tras resolver Red Flags.`
      : `En escenario optimista con ${Math.round(s.automationRate * 100)}% de exito en automatizacion y ${Math.round(s.botMonaThreshold * 100)}% de respuesta a Bot Mona, llevamos el inventario de Health ${props.currentHealth}% a ${s.postBotMonaHealth}% promedio. ${s.pincaliReady} de ${props.totalListings} listings quedan Pincali Ready tras resolver Red Flags.`;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

      <div className="mb-6">
        <ScenarioToggle scenario={scenario} onChange={setScenario} />
      </div>

      <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 mb-10">
        <p className="text-base text-gray-700 leading-relaxed">{executiveSummary}</p>
      </div>

      {/* Growth card */}
      <div className="border border-gray-100 rounded-lg p-6 bg-[#A7F3D0]">
        <div className="mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER</p>
          <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
        </div>

        {/* Sub-section 1: Automatizacion */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Automatizacion</h4>
          <p className="text-sm text-gray-600 mb-2">
            Optimiza descripcion, datos basicos y campos faltantes de forma automatica via API.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 bg-white/60 rounded-full text-gray-700">
              Tasa de exito: {Math.round(s.automationRate * 100)}%
            </span>
            <span className="px-3 py-1 bg-white/60 rounded-full text-gray-700">
              Health promedio: {props.currentHealth}% → {s.postAutomationHealth}%
            </span>
          </div>
        </div>

        <hr className="border-gray-300/50 my-4" />

        {/* Sub-section 2: Bot Mona */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Bot Mona (WhatsApp)</h4>
          <p className="text-sm text-gray-600 mb-2">
            Solicita al asesor fotos, ubicacion exacta y confirmacion de datos que solo el humano puede proveer.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 bg-white/60 rounded-full text-gray-700">
              Tasa de respuesta: {Math.round(s.botMonaThreshold * 100)}%
            </span>
            <span className="px-3 py-1 bg-white/60 rounded-full text-gray-700">
              Health promedio: {s.postAutomationHealth}% → {s.postBotMonaHealth}%
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-300/30">
          Bot Mona = herramienta del equipo Growth. Solo se activa cuando el campo requiere al asesor humano.
        </p>
      </div>
    </div>
  );
}
