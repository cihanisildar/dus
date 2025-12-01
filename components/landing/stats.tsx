"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, Award, Building2 } from "lucide-react"

const stats = [
  {
    label: "Aktif Kullanıcı",
    value: "5,000+",
    icon: Users,
    color: "from-blue-500 to-cyan-500"
  },
  {
    label: "Yapılan Tahmin",
    value: "1M+",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500"
  },
  {
    label: "Doğruluk Oranı",
    value: "%94",
    icon: Award,
    color: "from-green-500 to-emerald-500"
  },
  {
    label: "Üniversite",
    value: "40+",
    icon: Building2,
    color: "from-orange-500 to-red-500"
  },
]

export function Stats() {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-br bg-clip-text text-transparent from-gray-900 to-gray-600">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm lg:text-base text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
