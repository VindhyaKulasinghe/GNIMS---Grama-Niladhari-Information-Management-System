export const CERTIFICATE_TYPES = [
  "income_certificate",
  "business_name_registration",
  "gn_resident_certificate",
  "soil_transport_letter",
  "timber_felling_letter",
  "timber_transport_letter",
  "passport_travel_letter",
] as const;

export type CertificateType = (typeof CERTIFICATE_TYPES)[number];

/** Older DB values → translation keys for display in lists/reports */
export const LEGACY_CERTIFICATE_TYPE_KEYS: Record<string, string> = {
  funeral_leave_letter: "funeral_leave_letter",
  funeral_leave_certificate: "funeral_leave_letter",
  death_declaration: "timber_transport_letter",
};

export function resolveCertificateTypeKey(type: string): string {
  return LEGACY_CERTIFICATE_TYPE_KEYS[type] ?? type;
}

export function isCertificateType(value: string): value is CertificateType {
  return (CERTIFICATE_TYPES as readonly string[]).includes(value);
}
