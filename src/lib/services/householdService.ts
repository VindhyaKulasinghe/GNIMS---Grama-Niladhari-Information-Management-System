import { supabase } from "../supabaseClient";
import { Household, HouseholdSchema } from "../validationSchemas";

// GET ALL HOUSEHOLDS
export async function getHouseholds(): Promise<Household[]> {
  const { data, error } = await supabase
    .from("households")
    .select("*")
    .order("houseNumber", { ascending: true });

  if (error) throw new Error(`Failed to fetch households: ${error.message}`);
  return data || [];
}

// GET SINGLE HOUSEHOLD (scoped to GN division)
export async function getHouseholdByNumber(
  houseNumber: string,
  division: string,
): Promise<Household | null> {
  const { data, error } = await supabase
    .from("households")
    .select("*")
    .eq("houseNumber", houseNumber)
    .eq("division", division)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch household: ${error.message}`);
  return data || null;
}

// CREATE HOUSEHOLD
export async function createHousehold(
  household: Omit<Household, "id" | "createdAt" | "updatedAt">,
): Promise<Household> {
  // Validate input
  const validated = HouseholdSchema.parse({
    ...household,
    houseNumber: household.houseNumber.trim(),
  });

  if (!validated.division?.trim()) {
    throw new Error("Division is required to create a household");
  }
  validated.division = validated.division.trim();

  const existing = await getHouseholdByNumber(
    validated.houseNumber,
    validated.division,
  );
  if (existing) {
    throw new Error(
      `House number "${validated.houseNumber}" already exists in division "${validated.division}".`,
    );
  }

  const { data, error } = await supabase
    .from("households")
    .insert([validated])
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      const isGlobalHouseNumberKey =
        error.message?.includes("households_houseNumber_key") ||
        error.details?.includes("houseNumber");
      if (isGlobalHouseNumberKey && !error.message?.includes("division")) {
        throw new Error(
          `Database still uses a global house-number rule. Re-run migration-division-scoped-uniques.sql in Supabase SQL Editor. Details: ${error.message}`,
        );
      }
      throw new Error(
        `House number "${validated.houseNumber}" already exists in division "${validated.division}".`,
      );
    }
    throw new Error(`Failed to create household: ${error.message}`);
  }
  return data;
}

// UPDATE HOUSEHOLD
export async function updateHousehold(
  id: number,
  household: Partial<Household>,
): Promise<Household> {
  // Remove id from update data since we don't want to update the primary key
  const { id: _, ...updateData } = household;

  // Validate input
  const validated = HouseholdSchema.partial().parse(updateData);

  const { data, error } = await supabase
    .from("households")
    .update(validated)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update household: ${error.message}`);
  return data;
}

// DELETE HOUSEHOLD
export async function deleteHousehold(id: number): Promise<void> {
  const { error } = await supabase.from("households").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete household: ${error.message}`);
}

// GET HOUSEHOLDS BY STATISTICS
export async function getHouseholdStatistics() {
  const { data, error } = await supabase.from("households").select("*");

  if (error) throw new Error(`Failed to fetch statistics: ${error.message}`);

  const total = data?.length || 0;
  const withElectricity = data?.filter((h) => h.electricity).length || 0;
  const withWater = data?.filter((h) => h.water).length || 0;
  const withToilet = data?.filter((h) => h.toilet).length || 0;

  return {
    total,
    withElectricity,
    withWater,
    withToilet,
    withoutElectricity: total - withElectricity,
    withoutWater: total - withWater,
    withoutToilet: total - withToilet,
  };
}
