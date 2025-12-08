"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
    LayoutDashboard,
    CheckCircle,
    CreditCard,
    ListChecks,
    BarChart3,
    User,
    LogOut,
    GraduationCap,
    Settings
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const getMenuItems = (basePath: string = "/dashboard") => [
    {
        href: `${basePath}`,
        label: "Ana Sayfa",
        icon: (
            <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: null
    },
    {
        href: `${basePath}/verify`,
        label: "ÖSYM Doğrulama",
        icon: (
            <CheckCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "registered"
    },
    {
        href: `${basePath}/payment`,
        label: "Ödeme",
        icon: (
            <CreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "verified"
    },
    {
        href: `${basePath}/preferences`,
        label: "Tercihlerim",
        icon: (
            <ListChecks className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "active"
    },
    {
        href: `${basePath}/analytics`,
        label: "Analiz",
        icon: (
            <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "active"
    },
    {
        href: `${basePath}/programs`,
        label: "Program Sihirbazı",
        icon: (
            <GraduationCap className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "active"
    },
    {
        href: `${basePath}/scenarios`,
        label: "Senaryolarım",
        icon: (
            <ListChecks className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "active"
    },
    {
        href: `${basePath}/market`,
        label: "Piyasa Analizi",
        icon: (
            <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "active"
    },
    {
        href: `${basePath}/export`,
        label: "Raporlar",
        icon: (
            <CheckCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "active"
    },
    {
        href: `${basePath}/settings`,
        label: "Ayarlar",
        icon: (
            <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: null
    },
    {
        href: `${basePath}/profile`,
        label: "Profil",
        icon: (
            <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: null
    },
];

const statusOrder = ["registered", "verified", "active", "expired", "suspended"];

interface DashboardSidebarProps {
    user: SupabaseUser;
    accountStatus: "registered" | "verified" | "active";
    basePath?: string;
    isMobile?: boolean;
    onNavigate?: () => void;
}

export function DashboardSidebar({ user, accountStatus, basePath = "/dashboard", isMobile = false, onNavigate }: DashboardSidebarProps) {
    const pathname = usePathname();
    const allMenuItems = getMenuItems(basePath);

    // Filter menu items based on account status
    const visibleMenuItems = allMenuItems.filter((item) => {
        if (!item.requiredStatus) return true;

        const userStatusIndex = statusOrder.indexOf(accountStatus);
        const requiredStatusIndex = statusOrder.indexOf(item.requiredStatus);

        return userStatusIndex >= requiredStatusIndex;
    });

    const getStatusText = () => {
        if (accountStatus === "registered") return "Kayıt Tamamlandı";
        if (accountStatus === "verified") return "ÖSYM Doğrulandı";
        if (accountStatus === "active") return "Aktif Üyelik";
        return "";
    };

    const links = visibleMenuItems;

    // Mobile version - render content directly without Sidebar wrapper
    if (isMobile) {
        return (
            <div className="h-full flex flex-col bg-neutral-100 dark:bg-neutral-800 px-4 py-4">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {/* Simple logo without sidebar context */}
                    <Link
                        href="/"
                        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
                    >
                        <Image
                            src="/dentist_504010.png"
                            alt="DUS360 Logo"
                            width={32}
                            height={32}
                            className="rounded-lg flex-shrink-0"
                        />
                        <span className="font-medium text-black dark:text-white whitespace-pre">
                            DUS360
                        </span>
                    </Link>

                    <div className="mt-8 flex flex-col gap-2">
                        {links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                onClick={() => onNavigate?.()}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                                    pathname === link.href
                                        ? "bg-neutral-200 dark:bg-neutral-700"
                                        : "hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                )}
                            >
                                {link.icon}
                                <span className="text-neutral-700 dark:text-neutral-200 text-sm">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <MobileSidebarFooter user={user} />
                </div>
            </div>
        );
    }

    // Desktop version - use Sidebar wrapper
    return (
        <Sidebar>
            <SidebarBody className="justify-between gap-10">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <Logo basePath={basePath} />

                    <div className="mt-4 flex flex-col gap-2">
                        {links.map((link, idx) => (
                            <SidebarLink
                                key={idx}
                                link={link}
                                className={cn(
                                    "px-3",
                                    pathname === link.href
                                        ? "bg-neutral-200 dark:bg-neutral-700 rounded-md"
                                        : ""
                                )}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <SidebarFooter user={user} />
                </div>
            </SidebarBody>
        </Sidebar>
    );
}

export const Logo = ({ basePath = "/dashboard" }: { basePath?: string }) => {
    const { open, animate } = useSidebar();

    return (
        <Link
            href="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <Image
                src="/dentist_504010.png"
                alt="DUS360 Logo"
                width={32}
                height={32}
                className="rounded-lg flex-shrink-0"
            />
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                DUS360
            </motion.span>
        </Link>
    );
};

const SidebarFooter = ({ user }: { user: SupabaseUser }) => {
    const { open, animate } = useSidebar();
    const router = useRouter();
    const supabase = createClient();

    return (
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <div className={cn(
                "flex items-center px-2 py-2",
                open ? "gap-2 justify-between" : "justify-center"
            )}>
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                        {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                </div>
                {open && (
                    <>
                        <motion.div
                            className="flex flex-col overflow-hidden min-w-0 flex-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">
                                {user?.user_metadata?.name || "User"}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                {user?.email}
                            </span>
                        </motion.div>
                        <motion.button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push("/login");
                                router.refresh();
                            }}
                            className="flex-shrink-0 p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                            aria-label="Çıkış Yap"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
};

// Mobile version without sidebar context
const MobileSidebarFooter = ({ user }: { user: SupabaseUser }) => {
    const router = useRouter();
    const supabase = createClient();

    return (
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <div className="flex items-center gap-2 justify-between px-2 py-2">
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                        {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                </div>
                <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">
                        {user?.user_metadata?.name || "User"}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {user?.email}
                    </span>
                </div>
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        router.push("/login");
                        router.refresh();
                    }}
                    className="flex-shrink-0 p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                    aria-label="Çıkış Yap"
                >
                    <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

const AccountStatusBadge = ({ accountStatus }: { accountStatus: "registered" | "verified" | "active" }) => {
    const { open, animate } = useSidebar();

    const getStatusText = () => {
        if (accountStatus === "registered") return "Kayıt Tamamlandı";
        if (accountStatus === "verified") return "ÖSYM Doğrulandı";
        if (accountStatus === "active") return "Aktif Üyelik";
        return "";
    };

    return (
        <motion.div
            className="mt-4 px-3"
            animate={{
                display: animate ? (open ? "block" : "none") : "block",
                opacity: animate ? (open ? 1 : 0) : 1,
            }}
        >
            <div className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium text-center whitespace-nowrap overflow-hidden",
                accountStatus === "active" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                accountStatus === "verified" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                accountStatus === "registered" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            )}>
                {getStatusText()}
            </div>
        </motion.div>
    );
};
