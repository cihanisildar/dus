import type { Metadata } from 'next'
import { ScoreCalculator } from '@/components/score-calculator'

export const metadata: Metadata = {
  title: 'DUS Puan Hesaplama | DUS360',
  description: 'DUS sınavı puan hesaplama aracı. Temel bilimler ve klinik bilimler sorularından DUS puanınızı hesaplayın.',
  keywords: ['DUS puan hesaplama', 'DUS sınavı', 'diş hekimliği uzmanlık sınavı', 'DUS hesaplama'],
}

export default function PuanHesaplamaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">DUS Puan Hesaplama</h1>
          <p className="text-gray-600 text-lg">
            DUS sınavındaki doğru ve yanlış sayınızı girerek tahmini puanınızı hesaplayın.
          </p>
        </div>

        <ScoreCalculator />

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          <p className="font-semibold mb-1">Önemli Uyarı</p>
          <p>
            Bu hesaplama tahminidir ve referans amaçlı kullanılmalıdır. Gerçek DUS puanınız ÖSYM&apos;nin
            resmi hesaplama yöntemi ve standardizasyon işlemine göre farklılık gösterebilir.
            Resmi sonuçlarınız için ÖSYM&apos;nin web sitesini takip edin.
          </p>
        </div>
      </div>
    </div>
  )
}
