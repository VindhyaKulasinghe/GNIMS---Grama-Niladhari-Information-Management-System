import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";
import { FamilyMember } from "@/lib/validationSchemas";

interface PopulationTableProps {
  familyMembers: FamilyMember[];
}

export function PopulationTable({ familyMembers }: PopulationTableProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t("genderDistribution")}
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("gender")}</TableHead>
              <TableHead>{t("count")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(
              familyMembers.reduce(
                (acc, member) => {
                  const genderKey = member.gender.toLowerCase();
                  const translatedGender = t(genderKey) || member.gender;
                  acc[translatedGender] = (acc[translatedGender] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            ).map(([gender, count]) => (
              <TableRow key={gender}>
                <TableCell>{gender}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">{t("ageGroups")}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ageGroup")}</TableHead>
              <TableHead>{t("count")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                group: "0-18",
                count: familyMembers.filter((m) => m.age <= 18).length,
              },
              {
                group: "19-35",
                count: familyMembers.filter((m) => m.age > 18 && m.age <= 35)
                  .length,
              },
              {
                group: "36-60",
                count: familyMembers.filter((m) => m.age > 35 && m.age <= 60)
                  .length,
              },
              {
                group: "60+",
                count: familyMembers.filter((m) => m.age > 60).length,
              },
            ].map(({ group, count }) => (
              <TableRow key={group}>
                <TableCell>{group}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">{t("familyMembers")}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("age")}</TableHead>
              <TableHead>{t("gender")}</TableHead>
              <TableHead>{t("maritalStatus")}</TableHead>
              <TableHead>{t("educationStatus")}</TableHead>
              <TableHead>{t("jobType")}</TableHead>
              <TableHead>{t("memberType")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.fullName}</TableCell>
                <TableCell>{member.age}</TableCell>
                <TableCell>
                  {t(member.gender.toLowerCase()) || member.gender}
                </TableCell>
                <TableCell>{member.maritalStatus}</TableCell>
                <TableCell>{member.educationStatus}</TableCell>
                <TableCell>{member.jobType || "-"}</TableCell>
                <TableCell>
                  {t(member.memberType) || member.memberType}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
