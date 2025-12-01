import type { Specialty } from './specialty'

export interface Hospital {
  _id: string
  _creationTime: number
  name: string
  city: string
  university?: string
  specialtyId: string
  availableSpots: number
  minScoreLastYear?: number
  isActive: boolean
}

export interface HospitalWithSpecialty extends Hospital {
  specialty: Specialty
}
