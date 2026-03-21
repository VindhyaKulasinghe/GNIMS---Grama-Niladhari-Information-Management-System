import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Eye, Download, LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReportTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  type: string;
  onView: (type: string) => void;
  onGenerate: (type: string) => void;
}

export function ReportTypeCard({
  title,
  description,
  icon: Icon,
  color,
  type,
  onView,
  onGenerate,
}: ReportTypeCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`${color} p-3 rounded-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            onClick={() => onView(type)}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            {t("view")}
          </Button>
          <Button
            onClick={() => onGenerate(type)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {t("generate")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
