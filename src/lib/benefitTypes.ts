export const BENEFIT_TYPES = [
  "aswasuma",
  "wadihiti_deemana",
  "mahajana_adara",
  "abaditha_deemana",
  "wakugadu_adara",
  "other",
] as const;

export type BenefitType = (typeof BENEFIT_TYPES)[number];

export function isBenefitType(value: string): value is BenefitType {
  return (BENEFIT_TYPES as readonly string[]).includes(value);
}
