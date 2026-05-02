/**
 * Cliente para la API de EasyBroker.
 * Documentación: https://dev.easybroker.com/docs
 *
 * Ambientes:
 * - Staging: https://api.stagingeb.com (key pública para desarrollo)
 * - Producción: https://api.easybroker.com (key privada por cuenta)
 */

import { config } from "./config";

// ─── Tipos para el endpoint de lista (/v1/properties) ───

export interface PropertyOperation {
  type: "sale" | "rental";
  amount: number;
  currency: string;
  formatted_amount: string;
  commission: { type: string };
  unit: string;
}

export interface Property {
  public_id: string;
  title: string;
  title_image_full: string | null;
  title_image_thumb: string | null;
  location: string;
  operations: PropertyOperation[];
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  property_type: string;
  lot_size: number | null;
  construction_size: number | null;
  updated_at: string;
  agent: string;
  show_prices: boolean;
  share_commission: boolean;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  next_page: string | null;
}

export interface PropertiesListResponse {
  pagination: Pagination;
  content: Property[];
}

// ─── Tipos para el endpoint de detalle (/v1/properties/:id) ───

export interface PropertyImage {
  title: string | null;
  url: string;
}

export interface PropertyLocation {
  name: string;
  latitude: number | null;
  longitude: number | null;
  street: string | null;
  postal_code: string | null;
  show_exact_location: boolean;
  hide_exact_location: boolean;
  exterior_number: string | null;
  interior_number: string | null;
}

export interface PropertyAgent {
  id: number;
  name: string;
  full_name: string;
  mobile_phone: string | null;
  profile_image_url: string | null;
  email: string;
}

export interface PropertyDetail {
  public_id: string;
  title: string;
  description: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  half_bathrooms: number | null;
  parking_spaces: number | null;
  lot_size: number | null;
  construction_size: number | null;
  lot_length: number | null;
  lot_width: number | null;
  floors: number | null;
  floor: number | null;
  age: number | null;
  internal_id: string | null;
  expenses: number | null;
  location: PropertyLocation;
  property_type: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  operations: PropertyOperation[];
  property_files: unknown[];
  videos: string[];
  virtual_tour: string | null;
  collaboration_notes: string | null;
  public_url: string | null;
  shared_commission_percentage: number | null;
  exclusive: boolean | null;
  foreclosure: boolean;
  tags: string[];
  private_description: string | null;
  show_prices: boolean;
  share_commission: boolean;
  property_images: PropertyImage[];
  images: PropertyImage[];
  agent: PropertyAgent;
  features: string[];
}

// ─── Errores personalizados ───

export class EasyBrokerError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "EasyBrokerError";
  }
}

// ─── Helpers internos ───

function getHeaders(): Record<string, string> {
  const apiKey = process.env.EASYBROKER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "EASYBROKER_API_KEY no está configurada. Revisa tu archivo .env.local",
    );
  }
  return {
    "X-Authorization": apiKey,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function getBaseUrl(): string {
  return config.dataSources.easybroker.baseUrl;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    throw new EasyBrokerError(
      401,
      "API key inválida. Verifica EASYBROKER_API_KEY en .env.local",
    );
  }
  if (response.status === 429) {
    throw new EasyBrokerError(
      429,
      `Rate limit excedido (máx ${config.dataSources.easybroker.rateLimitPerSecond} req/seg). Espera unos segundos y reintenta.`,
    );
  }
  if (!response.ok) {
    throw new EasyBrokerError(
      response.status,
      `Error ${response.status}: ${response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
}

// ─── Funciones públicas ───

/**
 * Lista propiedades con paginación.
 * Equivale a GET /v1/properties
 */
export async function listProperties(opts?: {
  limit?: number;
  page?: number;
  search?: Record<string, string>;
}): Promise<PropertiesListResponse> {
  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.page) params.set("page", String(opts.page));
  if (opts?.search) {
    for (const [key, value] of Object.entries(opts.search)) {
      params.set(`search[${key}]`, value);
    }
  }

  const url = `${getBaseUrl()}/v1/properties?${params.toString()}`;
  const response = await fetch(url, { headers: getHeaders() });
  return handleResponse<PropertiesListResponse>(response);
}

/**
 * Obtiene el detalle completo de una propiedad.
 * Equivale a GET /v1/properties/:public_id
 */
export async function getProperty(publicId: string): Promise<PropertyDetail> {
  const url = `${getBaseUrl()}/v1/properties/${publicId}`;
  const response = await fetch(url, { headers: getHeaders() });
  return handleResponse<PropertyDetail>(response);
}

// ─── Funciones futuras (documentadas, no implementadas) ───

// TODO: createProperty(data: CreatePropertyInput): Promise<PropertyDetail>
// POST /v1/properties — Crea una nueva propiedad.
// Se implementará cuando el scorer pueda generar sugerencias de corrección automática.

// TODO: updateProperty(publicId: string, data: PatchInput): Promise<PropertyDetail>
// PATCH /v1/properties/:public_id — Actualiza campos de una propiedad.
// Se implementará para el flujo de "auto-fix" donde el sistema corrige listings automáticamente.
