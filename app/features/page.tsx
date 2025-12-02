"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Brain,
  BarChart3,
  Target,
  Lock,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Check,
  Zap,
  Users,
  Clock,
  RefreshCw,
  Award,
  MessageSquare,
  Bell,
  Smartphone
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const mainFeatures = [
  {
    title: "Akıllı Tahminler",
    description: "Gelişmiş yapay zeka algoritmaları ile yerleştirme olasılığınızı %94 doğrulukla hesaplıyoruz.",
    icon: Brain,
    gradient: "from-blue-500 to-cyan-500",
    details: [
      "Makine öğrenmesi destekli tahmin motoru",
      "Geçmiş yılların verilerinden öğrenen sistem",
      "Sürekli güncellenen algoritmalar",
      "Kişiselleştirilmiş tahmin raporu"
    ]
  },
  {
    title: "Gerçek Zamanlı Analitik",
    description: "Rekabet seviyelerini ve puan dağılımlarını anlık takip edin, stratejinizi buna göre ayarlayın.",
    icon: BarChart3,
    gradient: "from-cyan-500 to-purple-500",
    details: [
      "Canlı veri akışı ve güncellemeler",
      "İnteraktif grafikler ve görselleştirmeler",
      "Tercih bazlı rekabet analizi",
      "Anlık bildirimler ve uyarılar"
    ]
  },
  {
    title: "Stratejik Planlama",
    description: "Farklı tercih senaryolarını simüle ederek en iyi stratejiye ulaşın.",
    icon: Target,
    gradient: "from-purple-500 to-pink-500",
    details: [
      "Sınırsız senaryo simülasyonu",
      "Risk-fayda analizi",
      "Tercih sıralama optimizasyonu",
      "\"Ne-olursa\" senaryoları"
    ]
  },
  {
    title: "ÖSYM Entegrasyonu",
    description: "ÖSYM sonuç kodunuzla doğrudan bağlanın, puanınız otomatik aktarılsın.",
    icon: Lock,
    gradient: "from-pink-500 to-rose-500",
    details: [
      "Tek tıkla ÖSYM bağlantısı",
      "Otomatik puan çekme",
      "Güvenli kimlik doğrulama",
      "Resmi verilerle uyumluluk"
    ]
  },
  {
    title: "Canlı Rekabet Takibi",
    description: "Diğer adayların tercihlerini ve puanlarını gerçek zamanlı görün.",
    icon: TrendingUp,
    gradient: "from-rose-500 to-orange-500",
    details: [
      "Anlık kontenjan doluluk oranları",
      "Tercih edilen program istatistikleri",
      "Puan aralığı dağılımları",
      "Günlük trend raporları"
    ]
  },
  {
    title: "Güvenli & KVKK Uyumlu",
    description: "Verileriniz şifreli ve korumalı. KVKK uyumlu veri güvenliği garantisi.",
    icon: ShieldCheck,
    gradient: "from-green-500 to-emerald-500",
    details: [
      "256-bit SSL şifreleme",
      "KVKK ve GDPR uyumlu",
      "Düzenli güvenlik denetimleri",
      "İki faktörlü kimlik doğrulama"
    ]
  },
]

const additionalFeatures = [
  {
    icon: Smartphone,
    title: "Mobil Uyumlu",
    description: "Her cihazdan erişim"
  },
  {
    icon: Bell,
    title: "Akıllı Bildirimler",
    description: "Önemli güncellemeler"
  },
  {
    icon: MessageSquare,
    title: "7/24 Destek",
    description: "Her zaman yanınızdayız"
  },
  {
    icon: RefreshCw,
    title: "Otomatik Güncellemeler",
    description: "Her zaman güncel veri"
  },
  {
    icon: Award,
    title: "Başarı Garantisi",
    description: "%94 doğruluk oranı"
  },
  {
    icon: Users,
    title: "5000+ Kullanıcı",
    description: "Güvenilen platform"
  },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-white" />

        <div className="container mx-auto max-w-7xl px-6 relative">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } }
            }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Özellikler
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            >
              DUS Yerleştirmede
              <br />
              <span className="text-gradient">Güçlü Araçlar</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Yerleştirme sürecinizi kolaylaştıran ve başarı şansınızı artıran gelişmiş özellikler.
              Yapay zeka destekli tahminlerden gerçek zamanlı analitiğe kadar her şey bir arada.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10">
              <Button asChild size="lg" className="rounded-xl px-8">
                <Link href="/register">
                  <span>Ücretsiz Dene</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Features - Detailed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {feature.title}
                  </h2>

                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <div className={`h-80 bg-gradient-to-br ${feature.gradient} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <feature.icon className="w-32 h-32 text-white/20" />
                      </div>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <feature.icon className="w-24 h-24 text-white" />
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Daha Fazla Özellik
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Başarınız için düşündüğümüz her detay
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accuracy Highlight Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
              <CardContent className="py-16 px-6 md:px-12 text-center text-white">
                <div className="max-w-3xl mx-auto">
                  <div className="text-7xl md:text-8xl font-bold mb-6">
                    %94
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Tahmin Doğruluğu
                  </h2>
                  <p className="text-lg md:text-xl mb-8 opacity-90">
                    5000+ öğrencinin güvendiği yapay zeka algoritmaları ile yerleştirme
                    olasılığınızı en yüksek doğrulukla hesaplıyoruz.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" variant="secondary" className="rounded-xl px-8">
                      <Link href="/register">
                        <span>Hemen Başla</span>
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-xl px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Link href="/pricing">
                        <span>Fiyatları Gör</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
