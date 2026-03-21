-- Sample data for GNIMS (Grama Niladhari Information Management System)
-- Expanded with 20 records for each major table

-- 1. Insert Animal Types (20 total)
TRUNCATE TABLE animals RESTART IDENTITY CASCADE;
INSERT INTO animals (name, category) VALUES
('Cow', 'Livestock'), ('Chicken', 'Poultry'), ('Goat', 'Livestock'), ('Buffalo', 'Livestock'),
('Pig', 'Livestock'), ('Dog', 'Pet'), ('Cat', 'Pet'), ('Horse', 'Livestock'),
('Rabbit', 'Small Animal'), ('Duck', 'Poultry'), ('Turkey', 'Poultry'), ('Bee', 'Insects'),
('Hen', 'Poultry'), ('Rooster', 'Poultry'), ('Sheep', 'Livestock'), ('Donkey', 'Livestock'),
('Camel', 'Livestock'), ('Pigeon', 'Pet'), ('Parrot', 'Pet'), ('Fish', 'Pet');

-- 2. Insert Households (20 total)
TRUNCATE TABLE households RESTART IDENTITY CASCADE;
INSERT INTO households ("houseNumber", address, telephone, electricity, water, toilet, "roofType", "wallType", "floorType") VALUES
('H-001', 'No. 12, Main Street, Hambantota', '0471234567', TRUE, TRUE, TRUE, 'Tiles', 'Brick', 'Cement'),
('H-002', '24/A, Temple Road, Hambantota', '0471112223', TRUE, FALSE, TRUE, 'Asbestos', 'Cement', 'Tiles'),
('H-003', 'No. 5, School Avenue, Hambantota', '0479988776', FALSE, FALSE, FALSE, 'Cadjan', 'Earth', 'Earth'),
('H-004', '45, Beach Road, Hambantota', '0475544332', TRUE, TRUE, TRUE, 'Concrete', 'Brick', 'Stone'),
('H-005', 'No. 7, Post Office Row, Hambantota', '0472233441', TRUE, TRUE, TRUE, 'Tiles', 'Brick', 'Cement'),
('H-006', '12/B, Market Street, Hambantota', '0473344552', TRUE, FALSE, TRUE, 'Asbestos', 'Cement', 'Tiles'),
('H-007', 'No. 88, Lake View, Hambantota', '0474455663', FALSE, TRUE, FALSE, 'Cadjan', 'Earth', 'Earth'),
('H-008', '15, Hill Top Road, Hambantota', '0475566774', TRUE, TRUE, TRUE, 'Concrete', 'Brick', 'Stone'),
('H-009', 'No. 3, Coconut Grove, Hambantota', '0476677885', TRUE, TRUE, TRUE, 'Tiles', 'Brick', 'Cement'),
('H-010', '9/A, Paddy Field Lane, Hambantota', '0477788996', TRUE, FALSE, TRUE, 'Asbestos', 'Cement', 'Tiles'),
('H-011', 'No. 22, Old Town, Hambantota', '0478899007', FALSE, FALSE, FALSE, 'Cadjan', 'Earth', 'Earth'),
('H-012', '56, Harbour Road, Hambantota', '0479900118', TRUE, TRUE, TRUE, 'Concrete', 'Brick', 'Stone'),
('H-013', 'No. 14, Railway Road, Hambantota', '0470011229', TRUE, TRUE, TRUE, 'Tiles', 'Brick', 'Cement'),
('H-014', '33/C, Temple View, Hambantota', '0471122330', TRUE, FALSE, TRUE, 'Asbestos', 'Cement', 'Tiles'),
('H-015', 'No. 1, Junction Way, Hambantota', '0472233441', FALSE, TRUE, FALSE, 'Cadjan', 'Earth', 'Earth'),
('H-016', '77, Industrial Zone, Hambantota', '0473344552', TRUE, TRUE, TRUE, 'Concrete', 'Brick', 'Stone'),
('H-017', 'No. 5, salt Pan Road, Hambantota', '0474455663', TRUE, TRUE, TRUE, 'Tiles', 'Brick', 'Cement'),
('H-018', '21/A, New Colony, Hambantota', '0475566774', TRUE, FALSE, TRUE, 'Asbestos', 'Cement', 'Tiles'),
('H-019', 'No. 9, Windmill Close, Hambantota', '0476677885', FALSE, FALSE, FALSE, 'Cadjan', 'Earth', 'Earth'),
('H-020', '101, Highway Side, Hambantota', '0477788996', TRUE, TRUE, TRUE, 'Concrete', 'Brick', 'Stone');

