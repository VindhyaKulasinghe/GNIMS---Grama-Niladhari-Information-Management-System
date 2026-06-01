import { supabase } from "../supabaseClient";
import { isRemovedDomesticAnimal } from "../domesticAnimals";
import {
  Animal,
  HouseholdAnimal,
  AnimalSchema,
  HouseholdAnimalSchema,
} from "../validationSchemas";

// ANIMALS CRUD

/** Delete goat, duck, horse, quail and their household links if still in DB */
export async function purgeRemovedDomesticAnimals(): Promise<number> {
  const { data, error } = await supabase.from("animals").select("id, name");

  if (error) {
    throw new Error(`Failed to list animals for cleanup: ${error.message}`);
  }

  const toRemove = (data || []).filter((row) =>
    isRemovedDomesticAnimal(String(row.name ?? "")),
  );

  for (const animal of toRemove) {
    if (animal.id == null) continue;

    const { error: linkError } = await supabase
      .from("household_animals")
      .delete()
      .eq("animalId", animal.id);

    if (linkError) {
      throw new Error(
        `Failed to remove household links for animal ${animal.id}: ${linkError.message}`,
      );
    }

    await deleteAnimal(animal.id);
  }

  return toRemove.length;
}

// GET ALL ANIMALS
export async function getAnimals(): Promise<Animal[]> {
  const { data, error } = await supabase
    .from("animals")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to fetch animals: ${error.message}`);
  return data || [];
}

// CREATE ANIMAL
export async function createAnimal(
  animal: Omit<Animal, "id" | "createdAt" | "updatedAt">,
): Promise<Animal> {
  const validated = AnimalSchema.parse(animal);

  const { data, error } = await supabase
    .from("animals")
    .insert([validated])
    .select()
    .single();

  if (error) throw new Error(`Failed to create animal: ${error.message}`);
  return data;
}

// UPDATE ANIMAL
export async function updateAnimal(
  id: number,
  animal: Partial<Animal>,
): Promise<Animal> {
  const validated = AnimalSchema.partial().parse(animal);

  const { data, error } = await supabase
    .from("animals")
    .update(validated)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update animal: ${error.message}`);
  return data;
}

// DELETE ANIMAL
export async function deleteAnimal(id: number): Promise<void> {
  const { error } = await supabase.from("animals").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete animal: ${error.message}`);
}

// HOUSEHOLD ANIMALS CRUD

// GET ALL HOUSEHOLD ANIMALS
export async function getAllHouseholdAnimals(): Promise<HouseholdAnimal[]> {
  const { data, error } = await supabase
    .from("household_animals")
    .select("*")
    .order("houseNumber", { ascending: true });

  if (error)
    throw new Error(`Failed to fetch all household animals: ${error.message}`);
  return data || [];
}

// CREATE/UPDATE HOUSEHOLD ANIMAL
export async function upsertHouseholdAnimal(
  houseNumber: string,
  animalId: number,
  count: number,
  division: string,
): Promise<HouseholdAnimal> {
  if (!division) {
    throw new Error("Division is required for household animals");
  }

  const validated = HouseholdAnimalSchema.parse({
    houseNumber,
    animalId,
    count,
    division,
  });

  const { data, error } = await supabase
    .from("household_animals")
    .upsert([validated], { onConflict: "division,houseNumber,animalId" })
    .select()
    .single();

  if (error)
    throw new Error(`Failed to upsert household animal: ${error.message}`);
  return data;
}

// DELETE HOUSEHOLD ANIMAL
export async function deleteHouseholdAnimal(
  houseNumber: string,
  animalId: number,
  division: string,
): Promise<void> {
  const { error } = await supabase
    .from("household_animals")
    .delete()
    .eq("houseNumber", houseNumber)
    .eq("animalId", animalId)
    .eq("division", division);

  if (error)
    throw new Error(`Failed to delete household animal: ${error.message}`);
}
