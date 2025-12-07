import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/actions/dashboard-actions";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ payment?: string }>;
}) {
    // Get authenticated user (middleware already checked auth)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // User must exist here (middleware redirects if not)
    if (!user) {
        return null;
    }

    // Fetch dashboard data via action (auto-provisions user if needed)
    const dashboardData = await getDashboardData(user);

    // Handle error state
    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-900 text-lg font-semibold mb-2">Bir hata oluştu</p>
                    <p className="text-gray-600">Lütfen daha sonra tekrar deneyin.</p>
                </div>
            </div>
        );
    }

    // Await searchParams (Next.js 15+)
    const params = await searchParams;

    // Render dashboard with payment success message if present
    return (
        <>
            {params.payment === 'success' && (
                <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-green-900">Ödeme başarılı!</p>
                            <p className="text-sm text-green-700">Premium hesabınız aktif edildi.</p>
                        </div>
                    </div>
                </div>
            )}
            <DashboardClient dashboardData={dashboardData} />
        </>
    );
}
