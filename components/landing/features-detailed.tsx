import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FeaturesDetailed() {
  return (
    <div className="w-full py-20 lg:py-40 bg-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid rounded-2xl p-8 grid-cols-1 gap-8 items-center lg:grid-cols-2 bg-white shadow-sm">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="outline">Platform</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
                  ÖSYM Algoritması ile %94 Doğruluk
                </h2>
                <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                  Resmi ÖSYM Merkezi Yerleştirme Sistemi algoritmasını kullanarak en doğru tahminleri sunuyoruz.
                </p>
              </div>
            </div>
            <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Gerçek Zamanlı Veriler</p>
                  <p className="text-muted-foreground text-sm">
                    Diğer adayların tercihlerini anlık takip edin, rekabeti görün.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Akıllı Öneriler</p>
                  <p className="text-muted-foreground text-sm">
                    Puanınıza göre en uygun tercihleri keşfedin, stratejinizi optimize edin.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Güvenli ve Hızlı</p>
                  <p className="text-muted-foreground text-sm">
                    KVKK uyumlu veri güvenliği ile hızlı ve güvenilir hizmet.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-2xl aspect-square relative overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
              style={{ backgroundImage: 'url(/images/Gemini_Generated_Image_owmf0rowmf0rowmf.png)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-8 relative z-10">
                <div className="text-6xl font-bold text-gradient">
                  %94
                </div>
                <div className="text-lg text-muted-foreground">
                  Tahmin Doğruluğu
                </div>
                <div className="text-sm text-muted-foreground/70">
                  5000+ öğrenci güveniyor
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
