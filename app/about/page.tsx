"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Target,
  Eye,
  Heart,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  Shield,
  Zap
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const stats = [
  { value: "5000+", label: "Aktif Kullanıcı", icon: Users },
  { value: "%94", label: "Doğruluk Oranı", icon: Target },
  { value: "50K+", label: "Başarılı Tahmin", icon: TrendingUp },
  { value: "7/24", label: "Destek Hizmeti", icon: Shield },
]

const values = [
  {
    icon: Target,
    title: "Doğruluk",
    description: "Gelişmiş algoritmalarımızla en doğru tahminleri sunuyoruz.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Güvenilirlik",
    description: "Verileriniz şifreli ve KVKK uyumlu sistemlerimizde korunuyor.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Heart,
    title: "Öğrenci Odaklı",
    description: "Her öğrencinin hayalindeki üniversiteye ulaşması için çalışıyoruz.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Zap,
    title: "Hız ve Verimlilik",
    description: "Gerçek zamanlı analitikle anında sonuç alın.",
    gradient: "from-orange-500 to-yellow-500"
  },
]

const team = [
  {
    name: "Dr. Ahmet Yılmaz",
    role: "Kurucu & CEO",
    image: "/images/team-1.jpg",
    bio: "10+ yıllık eğitim teknolojisi deneyimi"
  },
  {
    name: "Ayşe Demir",
    role: "CTO",
    image: "/images/team-2.jpg",
    bio: "Yapay zeka ve veri bilimi uzmanı"
  },
  {
    name: "Mehmet Kaya",
    role: "Veri Analisti",
    image: "/images/team-3.jpg",
    bio: "İstatistik ve makine öğrenmesi uzmanı"
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-white to-white" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,transparent_0%,var(--background)_75%)]"
        />

        <div className="container mx-auto max-w-7xl px-6 relative">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Hakkımızda
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            >
              DUS Yolculuğunuzda
              <br />
              <span className="text-gradient">Yanınızdayız</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              DUS360, binlerce diş hekimliği öğrencisinin hayallerindeki uzmanlık programına yerleşmesine
              yardımcı olan, yapay zeka destekli akıllı tercih platformudur.
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="text-center h-full border-0 hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6 pb-6">
                    <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Misyonumuz</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Her diş hekimliği öğrencisinin, DUS yerleştirmesinde en doğru kararı
                alabilmesi için gereken araçları ve bilgiyi sağlamak. Gelişmiş teknoloji
                ve veri analitiği ile süreçleri sadeleştirip, stresi azaltmayı hedefliyoruz.
              </p>
              <ul className="space-y-3">
                {[
                  "Yapay zeka destekli tahmin sistemleri",
                  "Gerçek zamanlı veri analitiği",
                  "Kullanıcı dostu arayüz tasarımı",
                  "7/24 teknik destek hizmeti"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Vizyonumuz</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Türkiye'nin en güvenilir DUS tercih danışmanlığı platformu olmak.
                Binlerce öğrencinin geleceğini şekillendiren bu kritik süreçte,
                teknoloji ve deneyimimizle öncü olmayı sürdürmek.
              </p>
              <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Award className="w-10 h-10 text-purple-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Hedefimiz</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        2025 yılına kadar 10,000+ öğrenciye ulaşmak ve %95+ doğruluk
                        oranıyla sektörün en başarılı platformu olmak.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Değerlerimiz
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bizi farklı kılan ilkeler ve değerler
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0">
                  <CardContent className="pt-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.gradient} mb-4`}>
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/20 to-white">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ekibimiz
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              DUS360'ı mümkün kılan tutkulu insanlar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0">
                  <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
                    {/* Placeholder for team member image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-24 h-24 text-blue-300" />
                    </div>
                  </div>
                  <CardContent className="pt-6 text-center">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
              <CardContent className="py-16 px-6 md:px-12 text-center text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  DUS Yolculuğuna Hemen Başla
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  5000+ öğrencinin güvendiği platform ile hayalindeki uzmanlık programına bir adım daha yaklaş.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary" className="rounded-xl px-8">
                    <Link href="/register">
                      <span>Ücretsiz Dene</span>
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-xl px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Link href="#pricing">
                      <span>Fiyatları Gör</span>
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
