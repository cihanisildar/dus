"use server"

import { db } from "@/lib/db"
import { osymVerifications, userPreferences, programs } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { periodQueries } from "@/lib/db/queries/periods"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type SimulationResult = {
  programId: string
  university: string
  city: string
  specialty: string
  spots: number
  estimatedCutoff: number
  predictedCutoff: number     // Based on current applicant scores
  fillRate: number            // 0-100 percentage
  applicantCount: number
  topScore: number | null
  bottomScore: number | null
}

// In-memory cache: simple TTL cache
let cachedResult: { data: SimulationResult[]; timestamp: number } | null = null
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Simulate placement based on current preference data.
 * Mimics ÖSYM's placement algorithm: sort by score, fill spots in order.
 */
export async function getSimulationResults(): Promise<ActionResult<SimulationResult[]>> {
  try {
    // Check cache
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL_MS) {
      return { success: true, data: cachedResult.data }
    }

    const activePeriod = await periodQueries.getActive()
    if (!activePeriod) {
      return { success: false, error: "Aktif sınav dönemi bulunamadı" }
    }

    // Fetch all preferences with user scores for this period
    const prefRows = await db
      .select({
        programId: userPreferences.programId,
        rank: userPreferences.rank,
        userId: userPreferences.userId,
        dusScore: osymVerifications.dusScore,
      })
      .from(userPreferences)
      .innerJoin(
        osymVerifications,
        and(
          eq(osymVerifications.userId, userPreferences.userId),
          eq(osymVerifications.periodId, activePeriod.id)
        )
      )
      .where(eq(userPreferences.periodId, activePeriod.id))

    // Fetch all active programs for this period
    const allPrograms = await db.query.programs.findMany({
      where: and(
        eq(programs.periodId, activePeriod.id),
        eq(programs.isActive, true)
      ),
    })

    // Build program → applicant score map (sorted by score desc, preserving rank)
    const programApplicants = new Map<string, number[]>()
    for (const pref of prefRows) {
      const existing = programApplicants.get(pref.programId) || []
      existing.push(pref.dusScore)
      programApplicants.set(pref.programId, existing)
    }

    const results: SimulationResult[] = allPrograms.map(program => {
      const applicants = (programApplicants.get(program.id) || [])
        .sort((a, b) => b - a) // Sort descending by score

      const spots = program.spots
      const fillCount = Math.min(applicants.length, spots)
      const fillRate = Math.round((fillCount / spots) * 100)

      // Predicted cutoff: the score of the last placed candidate
      const predictedCutoff = fillCount > 0
        ? applicants[fillCount - 1] // Score of last placed candidate
        : program.estimatedCutoff   // Fall back to estimate if no data

      return {
        programId: program.id,
        university: program.university,
        city: program.city,
        specialty: program.specialty,
        spots,
        estimatedCutoff: program.estimatedCutoff,
        predictedCutoff,
        fillRate,
        applicantCount: applicants.length,
        topScore: applicants[0] || null,
        bottomScore: applicants[applicants.length - 1] || null,
      }
    })

    // Sort by fill rate desc, then predicted cutoff desc
    results.sort((a, b) => b.fillRate - a.fillRate || b.predictedCutoff - a.predictedCutoff)

    // Cache result
    cachedResult = { data: results, timestamp: Date.now() }

    return { success: true, data: results }
  } catch (error) {
    console.error("Simulation error:", error)
    return { success: false, error: "Simülasyon çalıştırılamadı" }
  }
}
