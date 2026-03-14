"use client"

import { useState } from "react"
import { Calculator, RefreshCw, Info } from "lucide-react"

const TB_TOTAL = 25  // Temel Bilimler total questions
const KB_TOTAL = 80  // Klinik Bilimler total questions

// ÖSYM DUS formula (approximate):
// TB Net = correct - (wrong / 3)
// KB Net = correct - (wrong / 3)
// DUS Score ≈ 0.3 * TB_standardized + 0.7 * KB_standardized
// Standardized score = (net / total_q) * 100 * scale_factor
// We use a simplified linear model matching ÖSYM's published ranges
function calculateDUSScore(
  tbCorrect: number, tbWrong: number,
  kbCorrect: number, kbWrong: number
): number {
  const tbNet = tbCorrect - tbWrong / 3
  const kbNet = kbCorrect - kbWrong / 3

  const tbStandard = (tbNet / TB_TOTAL) * 100
  const kbStandard = (kbNet / KB_TOTAL) * 100

  const rawScore = 0.3 * tbStandard + 0.7 * kbStandard

  // Scale to DUS score range (approximately 50-85)
  const dusScore = 50 + (rawScore / 100) * 35

  return Math.max(0, Math.round(dusScore * 100) / 100)
}

export function ScoreCalculator() {
  const [tb, setTb] = useState({ correct: '', wrong: '', blank: '' })
  const [kb, setKb] = useState({ correct: '', wrong: '', blank: '' })
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')

    const tbC = parseInt(tb.correct || '0')
    const tbW = parseInt(tb.wrong || '0')
    const tbB = parseInt(tb.blank || '0')
    const kbC = parseInt(kb.correct || '0')
    const kbW = parseInt(kb.wrong || '0')
    const kbB = parseInt(kb.blank || '0')

    if (tbC + tbW + tbB > TB_TOTAL) {
      setError(`Temel Bilimler toplam soru sayısı ${TB_TOTAL}'i geçemez.`)
      return
    }
    if (kbC + kbW + kbB > KB_TOTAL) {
      setError(`Klinik Bilimler toplam soru sayısı ${KB_TOTAL}'i geçemez.`)
      return
    }

    const score = calculateDUSScore(tbC, tbW, kbC, kbW)
    setResult(score)
  }

  const handleReset = () => {
    setTb({ correct: '', wrong: '', blank: '' })
    setKb({ correct: '', wrong: '', blank: '' })
    setResult(null)
    setError('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Puan Hesaplayıcı</h2>
            <p className="text-blue-100 text-sm">DUS sınav sonuç tahmini</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Info Box */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Sınav Yapısı:</span> Temel Bilimler ({TB_TOTAL} soru) +
            Klinik Bilimler ({KB_TOTAL} soru). Her yanlış ⅓ doğruyu götürür. Boşlar puana katılmaz.
          </div>
        </div>

        {/* Temel Bilimler */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">TB</span>
            Temel Bilimler
            <span className="text-sm font-normal text-gray-500">({TB_TOTAL} soru)</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Doğru</label>
              <input
                type="number"
                min="0"
                max={TB_TOTAL}
                value={tb.correct}
                onChange={e => setTb(prev => ({ ...prev, correct: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Yanlış</label>
              <input
                type="number"
                min="0"
                max={TB_TOTAL}
                value={tb.wrong}
                onChange={e => setTb(prev => ({ ...prev, wrong: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Boş</label>
              <input
                type="number"
                min="0"
                max={TB_TOTAL}
                value={tb.blank}
                onChange={e => setTb(prev => ({ ...prev, blank: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-center font-semibold text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Klinik Bilimler */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">KB</span>
            Klinik Bilimler
            <span className="text-sm font-normal text-gray-500">({KB_TOTAL} soru)</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Doğru</label>
              <input
                type="number"
                min="0"
                max={KB_TOTAL}
                value={kb.correct}
                onChange={e => setKb(prev => ({ ...prev, correct: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Yanlış</label>
              <input
                type="number"
                min="0"
                max={KB_TOTAL}
                value={kb.wrong}
                onChange={e => setKb(prev => ({ ...prev, wrong: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Boş</label>
              <input
                type="number"
                min="0"
                max={KB_TOTAL}
                value={kb.blank}
                onChange={e => setKb(prev => ({ ...prev, blank: e.target.value }))}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-center font-semibold text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Hesapla
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Sıfırla"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="mt-2 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Tahmini DUS Puanınız</p>
            <p className="text-5xl font-bold text-blue-600 mb-1">{result.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {result >= 75 ? '🏆 Mükemmel puan! Prestijli programlar için güçlü aday.' :
               result >= 70 ? '⭐ Çok iyi puan! Pek çok iyi program sizin için uygun.' :
               result >= 65 ? '👍 İyi puan! Tercihlerinizi dikkatli planlamanızı öneririz.' :
               result >= 60 ? '📚 Orta puan. Tercih stratejinizi dengeli yapın.' :
               '💪 Daha fazla çalışma gerekiyor.'}
            </p>

            {/* Net Scores */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">TB Net</p>
                <p className="text-xl font-bold text-gray-800">
                  {(parseInt(tb.correct || '0') - parseInt(tb.wrong || '0') / 3).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">/ {TB_TOTAL}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-indigo-100">
                <p className="text-xs text-gray-500 mb-1">KB Net</p>
                <p className="text-xl font-bold text-gray-800">
                  {(parseInt(kb.correct || '0') - parseInt(kb.wrong || '0') / 3).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">/ {KB_TOTAL}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
