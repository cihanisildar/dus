"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  UserCheck,
  ListChecks,
  BarChart3,
  Target,
  CheckCircle2,
  Trophy,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Users,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const steps = [
  {
    number: '01',
    title: 'Kayıt Ol & Doğrula',
    description: 'ÖSYM sonuç kodunla hesabını oluştur ve DUS puanını doğrula.',
    details: 'Sadece birkaç dakika içinde hesabınızı oluşturun. ÖSYM entegrasyonumuz sayesinde puanınız otomatik olarak sisteme aktarılır.',
    icon: UserCheck,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    number: '02',
    title: 'Tercihlerini Gir',
    description: '10 farklı tercih seçeneğinden en uygun olanları belirle.',
    details: 'Geniş üniversite ve program veritabanımızdan istediğiniz tercihleri seçin. Sistem otomatik olarak uyumluluğunu kontrol eder.',
    icon: ListChecks,
    gradient: 'from-cyan-500 to-purple-500'
  },
  {
    number: '03',
    title: 'Analitikleri İncele',
    description: 'Gerçek zamanlı verilerle yerleştirme olasılıklarını gör.',
    details: 'Her tercihiniz için detaylı analitik raporu görüntüleyin. Yerleşme olasılığınızı, rekabet seviyesini ve geçmiş yıl verilerini inceleyin.',
    icon: BarChart3,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    number: '04',
    title: 'Stratejini Optimize Et',
    description: 'Akıllı önerilerle tercih sıralamını en iyiye taşı.',
    details: 'Yapay zeka destekli önerilerimiz ile tercih listenizi optimize edin. Farklı senaryoları simüle edip en iyi stratejiyi belirleyin.',
    icon: Target,
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    number: '05',
    title: 'Güvenle Gönder',
    description: 'En doğru kararı vererek tercihlerini ÖSYM\'ye ilet.',
    details: 'Tüm analizleri inceledikten sonra güvenle tercihlerinizi yapın. Son kontroller ile hata yapma riskini minimize edin.',
    icon: CheckCircle2,
    gradient: 'from-rose-500 to-orange-500'
  },
  {
    number: '06',
    title: 'Hedefine Ulaş',
    description: 'Yerleştirme sonuçlarını takip et ve hayalindeki uzmanlığa kavuş.',
    details: 'Yerleştirme sonuçları açıklandığında sistem üzerinden takip edin. Başarı hikayenizi bizimle paylaşın!',
    icon: Trophy,
    gradient: 'from-orange-500 to-yellow-500'
  },
]

const benefits = [
  {
    icon: Clock,
    title: "Zaman Tasarrufu",
    description: "Manuel araştırma yerine otomatik analiz",
    stat: "90%"
  },
  {
    icon: Zap,
    title: "Hızlı İşlem",
    description: "Anında sonuç ve gerçek zamanlı güncelleme",
    stat: "<1dk"
  },
  {
    icon: Users,
    title: "Topluluk Desteği",
    description: "5000+ öğrenci deneyimi",
    stat: "5K+"
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Platform",
    description: "KVKK uyumlu ve şifreli veri koruması",
    stat: "%100"
  },
]

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 via-blue-50/30 to-white" />

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
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Nasıl Çalışır
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            >
              DUS Yerleştirme
              <br />
              <span className="text-gradient">6 Adımda</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Kayıt olmaktan yerleştirme sonuçlarını almaya kadar tüm süreç,
              basit ve anlaşılır adımlarla. Hayalinizdeki uzmanlık programına giden yol.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10">
              <Button asChild size="lg" className="rounded-xl px-8">
                <Link href="/register">
                  <span>Hemen Başla</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section - Detailed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-16 top-32 w-0.5 h-20 bg-gradient-to-b from-primary/30 to-transparent" />
                )}

                <div className="grid md:grid-cols-12 gap-8 items-center">
                  {/* Step Number & Icon */}
                  <div className="md:col-span-3 flex md:flex-col items-center md:items-start gap-4">
                    <div className={`p-6 rounded-3xl bg-gradient-to-br ${step.gradient} shadow-lg`}>
                      <step.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                    <div className="text-6xl md:text-7xl font-bold text-muted-foreground/10">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-9">
                    <Card className="border-0 hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl md:text-3xl font-bold">
                            {step.title}
                          </h3>
                          <Badge variant="outline" className="text-primary border-primary/30">
                            Adım {step.number}
                          </Badge>
                        </div>
                        <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.details}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/20 to-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Neden DUS360?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Geleneksel yöntemlere göre avantajlarımız
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full text-center group hover:shadow-xl transition-all duration-300 border-0">
                  <CardContent className="pt-8 pb-6">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-gradient mb-3">
                      {benefit.stat}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video/Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Platformu Keşfet
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              DUS360 arayüzü ve özellikleri hakkında genel bakış
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <Image
                  src="/images/image.png"
                  alt="DUS360 Platform Demo - Dashboard Önizlemesi"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600">
              <CardContent className="py-16 px-6 md:px-12 text-center text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Hazır mısın?
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Hemen kayıt ol ve DUS yerleştirme yolculuğuna güvenle başla.
                  İlk adımı atmak sadece 2 dakika!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary" className="rounded-xl px-8">
                    <Link href="/register">
                      <span>Ücretsiz Başla</span>
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-xl px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Link href="/features">
                      <span>Özellikleri Gör</span>
                    </Link>
                  </Button>
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
