export interface Specialty {
  _id: string
  _creationTime: number
  name: string
  description: string
  totalSpots: number
  averageCompetition: number
  difficulty: 'low' | 'medium' | 'high'
}
