"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    CheckCircle,
    CreditCard,
    ListChecks,
    BarChart3,
    User,
    LogOut
} from "lucide-react";

const allMenuItems = [
    {
        href: "/dashboard",
        label: "Ana Sayfa",
        icon: LayoutDashboard,
        requiredStatus: null // Always visible
    },
    {
        href: "/dashboard/verify",
        label: "ÖSYM Doğrulama",
        icon: CheckCircle,
        requiredStatus: "registered" // Shows for registered and above
    },
    {
        href: "/dashboard/payment",
        label: "Ödeme",
        icon: CreditCard,
        requiredStatus: "registered" // Shows for all registered users
    },
    {
        href: "/dashboard/preferences",
        label: "Tercihlerim",
        icon: ListChecks,
        requiredStatus: "active" // Shows only after payment
    },
    {
        href: "/dashboard/analytics",
        label: "Analiz",
        icon: BarChart3,
        requiredStatus: "active" // Shows only after payment
    },
    {
        href: "/dashboard/profile",
        label: "Profil",
        icon: User,
        requiredStatus: null // Always visible
    },
];

const statusOrder = ["registered", "verified", "active", "expired", "suspended"];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const supabase = createClient();
    // TODO: Fetch user's account status from custom users table
    const accountStatus = "registered" as string; // Default, should be fetched from DB

    // Filter menu items based on account status
    const visibleMenuItems = allMenuItems.filter((item) => {
        if (!item.requiredStatus) return true; // Always visible

        const userStatusIndex = statusOrder.indexOf(accountStatus);
        const requiredStatusIndex = statusOrder.indexOf(item.requiredStatus);

        return userStatusIndex >= requiredStatusIndex;
    });

    return (
        <aside className="w-64 border-r bg-card">
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">DUS360</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        {accountStatus === "registered" ? "Kayıt Tamamlandı" : null}
                        {accountStatus === "verified" ? "ÖSYM Doğrulandı" : null}
                        {accountStatus === "active" ? "Aktif Üyelik" : null}
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t">
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push("/login");
                            router.refresh();
                        }}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
