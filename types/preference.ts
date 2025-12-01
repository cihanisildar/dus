import type { Hospital } from './hospital'
import type { Specialty } from './specialty'

export interface Preference {
  _id: string
  _creationTime: number
  userId: string
  hospitalId: string
  rank: number
  probability?: number
  riskLevel?: 'safe' | 'moderate' | 'risky' | 'very-risky'
  createdAt: number
  updatedAt: number
}

export interface PreferenceWithDetails extends Preference {
  hospital: Hospital
  specialty: Specialty
}
