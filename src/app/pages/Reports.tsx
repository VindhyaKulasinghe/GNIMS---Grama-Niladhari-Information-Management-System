import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { useHouseholdData } from "../context/HouseholdDataContext";
import { useState } from "react";
import { Home, BarChart3, FileText, Car } from "lucide-react";
import {
  ReportTypeCard,
  RecentReports,
  LanguageSelectionDialog,
  ReportTableDialog,
} from "../components/reports";

export function Reports() {
  const { t } = useTranslation();
  const { households, familyMembers, vehicles, properties } =
    useHouseholdData();
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
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

  const generateHouseholdReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Household Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Total Households: ${households.length}`, 20, 45);

    // Table headers
    let yPosition = 60;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("House No.", 20, yPosition);
    doc.text("Address", 50, yPosition);
    doc.text("Telephone", 120, yPosition);
    doc.text("Facilities", 160, yPosition);
    doc.line(20, yPosition + 2, 190, yPosition + 2);

    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    households.forEach((household) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(household.houseNumber, 20, yPosition);
      doc.text(household.address.substring(0, 25), 50, yPosition);
      doc.text(household.telephone, 120, yPosition);
      const facilities = `${household.electricity ? "E" : ""}${household.water ? "W" : ""}${household.toilet ? "T" : ""}`;
      doc.text(facilities, 160, yPosition);
      yPosition += 8;
    });

    const filename =
      selectedLanguage === "si"
        ? "ගෘහ_වාර්තාව.pdf"
        : selectedLanguage === "ta"
          ? "வீட்டு_அறிக்கை.pdf"
          : "household_report.pdf";
    doc.save(filename);
    toast.success("Household report generated successfully!");
  };

  const generatePopulationStatistics = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Population Statistics Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Total Population: ${familyMembers.length}`, 20, 45);

    // Gender statistics
    const genderStats = familyMembers.reduce(
      (acc, member) => {
        acc[member.gender] = (acc[member.gender] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    let yPosition = 60;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Gender Distribution", 20, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    Object.entries(genderStats).forEach(([gender, count]) => {
      doc.text(`${gender}: ${count}`, 30, yPosition);
      yPosition += 8;
    });

    // Age groups
    const ageGroups = {
      "0-18": familyMembers.filter((m) => m.age <= 18).length,
      "19-35": familyMembers.filter((m) => m.age > 18 && m.age <= 35).length,
      "36-60": familyMembers.filter((m) => m.age > 35 && m.age <= 60).length,
      "60+": familyMembers.filter((m) => m.age > 60).length,
    };

    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Age Groups", 20, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    Object.entries(ageGroups).forEach(([group, count]) => {
      doc.text(`${group}: ${count}`, 30, yPosition);
      yPosition += 8;
    });

    const filename =
      selectedLanguage === "si"
        ? "ජනගහන_සංඛ්‍යාලේඛන.pdf"
        : selectedLanguage === "ta"
          ? "மக்கள்_தொகை_புள்ளியியல்.pdf"
          : "population_statistics.pdf";
    doc.save(filename);
    toast.success("Population statistics report generated successfully!");
  };

  const generatePropertyReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Property Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Total Properties: ${properties.length}`, 20, 45);

    // Table headers
    let yPosition = 60;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OPPU No.", 20, yPosition);
    doc.text("Owner", 60, yPosition);
    doc.text("Type", 120, yPosition);
    doc.text("Land Size", 160, yPosition);
    doc.line(20, yPosition + 2, 190, yPosition + 2);

    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    properties.forEach((property) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(property.oppuNumber, 20, yPosition);
      doc.text(property.ownerName.substring(0, 20), 60, yPosition);
      doc.text(
        `${property.propertyType} (${property.propertyCategory})`,
        120,
        yPosition,
      );
      doc.text(property.landSize, 160, yPosition);
      yPosition += 8;
    });

    const filename =
      selectedLanguage === "si"
        ? "දේපළ_වාර්තාව.pdf"
        : selectedLanguage === "ta"
          ? "சொத்து_அறிக்கை.pdf"
          : "property_report.pdf";
    doc.save(filename);
    toast.success("Property report generated successfully!");
  };

  const generateVehicleReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Vehicle Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Total Vehicles: ${vehicles.length}`, 20, 45);

    // Table headers
    let yPosition = 60;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle No.", 20, yPosition);
    doc.text("Owner", 70, yPosition);
    doc.text("Type", 130, yPosition);
    doc.text("Reg. Year", 170, yPosition);
    doc.line(20, yPosition + 2, 190, yPosition + 2);

    yPosition += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    vehicles.forEach((vehicle) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(vehicle.vehicleNumber, 20, yPosition);
      doc.text(vehicle.ownerName.substring(0, 25), 70, yPosition);
      doc.text(vehicle.vehicleType, 130, yPosition);
      doc.text(vehicle.registrationYear.toString(), 170, yPosition);
      yPosition += 8;
    });

    const filename =
      selectedLanguage === "si"
        ? "වාහන_වාර්තාව.pdf"
        : selectedLanguage === "ta"
          ? "வாகன_அறிக்கை.pdf"
          : "vehicle_report.pdf";
    doc.save(filename);
    toast.success("Vehicle report generated successfully!");
  };

  const handleGenerateReport = (reportType: string) => {
    setSelectedReportType(reportType);
    setShowLanguageDialog(true);
  };

  const handleLanguageConfirm = () => {
    setShowLanguageDialog(false);
    switch (selectedReportType) {
      case "household":
        generateHouseholdReport();
        break;
      case "population":
        generatePopulationStatistics();
        break;
      case "property":
        generatePropertyReport();
        break;
      case "vehicle":
        generateVehicleReport();
        break;
      default:
        toast.error("Unknown report type");
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

      {/* Language Selection Dialog */}
      <LanguageSelectionDialog
        open={showLanguageDialog}
        onOpenChange={setShowLanguageDialog}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onConfirm={handleLanguageConfirm}
      />

      {/* Report Table Dialog */}
      <ReportTableDialog
        showReportTable={showReportTable}
        onClose={() => setShowReportTable(null)}
        households={households}
        familyMembers={familyMembers}
        properties={properties}
        vehicles={vehicles}
        onDownload={() => {
          setSelectedReportType(showReportTable);
          setShowLanguageDialog(true);
        }}
      />
    </>
  );
}
