import { createClient } from "@/lib/supabase/server";
import { getUserAccountStatus } from "@/lib/queries/user-queries";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get authenticated user (middleware already checked auth)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // User must exist here (middleware redirects if not authenticated)
    if (!user) {
        return null;
    }

    // Get user's account status from database
    const accountStatus = await getUserAccountStatus(user.id) || "registered";

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile Navigation */}
            <MobileNav user={user} accountStatus={accountStatus} />

            {/* Sidebar - hidden on mobile, visible on desktop */}
            <div className="hidden md:block">
                <DashboardSidebar user={user} accountStatus={accountStatus} />
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto w-full md:w-auto">
                {children}
            </main>
        </div>
    );
}
