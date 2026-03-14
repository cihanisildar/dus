"use server"

import { createClient } from "@/lib/supabase/server"
import { periodQueries } from "@/lib/db/queries/periods"
import { verificationQueries } from "@/lib/db/queries/verifications"
import { programQueries } from "@/lib/db/queries/programs"
import { calculatePlacementMetrics } from "@/lib/utils/placement"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type SuggestedProgram = {
  programId: string
  university: string
  city: string
  specialty: string
  spots: number
  estimatedCutoff: number
  probability: number
  riskLevel: "safe" | "high" | "medium" | "low"
  category: "safe" | "target" | "reach"
}

export type SmartSuggestionResult = {
  userScore: number
  safe: SuggestedProgram[]
  target: SuggestedProgram[]
  reach: SuggestedProgram[]
  totalSuggested: number
}

/**
 * Generate a balanced preference suggestion based on user's DUS score.
 * safe:   probability >= 85% (score well above cutoff)
 * target: probability 60-84%
 * reach:  probability < 60%
 */
export async function generateSmartSuggestion(config?: {
  safe?: number
  target?: number
  reach?: number
}): Promise<ActionResult<SmartSuggestionResult>> {
  try {
    const safeCount = config?.safe ?? 10
    const targetCount = config?.target ?? 10
    const reachCount = config?.reach ?? 10

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: "Unauthorized" }

    const activePeriod = await periodQueries.getActive()
    if (!activePeriod) return { success: false, error: "Aktif dönem bulunamadı" }

    const verification = await verificationQueries.getByUserAndPeriod(user.id, activePeriod.id)
    if (!verification) return { success: false, error: "DUS skorunuz doğrulanmamış" }

    const userScore = verification.dusScore / 100

    const allPrograms = await programQueries.getByPeriod(activePeriod.id)

    const categorized = {
      safe: [] as SuggestedProgram[],
      target: [] as SuggestedProgram[],
      reach: [] as SuggestedProgram[],
    }

    for (const program of allPrograms) {
      const cutoff = program.estimatedCutoff / 100
      const { probability, riskLevel } = calculatePlacementMetrics(userScore, cutoff)

      const suggestion: SuggestedProgram = {
        programId: program.id,
        university: program.university,
        city: program.city,
        specialty: program.specialty,
        spots: program.spots,
        estimatedCutoff: program.estimatedCutoff,
        probability,
        riskLevel,
        category: probability >= 85 ? "safe" : probability >= 60 ? "target" : "reach",
      }

      if (probability >= 85) {
        categorized.safe.push(suggestion)
      } else if (probability >= 60) {
        categorized.target.push(suggestion)
      } else {
        categorized.reach.push(suggestion)
      }
    }

    // Sort each category: safe by cutoff desc (highest floor), reach by cutoff desc (best reach)
    categorized.safe.sort((a, b) => b.estimatedCutoff - a.estimatedCutoff)
    categorized.target.sort((a, b) => b.probability - a.probability)
    categorized.reach.sort((a, b) => b.estimatedCutoff - a.estimatedCutoff)

    return {
      success: true,
      data: {
        userScore,
        safe: categorized.safe.slice(0, safeCount),
        target: categorized.target.slice(0, targetCount),
        reach: categorized.reach.slice(0, reachCount),
        totalSuggested:
          Math.min(categorized.safe.length, safeCount) +
          Math.min(categorized.target.length, targetCount) +
          Math.min(categorized.reach.length, reachCount),
      },
    }
  } catch (error) {
    console.error("Smart suggestion error:", error)
    return { success: false, error: "Öneri oluşturulamadı" }
  }
}
