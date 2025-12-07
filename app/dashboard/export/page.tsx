import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    Download,
    FileText,
    FileSpreadsheet,
    CheckCircle2
} from "lucide-react";
import { preferenceQueries } from "@/lib/db/queries/preferences";
import { periodQueries } from "@/lib/db/queries/periods";
import { verificationQueries } from "@/lib/db/queries/verifications";
import ExportButton from "./export-button";

export default async function ExportPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get active period
    const activePeriod = await periodQueries.getActive();

    if (!activePeriod) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <Download className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
                            Dışa Aktar
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Tercihlerinizi ve raporlarınızı farklı formatlarda indirin
                        </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <p className="text-yellow-800">Aktif bir sınav dönemi bulunamadı.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Fetch user's preferences
    const preferences = await preferenceQueries.getByUserAndPeriod(user.id, activePeriod.id);

    // Get user's DUS score if available
    const verification = await verificationQueries.getByUserAndPeriod(user.id, activePeriod.id);
    const userScore = verification?.dusScore || 0;

    const exportOptions = [
        {
            id: "pdf-preferences",
            title: "Tercih Listem (PDF)",
            description: preferences.length > 0
                ? `${preferences.length} tercihinizi içeren detaylı liste`
                : "Henüz tercih eklenmemiş",
            icon: FileText,
            format: "PDF",
            exportType: "pdf-preferences" as const,
        },
        {
            id: "pdf-analytics",
            title: "Analiz Raporu (PDF)",
            description: preferences.length > 0
                ? "Detaylı istatistikler ve grafikler"
                : "Tercih ekleyerek rapor oluşturun",
            icon: FileText,
            format: "PDF",
            exportType: "pdf-analytics" as const,
        },
        {
            id: "excel-preferences",
            title: "Tercih Listem (Excel)",
            description: preferences.length > 0
                ? "Düzenlenebilir Excel formatında"
                : "Henüz tercih eklenmemiş",
            icon: FileSpreadsheet,
            format: "XLSX",
            exportType: "excel-preferences" as const,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <Download className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
                        Dışa Aktar
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Tercihlerinizi ve raporlarınızı farklı formatlarda indirin
                    </p>
                </div>

                {preferences.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <p className="text-blue-800">
                            Henüz tercih eklenmemiş. Dışa aktarma için önce tercihlerinizi oluşturun.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Export Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {exportOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <div
                                        key={option.id}
                                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-teal-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {option.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {option.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {option.format}
                                            </span>
                                            <ExportButton
                                                exportType={option.exportType}
                                                title={option.title}
                                                format={option.format}
                                                preferences={preferences}
                                                userScore={userScore}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-900">
                                    <p className="font-medium mb-1">İndirme İpucu</p>
                                    <p>
                                        PDF formatındaki raporlar ÖSYM'ye başvuru yaparken referans olarak kullanılabilir.
                                        Excel formatı kendi analizleriniz için uygundur.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
