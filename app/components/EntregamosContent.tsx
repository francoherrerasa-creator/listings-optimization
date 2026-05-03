"use client";

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
  const s = props.conservative;

  const subtitle = `One team: de 0 a 10 Pincali Ready`;

  const executiveSummary = `El equipo de Growth, con la estrategia de Automatización y Mona AI, lleva las propiedades de Calidad ${props.currentHealth}% a ${s.postBotMonaHealth}% promedio. Automatización resuelve 14 de 15 campos medibles sin tocar al asesor. Mona AI cierra el último: pedir fotos premium vía WhatsApp. Pincali Ready depende de resolver Red Flags: 5 violaciones de política en 4 propiedades requieren acción inmediata.`;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

      <div className="border border-gray-200 bg-gray-50/30 rounded-lg p-6 mb-10">
        <p className="text-base text-gray-700 leading-relaxed">{executiveSummary}</p>
      </div>

      {/* Growth card */}
      <div className="border border-gray-100 rounded-lg p-6 bg-[#A7F3D0]">
        <div className="mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">OWNER</p>
          <h3 className="text-lg font-semibold text-gray-900">Growth Strategy: Automatización y Mona AI</h3>
        </div>

        {/* Sub-section 1: Automatización */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Automatización</h4>
          <p className="text-sm text-gray-600 mb-2">
            Optimiza descripción, datos básicos y campos faltantes de forma automática vía API.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 bg-white/60 rounded-full text-gray-700">
              Tasa de éxito: {Math.round(s.automationRate * 100)}%
            </span>
            <span className="px-3 py-1 bg-white/60 rounded-full text-gray-700">
              Calidad promedio: {props.currentHealth}% → {s.postAutomationHealth}%
            </span>
          </div>
        </div>

        <hr className="border-gray-300/50 my-4" />

        {/* Sub-section 2: Mona AI */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Mona AI (WhatsApp)</h4>
          <p className="text-sm text-gray-600 mb-2">
            Solicita al asesor fotos, ubicación exacta y confirmación de datos que solo el humano puede proveer.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 bg-white/60 rounded-full text-gray-700">
              Tasa de respuesta: {Math.round(s.botMonaThreshold * 100)}%
            </span>
            <span className="px-3 py-1 bg-white/60 rounded-full text-gray-700">
              Calidad promedio: {s.postAutomationHealth}% → {s.postBotMonaHealth}%
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-300/30">
          Mona AI es herramienta del equipo Growth. Solo se activa cuando el campo requiere al asesor humano.
        </p>
      </div>
    </div>
  );
}
