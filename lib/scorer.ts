/**
 * Scorer de calidad para listings de EasyBroker.
 *
 * Evalúa propiedades contra las políticas oficiales de publicación
 * y mejores prácticas del help center de EasyBroker.
 *
 * Dimensiones:
 * - data_completeness: determinístico (campos null vs completos)
 * - description_quality: LLM (Anthropic)
 * - photos_signal: LLM (Anthropic)
 * - location_clarity: LLM (Anthropic)
 * - price_plausibility: pendiente (requiere data de mercado)
 */

import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config";
import type { PropertyDetail } from "./easybroker";

// ─── Tipos del resultado de scoring ───

export interface DimensionScore {
  score: number; // 0-100
  reasoning: string;
}

export interface PolicyCompliance {
  compliant: boolean | "unknown" | "requires_human";
  note: string;
}

export interface ScoringResult {
  publicId: string;
  totalScore: number;
  passingThreshold: number;
  passes: boolean;
  dimensions: {
    description_quality: DimensionScore;
    price_plausibility: DimensionScore;
    data_completeness: DimensionScore;
    photos_signal: DimensionScore;
    location_clarity: DimensionScore;
  };
  policyAlignment: {
    no_duplicates: PolicyCompliance;
    available_properties: PolicyCompliance;
    images_promote_property: PolicyCompliance;
    real_price_location: PolicyCompliance;
    matching_characteristics: PolicyCompliance;
    no_fraudulent: PolicyCompliance;
    bank_auctions_classified: PolicyCompliance;
  };
  flagsForModerationTeam: string[];
}

// ─── System prompt alineado a políticas oficiales de EasyBroker ───

const SCORING_SYSTEM_PROMPT = `Eres un evaluador de calidad de listings inmobiliarios para EasyBroker.

Tu evaluación debe estar alineada a las políticas oficiales de publicación de EasyBroker y a las mejores prácticas de su help center.

ESTÁNDARES OFICIALES DE EASYBROKER:

1. TÍTULO: Debe seguir el formato "Tipo de propiedad + operación + ubicación"
   Ejemplo correcto: "Departamento en Venta en Condesa, CDMX"

2. DESCRIPCIÓN: Debe ser concisa detallando características importantes del inmueble.
   No debe contener datos de contacto, URLs, ni información engañosa.

3. FOTOS: La recomendación oficial es al menos 10 fotos ordenadas como recorrido virtual.
   Deben promover el inmueble real (no renders genéricos ni fotos de otro inmueble).

4. UBICACIÓN: Debe ser precisa para que el inmueble aparezca en los filtros de búsqueda correctos.
   La colonia, ciudad y estado deben ser verificables.

5. AMENIDADES: Deben listarse todas las amenidades aplicables al inmueble.

6. PRECIO: Debe ser real y corresponder al inmueble (no precios anzuelo de $1 MXN).

CONTEXTO: EasyBroker recomienda explícitamente usar IA (ChatGPT, Claude, Gemini) para crear descripciones creativas y efectivas. Este scoring automatiza la validación que hoy hace un equipo humano de moderación con SLA de 48h.

Responde ÚNICAMENTE con JSON válido, sin markdown ni explicaciones adicionales.`;

// ─── Scoring determinístico: data_completeness ───

function scoreDataCompleteness(property: PropertyDetail): DimensionScore {
  // Campos que un listing completo debería tener
  const fields = [
    { name: "title", value: property.title },
    { name: "description", value: property.description },
    { name: "bedrooms", value: property.bedrooms },
    { name: "bathrooms", value: property.bathrooms },
    { name: "parking_spaces", value: property.parking_spaces },
    { name: "construction_size", value: property.construction_size },
    { name: "lot_size", value: property.lot_size },
    { name: "operations", value: property.operations?.length > 0 ? true : null },
    { name: "property_type", value: property.property_type },
    { name: "location.street", value: property.location?.street },
    { name: "location.postal_code", value: property.location?.postal_code },
    { name: "location.latitude", value: property.location?.latitude },
    { name: "images (>=10)", value: property.property_images?.length >= 10 ? true : null },
    { name: "images (>=1)", value: property.property_images?.length >= 1 ? true : null },
    { name: "features", value: property.features?.length > 0 ? true : null },
  ];

  const filled = fields.filter((f) => f.value !== null && f.value !== undefined && f.value !== "").length;
  const total = fields.length;
  const score = Math.round((filled / total) * 100);

  const missing = fields.filter((f) => f.value === null || f.value === undefined || f.value === "");
  const missingNames = missing.map((f) => f.name);

  let reasoning: string;
  if (score >= 80) {
    reasoning = `Listing bastante completo (${filled}/${total} campos). Falta: ${missingNames.join(", ") || "nada"}`;
  } else if (score >= 50) {
    reasoning = `Listing parcialmente completo (${filled}/${total} campos). Campos faltantes: ${missingNames.join(", ")}`;
  } else {
    reasoning = `Listing muy incompleto (${filled}/${total} campos). Faltan datos críticos: ${missingNames.join(", ")}`;
  }

  return { score, reasoning };
}

// ─── Scoring con LLM ───

interface LLMScoringResponse {
  description_quality: { score: number; reasoning: string };
  photos_signal: { score: number; reasoning: string };
  location_clarity: { score: number; reasoning: string };
  policy_flags: string[];
}

