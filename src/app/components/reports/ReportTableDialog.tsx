import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HouseholdTable } from "./HouseholdTable";
import { PopulationTable } from "./PopulationTable";
import { PropertyTable } from "./PropertyTable";
import { VehicleTable } from "./VehicleTable";
import {
  Household,
  FamilyMember,
  Property,
  Vehicle,
} from "../../lib/validationSchemas";

interface ReportTableDialogProps {
  showReportTable: string | null;
  onClose: () => void;
  households: Household[];
  familyMembers: FamilyMember[];
  properties: Property[];
  vehicles: Vehicle[];
  onDownload: () => void;
}

export function ReportTableDialog({
  showReportTable,
  onClose,
  households,
  familyMembers,
  properties,
  vehicles,
  onDownload,
}: ReportTableDialogProps) {
  const { t } = useTranslation();

  const getTitle = () => {
    switch (showReportTable) {
      case "household":
        return t("householdReport");
      case "population":
        return t("populationStatistics");
      case "property":
        return t("propertyReport");
      case "vehicle":
        return t("vehicleReport");
      default:
        return "";
    }
  };

  const renderTable = () => {
    switch (showReportTable) {
      case "household":
        return <HouseholdTable households={households} />;
      case "population":
        return <PopulationTable familyMembers={familyMembers} />;
      case "property":
        return <PropertyTable properties={properties} />;
      case "vehicle":
        return <VehicleTable vehicles={vehicles} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={!!showReportTable} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {t("viewReportData", "View and download the report data.")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div>{renderTable()}</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
          <Button onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            {t("download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
