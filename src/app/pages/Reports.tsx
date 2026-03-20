import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FileText, Download, Printer, BarChart3 } from "lucide-react";

export function Reports() {
  const { t } = useLanguage();

  const reportTypes = [
    {
      title: t("residenceCertificate"),
      description: "Generate residence certificate for individuals",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: t("characterCertificate"),
      description: "Generate character certificate for residents",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      title: t("householdReport"),
      description: "Detailed household information report",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: t("populationStatistics"),
      description: "Statistical analysis of village population",
      icon: BarChart3,
      color: "bg-orange-500",
    },
    {
      title: t("incomeStatistics"),
      description: "Income distribution and economic data",
      icon: BarChart3,
      color: "bg-pink-500",
    },
    {
      title: "Property Report",
      description: "Land and property ownership summary",
      icon: FileText,
      color: "bg-cyan-500",
    },
  ];

  const handleGenerateReport = (reportTitle: string) => {
    toast.info(`Generating ${reportTitle}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("reports")}</h1>
        <p className="text-gray-600 mt-1">Generate certificates and statistical reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`${report.color} p-3 rounded-lg`}>
                  <report.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleGenerateReport(report.title)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </Button>
                <Button 
                  onClick={() => handleGenerateReport(report.title)}
                  variant="outline"
                  size="sm"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Residence Certificate - H.M. Bandara", date: "2026-03-05", type: "Certificate" },
              { name: "Population Statistics - Hambantota - March 2026", date: "2026-03-01", type: "Statistics" },
              { name: "Income Report - Southern Province - Q1 2026", date: "2026-02-28", type: "Statistics" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}