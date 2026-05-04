/**
 * Maturity levels for listings based on quality score and marketplace readiness.
 * Level 1 (Crítico): Published on EasyBroker, quality < 50%
 * Level 2 (Standard): Published on EasyBroker, quality 50-79%
 * Level 3 (Pincali Ready): Quality ≥80% + ≥10 photos
 * Level 4 (Top Performer): Pincali Ready + video or virtual tour
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
  { level: 1, label: "Crítico", color: "#EF4444" },
  { level: 2, label: "Standard", color: "#F59E0B" },
  { level: 3, label: "Pincali Ready", color: "#10B981" },
  { level: 4, label: "Top Performer", color: "#1E3AD9" },
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

  // Classification based on quality score
  let level: 1 | 2 | 3 | 4 = 1;
  if (healthPercent >= 80 && hasMinPhotos10) {
    if (hasVideoOrTour) {
      level = 4;
    } else {
      level = 3;
    }
  } else if (healthPercent >= 50) {
    level = 2;
  } else {
    level = 1;
  }

  const levelLabel = MATURITY_LEVELS.find(l => l.level === level)?.label ?? "Crítico";
  return { publicId: listing.public_id || listing.publicId || "", level, levelLabel, criteria };
}
