import { Footer as FooterUI } from "@/components/ui/footer"
import { Twitter, Linkedin, Github, Mail } from "lucide-react"

export function Footer() {
    return (
        <FooterUI
            logo={
                <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5L35 12.5V27.5L20 35L5 27.5V12.5L20 5Z" fill="#2563eb" stroke="#1e40af" strokeWidth="2"/>
                    <circle cx="20" cy="20" r="6" fill="white"/>
                </svg>
            }
            brandName="DUS Tracker"
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
                    href: "mailto:info@dustracker.com",
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
                text: `© ${new Date().getFullYear()} DUS Tracker. Tüm hakları saklıdır.`,
                license: "Diş hekimliği uzmanlık eğitimi için tercih optimizasyonu."
            }}
        />
    )
}
