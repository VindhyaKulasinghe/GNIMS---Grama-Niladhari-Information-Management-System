import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { CertificateIssuance } from "../../../lib/validationSchemas";
import { buildCertificateReportRows } from "../../../lib/reportUtils";

interface CertificateTableProps {
  certificateIssuances: CertificateIssuance[];
  certificateFilter?: {
    certificateType?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export function CertificateTable({
  certificateIssuances,
  certificateFilter,
}: CertificateTableProps) {
  const { t } = useTranslation();
  const rows = buildCertificateReportRows(
    {
      households: [],
      familyMembers: [],
      properties: [],
      vehicles: [],
      householdBenefits: [],
      certificateIssuances,
      certificateFilter,
    },
    t,
  );

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("issueDate")}</TableHead>
            <TableHead>{t("certificateType")}</TableHead>
            <TableHead>{t("division")}</TableHead>
            <TableHead>{t("fullName")}</TableHead>
            <TableHead>{t("nicNumber")}</TableHead>
            <TableHead>{t("houseNumber")}</TableHead>
            <TableHead>{t("address")}</TableHead>
            <TableHead>{t("referenceNumber")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                {t("noCertificatesFound")}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={`${row.issueDate}-${row.recipientNic}-${index}`}>
                <TableCell>{row.issueDate}</TableCell>
                <TableCell>{row.certificateType}</TableCell>
                <TableCell>{row.division}</TableCell>
                <TableCell>{row.recipientName}</TableCell>
                <TableCell>{row.recipientNic}</TableCell>
                <TableCell>{row.houseNumber}</TableCell>
                <TableCell className="max-w-xs">{row.recipientAddress}</TableCell>
                <TableCell>{row.referenceNumber}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
