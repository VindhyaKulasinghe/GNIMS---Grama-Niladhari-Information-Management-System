import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, Download, Printer } from "lucide-react";
import { useTranslation } from "react-i18next";

export function RecentReports() {
  const { t } = useTranslation();

  const recentReports = [
    {
      name: `${t("householdReport")} - ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      type: t("report"),
    },
    {
      name: `${t("populationStatistics")} - ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      type: t("statistics"),
    },
    {
      name: `${t("propertyReport")} - ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      type: t("report"),
    },
    {
      name: `${t("vehicleReport")} - ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      type: t("report"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentReports")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
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
  );
}
