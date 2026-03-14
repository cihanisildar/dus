/**
 * Shared placement probability calculation.
 * Single source of truth used by preference-actions, scenario-actions, and analytics.
 */
export function calculatePlacementMetrics(
  userScore: number,
  programCutoff: number
): { probability: number; riskLevel: "safe" | "high" | "medium" | "low" } {
  const scoreDiff = userScore - programCutoff

  if (scoreDiff >= 5) return { probability: 95, riskLevel: "safe" }
  if (scoreDiff >= 2) return { probability: 85, riskLevel: "high" }
  if (scoreDiff >= -1) return { probability: 65, riskLevel: "medium" }
  return { probability: 35, riskLevel: "low" }
}
