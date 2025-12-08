import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Mock User
    const mockUser = {
        id: "demo-user-id",
        email: "demo@dus360.com",
        user_metadata: {
            name: "Demo Kullanıcı"
        },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString()
    } as SupabaseUser;

    const accountStatus = "active";

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile Navigation */}
            <MobileNav user={mockUser} accountStatus={accountStatus} basePath="/demo" />

            {/* Sidebar - hidden on mobile, visible on desktop */}
            <div className="hidden md:block">
                <DashboardSidebar user={mockUser} accountStatus={accountStatus} basePath="/demo" />
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden w-full pt-16 md:pt-0 md:w-auto">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
