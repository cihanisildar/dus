"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    LayoutDashboard,
    CheckCircle,
    CreditCard,
    ListChecks,
    BarChart3,
    User,
    LogOut,
    GraduationCap
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const allMenuItems = [
    {
        href: "/dashboard",
        label: "Ana Sayfa",
        icon: (
            <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: null
    },
    {
        href: "/dashboard/verify",
        label: "ÖSYM Doğrulama",
        icon: (
            <CheckCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "registered"
    },
    {
        href: "/dashboard/payment",
        label: "Ödeme",
        icon: (
            <CreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "verified"
    },
    {
        href: "/dashboard/preferences",
        label: "Tercihlerim",
        icon: (
            <ListChecks className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "active"
    },
    {
        href: "/dashboard/analytics",
        label: "Analiz",
        icon: (
            <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: "active"
    },
    {
        href: "/dashboard/profile",
        label: "Profil",
        icon: (
            <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        requiredStatus: null
    },
];

const statusOrder = ["registered", "verified", "active", "expired", "suspended"];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const accountStatus = (session?.user as { accountStatus: string })?.accountStatus || "registered";

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

    return (
        <Sidebar>
            <SidebarBody className="justify-between gap-10">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <Logo />
                    <div className="mt-8 flex flex-col gap-2">
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
                    <SidebarFooter session={session} />
                </div>
            </SidebarBody>
        </Sidebar>
    );
}

export const Logo = () => {
    const { open, animate } = useSidebar();

    return (
        <Link
            href="/dashboard"
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

const SidebarFooter = ({ session }: { session: any }) => {
    const { open, animate } = useSidebar();

    return (
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <div className={cn(
                "flex gap-2 px-2 py-2",
                open ? "flex-row items-center justify-between" : "flex-col items-center justify-center"
            )}>
                <div className={cn(
                    "flex items-center gap-2",
                    open ? "min-w-0" : "flex-col"
                )}>
                    <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                            {session?.user?.name?.charAt(0).toUpperCase() || session?.user?.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                    </div>
                    <motion.div
                        className="flex flex-col overflow-hidden"
                        animate={{
                            display: animate ? (open ? "flex" : "none") : "flex",
                            opacity: animate ? (open ? 1 : 0) : 1,
                        }}
                    >
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">
                            {session?.user?.name || "User"}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {session?.user?.email}
                        </span>
                    </motion.div>
                </div>
                {open && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex-shrink-0 p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                        aria-label="Çıkış Yap"
                    >
                        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};
