"use client"

import { useState } from "react"
import type { SimulationResult } from "@/lib/actions/simulation-actions"
import { TrendingUp, Users, Target, BarChart2 } from "lucide-react"

interface SimulationClientProps {
  results: SimulationResult[]
}

const RISK_COLORS: Record<string, string> = {
  high:   'bg-green-100 text-green-700 border-green-200',
  safe:   'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low:    'bg-red-100 text-red-700 border-red-200',
}

export function SimulationClient({ results }: SimulationClientProps) {
  const [search, setSearch] = useState("")
  const [specialty, setSpecialty] = useState("all")

  const specialties = Array.from(new Set(results.map(r => r.specialty))).sort()

  const filtered = results.filter(r => {
    const matchesSearch = search === "" ||
      r.university.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()) ||
      r.specialty.toLowerCase().includes(search.toLowerCase())
    const matchesSpecialty = specialty === "all" || r.specialty === specialty
    return matchesSearch && matchesSpecialty
  })

  const totalApplicants = results.reduce((s, r) => s + r.applicantCount, 0)
  const avgFillRate = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.fillRate, 0) / results.length)
    : 0
  const hotPrograms = results.filter(r => r.fillRate >= 80).length

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalApplicants}</p>
          <p className="text-xs text-gray-500">Toplam Başvuru</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <BarChart2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">%{avgFillRate}</p>
          <p className="text-xs text-gray-500">Ort. Doluluk</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Target className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{hotPrograms}</p>
          <p className="text-xs text-gray-500">Çok Tercih Edilen</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Üniversite, şehir veya branş ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tüm Branşlar</option>
          {specialties.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Program Yerleştirme Simülasyonu</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Mevcut başvurulara göre tahmin — {filtered.length} program
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Sonuç bulunamadı.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(r => {
              const trendDirection = r.predictedCutoff > r.estimatedCutoff ? '↑' :
                                     r.predictedCutoff < r.estimatedCutoff ? '↓' : '→'
              const fillColor = r.fillRate >= 80 ? 'bg-red-500' :
                                r.fillRate >= 50 ? 'bg-amber-500' : 'bg-green-500'

              return (
                <div key={r.programId} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{r.university}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-sm text-gray-600">{r.specialty}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{r.city}</span>
                      </div>

                      {/* Fill rate bar */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${fillColor}`}
                            style={{ width: `${Math.min(r.fillRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {r.applicantCount}/{r.spots} ({r.fillRate}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <TrendingUp className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-bold text-gray-900">
                          {(r.predictedCutoff / 100).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">{trendDirection}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Tahmin: {(r.estimatedCutoff / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
