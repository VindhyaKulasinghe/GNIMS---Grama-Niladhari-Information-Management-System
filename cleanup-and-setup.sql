-- Clean up existing transaction data and divisions master data to start fresh
TRUNCATE TABLE household_animals, properties, vehicles, family_members, households, divisions RESTART IDENTITY CASCADE;

-- Ensure division column exists on all transaction tables
ALTER TABLE households ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
ALTER TABLE household_animals ADD COLUMN IF NOT EXISTS division VARCHAR(255) NOT NULL;
