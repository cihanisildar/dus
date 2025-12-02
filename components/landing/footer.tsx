import { Footer as FooterUI } from "@/components/ui/footer"
import { Twitter, Linkedin, Github, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
    return (
        <FooterUI
            logo={
                <Image
                    src="/dentist_504010.png"
                    alt="DUS360 Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                />
            }
            brandName="DUS360"
            socialLinks={[
                {
                    icon: <Twitter className="h-4 w-4" />,
                    href: "https://twitter.com",
                    label: "Twitter"
                },
                {
                    icon: <Linkedin className="h-4 w-4" />,
                    href: "https://linkedin.com",
                    label: "LinkedIn"
                },
                {
                    icon: <Github className="h-4 w-4" />,
                    href: "https://github.com",
                    label: "GitHub"
                },
                {
                    icon: <Mail className="h-4 w-4" />,
                    href: "mailto:info@dus360.com",
                    label: "Email"
                }
            ]}
            mainLinks={[
                { href: "#how-it-works", label: "Nasıl Çalışır" },
                { href: "#features", label: "Özellikler" },
                { href: "#pricing", label: "Fiyatlandırma" },
                { href: "#", label: "İletişim" }
            ]}
            legalLinks={[
                { href: "#", label: "Gizlilik Politikası" },
                { href: "#", label: "Kullanım Koşulları" },
                { href: "#", label: "KVKK" }
            ]}
            copyright={{
                text: `© ${new Date().getFullYear()} DUS360. Tüm hakları saklıdır.`,
                license: "Diş hekimliği uzmanlık eğitimi için tercih optimizasyonu."
            }}
        />
    )
}
