/**
 * Scoring model v2: 8 dimensiones con sub-factores escalonados.
 * 100 puntos totales. Determinístico (sin LLM).
 */

import type { PropertyDetail } from "./easybroker";

export interface DimensionScoreV2 {
  score: number;
  maxScore: number;
  subFactors: Record<string, boolean>;
}

export interface ScoringResultV2 {
  publicId: string;
  totalScore: number;
  dimensions: {
    photos: DimensionScoreV2;
    description: DimensionScoreV2;
    price: DimensionScoreV2;
    freshness: DimensionScoreV2;
    location: DimensionScoreV2;
    characteristics: DimensionScoreV2;
    amenities: DimensionScoreV2;
    video: DimensionScoreV2;
  };
}

// ─── Scoring Functions ───

function scorePhotos(listing: PropertyDetail): DimensionScoreV2 {
  const images = listing.property_images ?? listing.images ?? [];
  const count = images.length;

  const hasQuantity = count >= 10;
  // Resolution: can't check actual resolution from API, assume true if images exist
  const hasResolution = count >= 5;
  // Diversity: assume true if more than 6 images (likely varied)
  const hasDiversity = count >= 7;
  // Cover photo: has at least one image
  const hasCover = count >= 1;

  const subFactors = { quantity: hasQuantity, resolution: hasResolution, diversity: hasDiversity, cover: hasCover };
  const met = Object.values(subFactors).filter(Boolean).length;

  let score = 0;
  if (met === 4) score = 20;
  else if (met === 3) score = 14;
  else if (met === 2) score = 8;
  else if (met === 1) score = 3;

  return { score, maxScore: 20, subFactors };
}

function scoreDescription(listing: PropertyDetail): DimensionScoreV2 {
  const desc = listing.description ?? "";
  const len = desc.length;

  const hasLength = len >= 150;
  const hasMentions = /m²|metros|zona|colonia|venta|renta|recámara|baño/.test(desc.toLowerCase());
  const hasStructure = desc.includes("\n") || desc.includes(".") && len > 200;
  // Simple heuristic for spelling: no repeated spaces, no all-caps blocks
  const noErrors = !/\s{3,}/.test(desc) && !/[A-ZÁÉÍÓÚÑ]{20,}/.test(desc);

  const subFactors = { length: hasLength, mentions: hasMentions, structure: hasStructure, spelling: noErrors };
  const met = Object.values(subFactors).filter(Boolean).length;

  let score = 0;
  if (met === 4) score = 20;
  else if (met === 3) score = 12;
  else if (met === 2) score = 5;
  else if (met === 1) score = 2;

  return { score, maxScore: 20, subFactors };
}

function scorePrice(listing: PropertyDetail): DimensionScoreV2 {
  const op = listing.operations?.[0];
  const hasNumericPrice = op != null && op.amount > 0;
  const hasPriceType = op != null && !!op.unit;
  // Financing: not available in API, check if there's any mention
  const hasFinancing = false; // API doesn't expose this

  const subFactors = { numericPrice: hasNumericPrice, priceType: hasPriceType, financing: hasFinancing };
  const met = Object.values(subFactors).filter(Boolean).length;

  let score = 0;
  if (met === 3) score = 20;
  else if (met === 2) score = 15;
  else if (met === 1) score = 8;

  return { score, maxScore: 20, subFactors };
}

function scoreFreshness(listing: PropertyDetail): DimensionScoreV2 {
  const now = new Date();
  const updated = new Date(listing.updated_at);
  const daysSinceUpdate = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));

  let score = 0;
  if (daysSinceUpdate <= 30) score = 15;
  else if (daysSinceUpdate <= 90) score = 10;
  else if (daysSinceUpdate <= 180) score = 5;
  else if (daysSinceUpdate <= 365) score = 2;

  const subFactors = { recentUpdate: daysSinceUpdate <= 90 };
  return { score, maxScore: 15, subFactors };
}

function scoreLocation(listing: PropertyDetail): DimensionScoreV2 {
  const loc = listing.location;
  const name = loc?.name ?? "";
  const parts = name.split(",").map(s => s.trim()).filter(Boolean);

  const hasStateCity = parts.length >= 2;
  const hasColonia = parts.length >= 3;
  const hasPin = loc?.latitude != null && loc?.longitude != null && loc.latitude !== 0;

  const subFactors = { stateCity: hasStateCity, colonia: hasColonia, pin: hasPin };
  const met = Object.values(subFactors).filter(Boolean).length;

  let score = 0;
  if (met === 3) score = 10;
  else if (met === 2) score = 6;
  else if (met === 1) score = 2;

  return { score, maxScore: 10, subFactors };
}

function scoreCharacteristics(listing: PropertyDetail): DimensionScoreV2 {
  const hasBedrooms = listing.bedrooms != null && listing.bedrooms > 0;
  const hasBathrooms = (listing.bathrooms != null && listing.bathrooms > 0) || (listing.half_bathrooms != null && listing.half_bathrooms > 0);
  const hasConstruction = listing.construction_size != null && listing.construction_size > 0;
  const hasLot = listing.lot_size != null && listing.lot_size > 0;
  const hasParking = listing.parking_spaces != null && listing.parking_spaces > 0;

  const subFactors = { bedrooms: hasBedrooms, bathrooms: hasBathrooms, construction: hasConstruction, lot: hasLot, parking: hasParking };
  const met = Object.values(subFactors).filter(Boolean).length;

  let score = 0;
  if (met === 5) score = 8;
  else if (met >= 3) score = 5;
  else if (met >= 1) score = 2;

  return { score, maxScore: 8, subFactors };
}

function scoreAmenities(listing: PropertyDetail): DimensionScoreV2 {
  const count = listing.features?.length ?? 0;

  let score = 0;
  if (count >= 5) score = 4;
  else if (count >= 3) score = 3;
  else if (count >= 1) score = 1;

  const subFactors = { hasAmenities: count > 0 };
  return { score, maxScore: 4, subFactors };
}

function scoreVideo(listing: PropertyDetail): DimensionScoreV2 {
  const hasVideo = (listing.videos?.length ?? 0) > 0 || !!listing.virtual_tour;

  return {
    score: hasVideo ? 3 : 0,
    maxScore: 3,
    subFactors: { hasVideoOrTour: hasVideo },
  };
}

// ─── Main Scorer ───

export function calculateScoreV2(listing: PropertyDetail): ScoringResultV2 {
  const photos = scorePhotos(listing);
  const description = scoreDescription(listing);
  const price = scorePrice(listing);
  const freshness = scoreFreshness(listing);
  const location = scoreLocation(listing);
  const characteristics = scoreCharacteristics(listing);
  const amenities = scoreAmenities(listing);
  const video = scoreVideo(listing);

  const totalScore = photos.score + description.score + price.score + freshness.score + location.score + characteristics.score + amenities.score + video.score;

  return {
    publicId: listing.public_id,
    totalScore,
    dimensions: { photos, description, price, freshness, location, characteristics, amenities, video },
  };
}
