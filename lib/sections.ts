export interface FieldDef {
  key: string;
  label: string;
  required: boolean;
  isThreshold?: boolean;
  threshold?: number;
}

export interface SectionDef {
  id: string;
  label: string;
  apiAvailable: boolean;
  apiGapNote?: string;
  fields: FieldDef[];
}

export const FORM_SECTIONS: SectionDef[] = [
  {
    id: "datos_basicos",
    label: "Datos básicos",
    apiAvailable: true,
    fields: [
      { key: "title", label: "Título", required: true },
      { key: "description", label: "Descripción", required: true },
      { key: "property_type", label: "Tipo de propiedad", required: true },
    ],
  },
  {
    id: "precio_operacion",
    label: "Precio y operación",
    apiAvailable: true,
    fields: [
      { key: "operations[0].amount", label: "Precio", required: true },
      { key: "operations[0].commission.type", label: "Tipo de comisión", required: false },
    ],
  },
  {
    id: "caracteristicas",
    label: "Características",
    apiAvailable: true,
    fields: [
      { key: "bedrooms", label: "Recámaras", required: false },
      { key: "bathrooms", label: "Baños", required: false },
      { key: "parking_spaces", label: "Estacionamientos", required: false },
      { key: "construction_size", label: "M² construidos", required: false },
      { key: "lot_size", label: "M² terreno", required: false },
    ],
  },
  {
    id: "ubicacion",
    label: "Ubicación",
    apiAvailable: true,
    fields: [
      { key: "location.street", label: "Calle", required: false },
      { key: "location.postal_code", label: "Código postal", required: false },
      { key: "location.latitude", label: "Coordenadas (lat)", required: false },
    ],
  },
  {
    id: "amenidades",
    label: "Amenidades",
    apiAvailable: false,
    apiGapNote: "El formulario tiene 30+ amenidades; la API pública solo expone 'features'",
    fields: [
      { key: "features", label: "Amenidades (≥5)", required: false, isThreshold: true, threshold: 5 },
    ],
  },
  {
    id: "colaboracion",
    label: "Colaboración y exclusividad",
    apiAvailable: false,
    apiGapNote: "Campos exclusivity y commission_sharing no expuestos completamente en API pública",
    fields: [
      { key: "exclusive", label: "Exclusividad", required: false },
      { key: "share_commission", label: "Comisión compartida", required: false },
    ],
  },
  {
    id: "multimedia",
    label: "Multimedia",
    apiAvailable: true,
    fields: [
      { key: "property_images_min_1", label: "Al menos 1 foto", required: true, isThreshold: true, threshold: 1 },
      { key: "property_images_min_10", label: "≥10 fotos (recomendado)", required: false, isThreshold: true, threshold: 10 },
    ],
  },
  {
    id: "estatus",
    label: "Estatus operativo",
    apiAvailable: false,
    apiGapNote: "El status (publicada/no publicada/reservada/etc.) no se expone en API pública",
    fields: [
      { key: "status", label: "Estatus", required: true },
    ],
  },
];

/**
 * Resuelve paths anidados tipo "operations[0].amount" o "location.street"
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce((acc: unknown, key: string) => {
      if (acc === null || acc === undefined) return undefined;
      return (acc as Record<string, unknown>)[key];
    }, obj);
}

/**
 * Evalúa si un campo está "lleno" (no null/vacío, cumple threshold si aplica)
 */
export function evaluateField(listing: Record<string, unknown>, field: FieldDef): boolean {
  // Para campos de threshold en multimedia, mapear la key real
  let resolvedKey = field.key;
  if (field.key === "property_images_min_1" || field.key === "property_images_min_10") {
    resolvedKey = "property_images";
  }

  const value = getNestedValue(listing, resolvedKey);

  if (field.isThreshold) {
    if (Array.isArray(value)) {
      return value.length >= (field.threshold ?? 1);
    }
    return false;
  }

  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}
