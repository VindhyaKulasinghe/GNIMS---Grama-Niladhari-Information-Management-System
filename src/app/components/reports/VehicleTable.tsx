import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";
import { Vehicle } from "@/lib/validationSchemas";

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export function VehicleTable({ vehicles }: VehicleTableProps) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("vehicleNumber")}</TableHead>
          <TableHead>{t("ownerName")}</TableHead>
          <TableHead>{t("ownerAddress")}</TableHead>
          <TableHead>{t("vehicleType")}</TableHead>
          <TableHead>{t("registrationYear")}</TableHead>
          <TableHead>{t("phone")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell>{vehicle.vehicleNumber}</TableCell>
            <TableCell>{vehicle.ownerName}</TableCell>
            <TableCell>{vehicle.ownerAddress}</TableCell>
            <TableCell>{vehicle.vehicleType}</TableCell>
            <TableCell>{vehicle.registrationYear}</TableCell>
            <TableCell>{vehicle.ownerPhone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
