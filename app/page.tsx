import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesDetailed } from "@/components/landing/features-detailed"
import { Features } from "@/components/landing/features"
import { Stats } from "@/components/landing/stats"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-100">
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturesDetailed />
      {/* <Stats /> */}
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  )
}
