"use client"

import { PricingCard } from "@/components/pricing-card"

export function Pricing() {
  const pricingFeatures = [
    {
      title: "Temel Özellikler",
      items: [
        "10 Tercih Hakkı",
        "3 Uzmanlık Alanı",
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

  const handleGetStarted = () => {
    // Navigate to register page
    window.location.href = "/register"
  }

  return (
    <section id="pricing" className="w-full bg-white">
      <div className="container mx-auto px-6 pt-20 pb-12 lg:pt-32 lg:pb-16 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter mb-4">
            Basit ve Şeffaf Fiyatlandırma
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tek seferlik ödeme ile tüm özelliklere tam erişim. Gizli maliyet yok.
          </p>
        </div>

        <PricingCard
          title="DUS Tracker Pro"
          description="DUS 2025 yerleştirme süreci için ihtiyacınız olan her şey"
          price={299}
          originalPrice={499}
          features={pricingFeatures}
          buttonText="Hemen Başla"
          onButtonClick={handleGetStarted}
        />
      </div>
    </section>
  )
}