async function scoreLLMDimensions(
  property: PropertyDetail,
  client: Anthropic,
): Promise<{
  description_quality: DimensionScore;
  photos_signal: DimensionScore;
  location_clarity: DimensionScore;
  policyFlags: string[];
}> {
  const propertyContext = JSON.stringify(
    {
      public_id: property.public_id,
      title: property.title,
      description: property.description,
      property_type: property.property_type,
      operations: property.operations,
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parking_spaces: property.parking_spaces,
      construction_size: property.construction_size,
      lot_size: property.lot_size,
      features: property.features,
      images_count: property.property_images?.length ?? 0,
      has_virtual_tour: !!property.virtual_tour,
      foreclosure: property.foreclosure,
      tags: property.tags,
    },
    null,
    2,
  );

  const userPrompt = `Evalúa este listing inmobiliario y devuelve un JSON con esta estructura exacta:

{
  "description_quality": { "score": <0-100>, "reasoning": "<explicación corta en español>" },
  "photos_signal": { "score": <0-100>, "reasoning": "<explicación corta en español>" },
  "location_clarity": { "score": <0-100>, "reasoning": "<explicación corta en español>" },
  "policy_flags": ["<razón por la que un moderador debería revisar>", ...]
}

CRITERIOS DE EVALUACIÓN:

description_quality (0-100):
- 90-100: Descripción concisa, detalla características importantes, sin datos de contacto
- 70-89: Descripción aceptable pero podría mejorar en detalle o claridad
- 50-69: Descripción genérica o muy corta, no diferencia el inmueble
- 0-49: Sin descripción, copiada, engañosa o con información que viola políticas

photos_signal (0-100):
- 90-100: 10+ fotos que parecen un recorrido ordenado del inmueble
- 70-89: 5-9 fotos relevantes
- 50-69: 1-4 fotos o fotos que no parecen cubrir el inmueble completo
- 0-49: Sin fotos o fotos que no promueven el inmueble

location_clarity (0-100):
- 90-100: Ubicación completa con colonia, ciudad, estado y coordenadas
- 70-89: Ubicación identificable pero le faltan detalles menores
- 50-69: Ubicación vaga o parcial, difícil de filtrar en búsqueda
- 0-49: Sin ubicación o ubicación claramente incorrecta

policy_flags: Lista de strings con razones específicas por las que un moderador humano debería revisar este listing. Si no hay flags, devuelve array vacío.

DATOS DEL LISTING:
${propertyContext}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SCORING_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("Respuesta de Anthropic sin contenido de texto");
  }

  const cleanedText = textContent.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim(); const parsed: LLMScoringResponse = JSON.parse(cleanedText);

  return {
    description_quality: parsed.description_quality,
    photos_signal: parsed.photos_signal,
    location_clarity: parsed.location_clarity,
    policyFlags: parsed.policy_flags ?? [],
  };
}

// ─── Función principal de scoring ───

export async function scoreProperty(property: PropertyDetail): Promise<ScoringResult> {
  const client = new Anthropic();

  // Scoring determinístico
  const dataCompleteness = scoreDataCompleteness(property);

  // Scoring con LLM
  const llmScores = await scoreLLMDimensions(property, client);

  // Price plausibility: pendiente, requiere datos de mercado comparativo
  const pricePlausibility: DimensionScore = {
    score: 50,
    reasoning: "Pendiente: requiere datos de mercado para análisis comparativo. Score neutral asignado.",
  };

  // Calcular score total ponderado
  const dimensions = config.scoring.dimensions;
  const scores: Record<string, number> = {
    description_quality: llmScores.description_quality.score,
    price_plausibility: pricePlausibility.score,
    data_completeness: dataCompleteness.score,
    photos_signal: llmScores.photos_signal.score,
    location_clarity: llmScores.location_clarity.score,
  };

  const totalWeight = dimensions.reduce((sum, d) => sum + d.weight, 0);
  const totalScore = Math.round(
    dimensions.reduce((sum, d) => sum + (scores[d.id] ?? 0) * d.weight, 0) / totalWeight,
  );

  // Policy alignment
  const policyAlignment: ScoringResult["policyAlignment"] = {
    no_duplicates: {
      compliant: "unknown",
      note: "Requiere comparación con otros listings del mismo agente (futuro)",
    },
    available_properties: {
      compliant: true,
      note: "El listing está publicado en la API, se asume disponible",
    },
    images_promote_property: {
      compliant: (property.property_images?.length ?? 0) > 0 ? true : false,
      note:
        (property.property_images?.length ?? 0) >= 10
          ? "Cumple: tiene 10+ imágenes"
          : `Tiene ${property.property_images?.length ?? 0} imagen(es), se recomiendan al menos 10`,
    },
    real_price_location: {
      compliant: property.operations?.[0]?.amount > 100 ? true : "unknown",
      note:
        property.operations?.[0]?.amount > 100
          ? "Precio parece razonable (no es $1 MXN anzuelo)"
          : "Precio sospechosamente bajo, requiere verificación",
    },
    matching_characteristics: {
      compliant: "unknown",
      note: "Requiere verificación cruzada con imágenes (futuro: visión por computadora)",
    },
    no_fraudulent: {
      compliant: "requires_human",
      note: "Validación de fraude requiere revisión humana",
    },
    bank_auctions_classified: {
      compliant: property.foreclosure ? true : "requires_human",
      note: property.foreclosure
        ? "Clasificado correctamente como remate bancario"
        : "No marcado como remate — si lo es, requiere reclasificación humana",
    },
  };

  return {
    publicId: property.public_id,
    totalScore,
    passingThreshold: config.scoring.passingThreshold,
    passes: totalScore >= config.scoring.passingThreshold,
    dimensions: {
      description_quality: llmScores.description_quality,
      price_plausibility: pricePlausibility,
      data_completeness: dataCompleteness,
      photos_signal: llmScores.photos_signal,
      location_clarity: llmScores.location_clarity,
    },
    policyAlignment,
    flagsForModerationTeam: llmScores.policyFlags,
  };
}
