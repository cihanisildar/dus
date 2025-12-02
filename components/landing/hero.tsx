"use client"

import { Button } from "@/components/ui/button"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export function Hero() {
  return (
    <section className="overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image
            src="/images/Gemini_Generated_Image_jhv79pjhv79pjhv7.png"
            alt="DUS360 Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white" />
        </div>
      </div>

      {/* Background Effects */}
      <div
        aria-hidden
        className="z-[2] absolute inset-0 pointer-events-none isolate opacity-30 contain-strict hidden lg:block"
      >
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      <div className="relative pt-24 md:pt-36">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
        />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
            <AnimatedGroup variants={transitionVariants}>
              {/* Announcement Badge */}
              <Link
                href="/register"
                className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border border-white/10 p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
              >
                <span className="text-foreground text-sm">
                  DUS 2025 için Akıllı Tahminler Hazır
                </span>
                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />

                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Main Heading */}
              <h1 className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl font-bold">
                DUS Yerleştirmede <br className="hidden md:block" />
                Akıllı Çözümler
              </h1>

              {/* Description */}
              <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                Gelişmiş algoritmalar ve gerçek zamanlı verilerle DUS tercihinizi optimize edin.
                5000+ diş hekimliği öğrencisinin güvendiği platform.
              </p>
            </AnimatedGroup>

            {/* CTA Buttons */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
            >
              <div className="bg-foreground/10 rounded-[14px] border border-white/10 p-0.5">
                <Button asChild size="lg" className="rounded-xl px-5 text-base">
                  <Link href="/register">
                    <span className="text-nowrap">Hemen Başla</span>
                  </Link>
                </Button>
              </div>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-10.5 rounded-xl px-5"
              >
                <Link href="#how-it-works">
                  <span className="text-nowrap">Nasıl Çalışır?</span>
                </Link>
              </Button>
            </AnimatedGroup>
          </div>
        </div>

        {/* Dashboard Preview Image */}
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
            <div
              aria-hidden
              className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
            />
            <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-zinc-950/15 ring-1 p-4">
              {/* Dashboard Preview */}
              <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <Image
                  src="/images/image.png"
                  alt="DUS360 Dashboard Preview"
                  fill
                  className="object-contain rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  )
}
