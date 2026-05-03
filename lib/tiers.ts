export const TIER_THRESHOLDS = {
  excellent: 80,
  good: 60,
  poor: 0,
};

export function getTierColor(health: number): string {
  if (health >= 80) return "text-emerald-600";
  if (health >= 60) return "text-yellow-600";
  return "text-red-400";
}

export function getTierLabel(health: number): string {
  if (health >= 80) return "Excellent";
  if (health >= 60) return "Good";
  return "Poor";
}
