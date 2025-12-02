import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://dusturkiye.com"),
  title: "DUS360 | Diş Hekimliği Uzmanlık Yerleştirme",
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
  authors: [{ name: "DUS360" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://dusturkiye.com",
    siteName: "DUS360",
    title: "DUS360 | Akıllı Yerleştirme Analizi",
    description: "DUS yerleştirme sürecinizde en doğru kararları alın.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DUS360",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DUS360",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
