"use client"

import { TestimonialsColumn } from "@/components/testimonials-columns-1"

const testimonials = [
  {
    text: "DUS360 sayesinde tercihlerimi çok daha bilinçli yaptım. Gerçek zamanlı veriler ve olasılık hesaplamaları gerçekten işime yaradı. İlk tercihimde yerleştim!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AyseYilmaz",
    name: "Dr. Ayşe Yılmaz",
    role: "Ortodonti Uzmanı",
  },
  {
    text: "Platform çok kullanıcı dostu. ÖSYM entegrasyonu sayesinde puanım otomatik aktarıldı ve en uygun tercihleri hemen görebildim. %94 doğruluk oranı etkileyici.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MehmetKaya",
    name: "Mehmet Kaya",
    role: "Periodontoloji Uzmanı",
  },
  {
    text: "Akıllı öneriler sayesinde düşünmediğim seçenekleri keşfettim. Risk analizi ve simülasyon özellikleri stratejimi optimize etmemde çok yardımcı oldu.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZeynepDemir",
    name: "Zeynep Demir",
    role: "Endodonti Uzmanı",
  },
  {
    text: "Geçmiş yıl verilerini analiz ederek en doğru tahminleri sunuyor. Tercih yaparken kendimi çok güvende hissettim. Herkese tavsiye ederim!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliCelik",
    name: "Ali Çelik",
    role: "Protetik Diş Tedavisi Uzmanı",
  },
  {
    text: "Mobil uygulama sayesinde her yerden tercihlerimi kontrol edebildim. Bildirimler sayesinde önemli değişikliklerden anında haberdar oldum.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=FatmaOzkan",
    name: "Fatma Özkan",
    role: "Ağız, Diş ve Çene Cerrahisi Uzmanı",
  },
  {
    text: "Rekabet takibi özelliği çok faydalı. Diğer adayların tercih eğilimlerini görmek stratejimi belirlememe yardımcı oldu. Kesinlikle değerli bir araç.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=CanYildirim",
    name: "Can Yıldırım",
    role: "Pedodonti Uzmanı",
  },
  {
    text: "Detaylı raporlar ve grafikler sayesinde durumumu net bir şekilde görebildim. Tercih stratejimi bilimsel verilere dayandırabildim.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=EsraKoc",
    name: "Esra Koç",
    role: "Ağız Hastalıkları Uzmanı",
  },
  {
    text: "7/24 destek ekibi her zaman yardımcı oldu. Sorularıma hızlı ve etkili çözümler buldular. Mükemmel bir hizmet.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=BurakOz",
    name: "Burak Öz",
    role: "Restoratif Diş Tedavisi Uzmanı",
  },
  {
    text: "Fiyat-performans açısından çok iyi. Tek seferlik ödemeyle tüm özelliklere erişmek harika. Yatırımın karşılığını fazlasıyla aldım.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=SedaAkgun",
    name: "Seda Akgün",
    role: "Cerrahi Onkoloji Uzmanı",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export function Testimonials() {
  return (
    <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter mb-4">
            Başarı Hikayeleri
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            DUS360 ile hedeflerine ulaşan diş hekimliği uzmanlarından
          </p>
        </div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            5000+ öğrenci DUS360'ı başarıyla kullandı
          </p>
        </div>
      </div>
    </section>
  )
}
