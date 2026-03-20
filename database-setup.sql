-- Create households table
CREATE TABLE IF NOT EXISTS households (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  houseNumber VARCHAR(50) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  electricity BOOLEAN DEFAULT FALSE,
  water BOOLEAN DEFAULT FALSE,
  toilet BOOLEAN DEFAULT FALSE,
  roofType VARCHAR(100) NOT NULL,
  wallType VARCHAR(100) NOT NULL,
  floorType VARCHAR(100) NOT NULL,
  cow INT DEFAULT 0,
  chicken INT DEFAULT 0,
  goat INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  houseNumber VARCHAR(50) NOT NULL REFERENCES households(houseNumber) ON DELETE CASCADE,
  uniqueNumber VARCHAR(50) UNIQUE NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  nicNumber VARCHAR(20) NOT NULL,
  birthYear INT NOT NULL,
  age INT NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  religion VARCHAR(50) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  maritalStatus VARCHAR(50) NOT NULL,
  educationStatus VARCHAR(100) NOT NULL,
  isHeadOfHousehold BOOLEAN DEFAULT FALSE,
  memberType VARCHAR(20) NOT NULL DEFAULT 'regular',
  jobType VARCHAR(100),
  trainingReceived TEXT,
  sector VARCHAR(100),
  monthlyIncome VARCHAR(50),
  grade VARCHAR(50),
  institutionName VARCHAR(255),
  purpose VARCHAR(255),
  boarderDistrict VARCHAR(100),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId UUID,
  houseNumber VARCHAR(50) NOT NULL REFERENCES households(houseNumber) ON DELETE CASCADE,
  ownerName VARCHAR(255) NOT NULL,
  ownerAddress TEXT NOT NULL,
  ownerPhone VARCHAR(20) NOT NULL,
  vehicleType VARCHAR(100) NOT NULL,
  vehicleNumber VARCHAR(50) NOT NULL,
  registrationYear INT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId UUID,
  houseNumber VARCHAR(50) NOT NULL REFERENCES households(houseNumber) ON DELETE CASCADE,
  ownerName VARCHAR(255) NOT NULL,
  ownerAddress TEXT NOT NULL,
  ownerPhone VARCHAR(20) NOT NULL,
  propertyType VARCHAR(100) NOT NULL,
  propertyCategory VARCHAR(50) NOT NULL,
  oppuNumber VARCHAR(50) NOT NULL UNIQUE,
  landSize VARCHAR(100) NOT NULL,
  ownership VARCHAR(100) NOT NULL,
  agriculturalUse TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create household_animals table (junction table)
CREATE TABLE IF NOT EXISTS household_animals (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  houseNumber VARCHAR(50) NOT NULL REFERENCES households(houseNumber) ON DELETE CASCADE,
  animalId BIGINT NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  count INT NOT NULL DEFAULT 1,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(houseNumber, animalId)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'GN Officer', 'Divisional Secretariat')),
  division VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_familymembers_houseNumber ON family_members(houseNumber);
CREATE INDEX IF NOT EXISTS idx_familymembers_memberType ON family_members(memberType);
CREATE INDEX IF NOT EXISTS idx_vehicles_houseNumber ON vehicles(houseNumber);
CREATE INDEX IF NOT EXISTS idx_properties_houseNumber ON properties(houseNumber);
CREATE INDEX IF NOT EXISTS idx_householdanimals_houseNumber ON household_animals(houseNumber);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS (Row Level Security)
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- For public access (unauthenticated users) - adjust as needed
DO $$
BEGIN
  CREATE POLICY "Enable read access for all users" ON households FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable read access for all users" ON family_members FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable read access for all users" ON vehicles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable read access for all users" ON properties FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable read access for all users" ON animals FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable read access for all users" ON household_animals FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow authenticated users to insert/update/delete
DO $$
BEGIN
  CREATE POLICY "Enable insert for authenticated users" ON households FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable update for authenticated users" ON households FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable delete for authenticated users" ON households FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Repeat for other tables
DO $$
BEGIN
  CREATE POLICY "Enable insert for authenticated users" ON family_members FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable update for authenticated users" ON family_members FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable delete for authenticated users" ON family_members FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable insert for authenticated users" ON vehicles FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable update for authenticated users" ON vehicles FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable delete for authenticated users" ON vehicles FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable insert for authenticated users" ON properties FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable update for authenticated users" ON properties FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable delete for authenticated users" ON properties FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable insert for authenticated users" ON household_animals FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable update for authenticated users" ON household_animals FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable delete for authenticated users" ON household_animals FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS Policies for users table
DO $$
BEGIN
  CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable insert for authenticated users" ON users FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable update for authenticated users" ON users FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Enable delete for authenticated users" ON users FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
