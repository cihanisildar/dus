"use client"

import { useState, useTransition } from "react"
import type { UserPreferenceWithProgram } from "@/lib/db/queries/preferences"
import type { Program } from "@/lib/db/schema"
import {
  GripVertical,
  Trash2,
  Plus,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  Target,
} from "lucide-react"
import {
  addPreference,
  removePreference,
  reorderPreferences,
} from "@/lib/actions/preference-actions"
import { useToast } from "@/hooks/use-toast"

interface PreferencesClientProps {
  initialPreferences: UserPreferenceWithProgram[]
  availablePrograms: Program[]
  userScore: number
  maxPreferences: number
  riskDistribution: {
    safe: number
    high: number
    medium: number
    low: number
  }
}

export function PreferencesClient({
  initialPreferences,
  availablePrograms,
  userScore,
  maxPreferences,
  riskDistribution: initialRiskDistribution,
}: PreferencesClientProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCity, setFilterCity] = useState<string>("")
  const [filterSpecialty, setFilterSpecialty] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [riskDistribution, setRiskDistribution] = useState(initialRiskDistribution)
  const toast = useToast()

  const currentCount = preferences.length

  // Get unique cities and specialties
  const cities = Array.from(new Set(availablePrograms.map(p => p.city))).sort()
  const specialties = Array.from(new Set(availablePrograms.map(p => p.specialty))).sort()

  // Filter programs
  const filteredPrograms = availablePrograms.filter(program => {
    // Don't show already added programs
    if (preferences.some(p => p.programId === program.id)) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        program.university.toLowerCase().includes(query) ||
        program.specialty.toLowerCase().includes(query) ||
        program.city.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // City filter
    if (filterCity && program.city !== filterCity) return false

    // Specialty filter
    if (filterSpecialty && program.specialty !== filterSpecialty) return false

    return true
  })

  const handleAddPreference = async (programId: string) => {
    startTransition(async () => {
      const result = await addPreference(programId)
      if (result.success) {
        setPreferences([...preferences, result.data])
        // Update risk distribution
        const newDist = { ...riskDistribution }
        if (result.data.riskLevel) {
          newDist[result.data.riskLevel as keyof typeof newDist]++
        }
        setRiskDistribution(newDist)
        setShowAddModal(false)
        toast.success("Tercih eklendi")
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleRemovePreference = async (preferenceId: string) => {
    const pref = preferences.find(p => p.id === preferenceId)
    startTransition(async () => {
      const result = await removePreference(preferenceId)
      if (result.success) {
        setPreferences(preferences.filter(p => p.id !== preferenceId))
        // Update risk distribution
        if (pref?.riskLevel) {
          const newDist = { ...riskDistribution }
          newDist[pref.riskLevel as keyof typeof newDist]--
          setRiskDistribution(newDist)
        }
        toast.success("Tercih silindi")
      } else {
        toast.error(result.error)
      }
    })
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "safe": return "text-green-600 bg-green-50"
      case "high": return "text-blue-600 bg-blue-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "low": return "text-orange-600 bg-orange-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getProbabilityColor = (probability: number | null) => {
    if (!probability) return "text-gray-600"
    if (probability >= 90) return "text-green-600"
    if (probability >= 70) return "text-blue-600"
    if (probability >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const totalPreferences = riskDistribution.safe + riskDistribution.high + riskDistribution.medium + riskDistribution.low
  const strategyMessage = totalPreferences === 0
    ? "Henüz tercih eklemediniz"
    : totalPreferences < 10
      ? "Daha fazla tercih ekleyin"
      : riskDistribution.safe >= totalPreferences * 0.4
        ? "✓ Stratejiniz dengeli görünüyor"
        : riskDistribution.low >= totalPreferences * 0.5
          ? "⚠ Çok fazla riskli tercih var"
          : "Daha fazla güvenli tercih eklemelisiniz"

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Preferences List */}
        <div className="xl:col-span-2 space-y-4">
          {/* Current Preferences */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Tercihlerim ({currentCount}/{maxPreferences})
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Sürükle-bırak ile sıralama yapabilirsiniz
              </p>
            </div>

            {preferences.length === 0 ? (
              <div className="p-8 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  Henüz tercih eklemediniz
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  İlk Tercihinizi Ekleyin
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {preferences.map((pref) => (
                  <div
                    key={pref.id}
                    className="p-3 sm:p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex gap-3 flex-1 min-w-0">
                        {/* Drag Handle */}
                        <div className="flex items-center">
                          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                        </div>

                        {/* Rank */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 font-bold flex-shrink-0">
                          {pref.rank}
                        </div>

                        {/* Program Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {pref.program.university}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {pref.program.specialty} - {pref.program.city}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs">
                            <span className="text-gray-600">
                              Kontenjan: <span className="font-medium">{pref.program.spots}</span>
                            </span>
                            <span className="text-gray-600">
                              Başvuru: <span className="font-medium">{pref.program.applicants}</span>
                            </span>
                            <span className="text-gray-600">
                              Taban: <span className="font-medium">{(pref.program.estimatedCutoff / 100).toFixed(1)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Probability & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2 mt-2 sm:mt-0">
                        <div className="text-left sm:text-right">
                          <div className={`text-xl sm:text-2xl font-bold ${getProbabilityColor(pref.placementProbability)}`}>
                            {pref.placementProbability || 0}%
                          </div>
                          {pref.riskLevel && (
                            <div className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(pref.riskLevel)} inline-block mt-1`}>
                              {pref.riskLevel === "safe" && "Güvenli"}
                              {pref.riskLevel === "high" && "Yüksek"}
                              {pref.riskLevel === "medium" && "Orta"}
                              {pref.riskLevel === "low" && "Düşük"}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemovePreference(pref.id)}
                          disabled={isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Preference Button */}
          {currentCount < maxPreferences && (
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600 font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Tercih Ekle
            </button>
          )}
        </div>

        {/* Sidebar - Strategy Analysis */}
        <div className="space-y-4">
          {/* Risk Assessment */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Strateji Analizi
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Güvenli Tercihler</span>
                  <span className="text-sm font-bold text-green-600">{riskDistribution.safe}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: totalPreferences > 0 ? `${(riskDistribution.safe / totalPreferences) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Yüksek İhtimal</span>
                  <span className="text-sm font-bold text-blue-600">{riskDistribution.high}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: totalPreferences > 0 ? `${(riskDistribution.high / totalPreferences) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Orta İhtimal</span>
                  <span className="text-sm font-bold text-yellow-600">{riskDistribution.medium}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: totalPreferences > 0 ? `${(riskDistribution.medium / totalPreferences) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Düşük İhtimal</span>
                  <span className="text-sm font-bold text-red-600">{riskDistribution.low}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: totalPreferences > 0 ? `${(riskDistribution.low / totalPreferences) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">
                {strategyMessage}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Öneriler
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  Daha fazla güvenli seçenek ekleyerek riskinizi azaltabilirsiniz
                </p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  30 tercih hakkınızın tamamını kullanmanız önerilir
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Preference Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Program Seç</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Üniversite, şehir veya dal ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tüm Şehirler</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>

                  <select
                    value={filterSpecialty}
                    onChange={(e) => setFilterSpecialty(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tüm Dallar</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Programs List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {filteredPrograms.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Program bulunamadı</p>
                  </div>
                ) : (
                  filteredPrograms.map(program => (
                    <button
                      key={program.id}
                      onClick={() => handleAddPreference(program.id)}
                      disabled={isPending}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{program.university}</h3>
                          <p className="text-sm text-gray-600">{program.specialty} - {program.city}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                            <span>Kontenjan: <span className="font-medium">{program.spots}</span></span>
                            <span>Başvuru: <span className="font-medium">{program.applicants}</span></span>
                            <span>Taban: <span className="font-medium">{(program.estimatedCutoff / 100).toFixed(1)}</span></span>
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
