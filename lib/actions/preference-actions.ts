"use server"

import { createClient } from "@/lib/supabase/server";
import { preferenceQueries, type UserPreferenceWithProgram } from "@/lib/db/queries/preferences";
import { programQueries } from "@/lib/db/queries/programs";
import { periodQueries } from "@/lib/db/queries/periods";
import { verificationQueries } from "@/lib/db/queries/verifications";
import { revalidatePath } from "next/cache";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Calculate placement probability and risk level for a preference
 */
function calculatePlacementMetrics(userScore: number, programCutoff: number): {
  probability: number
  riskLevel: "safe" | "high" | "medium" | "low"
} {
  const scoreDiff = userScore - programCutoff

  let probability: number
  let riskLevel: "safe" | "high" | "medium" | "low"

  if (scoreDiff >= 5) {
    probability = 95
    riskLevel = "safe"
  } else if (scoreDiff >= 2) {
    probability = 85
    riskLevel = "high"
  } else if (scoreDiff >= -1) {
    probability = 65
    riskLevel = "medium"
  } else {
    probability = 35
    riskLevel = "low"
  }

  return { probability, riskLevel }
}

/**
 * Get all preferences for current user
 */
export async function getUserPreferences(): Promise<ActionResult<UserPreferenceWithProgram[]>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const activePeriod = await periodQueries.getActive()
    if (!activePeriod) {
      return { success: false, error: "No active exam period" }
    }

    const preferences = await preferenceQueries.getByUserAndPeriod(user.id, activePeriod.id)
    return { success: true, data: preferences }
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return { success: false, error: "Failed to fetch preferences" }
  }
}

/**
 * Add a new preference
 */
export async function addPreference(programId: string): Promise<ActionResult<UserPreferenceWithProgram>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const activePeriod = await periodQueries.getActive()
    if (!activePeriod) {
      return { success: false, error: "No active exam period" }
    }

    // Check if user has reached max preferences (30)
    const currentCount = await preferenceQueries.getCount(user.id, activePeriod.id)
    if (currentCount >= 30) {
      return { success: false, error: "Maximum 30 preferences allowed" }
    }

    // Get program details
    const program = await programQueries.getById(programId)
    if (!program) {
      return { success: false, error: "Program not found" }
    }

    // Get user's DUS score
    const verification = await verificationQueries.getByUserAndPeriod(user.id, activePeriod.id)
    if (!verification) {
      return { success: false, error: "DUS score not verified" }
    }

    const userScore = verification.dusScore / 100 // Convert to decimal
    const programCutoff = program.estimatedCutoff / 100

    // Calculate metrics
    const { probability, riskLevel } = calculatePlacementMetrics(userScore, programCutoff)

    // Create preference with next rank
    const newRank = currentCount + 1
    const preference = await preferenceQueries.create({
      userId: user.id,
      periodId: activePeriod.id,
      programId,
      rank: newRank,
      placementProbability: probability,
      riskLevel,
    })

    // Get full preference with program details
    const fullPreference = await preferenceQueries.getById(preference.id)
    if (!fullPreference) {
      return { success: false, error: "Failed to fetch created preference" }
    }

    revalidatePath("/dashboard/preferences")
    revalidatePath("/dashboard")

    return { success: true, data: fullPreference }
  } catch (error) {
    console.error("Error adding preference:", error)
    return { success: false, error: "Failed to add preference" }
  }
}

/**
 * Remove a preference
 */
export async function removePreference(preferenceId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const activePeriod = await periodQueries.getActive()
    if (!activePeriod) {
      return { success: false, error: "No active exam period" }
    }

    // Get preference to verify ownership
    const preference = await preferenceQueries.getById(preferenceId)
    if (!preference || preference.userId !== user.id) {
      return { success: false, error: "Preference not found" }
    }

    // Delete preference
    await preferenceQueries.delete(preferenceId)

    // Get remaining preferences and reorder them
    const remainingPreferences = await preferenceQueries.getByUserAndPeriod(user.id, activePeriod.id)
    if (remainingPreferences.length > 0) {
      const preferenceIds = remainingPreferences
        .sort((a, b) => a.rank - b.rank)
        .map(p => p.id)
      await preferenceQueries.reorder(user.id, activePeriod.id, preferenceIds)
    }

    revalidatePath("/dashboard/preferences")
    revalidatePath("/dashboard")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error removing preference:", error)
    return { success: false, error: "Failed to remove preference" }
  }
}

/**
 * Reorder preferences (drag and drop)
 */
export async function reorderPreferences(preferenceIds: string[]): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const activePeriod = await periodQueries.getActive()
    if (!activePeriod) {
      return { success: false, error: "No active exam period" }
    }

    await preferenceQueries.reorder(user.id, activePeriod.id, preferenceIds)

    revalidatePath("/dashboard/preferences")
    revalidatePath("/dashboard")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error reordering preferences:", error)
    return { success: false, error: "Failed to reorder preferences" }
  }
}

/**
 * Get risk distribution for user's preferences
 */
export async function getRiskDistribution(): Promise<ActionResult<{
  safe: number
  high: number
  medium: number
  low: number
}>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const activePeriod = await periodQueries.getActive()
    if (!activePeriod) {
      return { success: false, error: "No active exam period" }
    }

    const distribution = await preferenceQueries.getRiskDistribution(user.id, activePeriod.id)
    return { success: true, data: distribution }
  } catch (error) {
    console.error("Error fetching risk distribution:", error)
    return { success: false, error: "Failed to fetch risk distribution" }
  }
}
