"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { PricingCard } from "@/components/pricing-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Sparkles,
  Check,
  X,
  HelpCircle,
  Zap,
  Shield,
  TrendingUp,
  Users
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const pricingFeatures = [
  {
    title: "Temel Özellikler",
    items: [
      "30 Tercih Hakkı",
      "8 Uzmanlık Alanı",
      "Gerçek Zamanlı Analitik",
      "Olasılık Hesaplamaları",
      "Rekabet Takibi",
      "ÖSYM Entegrasyonu",
    ],
  },
  {
    title: "Gelişmiş Özellikler",
    items: [
      "Akıllı Öneriler",
      "Risk Analizi",
      "Tercih Simülasyonu",
      "Geçmiş Veri Analizi",
      "Mobil Uygulama",
      "Öncelikli Destek",
    ],
  },
  {
    title: "Güvenlik & Destek",
    items: [
      "KVKK Uyumlu",
      "7/24 Destek",
      "Veri Güvenliği",
      "E-posta Bildirimleri",
    ],
  },
]

const comparison = [
  {
    feature: "Tercih Sayısı",
    free: "5 Tercih",
    pro: "30 Tercih"
  },
  {
    feature: "Akıllı Tahminler",
    free: false,
    pro: true
  },
  {
    feature: "Gerçek Zamanlı Analitik",
    free: "Temel",
    pro: "Gelişmiş"
  },
  {
    feature: "Risk Analizi",
    free: false,
    pro: true
  },
  {
    feature: "Tercih Simülasyonu",
    free: false,
    pro: true
  },
  {
    feature: "ÖSYM Entegrasyonu",
    free: false,
    pro: true
  },
  {
    feature: "Mobil Uygulama",
    free: false,
    pro: true
  },
  {
    feature: "7/24 Destek",
    free: false,
    pro: true
  },
]

const faqs = [
  {
    question: "Ödeme güvenli mi?",
    answer: "Evet, tüm ödemeler SSL sertifikası ile şifrelenmiş güvenli bağlantı üzerinden alınır. Kredi kartı bilgileriniz güvenle saklanır."
  },
  {
    question: "Para iade garantisi var mı?",
    answer: "Evet, hizmetten memnun kalmazsanız ilk 7 gün içinde tam iade garantisi sunuyoruz."
  },
  {
    question: "Abonelik mi yoksa tek seferlik ödeme mi?",
    answer: "DUS360 Pro tek seferlik ödemedir. Bir kez ödeyip DUS 2025 süreci boyunca tüm özelliklere sınırsız erişim sağlarsınız."
  },
  {
    question: "Kaç cihazdan kullanabilirim?",
    answer: "Hesabınızı dilediğiniz kadar cihazdan kullanabilirsiniz. Mobil ve masaüstü tüm platformlarda çalışır."
  },
  {
    question: "Ücretsiz deneme süresi var mı?",
    answer: "Evet, kayıt olduğunuzda 5 tercih hakkı ile platformu ücretsiz deneyebilirsiniz."
  },
  {
    question: "Ödeme yöntemleri nelerdir?",
    answer: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz."
  },
]

const benefits = [
  {
    icon: Zap,
    title: "%40 İndirim",
    description: "Erken kayıt fırsatı",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "7 Gün Garanti",
    description: "Para iade garantisi",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: TrendingUp,
    title: "%94 Başarı",
    description: "Doğruluk oranı",
    gradient: "from-blue-500 to-purple-500"
  },
  {
    icon: Users,
    title: "5000+ Kullanıcı",
    description: "Güvenilen platform",
    gradient: "from-pink-500 to-rose-500"
  },
]

export default function PricingPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/register")
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-pink-50/30 to-white" />

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
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Fiyatlandırma
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            >
              Basit ve Şeffaf
              <br />
              <span className="text-gradient">Fiyatlandırma</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Tek seferlik ödeme ile tüm özelliklere tam erişim. Gizli maliyet yok,
              abonelik yok. Sadece başarınız için ihtiyacınız olan her şey.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="text-center border-0 hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6 pb-6">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${benefit.gradient} mb-3`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-bold text-lg mb-1">{benefit.title}</div>
                    <div className="text-sm text-muted-foreground">{benefit.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Pricing Card */}
      <section className="py-12">
        <PricingCard
          title="DUS360 Pro"
          description="DUS 2025 yerleştirme süreci için ihtiyacınız olan her şey"
          price={299}
          originalPrice={499}
          features={pricingFeatures}
          buttonText="Hemen Başla"
          onButtonClick={handleGetStarted}
        />
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Paket Karşılaştırması
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ücretsiz ve Pro paket arasındaki farkları görün
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Özellik</th>
                      <th className="px-6 py-4 text-center font-semibold">Ücretsiz</th>
                      <th className="px-6 py-4 text-center font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        Pro
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-6 py-4 font-medium">{item.feature}</td>
                        <td className="px-6 py-4 text-center">
                          {typeof item.free === 'boolean' ? (
                            item.free ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-muted-foreground">{item.free}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center bg-blue-50/30">
                          {typeof item.pro === 'boolean' ? (
                            item.pro ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="font-medium">{item.pro}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-lg text-muted-foreground">
              Merak ettiklerinizin cevapları
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600">
              <CardContent className="py-16 px-6 md:px-12 text-center text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Hemen Başla ve %40 Tasarruf Et
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Erken kayıt indirimi sadece sınırlı süre için geçerli.
                  Fırsatı kaçırmadan DUS360 Pro'ya geç!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="text-left bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-sm opacity-75 mb-1">Sadece</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">₺299</span>
                      <span className="text-xl line-through opacity-60">₺499</span>
                    </div>
                  </div>
                  <Button asChild size="lg" variant="secondary" className="rounded-xl px-8 text-lg h-14">
                    <Link href="/register">
                      <span>Hemen Kayıt Ol</span>
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
