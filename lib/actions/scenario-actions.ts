"use server"

import { createClient } from "@/lib/supabase/server";
import { scenarioQueries } from "@/lib/db/queries/scenarios";
import { preferenceQueries } from "@/lib/db/queries/preferences";
import { periodQueries } from "@/lib/db/queries/periods";
import { programQueries } from "@/lib/db/queries/programs";
import { verificationQueries } from "@/lib/db/queries/verifications";
import type { Scenario } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { calculatePlacementMetrics } from "@/lib/utils/placement";
import { db } from "@/lib/db";
import { userPreferences } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Calculate expected placement for a scenario
 */
async function calculateScenarioResult(
  programIds: string[],
  periodId: string,
  userScore: number
): Promise<{ expectedPlacement: string | null; expectedProbability: number }> {
  if (programIds.length === 0) {
    return { expectedPlacement: null, expectedProbability: 0 }
  }

  // Get all programs
  const programs = await Promise.all(
    programIds.map(id => programQueries.getById(id))
  )

  // Calculate probability for each program
  const programsWithProbability = programs
    .filter(p => p !== undefined)
    .map((program) => {
      const cutoff = program!.estimatedCutoff / 100
      const { probability } = calculatePlacementMetrics(userScore, cutoff)
      return {
        name: `${program!.university} - ${program!.specialty}`,
        probability,
      }
    })

  // Find highest probability
  const best = programsWithProbability.reduce((prev, current) =>
    current.probability > prev.probability ? current : prev
  )

  return {
    expectedPlacement: best.name,
    expectedProbability: best.probability,
  }
}

/**
 * Get all scenarios for current user
 */
export async function getUserScenarios(): Promise<ActionResult<Scenario[]>> {
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

    const scenarios = await scenarioQueries.getByUserAndPeriod(user.id, activePeriod.id)
    return { success: true, data: scenarios }
  } catch (error) {
    console.error("Error fetching scenarios:", error)
    return { success: false, error: "Failed to fetch scenarios" }
  }
}

/**
 * Create a new scenario from current preferences
 */
export async function createScenarioFromPreferences(
  name: string,
  description?: string
): Promise<ActionResult<Scenario>> {
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

    // Get user's current preferences
    const preferences = await preferenceQueries.getByUserAndPeriod(user.id, activePeriod.id)

    if (preferences.length === 0) {
      return { success: false, error: "Tercih listeniz boş. Önce tercih ekleyin." }
    }

    // Get user's DUS score
    const verification = await verificationQueries.getByUserAndPeriod(user.id, activePeriod.id)
    if (!verification) {
      return { success: false, error: "DUS score not verified" }
    }

    const userScore = verification.dusScore / 100

    // Create snapshot of preference IDs in order
    const preferenceSnapshot = preferences
      .sort((a, b) => a.rank - b.rank)
      .map(p => p.programId)

    // Calculate expected result
    const { expectedPlacement, expectedProbability } = await calculateScenarioResult(
      preferenceSnapshot,
      activePeriod.id,
      userScore
    )

    // Create scenario
    const scenario = await scenarioQueries.create({
      userId: user.id,
      periodId: activePeriod.id,
      name,
      description: description || null,
      preferenceSnapshot,
      expectedPlacement,
      expectedProbability,
      preferenceCount: preferences.length,
    })

    revalidatePath("/dashboard", "layout")

    return { success: true, data: scenario }
  } catch (error) {
    console.error("Error creating scenario:", error)
    return { success: false, error: "Failed to create scenario" }
  }
}

/**
 * Delete a scenario
 */
export async function deleteScenario(scenarioId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    // Get scenario to verify ownership
    const scenario = await scenarioQueries.getById(scenarioId)
    if (!scenario || scenario.userId !== user.id) {
      return { success: false, error: "Scenario not found" }
    }

    await scenarioQueries.delete(scenarioId)

    revalidatePath("/dashboard", "layout")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting scenario:", error)
    return { success: false, error: "Failed to delete scenario" }
  }
}

/**
 * Apply a scenario to current preferences
 */
export async function applyScenario(scenarioId: string): Promise<ActionResult> {
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

    // Get scenario
    const scenario = await scenarioQueries.getById(scenarioId)
    if (!scenario || scenario.userId !== user.id) {
      return { success: false, error: "Scenario not found" }
    }

    // Get user's DUS score for calculations
    const verification = await verificationQueries.getByUserAndPeriod(user.id, activePeriod.id)
    if (!verification) {
      return { success: false, error: "DUS score not verified" }
    }

    const userScore = verification.dusScore / 100
    const programIds = scenario.preferenceSnapshot as string[]

    // Fetch all programs before entering the transaction
    const programs = await Promise.all(programIds.map(id => programQueries.getById(id)))

    // Atomically delete all preferences and re-create from scenario snapshot
    await db.transaction(async (tx) => {
      await tx.delete(userPreferences).where(
        and(
          eq(userPreferences.userId, user.id),
          eq(userPreferences.periodId, activePeriod.id)
        )
      )

      for (let i = 0; i < programIds.length; i++) {
        const program = programs[i]
        if (!program) continue

        const cutoff = program.estimatedCutoff / 100
        const { probability, riskLevel } = calculatePlacementMetrics(userScore, cutoff)

        await tx.insert(userPreferences).values({
          userId: user.id,
          periodId: activePeriod.id,
          programId: programIds[i],
          rank: i + 1,
          placementProbability: probability,
          riskLevel,
        })
      }
    })

    revalidatePath("/dashboard", "layout")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error applying scenario:", error)
    return { success: false, error: "Failed to apply scenario" }
  }
}

/**
 * Duplicate a scenario
 */
export async function duplicateScenario(scenarioId: string): Promise<ActionResult<Scenario>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    // Get scenario
    const scenario = await scenarioQueries.getById(scenarioId)
    if (!scenario || scenario.userId !== user.id) {
      return { success: false, error: "Scenario not found" }
    }

    // Create duplicate
    const newScenario = await scenarioQueries.create({
      userId: scenario.userId,
      periodId: scenario.periodId,
      name: `${scenario.name} (Kopya)`,
      description: scenario.description,
      preferenceSnapshot: scenario.preferenceSnapshot,
      expectedPlacement: scenario.expectedPlacement,
      expectedProbability: scenario.expectedProbability,
      preferenceCount: scenario.preferenceCount,
    })

    revalidatePath("/dashboard", "layout")

    return { success: true, data: newScenario }
  } catch (error) {
    console.error("Error duplicating scenario:", error)
    return { success: false, error: "Failed to duplicate scenario" }
  }
}
