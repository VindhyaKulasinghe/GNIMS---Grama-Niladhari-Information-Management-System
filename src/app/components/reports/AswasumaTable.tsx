import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Household,
  FamilyMember,
  HouseholdBenefit,
} from "../../../lib/validationSchemas";
import { buildAswasumaReportRows } from "../../../lib/reportUtils";

interface AswasumaTableProps {
  households: Household[];
  familyMembers: FamilyMember[];
  householdBenefits: HouseholdBenefit[];
}

export function AswasumaTable({
  households,
  familyMembers,
  householdBenefits,
}: AswasumaTableProps) {
  const { t } = useTranslation();
  const rows = buildAswasumaReportRows({
    households,
    familyMembers,
    properties: [],
    vehicles: [],
    householdBenefits,
  });

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("houseNumber")}</TableHead>
            <TableHead>{t("division")}</TableHead>
            <TableHead>{t("address")}</TableHead>
            <TableHead>{t("telephone")}</TableHead>
            <TableHead>{t("fullName")}</TableHead>
            <TableHead>{t("nicNumber")}</TableHead>
            <TableHead>{t("age")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                {t("noAswasumaRecipients")}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={`${row.division}-${row.houseNumber}`}>
                <TableCell>{row.houseNumber}</TableCell>
                <TableCell>{row.division}</TableCell>
                <TableCell className="max-w-xs">{row.address}</TableCell>
                <TableCell>{row.telephone}</TableCell>
                <TableCell>{row.receiverName}</TableCell>
                <TableCell>{row.receiverNic}</TableCell>
                <TableCell>{row.receiverAge}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
