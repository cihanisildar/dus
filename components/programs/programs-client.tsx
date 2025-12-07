"use client"

import { useState, useMemo, useTransition } from "react"
import type { Program } from "@/lib/db/schema"
import {
  Search,
  MapPin,
  Building2,
  TrendingUp,
  TrendingDown,
  Plus,
  Star,
  BookmarkPlus,
  ChevronDown,
} from "lucide-react"
import { addPreference } from "@/lib/actions/preference-actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ProgramsClientProps {
  programs: Program[]
  userScore: number
  cities: string[]
  specialties: string[]
  userPreferenceIds: string[]
}

type SortOption = "competition-asc" | "cutoff-asc" | "spots-desc" | "city-az"

export function ProgramsClient({
  programs,
  userScore,
  cities,
  specialties,
  userPreferenceIds,
}: ProgramsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("competition-asc")
  const [isPending, startTransition] = useTransition()
  const toast = useToast()
  const router = useRouter()

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    let filtered = programs.filter(program => {
      // Already added to preferences
      if (userPreferenceIds.includes(program.id)) return false

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          program.university.toLowerCase().includes(query) ||
          program.city.toLowerCase().includes(query) ||
          program.specialty.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // City filter
      if (selectedCity && selectedCity !== "Tümü") {
        if (program.city !== selectedCity) return false
      }

      // Specialty filter
      if (selectedSpecialty && selectedSpecialty !== "Tümü") {
        if (program.specialty !== selectedSpecialty) return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      const aRatio = a.spots > 0 ? a.applicants / a.spots : 0
      const bRatio = b.spots > 0 ? b.applicants / b.spots : 0

      switch (sortBy) {
        case "competition-asc":
          return aRatio - bRatio
        case "cutoff-asc":
          return a.estimatedCutoff - b.estimatedCutoff
        case "spots-desc":
          return b.spots - a.spots
        case "city-az":
          return a.city.localeCompare(b.city, 'tr')
        default:
          return 0
      }
    })

    return filtered
  }, [programs, searchQuery, selectedCity, selectedSpecialty, sortBy, userPreferenceIds])

  const handleAddPreference = async (programId: string) => {
    startTransition(async () => {
      const result = await addPreference(programId)
      if (result.success) {
        toast.success("Program tercihlerinize eklendi")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const calculateTrend = (program: Program): { trend: "up" | "down" | "neutral"; percentage: number } => {
    if (!program.historicalCutoff) {
      return { trend: "neutral", percentage: 0 }
    }

    const diff = program.estimatedCutoff - program.historicalCutoff
    const percentage = Math.abs((diff / program.historicalCutoff) * 100)

    return {
      trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
      percentage: Math.round(percentage * 10) / 10,
    }
  }

  const isPopular = (program: Program): boolean => {
    const ratio = program.spots > 0 ? program.applicants / program.spots : 0
    return ratio >= 10
  }

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Üniversite veya Şehir Ara
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Üniversite veya şehir adı girin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uzmanlık Dalı
            </label>
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tümü</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şehir
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tümü</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Sırala:</span>
          <button
            onClick={() => setSortBy("competition-asc")}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
              sortBy === "competition-asc"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Rekabet (Az-Çok)
          </button>
          <button
            onClick={() => setSortBy("cutoff-asc")}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
              sortBy === "cutoff-asc"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Taban Puan (Düşük-Yüksek)
          </button>
          <button
            onClick={() => setSortBy("spots-desc")}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
              sortBy === "spots-desc"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Kontenjan (Çok-Az)
          </button>
          <button
            onClick={() => setSortBy("city-az")}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
              sortBy === "city-az"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Şehir (A-Z)
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredPrograms.length}</span> program bulundu
        </p>
        <div className="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200">
          Puanınız: <span className="font-bold text-blue-600">{userScore.toFixed(1)}</span>
        </div>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Hiçbir program bulunamadı</p>
            <p className="text-sm text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin</p>
          </div>
        ) : (
          filteredPrograms.map((program) => {
            const scoreAboveCutoff = userScore * 100 >= program.estimatedCutoff
            const scoreDifference = ((userScore * 100 - program.estimatedCutoff) / 100).toFixed(1)
            const trend = calculateTrend(program)
            const popular = isPopular(program)
            const competitionRatio = program.spots > 0 ? (program.applicants / program.spots).toFixed(1) : "0"

            return (
              <div
                key={program.id}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col gap-4">
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {program.university}
                      </h3>
                      {popular && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                          <Star className="w-3 h-3" />
                          Popüler
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {program.specialty}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {program.city}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-600 mb-0.5">Kontenjan</p>
                        <p className="text-lg font-bold text-gray-900">{program.spots}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-600 mb-0.5">Başvuru</p>
                        <p className="text-lg font-bold text-gray-900">{program.applicants}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-600 mb-0.5">Rekabet</p>
                        <p className="text-lg font-bold text-orange-600">{competitionRatio}x</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-600 mb-0.5">Taban Puan</p>
                        <p className="text-lg font-bold text-gray-900">
                          {(program.estimatedCutoff / 100).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom - Score Analysis & Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-3 border-t border-gray-100">
                    {/* Score Status */}
                    <div
                      className={`flex-1 text-center p-3 rounded-lg ${
                        scoreAboveCutoff
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: scoreAboveCutoff ? "#16a34a" : "#dc2626" }}
                      >
                        {scoreAboveCutoff ? "Puanınız Üzerinde" : "Puanınız Altında"}
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-bold ${
                          scoreAboveCutoff ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {scoreAboveCutoff ? "+" : ""}
                        {scoreDifference}
                      </p>
                    </div>

                    {/* Trend */}
                    {trend.trend !== "neutral" && (
                      <div className="flex items-center justify-center gap-1 text-sm px-4 py-3 bg-gray-50 rounded-lg">
                        {trend.trend === "up" ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="text-red-600 font-medium">+{trend.percentage}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">-{trend.percentage}%</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 sm:w-auto">
                      <button
                        onClick={() => handleAddPreference(program.id)}
                        disabled={isPending}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        Ekle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
