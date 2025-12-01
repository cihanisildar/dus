'use client'

import { motion } from 'framer-motion'
import { UserCheck, ListChecks, BarChart3, Target, CheckCircle2, Trophy } from 'lucide-react'
import { Card } from '@/components/ui/card'

const steps = [
  {
    number: '01',
    title: 'Kayıt Ol & Doğrula',
    description: 'ÖSYM sonuç kodunla hesabını oluştur ve DUS puanını doğrula.',
    icon: UserCheck,
  },
  {
    number: '02',
    title: 'Tercihlerini Gir',
    description: '10 farklı tercih seçeneğinden en uygun olanları belirle.',
    icon: ListChecks,
  },
  {
    number: '03',
    title: 'Analitikleri İncele',
    description: 'Gerçek zamanlı verilerle yerleştirme olasılıklarını gör.',
    icon: BarChart3,
  },
  {
    number: '04',
    title: 'Stratejini Optimize Et',
    description: 'Akıllı önerilerle tercih sıralamını en iyiye taşı.',
    icon: Target,
  },
  {
    number: '05',
    title: 'Güvenle Gönder',
    description: 'En doğru kararı vererek tercihlerini ÖSYM\'ye ilet.',
    icon: CheckCircle2,
  },
  {
    number: '06',
    title: 'Hedefine Ulaş',
    description: 'Yerleştirme sonuçlarını takip et ve hayalindeki uzmanlığa kavuş.',
    icon: Trophy,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-20 lg:py-32 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            6 basit adımda DUS yerleştirme sürecinizi optimize edin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 h-full transition-all hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-primary mb-1">
                        Adım {step.number}
                      </div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
