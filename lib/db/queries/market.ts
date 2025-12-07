import { db } from '../index'
import { programs, examPeriods } from '../schema'
import { eq, and, sql, desc, asc } from 'drizzle-orm'

export interface SpecialtyAnalytics {
    name: string
    ratio: number
    change: number
    trend: 'up' | 'down'
}

export interface CityAnalytics {
    name: string
    programs: number
    avgRatio: number
    applicants: number
}

export const marketQueries = {
    /**
     * Get the most competitive specialties by applicant/spot ratio
     * Returns top 3 specialties with highest competition
     */
    async getMostCompetitiveSpecialties(periodId: string, limit = 3): Promise<SpecialtyAnalytics[]> {
        const result = await db
            .select({
                specialty: programs.specialty,
                avgRatio: sql<number>`ROUND(AVG(CAST(${programs.applicants} AS DECIMAL) / NULLIF(${programs.spots}, 0)), 1)`,
                totalApplicants: sql<number>`SUM(${programs.applicants})`,
                totalSpots: sql<number>`SUM(${programs.spots})`,
            })
            .from(programs)
            .where(and(
                eq(programs.periodId, periodId),
                eq(programs.isActive, true)
            ))
            .groupBy(programs.specialty)
            .orderBy(desc(sql`AVG(CAST(${programs.applicants} AS DECIMAL) / NULLIF(${programs.spots}, 0))`))
            .limit(limit)

        // For now, we'll use mock trend data since we don't have historical data
        // In a real implementation, you'd compare with previous period data
        return result.map((row, idx) => ({
            name: row.specialty,
            ratio: Number(row.avgRatio) || 0,
            change: idx === 0 ? 2.3 : idx === 1 ? 1.8 : -0.5, // Mock data
            trend: idx === 2 ? 'down' : 'up',
        }))
    },

    /**
     * Get the least competitive specialties by applicant/spot ratio
     * Returns top 3 specialties with lowest competition
     */
    async getLeastCompetitiveSpecialties(periodId: string, limit = 3): Promise<SpecialtyAnalytics[]> {
        const result = await db
            .select({
                specialty: programs.specialty,
                avgRatio: sql<number>`ROUND(AVG(CAST(${programs.applicants} AS DECIMAL) / NULLIF(${programs.spots}, 0)), 1)`,
                totalApplicants: sql<number>`SUM(${programs.applicants})`,
                totalSpots: sql<number>`SUM(${programs.spots})`,
            })
            .from(programs)
            .where(and(
                eq(programs.periodId, periodId),
                eq(programs.isActive, true)
            ))
            .groupBy(programs.specialty)
            .orderBy(asc(sql`AVG(CAST(${programs.applicants} AS DECIMAL) / NULLIF(${programs.spots}, 0))`))
            .limit(limit)

        // For now, we'll use mock trend data since we don't have historical data
        return result.map((row, idx) => ({
            name: row.specialty,
            ratio: Number(row.avgRatio) || 0,
            change: idx === 0 ? -1.2 : idx === 1 ? 0.3 : -0.8, // Mock data
            trend: idx === 1 ? 'up' : 'down',
        }))
    },

    /**
     * Get the most competitive cities by average applicant/spot ratio
     * Returns top 3 cities with highest competition
     */
    async getMostCompetitiveCities(periodId: string, limit = 3): Promise<CityAnalytics[]> {
        const result = await db
            .select({
                city: programs.city,
                programCount: sql<number>`COUNT(*)`,
                avgRatio: sql<number>`ROUND(AVG(CAST(${programs.applicants} AS DECIMAL) / NULLIF(${programs.spots}, 0)), 1)`,
                totalApplicants: sql<number>`SUM(${programs.applicants})`,
            })
            .from(programs)
            .where(and(
                eq(programs.periodId, periodId),
                eq(programs.isActive, true)
            ))
            .groupBy(programs.city)
            .orderBy(desc(sql`AVG(CAST(${programs.applicants} AS DECIMAL) / NULLIF(${programs.spots}, 0))`))
            .limit(limit)

        return result.map(row => ({
            name: row.city,
            programs: Number(row.programCount) || 0,
            avgRatio: Number(row.avgRatio) || 0,
            applicants: Number(row.totalApplicants) || 0,
        }))
    },
}
