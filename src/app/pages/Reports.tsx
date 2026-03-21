import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useHouseholdData } from "../context/HouseholdDataContext";
import { useState } from "react";
import { Home, BarChart3, FileText, Car } from "lucide-react";
import {
  ReportTypeCard,
  RecentReports,
  ReportTableDialog,
} from "../components/reports";

import { generateReport } from "../../lib/reportGenerator";

export function Reports() {
  const { t, i18n } = useTranslation();
  const { households, familyMembers, vehicles, properties } =
    useHouseholdData();
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [showReportTable, setShowReportTable] = useState<string | null>(null);

  const reportTypes = [
    {
      title: t("householdReport"),
      description: t("householdReportDesc"),
      icon: Home,
      color: "bg-blue-500",
      type: "household",
    },
    {
      title: t("populationStatistics"),
      description: t("populationStatisticsDesc"),
      icon: BarChart3,
      color: "bg-green-500",
      type: "population",
    },
    {
      title: t("propertyReport"),
      description: t("propertyReportDesc"),
      icon: FileText,
      color: "bg-purple-500",
      type: "property",
    },
    {
      title: t("vehicleReport"),
      description: t("vehicleReportDesc"),
      icon: Car,
      color: "bg-orange-500",
      type: "vehicle",
    },
  ];

  const handleGenerateReport = (reportType: string) => {
    try {
      generateReport(
        reportType,
        { households, familyMembers, properties, vehicles },
        "en",
        t
      );
      toast.success(t("reportGenerated", "Report generated successfully"));
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error(t("reportGenerationError", "Error generating report"));
    }
  };

  const handleViewReport = (reportType: string) => {
    setShowReportTable(reportType);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("reports")}</h1>
          <p className="text-gray-600 mt-1">{t("reportsDescription")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <ReportTypeCard
              key={report.title}
              title={report.title}
              description={report.description}
              icon={report.icon}
              color={report.color}
              type={report.type}
              onView={handleViewReport}
              onGenerate={handleGenerateReport}
            />
          ))}
        </div>

        <RecentReports />
      </div>

      {/* Report Table Dialog */}
      <ReportTableDialog
        showReportTable={showReportTable}
        onClose={() => setShowReportTable(null)}
        households={households}
        familyMembers={familyMembers}
        properties={properties}
        vehicles={vehicles}
        onDownload={() => {
          if (showReportTable) {
            handleGenerateReport(showReportTable);
          }
        }}
      />
    </>
  );
}

