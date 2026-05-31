-- Clean up existing transaction data and divisions master data to start fresh
TRUNCATE TABLE household_animals, properties, vehicles, family_members, households, divisions RESTART IDENTITY CASCADE;

-- Ensure division column exists on all transaction tables
ALTER TABLE households ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
ALTER TABLE household_animals ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;

-- Unique constraints scoped per GN division (same house no. allowed across divisions)
ALTER TABLE households DROP CONSTRAINT IF EXISTS households_houseNumber_key;
ALTER TABLE households DROP CONSTRAINT IF EXISTS households_division_houseNumber_key;
ALTER TABLE households
  ADD CONSTRAINT households_division_houseNumber_key
  UNIQUE (division, "houseNumber");

ALTER TABLE household_animals DROP CONSTRAINT IF EXISTS household_animals_houseNumber_animalId_key;
ALTER TABLE household_animals DROP CONSTRAINT IF EXISTS household_animals_division_houseNumber_animalId_key;
ALTER TABLE household_animals
  ADD CONSTRAINT household_animals_division_houseNumber_animalId_key
  UNIQUE (division, "houseNumber", "animalId");

ALTER TABLE family_members DROP CONSTRAINT IF EXISTS family_members_uniqueNumber_key;
ALTER TABLE family_members DROP CONSTRAINT IF EXISTS family_members_division_uniqueNumber_key;
ALTER TABLE family_members
  ADD CONSTRAINT family_members_division_uniqueNumber_key
  UNIQUE (division, "uniqueNumber");
