/** Match records that belong to the same household within a GN division. */
export function isSameHouse(
  record: { houseNumber: string; division?: string },
  houseNumber: string,
  division: string,
): boolean {
  return record.houseNumber === houseNumber && record.division === division;
}

export function findHouseholdByRef<
  T extends { houseNumber: string; division?: string },
>(households: T[], houseNumber: string, division?: string): T | undefined {
  if (division) {
    return households.find((h) => isSameHouse(h, houseNumber, division));
  }
  return households.find((h) => h.houseNumber === houseNumber);
}

/** Division from the logged-in GN user — never use a hardcoded fallback. */
export function resolveUserDivision(
  user: { division?: string } | null | undefined,
): string {
  const division = user?.division?.trim();
  if (!division) {
    throw new Error(
      "No GN division is assigned to your account. Ask an admin to set your division in User Management.",
    );
  }
  return division;
}
