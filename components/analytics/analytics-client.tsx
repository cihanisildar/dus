"use client"

import type { AnalyticsData } from "@/lib/actions/analytics-actions"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Award,
  AlertCircle,
  Activity,
  Percent,
  Calendar,
} from "lucide-react"

interface AnalyticsClientProps {
  analyticsData: AnalyticsData
}

export function AnalyticsClient({ analyticsData }: AnalyticsClientProps) {
  const {
    userScore,
    totalCandidates,
    userRank,
    percentile,
    preferenceAnalytics,
    scoreDistribution,
    expectedPlacement,
    riskDistribution,
    insights,
  } = analyticsData

  // Find user's score range
  const userScoreRange = scoreDistribution.find(dist => {
    const [min, max] = dist.range.includes('+')
      ? [75, 100]
      : dist.range.split('-').map(Number)
    const score = userScore
    return score >= min && (dist.range.includes('+') || score <= max)
  })?.range || ""

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-100">DUS Puanınız</span>
            <Target className="w-4 h-4 text-blue-200" />
          </div>
          <div className="text-3xl font-bold">{userScore.toFixed(1)}</div>
          <p className="text-xs text-blue-100 mt-1">Doğrulanmış</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-100">Sıralamanız</span>
            <Award className="w-4 h-4 text-green-200" />
          </div>
          <div className="text-3xl font-bold">{userRank}</div>
          <p className="text-xs text-green-100 mt-1">/ {totalCandidates} aday</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-100">Yüzdelik Diliminiz</span>
            <Percent className="w-4 h-4 text-purple-200" />
          </div>
          <div className="text-3xl font-bold">{percentile}%</div>
          <p className="text-xs text-purple-100 mt-1">Üst dilim</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-100">Toplam Aday</span>
            <Users className="w-4 h-4 text-orange-200" />
          </div>
          <div className="text-3xl font-bold">{totalCandidates}</div>
          <p className="text-xs text-orange-100 mt-1">Doğrulanmış kullanıcı</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Preference Analysis */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Detailed Preference Analysis */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Tercih Bazlı Analiz
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Her tercihiniz için detaylı yerleştirme analizi
              </p>
            </div>

            {preferenceAnalytics.length === 0 ? (
              <div className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Henüz tercih eklemediniz</p>
                <p className="text-sm text-gray-500">
                  Tercih eklemek için Tercihlerim sayfasına gidin
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {preferenceAnalytics.map((pref) => (
                  <div key={pref.rank} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0">
                          {pref.rank}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{pref.program}</h3>
                          <p className="text-sm text-gray-600">{pref.city}</p>
                        </div>
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          pref.probability >= 90
                            ? "text-green-600"
                            : pref.probability >= 70
                            ? "text-blue-600"
                            : pref.probability >= 40
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {pref.probability}%
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Puanınız</p>
                        <p className="text-lg font-bold text-gray-900">{pref.yourScore.toFixed(1)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Taban Puan</p>
                        <p className="text-lg font-bold text-gray-900">{pref.estimatedCutoff.toFixed(1)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Puan Farkı</p>
                        <p className={`text-lg font-bold ${pref.scoreGap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pref.scoreGap >= 0 ? '+' : ''}{pref.scoreGap}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Kontenjan</p>
                        <p className="text-lg font-bold text-gray-900">{pref.spotsAvailable}</p>
                      </div>
                    </div>

                    {/* Competition Analysis */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-blue-900 font-medium mb-1">Rekabet Analizi</p>
                          <p className="text-blue-800">
                            <span className="font-semibold">{pref.higherScoredApplicants}</span> aday daha yüksek
                            puana sahip. Toplam <span className="font-semibold">{pref.competitorCount}</span> başvuru
                            var ve <span className="font-semibold">{pref.spotsAvailable}</span> kontenjan mevcut.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Puan Dağılımı</h2>
            <p className="text-sm text-gray-600 mb-6">
              Tüm adayların puan dağılımı ve sizin konumunuz
            </p>

            {scoreDistribution.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz yeterli veri yok
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {scoreDistribution.map((dist, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{dist.range}</span>
                        <span className="text-gray-600">
                          {dist.count} aday ({dist.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            dist.range === userScoreRange ? "bg-blue-600" : "bg-gray-300"
                          }`}
                          style={{ width: `${Math.min(dist.percentage * 3, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {userScoreRange && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-900">
                      Siz <span className="font-semibold">{userScoreRange}</span> puan aralığındasınız
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-4 sm:space-y-6">
          {/* Expected Placement */}
          {expectedPlacement && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Beklenen Yerleşme</h3>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{expectedPlacement.program}</p>
              <p className="text-xs text-gray-600 mb-3">
                {expectedPlacement.rank}. Tercih - {expectedPlacement.probability}% olasılık
              </p>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {expectedPlacement.probability >= 90
                    ? "Çok yüksek olasılık"
                    : expectedPlacement.probability >= 70
                    ? "Yüksek olasılık"
                    : "Orta olasılık"}
                </span>
              </div>
            </div>
          )}

          {/* Risk Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Risk Analizi</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Güvenli</span>
                <span className="text-sm font-bold text-green-600">
                  {riskDistribution.safe} tercih
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Yüksek</span>
                <span className="text-sm font-bold text-blue-600">
                  {riskDistribution.high} tercih
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Orta</span>
                <span className="text-sm font-bold text-yellow-600">
                  {riskDistribution.medium} tercih
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Düşük</span>
                <span className="text-sm font-bold text-red-600">
                  {riskDistribution.low} tercih
                </span>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Önemli Notlar</h3>
            <div className="space-y-3 text-sm">
              {insights.hasHighProbability && (
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Tercihlerinizde yüksek yerleşme olasılığınız var
                  </p>
                </div>
              )}
              {insights.scoreAboveAverage && (
                <div className="flex gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Puanınız tercihlerinizin ortalamasının üzerinde</p>
                </div>
              )}
              {!insights.scoreAboveAverage && preferenceAnalytics.length > 0 && (
                <div className="flex gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Daha güvenli seçenekler eklemeyi düşünün
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Son güncelleme: {formatDate(insights.lastUpdate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
