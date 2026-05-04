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

  const executiveSummary = `El equipo de Growth, con la estrategia de Automatización y Eva Quality, lleva las propiedades de Calidad ${props.currentHealth}% a ${s.postBotMonaHealth}% promedio. Automatización resuelve 14 de 15 campos medibles sin tocar al asesor. Eva Quality cierra el último: pedir fotos premium vía WhatsApp. Pincali Ready depende de resolver Red Flags: 5 violaciones de política en 4 propiedades requieren acción inmediata.`;

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--ink-3)" }}>{subtitle}</p>

      <div className="highlight-block mb-10">
        <p className="leading-relaxed" style={{ color: "var(--ink-2)" }}>{executiveSummary}</p>
      </div>

      {/* Growth card */}
      <div className="card" style={{ borderColor: "var(--green)", background: "#D1FAE5" }}>
        <div className="mb-4">
          <p className="label-eyebrow">OWNER</p>
          <h3 className="text-lg font-semibold" style={{ color: "var(--eb-ink)" }}>Growth Strategy: Automatización y Eva Quality</h3>
        </div>

        {/* Sub-section 1: Automatización */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--eb-ink)" }}>Automatización</h4>
          <p className="text-sm mb-2" style={{ color: "var(--ink-2)" }}>
            Optimiza descripción, datos básicos y campos faltantes de forma automática vía API.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="badge">
              Tasa de éxito: {Math.round(s.automationRate * 100)}%
            </span>
            <span className="badge">
              Calidad promedio: {props.currentHealth}% → {s.postAutomationHealth}%
            </span>
          </div>
        </div>

        <hr style={{ borderColor: "var(--eb-line)", opacity: 0.5 }} className="my-4" />

        {/* Sub-section 2: Eva Quality */}
        <div>
          <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--eb-ink)" }}>Eva Quality (WhatsApp)</h4>
          <p className="text-sm mb-2" style={{ color: "var(--ink-2)" }}>
            Solicita al asesor fotos, ubicación exacta y confirmación de datos que solo el humano puede proveer.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="badge">
              Tasa de respuesta: {Math.round(s.botMonaThreshold * 100)}%
            </span>
            <span className="badge">
              Calidad promedio: {s.postAutomationHealth}% → {s.postBotMonaHealth}%
            </span>
          </div>
        </div>

        <p className="text-xs mt-4 pt-3" style={{ borderTop: "1px solid var(--eb-line)", color: "var(--ink-3)" }}>
          Eva Quality es herramienta del equipo Growth. Solo se activa cuando el campo requiere al asesor humano.
        </p>
      </div>
    </div>
  );
}
