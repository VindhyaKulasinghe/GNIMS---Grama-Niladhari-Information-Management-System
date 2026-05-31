import type {
  FamilyMember,
  Household,
  HouseholdBenefit,
  Property,
  Vehicle,
} from "./validationSchemas";

export type TranslateFn = (key: string) => string;

export interface ReportData {
  households: Household[];
  familyMembers: FamilyMember[];
  properties: Property[];
  vehicles: Vehicle[];
  householdBenefits: HouseholdBenefit[];
}

export interface AswasumaReportRow {
  houseNumber: string;
  division: string;
  address: string;
  telephone: string;
  receiverName: string;
  receiverNic: string;
  receiverAge: number | string;
}

export function buildAswasumaReportRows(data: ReportData): AswasumaReportRow[] {
  const receiving = data.householdBenefits.filter(
    (b) => b.benefitType === "aswasuma" && b.isReceiving,
  );

  return receiving
    .map((benefit) => {
      const household = data.households.find(
        (h) =>
          h.houseNumber === benefit.houseNumber &&
          h.division === benefit.division,
      );
      const receiver = data.familyMembers.find(
        (m) => m.id === benefit.receiverMemberId,
      );

      if (!household || !receiver) {
        return null;
      }

      return {
        houseNumber: household.houseNumber,
        division: household.division || "-",
        address: household.address,
        telephone: household.telephone,
        receiverName: receiver.fullName,
        receiverNic: receiver.nicNumber,
        receiverAge: receiver.age,
      };
    })
    .filter((row): row is AswasumaReportRow => row !== null)
    .sort((a, b) => a.houseNumber.localeCompare(b.houseNumber));
}

export function normalizeText(value?: string | null): string {
  if (!value) return "-";
  return value.normalize("NFC");
}

export function translateField(t: TranslateFn, value?: string | null): string {
  if (!value) return "-";
  const key = value.toLowerCase();
  const translated = t(key);
  return translated && translated !== key
    ? translated.normalize("NFC")
    : value.normalize("NFC");
}

export function escapeHtml(value: unknown): string {
  const text =
    value === null || value === undefined || value === ""
      ? "-"
      : String(value).normalize("NFC");

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function usesComplexScriptPdf(language: string): boolean {
  const lang = language.toLowerCase().split("-")[0];
  return lang === "si" || lang === "ta";
}

export function getReportFontFamily(language: string): string {
  const lang = language.toLowerCase().split("-")[0];
  if (lang === "si") return "'Noto Sans Sinhala', sans-serif";
  if (lang === "ta") return "'Noto Sans Tamil', sans-serif";
  return "'Inter', sans-serif";
}
