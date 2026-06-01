import type { TFunction } from "i18next";

/** Categories used in GNIMS animal records */
export const DOMESTIC_ANIMAL_CATEGORIES = [
  "Livestock",
  "Poultry",
  "Pets",
  "Small Animals",
  "Other",
] as const;

export type DomesticAnimalCategory = (typeof DOMESTIC_ANIMAL_CATEGORIES)[number];

/** Common domestic animals in Southern Province (Down South) villages */
export interface DomesticAnimalPreset {
  key: string;
  /** Canonical English name stored in the database */
  nameEn: string;
  category: DomesticAnimalCategory;
}

/** Removed from the village default list — hidden and purged from the database on load */
export const REMOVED_DOMESTIC_ANIMAL_NAMES = [
  "goat",
  "duck",
  "horse",
  "quail",
] as const;

export function isRemovedDomesticAnimal(name: string): boolean {
  const normalized = name.toLowerCase().trim();
  return (REMOVED_DOMESTIC_ANIMAL_NAMES as readonly string[]).includes(
    normalized,
  );
}

export function filterActiveDomesticAnimals<T extends { name: string }>(
  list: T[],
): T[] {
  return list.filter((item) => !isRemovedDomesticAnimal(item.name));
}

export const SOUTHERN_SRI_LANKA_DOMESTIC_ANIMALS: DomesticAnimalPreset[] = [
  { key: "cattle", nameEn: "Cattle (Cow)", category: "Livestock" },
  { key: "buffalo", nameEn: "Buffalo", category: "Livestock" },
  { key: "pig", nameEn: "Pig", category: "Livestock" },
  { key: "chicken", nameEn: "Chicken", category: "Poultry" },
  { key: "dog", nameEn: "Dog", category: "Pets" },
  { key: "cat", nameEn: "Cat", category: "Pets" },
  { key: "rabbit", nameEn: "Rabbit", category: "Small Animals" },
  { key: "pigeon", nameEn: "Pigeon", category: "Small Animals" },
  { key: "beehive", nameEn: "Bee Hive (Honey Bee)", category: "Other" },
];

const presetByName = new Map(
  SOUTHERN_SRI_LANKA_DOMESTIC_ANIMALS.map((p) => [
    p.nameEn.toLowerCase().trim(),
    p,
  ]),
);

const presetByKey = new Map(
  SOUTHERN_SRI_LANKA_DOMESTIC_ANIMALS.map((p) => [p.key, p]),
);

export function findDomesticAnimalPreset(
  nameOrKey: string,
): DomesticAnimalPreset | undefined {
  const normalized = nameOrKey.toLowerCase().trim();
  return presetByKey.get(normalized) ?? presetByName.get(normalized);
}

export function getAnimalDisplayName(name: string, t: TFunction): string {
  const preset = findDomesticAnimalPreset(name);
  if (preset) {
    return t(`domesticAnimal.${preset.key}`, { defaultValue: preset.nameEn });
  }
  return name;
}

export function getCategoryDisplayName(category: string, t: TFunction): string {
  const key = category.toLowerCase().replace(/\s+/g, "");
  const translated = t(key, { defaultValue: "" });
  return translated || category;
}

export function groupDomesticAnimalsByCategory(): Record<
  DomesticAnimalCategory,
  DomesticAnimalPreset[]
> {
  const groups = {} as Record<DomesticAnimalCategory, DomesticAnimalPreset[]>;
  for (const cat of DOMESTIC_ANIMAL_CATEGORIES) {
    groups[cat] = [];
  }
  for (const preset of SOUTHERN_SRI_LANKA_DOMESTIC_ANIMALS) {
    groups[preset.category].push(preset);
  }
  return groups;
}

export interface AnimalRecord {
  name: string;
}

/** Add preset animals that are not already in the database (matched by English name). */
export async function seedMissingDomesticAnimals(
  existing: AnimalRecord[],
  addAnimal: (animal: { name: string; category: string }) => Promise<unknown>,
): Promise<number> {
  const existingNames = new Set(
    existing.map((a) => a.name.toLowerCase().trim()),
  );
  let added = 0;
  for (const preset of SOUTHERN_SRI_LANKA_DOMESTIC_ANIMALS) {
    if (!existingNames.has(preset.nameEn.toLowerCase().trim())) {
      await addAnimal({ name: preset.nameEn, category: preset.category });
      existingNames.add(preset.nameEn.toLowerCase().trim());
      added++;
    }
  }
  return added;
}
