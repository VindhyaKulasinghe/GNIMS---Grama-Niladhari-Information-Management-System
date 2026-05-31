import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useHouseholdData } from "../context/HouseholdDataContext";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Home, BarChart3, FileText, Car, HandHeart, ScrollText } from "lucide-react";
import {
  ReportTypeCard,
  RecentReports,
  ReportTableDialog,
} from "../components/reports";
import { CertificatesSection } from "../components/certificates/CertificatesSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { generateReport } from "../../lib/reportGenerator";

export function Reports() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { households, familyMembers, vehicles, properties, householdBenefits, certificateIssuances } =
    useHouseholdData();
  const [showReportTable, setShowReportTable] = useState<string | null>(null);

  const defaultTab = useMemo(() => {
    return searchParams.get("tab") === "certificates" ? "certificates" : "statistics";
  }, [searchParams]);

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
    {
      title: t("aswasumaReport"),
      description: t("aswasumaReportDesc"),
      icon: HandHeart,
      color: "bg-rose-500",
      type: "aswasuma",
    },
    {
      title: t("gnCertificatesReport"),
      description: t("gnCertificatesReportDesc"),
      icon: ScrollText,
      color: "bg-indigo-500",
      type: "certificates",
    },
  ];

  const handleGenerateReport = async (reportType: string) => {
    try {
      await generateReport(
        reportType,
        { households, familyMembers, properties, vehicles, householdBenefits, certificateIssuances },
        i18n.language,
        t,
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t("reports")}</h1>
          <p className="text-gray-600 mt-1">{t("reportsDescription")}</p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="flex h-auto w-full max-w-lg flex-wrap gap-1 p-1 sm:flex-nowrap">
            <TabsTrigger value="certificates" className="flex-1 text-xs sm:text-sm">
              {t("reportsTabCertificates")}
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex-1 text-xs sm:text-sm">
              {t("reportsTabStatistics")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="mt-6">
            <CertificatesSection />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6 mt-6">
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
          </TabsContent>
        </Tabs>
      </div>

      <ReportTableDialog
        showReportTable={showReportTable}
        onClose={() => setShowReportTable(null)}
        households={households}
        familyMembers={familyMembers}
        properties={properties}
        vehicles={vehicles}
        householdBenefits={householdBenefits}
        certificateIssuances={certificateIssuances}
        onDownload={() => {
          if (showReportTable) {
            handleGenerateReport(showReportTable);
          }
        }}
      />
    </>
  );
}
