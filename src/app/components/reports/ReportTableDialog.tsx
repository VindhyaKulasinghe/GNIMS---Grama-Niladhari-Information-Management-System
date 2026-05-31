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
import { AswasumaTable } from "./AswasumaTable";
import { CertificateTable } from "./CertificateTable";
import {
  Household,
  FamilyMember,
  Property,
  Vehicle,
  HouseholdBenefit,
  CertificateIssuance,
} from "../../../lib/validationSchemas";

interface ReportTableDialogProps {
  showReportTable: string | null;
  onClose: () => void;
  households: Household[];
  familyMembers: FamilyMember[];
  properties: Property[];
  vehicles: Vehicle[];
  householdBenefits: HouseholdBenefit[];
  certificateIssuances: CertificateIssuance[];
  onDownload: () => void;
}

export function ReportTableDialog({
  showReportTable,
  onClose,
  households,
  familyMembers,
  properties,
  vehicles,
  householdBenefits,
  certificateIssuances,
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
      case "aswasuma":
        return t("aswasumaReport");
      case "certificates":
        return t("gnCertificatesReport");
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
      case "aswasuma":
        return (
          <AswasumaTable
            households={households}
            familyMembers={familyMembers}
            householdBenefits={householdBenefits}
          />
        );
      case "certificates":
        return <CertificateTable certificateIssuances={certificateIssuances} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={!!showReportTable} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] sm:max-w-6xl max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {t("viewReportData", "View and download the report data.")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 overflow-y-auto flex-1 min-h-0 -mx-1 px-1">
          <div className="overflow-x-auto">{renderTable()}</div>
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
