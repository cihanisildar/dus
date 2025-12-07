"use server"

import { createClient } from "@/lib/supabase/server";
import { preferenceQueries, type UserPreferenceWithProgram } from "@/lib/db/queries/preferences";
import { verificationQueries } from "@/lib/db/queries/verifications";
import { periodQueries } from "@/lib/db/queries/periods";
import { db } from "@/lib/db";
import { osymVerifications } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type PreferenceAnalytic = {
  rank: number
  program: string
  city: string
  university: string
  specialty: string
  probability: number
  yourScore: number
  estimatedCutoff: number
  scoreGap: number
  competitorCount: number
  spotsAvailable: number
  higherScoredApplicants: number
}

export type ScoreDistribution = {
  range: string
  count: number
  percentage: number
}

export type AnalyticsData = {
  userScore: number
  totalCandidates: number
  userRank: number
  percentile: number
  preferenceAnalytics: PreferenceAnalytic[]
  scoreDistribution: ScoreDistribution[]
  expectedPlacement: {
    program: string
    rank: number
    probability: number
  } | null
  riskDistribution: {
    safe: number
    high: number
    medium: number
    low: number
  }
  insights: {
    hasHighProbability: boolean
    scoreAboveAverage: boolean
    lastUpdate: Date
  }
}

/**
 * Calculate how many candidates have a higher score
 */
async function getHigherScoredApplicants(periodId: string, cutoffScore: number): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(osymVerifications)
    .where(sql`${osymVerifications.periodId} = ${periodId} AND ${osymVerifications.dusScore} >= ${cutoffScore * 100}`)

  return result[0]?.count || 0
}

/**
 * Get score distribution for all candidates in period
 */
async function getScoreDistribution(periodId: string): Promise<ScoreDistribution[]> {
  const allScores = await db
    .select({ score: osymVerifications.dusScore })
    .from(osymVerifications)
    .where(sql`${osymVerifications.periodId} = ${periodId}`)

  const total = allScores.length
  if (total === 0) {
    return []
  }

  // Define ranges
  const ranges = [
    { range: "75+", min: 7500, max: 10000 },
    { range: "70-74", min: 7000, max: 7499 },
    { range: "65-69", min: 6500, max: 6999 },
    { range: "60-64", min: 6000, max: 6499 },
    { range: "55-59", min: 5500, max: 5999 },
  ]

  return ranges.map(({ range, min, max }) => {
    const count = allScores.filter(s => s.score >= min && s.score <= max).length
    const percentage = total > 0 ? (count / total) * 100 : 0
    return {
      range,
      count,
      percentage: Math.round(percentage * 10) / 10,
    }
  })
}

/**
 * Get user's rank among all candidates
 */
async function getUserRank(periodId: string, userScore: number): Promise<{ rank: number; total: number }> {
  const higherScored = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(osymVerifications)
    .where(sql`${osymVerifications.periodId} = ${periodId} AND ${osymVerifications.dusScore} > ${userScore * 100}`)

  const total = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(osymVerifications)
    .where(sql`${osymVerifications.periodId} = ${periodId}`)

  return {
    rank: (higherScored[0]?.count || 0) + 1,
    total: total[0]?.count || 1,
  }
}

/**
 * Get complete analytics data for user
 */
export async function getAnalyticsData(): Promise<ActionResult<AnalyticsData>> {
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

    // Get user's DUS score
    const verification = await verificationQueries.getByUserAndPeriod(user.id, activePeriod.id)
    if (!verification) {
      return { success: false, error: "DUS score not verified" }
    }

    const userScore = verification.dusScore / 100

    // Get user's preferences with program details
    const preferences = await preferenceQueries.getByUserAndPeriod(user.id, activePeriod.id)

    // Calculate preference analytics
    const preferenceAnalytics: PreferenceAnalytic[] = await Promise.all(
      preferences.map(async (pref) => {
        const estimatedCutoff = pref.program.estimatedCutoff / 100
        const scoreGap = userScore - estimatedCutoff
        const higherScoredApplicants = await getHigherScoredApplicants(
          activePeriod.id,
          estimatedCutoff
        )

        return {
          rank: pref.rank,
          program: `${pref.program.university} - ${pref.program.specialty}`,
          city: pref.program.city,
          university: pref.program.university,
          specialty: pref.program.specialty,
          probability: pref.placementProbability || 0,
          yourScore: userScore,
          estimatedCutoff,
          scoreGap: Math.round(scoreGap * 10) / 10,
          competitorCount: pref.program.applicants,
          spotsAvailable: pref.program.spots,
          higherScoredApplicants,
        }
      })
    )

    // Get score distribution
    const scoreDistribution = await getScoreDistribution(activePeriod.id)

    // Get user rank
    const { rank, total } = await getUserRank(activePeriod.id, userScore)
    const percentile = Math.round(((total - rank) / total) * 1000) / 10

    // Find expected placement (highest probability)
    const expectedPlacement = preferenceAnalytics.length > 0
      ? preferenceAnalytics.reduce((prev, current) =>
          current.probability > prev.probability ? current : prev
        )
      : null

    // Get risk distribution
    const riskDistribution = await preferenceQueries.getRiskDistribution(user.id, activePeriod.id)

    // Generate insights
    const hasHighProbability = preferenceAnalytics.some(p => p.probability >= 80)
    const avgCutoff = preferenceAnalytics.length > 0
      ? preferenceAnalytics.reduce((sum, p) => sum + p.estimatedCutoff, 0) / preferenceAnalytics.length
      : 0
    const scoreAboveAverage = userScore > avgCutoff

    return {
      success: true,
      data: {
        userScore,
        totalCandidates: total,
        userRank: rank,
        percentile,
        preferenceAnalytics,
        scoreDistribution,
        expectedPlacement: expectedPlacement
          ? {
              program: expectedPlacement.program,
              rank: expectedPlacement.rank,
              probability: expectedPlacement.probability,
            }
          : null,
        riskDistribution,
        insights: {
          hasHighProbability,
          scoreAboveAverage,
          lastUpdate: new Date(),
        },
      },
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return { success: false, error: "Failed to fetch analytics data" }
  }
}
