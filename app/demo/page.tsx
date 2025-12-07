import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { DashboardData } from "@/lib/actions/dashboard-actions";

export default function DemoPage() {
    // Mock Dashboard Data
    const mockDashboardData: DashboardData = {
        user: {
            id: "demo-user-id",
            email: "demo@dus360.com",
            name: "Demo Kullanıcı",
            accountStatus: "active"
        },
        stats: {
            dusScore: 68.5,
            preferencesFilled: 12,
            totalPreferences: 30,
            expectedPlacement: "İstanbul Üniversitesi - Ortodonti",
            daysUntilDeadline: 5,
            riskLevel: "balanced",
            savedScenarios: 3,
            recentChanges: [
                { program: "Ege Üni. - Periodontoloji", change: "up", percentage: 15 },
                { program: "Ankara Üni. - Restoratif", change: "down", percentage: 5 },
                { program: "Marmara Üni. - Endodonti", change: "up", percentage: 8 }
            ]
        }
    };

    return <DashboardClient dashboardData={mockDashboardData} />;
}
