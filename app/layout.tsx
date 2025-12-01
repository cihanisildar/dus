import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import CursorVibration from "@/components/cursor-vibration";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DUS Placement Tracker | Diş Hekimliği Uzmanlık Yerleştirme",
  description:
    "DUS sınavı için akıllı yerleştirme tahminleri, gerçek zamanlı analitik ve stratejik içgörüler. Geleceğinizi veriye dayalı kararlarla şekillendirin.",
  keywords: [
    "DUS",
    "diş hekimliği",
    "uzmanlık",
    "yerleştirme",
    "sınav",
    "ÖSYM",
    "ortodonti",
    "periodontoloji",
    "endodonti",
  ],
  authors: [{ name: "DUS Tracker" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://dusturkiye.com",
    siteName: "DUS Placement Tracker",
    title: "DUS Placement Tracker | Akıllı Yerleştirme Analizi",
    description: "DUS yerleştirme sürecinizde en doğru kararları alın.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DUS Placement Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DUS Placement Tracker",
    description: "Geleceğinizi veriye dayalı kararlarla şekillendirin.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${poppins.className} antialiased`}
      >
        <CursorVibration />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
