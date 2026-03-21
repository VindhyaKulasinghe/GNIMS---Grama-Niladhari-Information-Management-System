import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";
import { Property } from "@/lib/validationSchemas";

interface PropertyTableProps {
  properties: Property[];
}

export function PropertyTable({ properties }: PropertyTableProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("oppuNumber")}</TableHead>
          <TableHead>{t("ownerName")}</TableHead>
          <TableHead>{t("propertyType")}</TableHead>
          <TableHead>{t("propertyCategory")}</TableHead>
          <TableHead>{t("landSize")}</TableHead>
          <TableHead>{t("ownership")}</TableHead>
          <TableHead>{t("agriculturalUse")}</TableHead>
          <TableHead>{t("phone")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell>{property.oppuNumber}</TableCell>
            <TableCell>{property.ownerName}</TableCell>
            <TableCell>{property.propertyType}</TableCell>
            <TableCell>
              {property.propertyCategory === "living"
                ? t("living")
                : t("additional")}
            </TableCell>
            <TableCell>{property.landSize}</TableCell>
            <TableCell>{property.ownership}</TableCell>
            <TableCell>{property.agriculturalUse || "-"}</TableCell>
            <TableCell>{property.ownerPhone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
