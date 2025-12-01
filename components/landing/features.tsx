"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useInView } from "framer-motion"
import { BarChart3, Brain, Target, ShieldCheck, Lock, TrendingUp, Lightbulb, Smartphone } from "lucide-react"
import { useRef } from "react"

const features = [
  {
    title: "Akıllı Tahminler",
    description: "Gelişmiş algoritmalarla yerleştirme olasılığını %94 doğrulukla hesapla.",
    icon: Brain,
    gradient: "from-blue-500 to-cyan-500",
    className: "md:col-span-2 md:row-span-2",
    badge: "Yapay Zeka",
  },
  {
    title: "Gerçek Zamanlı Analitik",
    description: "Rekabet seviyelerini ve puan dağılımlarını anlık takip et.",
    icon: BarChart3,
    gradient: "from-cyan-500 to-purple-500",
    className: "md:col-span-1 md:row-span-1",
    badge: null,
  },
  {
    title: "Stratejik Planlama",
    description: "Farklı tercih senaryolarını simüle ederek şansını maksimize et.",
    icon: Target,
    gradient: "from-purple-500 to-pink-500",
    className: "md:col-span-1 md:row-span-1",
    badge: null,
  },
  {
    title: "ÖSYM Entegrasyonu",
    description: "ÖSYM sonuç kodunla doğrudan bağlan, puanın otomatik aktarılsın.",
    icon: Lock,
    gradient: "from-pink-500 to-rose-500",
    className: "md:col-span-1 md:row-span-1",
    badge: "Otomatik",
  },
  {
    title: "Canlı Rekabet Takibi",
    description: "Diğer adayların tercihlerini ve puanlarını gerçek zamanlı gör.",
    icon: TrendingUp,
    gradient: "from-rose-500 to-orange-500",
    className: "md:col-span-1 md:row-span-1",
    badge: "Canlı",
  },
  {
    title: "Güvenli & KVKK Uyumlu",
    description: "Verilerimiz şifreli ve korumalı. KVKK uyumlu veri güvenliği garantisi.",
    icon: ShieldCheck,
    gradient: "from-green-500 to-emerald-500",
    className: "md:col-span-1 md:row-span-1",
    badge: "KVKK",
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="relative py-20 sm:py-32 px-4 overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/20 to-white" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
            Neden <span className="text-gradient">DUS Tracker</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            DUS yerleştirme sürecini güvenle yönetmek için ihtiyacın olan her şey
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-fr"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              className={feature.className}
            >
              <Card className="h-full group relative overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.gradient}`}>
                      <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    {feature.badge && (
                      <Badge variant="outline" className="border-primary/30 text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4 text-lg md:text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
