"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Program {
    id: string;
    city: string;
    university: string;
    specialty: string;
    spots: number;
    applicants: number;
    estimatedCutoff: number;
}

interface UserPreference {
    id: string;
    rank: number;
    placementProbability: number | null;
    riskLevel: string | null;
    program: Program;
}

interface ExportButtonProps {
    exportType: "pdf-preferences" | "pdf-analytics" | "excel-preferences";
    title: string;
    format: string;
    preferences: UserPreference[];
    disabled?: boolean;
    userScore?: number;
}

export default function ExportButton({
    exportType,
    title,
    format,
    preferences,
    disabled = false,
    userScore = 0,
}: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (disabled || preferences.length === 0) return;

        setIsExporting(true);
        try {
            switch (exportType) {
                case "pdf-preferences":
                    exportPreferencesPDF();
                    break;
                case "pdf-analytics":
                    exportAnalyticsPDF();
                    break;
                case "excel-preferences":
                    exportPreferencesExcel();
                    break;
            }
        } catch (error) {
            console.error("Export error:", error);
            alert("Dışa aktarma sırasında bir hata oluştu.");
        } finally {
            setIsExporting(false);
        }
    };

    const exportPreferencesPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Tercih Listem", 14, 20);

        // Date
        doc.setFontSize(10);
        doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString("tr-TR")}`, 14, 28);
        doc.text(`Toplam Tercih: ${preferences.length}`, 14, 34);

        // Table
        const tableData = preferences.map((pref) => [
            pref.rank.toString(),
            pref.program.city,
            pref.program.university,
            pref.program.specialty,
            pref.program.spots.toString(),
            (pref.program.estimatedCutoff / 100).toFixed(2),
            pref.placementProbability ? `%${pref.placementProbability}` : "-",
            pref.riskLevel || "-",
        ]);

        autoTable(doc, {
            head: [["Sıra", "Şehir", "Üniversite", "Dal", "Kontenjan", "Taban Puan", "Yerleşme İhtimali", "Risk"]],
            body: tableData,
            startY: 40,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [20, 184, 166] },
        });

        doc.save("tercih-listem.pdf");
    };

    const exportAnalyticsPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Analiz Raporu", 14, 20);

        // Date
        doc.setFontSize(10);
        doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString("tr-TR")}`, 14, 28);

        // Statistics
        doc.setFontSize(12);
        doc.text("Genel İstatistikler", 14, 40);
        doc.setFontSize(10);
        doc.text(`Toplam Tercih Sayısı: ${preferences.length}`, 14, 48);
        doc.text(`DUS Puanınız: ${(userScore / 100).toFixed(2)}`, 14, 54);

        // Risk Distribution
        const riskDist = {
            safe: preferences.filter((p) => p.riskLevel === "safe").length,
            high: preferences.filter((p) => p.riskLevel === "high").length,
            medium: preferences.filter((p) => p.riskLevel === "medium").length,
            low: preferences.filter((p) => p.riskLevel === "low").length,
        };

        doc.setFontSize(12);
        doc.text("Risk Dağılımı", 14, 66);
        doc.setFontSize(10);
        doc.text(`Güvenli: ${riskDist.safe}`, 14, 74);
        doc.text(`Yüksek: ${riskDist.high}`, 14, 80);
        doc.text(`Orta: ${riskDist.medium}`, 14, 86);
        doc.text(`Düşük: ${riskDist.low}`, 14, 92);

        // City Distribution
        const cityDist = preferences.reduce((acc, pref) => {
            acc[pref.program.city] = (acc[pref.program.city] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        doc.setFontSize(12);
        doc.text("Şehir Dağılımı", 14, 104);
        doc.setFontSize(10);
        let yPos = 112;
        Object.entries(cityDist)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .forEach(([city, count]) => {
                doc.text(`${city}: ${count}`, 14, yPos);
                yPos += 6;
            });

        doc.save("analiz-raporu.pdf");
    };

    const exportPreferencesExcel = () => {
        const data = preferences.map((pref) => ({
            Sıra: pref.rank,
            Şehir: pref.program.city,
            Üniversite: pref.program.university,
            Dal: pref.program.specialty,
            Kontenjan: pref.program.spots,
            "Başvuru Sayısı": pref.program.applicants,
            "Taban Puan": (pref.program.estimatedCutoff / 100).toFixed(2),
            "Yerleşme İhtimali": pref.placementProbability ? `%${pref.placementProbability}` : "-",
            "Risk Seviyesi": pref.riskLevel || "-",
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tercihler");

        // Set column widths
        ws["!cols"] = [
            { wch: 6 },  // Sıra
            { wch: 15 }, // Şehir
            { wch: 30 }, // Üniversite
            { wch: 25 }, // Dal
            { wch: 10 }, // Kontenjan
            { wch: 12 }, // Başvuru
            { wch: 12 }, // Taban Puan
            { wch: 18 }, // Yerleşme İhtimali
            { wch: 15 }, // Risk
        ];

        XLSX.writeFile(wb, "tercih-listem.xlsx");
    };

    return (
        <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${disabled || preferences.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
            disabled={disabled || preferences.length === 0 || isExporting}
        >
            <Download className="w-4 h-4" />
            {isExporting ? "İndiriliyor..." : "İndir"}
        </button>
    );
}
