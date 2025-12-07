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
                className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="md:hidden fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>

                        <DashboardSidebar user={user} accountStatus={accountStatus} basePath={basePath} />
                    </div>
                </>
            )}
        </>
    );
}
