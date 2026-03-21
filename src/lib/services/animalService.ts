import { supabase } from "../supabaseClient";
import {
  Animal,
  HouseholdAnimal,
  AnimalSchema,
  HouseholdAnimalSchema,
} from "../validationSchemas";

// ANIMALS CRUD

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
): Promise<HouseholdAnimal> {
  const validated = HouseholdAnimalSchema.parse({
    houseNumber,
    animalId,
    count,
  });

  const { data, error } = await supabase
    .from("household_animals")
    .upsert([validated], { onConflict: "houseNumber,animalId" })
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
): Promise<void> {
  const { error } = await supabase
    .from("household_animals")
    .delete()
    .eq("houseNumber", houseNumber)
    .eq("animalId", animalId);

  if (error)
    throw new Error(`Failed to delete household animal: ${error.message}`);
}
