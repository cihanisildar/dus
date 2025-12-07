"use client"

import { useState, useTransition } from "react"
import type { Scenario } from "@/lib/db/schema"
import {
  Sparkles,
  Plus,
  Copy,
  Trash2,
  Play,
  BarChart3,
  Target,
  TrendingUp,
  X,
} from "lucide-react"
import {
  createScenarioFromPreferences,
  deleteScenario,
  applyScenario,
  duplicateScenario,
} from "@/lib/actions/scenario-actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ScenariosClientProps {
  scenarios: Scenario[]
  hasPreferences: boolean
}

export function ScenariosClient({ scenarios: initialScenarios, hasPreferences }: ScenariosClientProps) {
  const [scenarios, setScenarios] = useState(initialScenarios)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newScenarioName, setNewScenarioName] = useState("")
  const [newScenarioDescription, setNewScenarioDescription] = useState("")
  const [isPending, startTransition] = useTransition()
  const toast = useToast()
  const router = useRouter()

  const handleCreateScenario = async () => {
    if (!newScenarioName.trim()) {
      toast.error("Senaryo adı gereklidir")
      return
    }

    startTransition(async () => {
      const result = await createScenarioFromPreferences(
        newScenarioName,
        newScenarioDescription || undefined
      )

      if (result.success) {
        setScenarios([result.data, ...scenarios])
        setShowCreateModal(false)
        setNewScenarioName("")
        setNewScenarioDescription("")
        toast.success("Senaryo oluşturuldu")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleDeleteScenario = async (scenarioId: string) => {
    if (!confirm("Bu senaryoyu silmek istediğinizden emin misiniz?")) {
      return
    }

    startTransition(async () => {
      const result = await deleteScenario(scenarioId)

      if (result.success) {
        setScenarios(scenarios.filter(s => s.id !== scenarioId))
        toast.success("Senaryo silindi")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleApplyScenario = async (scenarioId: string) => {
    if (!confirm("Mevcut tercihleriniz bu senaryoyla değiştirilecek. Emin misiniz?")) {
      return
    }

    startTransition(async () => {
      const result = await applyScenario(scenarioId)

      if (result.success) {
        toast.success("Senaryo uygulandı! Tercihleriniz güncellendi.")
        router.push("/dashboard/preferences")
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleDuplicateScenario = async (scenarioId: string) => {
    startTransition(async () => {
      const result = await duplicateScenario(scenarioId)

      if (result.success) {
        setScenarios([result.data, ...scenarios])
        toast.success("Senaryo kopyalandı")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Bugün"
    if (diffDays === 1) return "Dün"
    if (diffDays < 7) return `${diffDays} gün önce`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
    return `${Math.floor(diffDays / 30)} ay önce`
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Saved Scenarios */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Kayıtlı Senaryolar ({scenarios.length})
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!hasPreferences || isPending}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Yeni Senaryo
            </button>
          </div>

          {!hasPreferences && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-yellow-800">
                Senaryo oluşturmak için önce tercih eklemelisiniz.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {scenarios.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Henüz senaryo oluşturmadınız</p>
                <p className="text-sm text-gray-500">
                  Farklı tercih stratejilerini test etmek için senaryo oluşturun
                </p>
              </div>
            ) : (
              scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {scenario.name}
                      </h3>
                      {scenario.description && (
                        <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span>{scenario.preferenceCount} tercih</span>
                        <span>•</span>
                        <span>Oluşturulma: {formatDate(scenario.createdAt)}</span>
                        <span>•</span>
                        <span>Güncelleme: {formatDate(scenario.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleDuplicateScenario(scenario.id)}
                        disabled={isPending}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Kopyala"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteScenario(scenario.id)}
                        disabled={isPending}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expected Result */}
                  {scenario.expectedPlacement && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Beklenen Yerleşme</span>
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {scenario.expectedPlacement}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-purple-600">
                          {scenario.expectedProbability || 0}%
                        </div>
                        <span className="text-sm text-gray-600">olasılık</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApplyScenario(scenario.id)}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      <Play className="w-4 h-4" />
                      Senaryoyu Uygula
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              İpuçları
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>En az 3 farklı strateji oluşturun</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Dengeli, agresif ve güvenli stratejileri test edin</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Senaryolarınızı düzenli olarak güncelleyin</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>En iyi sonucu veren senaryoyu tercihlerinize uygulayın</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Yeni Senaryo Oluştur</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senaryo Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="Örn: Dengeli Strateji"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  placeholder="Senaryo hakkında notlar ekleyin..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Mevcut tercih listeniz bu senaryoya kaydedilecek. Daha sonra farklı tercihlerle
                  yeni senaryolar oluşturabilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreateScenario}
                disabled={isPending || !newScenarioName.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