-- 3. Insert Family Members (20 total)
TRUNCATE TABLE family_members RESTART IDENTITY CASCADE;
INSERT INTO family_members ("houseNumber", "uniqueNumber", "fullName", "nicNumber", "birthYear", age, nationality, religion, gender, "maritalStatus", "educationStatus", "isHeadOfHousehold", "memberType", "jobType", sector, "monthlyIncome") VALUES
('H-001', 'U-001', 'Perera Gamage Sunil', '197512345678', 1975, 51, 'Sri Lankan', 'Buddhist', 'Male', 'Married', 'Secondary', TRUE, 'regular', 'Farmer', 'Agricultural', '35000-50000'),
('H-002', 'U-002', 'Mohamed Razik', '196555667788', 1965, 61, 'Sri Lankan', 'Islam', 'Male', 'Married', 'Degree', TRUE, 'regular', 'Teacher', 'Government', '75000-100000'),
('H-003', 'U-003', 'Velu Murugan', '198233445566', 1982, 44, 'Sri Lankan', 'Hindu', 'Male', 'Married', 'Primary', TRUE, 'regular', 'Laborer', 'Private', '15000-25000'),
('H-004', 'U-004', 'Fernando Silva', '197066778899', 1970, 56, 'Sri Lankan', 'Christian', 'Male', 'Married', 'Diploma', TRUE, 'regular', 'Merchant', 'Private', '50000-75000'),
('H-005', 'U-005', 'Kamal Karunaratne', '198511223344', 1985, 41, 'Sri Lankan', 'Buddhist', 'Male', 'Married', 'Degree', TRUE, 'regular', 'Clerk', 'Government', '45000-60000'),
('H-006', 'U-006', 'Samanthi Silva', '199022334455', 1990, 36, 'Sri Lankan', 'Buddhist', 'Female', 'Single', 'Degree', TRUE, 'regular', 'Nurse', 'Government', '60000-80000'),
('H-007', 'U-007', 'Aruna Jayawardene', '196033445566', 1960, 66, 'Sri Lankan', 'Buddhist', 'Male', 'Widowed', 'Secondary', TRUE, 'regular', 'Retired', 'Government', '25000-35000'),
('H-008', 'U-008', 'Fathima Naushad', '198844556677', 1988, 38, 'Sri Lankan', 'Islam', 'Female', 'Married', 'Secondary', TRUE, 'regular', 'Housewife', 'Private', 'None'),
('H-009', 'U-009', 'Ravi Chandran', '197555667788', 1975, 51, 'Sri Lankan', 'Hindu', 'Male', 'Married', 'Primary', TRUE, 'regular', 'Driver', 'Private', '30000-45000'),
('H-010', 'U-010', 'Nimal Siriwardene', '196866778899', 1968, 58, 'Sri Lankan', 'Buddhist', 'Male', 'Married', 'Secondary', TRUE, 'regular', 'Farmer', 'Agricultural', '40000-55000'),
('H-011', 'U-011', 'Latha Perera', '197277889900', 1972, 54, 'Sri Lankan', 'Buddhist', 'Female', 'Single', 'Primary', TRUE, 'regular', 'Laborer', 'Private', '15000-20000'),
('H-012', 'U-012', 'Samantha Kumara', '198088990011', 1980, 46, 'Sri Lankan', 'Buddhist', 'Male', 'Married', 'Secondary', TRUE, 'regular', 'Police Officer', 'Government', '55000-75000'),
('H-013', 'U-013', 'Irfan Ahmed', '199599001122', 1995, 31, 'Sri Lankan', 'Islam', 'Male', 'Married', 'Diploma', TRUE, 'regular', 'Salesman', 'Private', '40000-50000'),
('H-014', 'U-014', 'Pushpa Kumari', '196500112233', 1965, 61, 'Sri Lankan', 'Buddhist', 'Female', 'Married', 'Diploma', TRUE, 'regular', 'Teacher', 'Government', '70000-90000'),
('H-015', 'U-015', 'Siva Lingam', '197811223344', 1978, 48, 'Sri Lankan', 'Hindu', 'Male', 'Married', 'Primary', TRUE, 'regular', 'Farmer', 'Agricultural', '30000-40000'),
('H-016', 'U-016', 'Asela Gunaratne', '198222334455', 1982, 44, 'Sri Lankan', 'Buddhist', 'Male', 'Married', 'Degree', TRUE, 'regular', 'Manager', 'Private', '80000-120000'),
('H-017', 'U-017', 'Dilini Fonseka', '199233445566', 1992, 34, 'Sri Lankan', 'Christian', 'Female', 'Single', 'Postgraduate', TRUE, 'regular', 'Doctor', 'Government', '150000+'),
('H-018', 'U-018', 'Nuwan Hettiarachchi', '198744556677', 1987, 39, 'Sri Lankan', 'Buddhist', 'Male', 'Married', 'Secondary', TRUE, 'regular', 'Mason', 'Private', '50000-70000'),
('H-019', 'U-019', 'Zahira Banu', '197055667788', 1970, 56, 'Sri Lankan', 'Islam', 'Female', 'Married', 'Secondary', TRUE, 'regular', 'Tailor', 'Private', '20000-30000'),
('H-020', 'U-020', 'Jagath Wickramasinghe', '196266778899', 1962, 64, 'Sri Lankan', 'Buddhist', 'Male', 'Married', 'Secondary', TRUE, 'regular', 'Security Guard', 'Private', '25000-35000');
-- 8. Insert Boarders (20 total)
TRUNCATE TABLE family_members RESTART IDENTITY CASCADE; -- Reset for boarders
INSERT INTO family_members ("houseNumber", "uniqueNumber", "fullName", "nicNumber", "birthYear", age, nationality, religion, gender, "maritalStatus", "educationStatus", "isHeadOfHousehold", "memberType", "boarderDistrict", "jobType", sector, "monthlyIncome") VALUES
('H-001', 'B-01', 'Boarder Person 1', '198099887766', 1980, 46, 'Sri Lankan', 'Buddhist', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Colombo', 'Worker', 'Private', '30000-45000'),
('H-002', 'B-02', 'Boarder Person 2', '198199887766', 1981, 45, 'Sri Lankan', 'Islam', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Colombo', 'Worker', 'Private', '30000-45000'),
('H-003', 'B-03', 'Boarder Person 3', '198299887766', 1982, 44, 'Sri Lankan', 'Hindu', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Colombo', 'Worker', 'Private', '30000-45000'),
('H-004', 'B-04', 'Boarder Person 4', '198399887766', 1983, 43, 'Sri Lankan', 'Buddhist', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Colombo', 'Worker', 'Private', '30000-45000'),
('H-005', 'B-05', 'Boarder Person 5', '198499887766', 1984, 42, 'Sri Lankan', 'Islam', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Colombo', 'Worker', 'Private', '30000-45000'),
('H-006', 'B-06', 'Boarder Person 6', '198599887766', 1985, 41, 'Sri Lankan', 'Hindu', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Galle', 'Worker', 'Private', '30000-45000'),
('H-007', 'B-07', 'Boarder Person 7', '198699887766', 1986, 40, 'Sri Lankan', 'Buddhist', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Galle', 'Worker', 'Private', '30000-45000'),
('H-008', 'B-08', 'Boarder Person 8', '198799887766', 1987, 39, 'Sri Lankan', 'Islam', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Galle', 'Worker', 'Private', '30000-45000'),
('H-009', 'B-09', 'Boarder Person 9', '198899887766', 1988, 38, 'Sri Lankan', 'Hindu', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Galle', 'Worker', 'Private', '30000-45000'),
('H-010', 'B-10', 'Boarder Person 10', '198999887766', 1989, 37, 'Sri Lankan', 'Buddhist', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Galle', 'Worker', 'Private', '30000-45000'),
('H-011', 'B-11', 'Boarder Person 11', '198099887766', 1980, 46, 'Sri Lankan', 'Islam', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Matara', 'Worker', 'Private', '30000-45000'),
('H-012', 'B-12', 'Boarder Person 12', '198199887766', 1981, 45, 'Sri Lankan', 'Hindu', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Matara', 'Worker', 'Private', '30000-45000'),
('H-013', 'B-13', 'Boarder Person 13', '198299887766', 1982, 44, 'Sri Lankan', 'Buddhist', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Matara', 'Worker', 'Private', '30000-45000'),
('H-014', 'B-14', 'Boarder Person 14', '198399887766', 1983, 43, 'Sri Lankan', 'Islam', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Matara', 'Worker', 'Private', '30000-45000'),
('H-015', 'B-15', 'Boarder Person 15', '198499887766', 1984, 42, 'Sri Lankan', 'Hindu', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Matara', 'Worker', 'Private', '30000-45000'),
('H-016', 'B-16', 'Boarder Person 16', '198599887766', 1985, 41, 'Sri Lankan', 'Buddhist', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Kandy', 'Worker', 'Private', '30000-45000'),
('H-017', 'B-17', 'Boarder Person 17', '198699887766', 1986, 40, 'Sri Lankan', 'Islam', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Kandy', 'Worker', 'Private', '30000-45000'),
('H-018', 'B-18', 'Boarder Person 18', '198799887766', 1987, 39, 'Sri Lankan', 'Hindu', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Kandy', 'Worker', 'Private', '30000-45000'),
('H-019', 'B-19', 'Boarder Person 19', '198899887766', 1988, 38, 'Sri Lankan', 'Buddhist', 'Male', 'Single', 'Secondary', FALSE, 'boarder', 'Kandy', 'Worker', 'Private', '30000-45000'),
('H-020', 'B-20', 'Boarder Person 20', '198999887766', 1989, 37, 'Sri Lankan', 'Islam', 'Female', 'Single', 'Secondary', FALSE, 'boarder', 'Kandy', 'Worker', 'Private', '30000-45000');
-- 4. Associate Animals with Households (20 total)
TRUNCATE TABLE household_animals RESTART IDENTITY CASCADE;
INSERT INTO household_animals ("houseNumber", "animalId", count) VALUES
('H-001', 1, 3), ('H-001', 2, 12), ('H-002', 6, 1), ('H-003', 3, 7),
('H-004', 7, 2), ('H-005', 1, 2), ('H-006', 9, 4), ('H-007', 10, 5),
('H-008', 6, 1), ('H-009', 2, 8), ('H-010', 3, 4), ('H-011', 1, 1),
('H-012', 4, 3), ('H-013', 2, 15), ('H-014', 6, 1), ('H-015', 3, 6),
('H-016', 15, 2), ('H-017', 2, 10), ('H-018', 6, 1), ('H-019', 13, 20);

-- 5. Insert Vehicles (20 total)
TRUNCATE TABLE vehicles RESTART IDENTITY CASCADE;
INSERT INTO vehicles ("houseNumber", "ownerName", "ownerAddress", "ownerPhone", "vehicleType", "vehicleNumber", "registrationYear") VALUES
('H-001', 'Perera Gamage Sunil', 'No. 12, Main Street, Hambantota', '0471234567', 'Tractor', 'WP RA-1234', 2015),
('H-002', 'Mohamed Razik', '24/A, Temple Road, Hambantota', '0471112223', 'Car', 'CP ABC-5678', 2020),
('H-004', 'Fernando Silva', '45, Beach Road, Hambantota', '0475544332', 'Van', 'WP PX-9090', 2018),
('H-005', 'Kamal Karunaratne', 'No. 7, Post Office Row, Hambantota', '0472233441', 'Motorcycle', 'SP BD-1122', 2019),
('H-006', 'Samanthi Silva', '12/B, Market Street, Hambantota', '0473344552', 'Three-Wheeler', 'WP AA-3344', 2021),
('H-008', 'Fathima Naushad', '15, Hill Top Road, Hambantota', '0475566774', 'Motorcycle', 'WP KZ-5566', 2017),
('H-009', 'Ravi Chandran', 'No. 3, Coconut Grove, Hambantota', '0476677885', 'Three-Wheeler', 'SP QB-7788', 2016),
('H-010', 'Nimal Siriwardene', '9/A, Paddy Field Lane, Hambantota', '0477788996', 'Tractor', 'SP RA-9900', 2014),
('H-012', 'Samantha Kumara', '56, Harbour Road, Hambantota', '0479900118', 'Motorcycle', 'SP CC-1122', 2022),
('H-013', 'Irfan Ahmed', 'No. 14, Railway Road, Hambantota', '0470011229', 'Three-Wheeler', 'WP AA-2233', 2018),
('H-014', 'Pushpa Kumari', '33/C, Temple View, Hambantota', '0471122330', 'Car', 'SP CAD-4455', 2019),
('H-016', 'Asela Gunaratne', '77, Industrial Zone, Hambantota', '0473344552', 'Van', 'WP LX-6677', 2020),
('H-017', 'Dilini Fonseka', 'No. 5, salt Pan Road, Hambantota', '0474455663', 'Car', 'WP KE-8899', 2023),
('H-018', 'Nuwan Hettiarachchi', '21/A, New Colony, Hambantota', '0475566774', 'Motorcycle', 'SP BC-9900', 2015),
('H-020', 'Jagath Wickramasinghe', '101, Highway Side, Hambantota', '0477788996', 'Three-Wheeler', 'WP AB-1122', 2017),
('H-001', 'Perera Gamage Sunil', 'No. 12, Main Street, Hambantota', '0471234567', 'Motorcycle', 'SP BD-2233', 2021),
('H-004', 'Fernando Silva', '45, Beach Road, Hambantota', '0475544332', 'Car', 'WP KV-3344', 2022),
('H-005', 'Kamal Karunaratne', 'No. 7, Post Office Row, Hambantota', '0472233441', 'Tractor', 'SP RA-4455', 2013),
('H-013', 'Irfan Ahmed', 'No. 14, Railway Road, Hambantota', '0470011229', 'Motorcycle', 'WP LZ-5566', 2016),
('H-017', 'Dilini Fonseka', 'No. 5, salt Pan Road, Hambantota', '0474455663', 'Motorcycle', 'SP BK-6677', 2018);

-- 6. Insert Properties (20 total)
TRUNCATE TABLE properties RESTART IDENTITY CASCADE;
INSERT INTO properties ("houseNumber", "ownerName", "ownerAddress", "ownerPhone", "propertyType", "propertyCategory", "oppuNumber", "landSize", ownership) VALUES
('H-001', 'Perera Gamage Sunil', 'No. 12, Main Street, Hambantota', '0471234567', 'Agricultural', 'Paddy Land', 'OPPU-1001', '2 Acres', 'Owner'),
('H-002', 'Mohamed Razik', '24/A, Temple Road, Hambantota', '0471112223', 'Living', 'House and Land', 'OPPU-1002', '20 Perches', 'Owner'),
('H-004', 'Fernando Silva', '45, Beach Road, Hambantota', '0475544332', 'Commercial', 'Shop Premises', 'OPPU-1003', '5 Perches', 'Owner'),
('H-005', 'Kamal Karunaratne', 'No. 7, Post Office Row, Hambantota', '0472233441', 'Agricultural', 'Coconut Land', 'OPPU-1004', '1 Acre', 'Permit'),
('H-007', 'Aruna Jayawardene', 'No. 88, Lake View, Hambantota', '0474455663', 'Living', 'Residential Plot', 'OPPU-1005', '15 Perches', 'Grant'),
('H-009', 'Ravi Chandran', 'No. 3, Coconut Grove, Hambantota', '0476677885', 'Agricultural', 'Home Garden', 'OPPU-1006', '40 Perches', 'Owner'),
('H-010', 'Nimal Siriwardene', '9/A, Paddy Field Lane, Hambantota', '0477788996', 'Agricultural', 'Paddy Land', 'OPPU-1007', '3 Acres', 'Leasehold'),
('H-012', 'Samantha Kumara', '56, Harbour Road, Hambantota', '0479900118', 'Living', 'House and Land', 'OPPU-1008', '12 Perches', 'Owner'),
('H-013', 'Irfan Ahmed', 'No. 14, Railway Road, Hambantota', '0470011229', 'Commercial', 'Storage Unit', 'OPPU-1009', '8 Perches', 'Owner'),
('H-015', 'Siva Lingam', 'No. 1, Junction Way, Hambantota', '0472233441', 'Agricultural', 'Mixed Crop', 'OPPU-1010', '1.5 Acres', 'Permit'),
('H-016', 'Asela Gunaratne', '77, Industrial Zone, Hambantota', '0473344552', 'Commercial', 'Factory Site', 'OPPU-1011', '1 Acre', 'Owner'),
('H-017', 'Dilini Fonseka', 'No. 5, salt Pan Road, Hambantota', '0474455663', 'Investment', 'Vacant Land', 'OPPU-1012', '50 Perches', 'Owner'),
('H-019', 'Zahira Banu', 'No. 9, Windmill Close, Hambantota', '0476677885', 'Living', 'Residence', 'OPPU-1013', '10 Perches', 'Grant'),
('H-020', 'Jagath Wickramasinghe', '101, Highway Side, Hambantota', '0477788996', 'Commercial', 'Small Stall', 'OPPU-1014', '2 Perches', 'Leasehold'),
('H-001', 'Perera Gamage Sunil', 'No. 12, Main Street, Hambantota', '0471234567', 'Agricultural', 'Vegetable Plot', 'OPPU-1015', '1 Acre', 'Owner'),
('H-004', 'Fernando Silva', '45, Beach Road, Hambantota', '0475544332', 'Living', 'Rental Property', 'OPPU-1016', '10 Perches', 'Owner'),
('H-005', 'Kamal Karunaratne', 'No. 7, Post Office Row, Hambantota', '0472233441', 'Living', 'House and Land', 'OPPU-1017', '18 Perches', 'Owner'),
('H-009', 'Ravi Chandran', 'No. 3, Coconut Grove, Hambantota', '0476677885', 'Investment', 'Rural Plot', 'OPPU-1018', '2 Acres', 'Owner'),
('H-012', 'Samantha Kumara', '56, Harbour Road, Hambantota', '0479900118', 'Agricultural', 'Cinnamon Land', 'OPPU-1019', '1 Acre', 'Permit'),
('H-017', 'Dilini Fonseka', 'No. 5, salt Pan Road, Hambantota', '0474455663', 'Commercial', 'Clinic Premises', 'OPPU-1020', '10 Perches', 'Owner');

-- 7. Insert Sample Users (System Access) (20 total)
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
INSERT INTO users (name, email, role, division, status) VALUES
('Sunil Perera', 'sunil@gnims.lk', 'GN Officer', 'Hambantota Central', 'Active'),
('Fathima Razik', 'fathima@gnims.lk', 'Admin', 'Hambantota Head Office', 'Active'),
('Sathis Kumar', 'sathis@gnims.lk', 'Divisional Secretariat', 'Hambantota District Office', 'Active'),
('Nimali Jayasundara', 'nimali@gnims.lk', 'GN Officer', 'Hambantota West', 'Active'),
('Aruna Shantha', 'aruna@gnims.lk', 'GN Officer', 'Hambantota East', 'Active'),
('Priyantha De Silva', 'priyantha@gnims.lk', 'GN Officer', 'Hambantota North', 'Active'),
('Dilani Perera', 'dilani@gnims.lk', 'Admin', 'Hambantota Head Office', 'Active'),
('Nuwan Jayaweera', 'nuwan@gnims.lk', 'Divisional Secretariat', 'Hambantota District Office', 'Active'),
('Saman Kumara', 'saman@gnims.lk', 'GN Officer', 'Ambalantota South', 'Active'),
('Latha Kumari', 'latha@gnims.lk', 'GN Officer', 'Ambalantota North', 'Active'),
('Irfan Mohamed', 'irfan@gnims.lk', 'GN Officer', 'Tissamaharama', 'Active'),
('Suraj Ahmed', 'suraj@gnims.lk', 'Admin', 'District Secretariat', 'Active'),
('Chathura Fonseka', 'chathura@gnims.lk', 'GN Officer', 'Tangalle', 'Active'),
('Kasun Kalhara', 'kasun@gnims.lk', 'GN Officer', 'Beliatta', 'Active'),
('Madhu Shanthi', 'madhu@gnims.lk', 'GN Officer', 'Walasmulla', 'Active'),
('Ruwan Silva', 'ruwan@gnims.lk', 'GN Officer', 'Katuwana', 'Active'),
('Deepika Damayanthi', 'deepika@gnims.lk', 'Admin', 'Provincial Office', 'Active'),
('Sumudu Perera', 'sumudu@gnims.lk', 'GN Officer', 'Weeraketiya', 'Active'),
('Shanika Jayawardene', 'shanika@gnims.lk', 'GN Officer', 'Sooriyawewa', 'Active'),
('Jagath Bandara', 'jagath@gnims.lk', 'GN Officer', 'Lunugamvehera', 'Active');
