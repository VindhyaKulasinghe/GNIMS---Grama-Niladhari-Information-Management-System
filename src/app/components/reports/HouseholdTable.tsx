import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";
import { Household } from "@/lib/validationSchemas";

interface HouseholdTableProps {
  households: Household[];
}

export function HouseholdTable({ households }: HouseholdTableProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("houseNumber")}</TableHead>
          <TableHead>{t("address")}</TableHead>
          <TableHead>{t("telephone")}</TableHead>
          <TableHead>{t("facilities")}</TableHead>
          <TableHead>{t("roofType")}</TableHead>
          <TableHead>{t("wallType")}</TableHead>
          <TableHead>{t("floorType")}</TableHead>
          <TableHead>{t("animals")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {households.map((household) => (
          <TableRow key={household.id}>
            <TableCell>{household.houseNumber}</TableCell>
            <TableCell>{household.address}</TableCell>
            <TableCell>{household.telephone}</TableCell>
            <TableCell>
              {household.electricity && `${t("electricity")} `}
              {household.water && `${t("water")} `}
              {household.toilet && t("toilet")}
            </TableCell>
            <TableCell>{household.roofType}</TableCell>
            <TableCell>{household.wallType}</TableCell>
            <TableCell>{household.floorType}</TableCell>
            <TableCell>
              {household.cow > 0 && `${household.cow} ${t("cow")} `}
              {household.chicken > 0 && `${household.chicken} ${t("chicken")} `}
              {household.goat > 0 && `${household.goat} ${t("goat")}`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
