"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileNavProps {
    user: SupabaseUser;
    accountStatus: "registered" | "verified" | "active";
    basePath?: string;
}

export function MobileNav({ user, accountStatus, basePath = "/dashboard" }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors touch-manipulation"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    />

                    {/* Sidebar */}
                    <div className="md:hidden fixed inset-y-0 left-0 w-[280px] max-w-[85vw] z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-50 p-2.5 bg-white dark:bg-neutral-700 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors touch-manipulation"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                        </button>

                        <DashboardSidebar
                            user={user}
                            accountStatus={accountStatus}
                            basePath={basePath}
                            isMobile={true}
                            onNavigate={() => setIsOpen(false)}
                        />
                    </div>
                </>
            )}
        </>
    );
}
