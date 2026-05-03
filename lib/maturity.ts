/**
 * Maturity levels for listings based on marketplace standards.
 * Level 1 (Básico): has agent + basic data (title, description, property_type)
 * Level 2 (Completo): above + ≥5 photos + location with city and neighborhood
 * Level 3 (Optimizado): above + ≥10 photos + Health ≥80%
 * Level 4 (Premium): above + (video OR virtual_tour) + share_commission: true
 */

export interface MaturityResult {
  publicId: string;
  level: 1 | 2 | 3 | 4;
  levelLabel: string;
  criteria: {
    hasAgent: boolean;
    hasBasicData: boolean;
    hasMinPhotos5: boolean;
    hasLocationComplete: boolean;
    hasMinPhotos10: boolean;
    healthAbove80: boolean;
    hasVideoOrTour: boolean;
    hasShareCommission: boolean;
  };
}

export const MATURITY_LEVELS = [
  { level: 1, label: "Básico", color: "bg-red-100 text-red-700 border-red-200" },
  { level: 2, label: "Completo", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { level: 3, label: "Optimizado", color: "bg-green-100 text-green-700 border-green-200" },
  { level: 4, label: "Premium", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

export function calculateMaturityLevel(listing: any, healthPercent: number): MaturityResult {
  const hasAgent = !!(listing.agent && (listing.agent.id || listing.agent.name));
  const hasBasicData = !!(listing.title && listing.description && listing.property_type);
  const photoCount = listing.property_images?.length ?? 0;
  const hasMinPhotos5 = photoCount >= 5;
  const locationName = listing.location?.name || listing.location || "";
  const parts = typeof locationName === "string" ? locationName.split(",").map((s: string) => s.trim()) : [];
  const hasLocationComplete = parts.length >= 2;
  const hasMinPhotos10 = photoCount >= 10;
  const healthAbove80 = healthPercent >= 80;
  const hasVideoOrTour = (listing.videos?.length > 0) || !!listing.virtual_tour;
  const hasShareCommission = listing.share_commission === true;

  const criteria = { hasAgent, hasBasicData, hasMinPhotos5, hasLocationComplete, hasMinPhotos10, healthAbove80, hasVideoOrTour, hasShareCommission };

  let level: 1 | 2 | 3 | 4 = 1;
  if (hasAgent && hasBasicData) {
    level = 1;
    if (hasMinPhotos5 && hasLocationComplete) {
      level = 2;
      if (hasMinPhotos10 && healthAbove80) {
        level = 3;
        if (hasVideoOrTour && hasShareCommission) {
          level = 4;
        }
      }
    }
  }

  const levelLabel = MATURITY_LEVELS.find(l => l.level === level)?.label ?? "Básico";
  return { publicId: listing.public_id || listing.publicId || "", level, levelLabel, criteria };
}
