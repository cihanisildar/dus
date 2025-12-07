"use server"

import { createClient } from "@/lib/supabase/server";
import { programQueries } from "@/lib/db/queries/programs";
import { periodQueries } from "@/lib/db/queries/periods";
import type { Program } from "@/lib/db/schema";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Get all programs for active period
 */
export async function getPrograms(): Promise<ActionResult<Program[]>> {
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

    const programs = await programQueries.getByPeriod(activePeriod.id)
    return { success: true, data: programs }
  } catch (error) {
    console.error("Error fetching programs:", error)
    return { success: false, error: "Failed to fetch programs" }
  }
}

/**
 * Search programs with filters
 */
export async function searchPrograms(filters: {
  city?: string
  specialty?: string
  university?: string
}): Promise<ActionResult<Program[]>> {
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

    const programs = await programQueries.search({
      periodId: activePeriod.id,
      ...filters,
    })

    return { success: true, data: programs }
  } catch (error) {
    console.error("Error searching programs:", error)
    return { success: false, error: "Failed to search programs" }
  }
}

/**
 * Get available cities
 */
export async function getCities(): Promise<ActionResult<string[]>> {
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

    const cities = await programQueries.getCities(activePeriod.id)
    return { success: true, data: cities }
  } catch (error) {
    console.error("Error fetching cities:", error)
    return { success: false, error: "Failed to fetch cities" }
  }
}

/**
 * Get available specialties
 */
export async function getSpecialties(): Promise<ActionResult<string[]>> {
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

    const specialties = await programQueries.getSpecialties(activePeriod.id)
    return { success: true, data: specialties }
  } catch (error) {
    console.error("Error fetching specialties:", error)
    return { success: false, error: "Failed to fetch specialties" }
  }
}
