import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL or SUPABASE_KEY is missing in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ANIMALS = [
  { name: "Cow", category: "Livestock" },
  { name: "Chicken", category: "Poultry" },
  { name: "Goat", category: "Livestock" },
  { name: "Buffalo", category: "Livestock" },
  { name: "Pig", category: "Livestock" },
  { name: "Dog", category: "Pet" },
  { name: "Cat", category: "Pet" },
  { name: "Horse", category: "Livestock" },
  { name: "Rabbit", category: "Small Animal" },
  { name: "Duck", category: "Poultry" },
  { name: "Turkey", category: "Poultry" },
  { name: "Bee", category: "Insects" },
  { name: "Hen", category: "Poultry" },
  { name: "Rooster", category: "Poultry" },
  { name: "Sheep", category: "Livestock" },
  { name: "Donkey", category: "Livestock" },
  { name: "Camel", category: "Livestock" },
  { name: "Pigeon", category: "Pet" },
  { name: "Parrot", category: "Pet" },
  { name: "Fish", category: "Pet" },
];

const HOUSEHOLDS = [
  {
    houseNumber: "H-001",
    address: "No. 12, Main Street, Hambantota",
    telephone: "0471234567",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Tiles",
    wallType: "Brick",
    floorType: "Cement",
  },
  {
    houseNumber: "H-002",
    address: "24/A, Temple Road, Hambantota",
    telephone: "0471112223",
    electricity: true,
    water: false,
    toilet: true,
    roofType: "Asbestos",
    wallType: "Cement",
    floorType: "Tiles",
  },
  {
    houseNumber: "H-003",
    address: "No. 5, School Avenue, Hambantota",
    telephone: "0479988776",
    electricity: false,
    water: false,
    toilet: false,
    roofType: "Cadjan",
    wallType: "Earth",
    floorType: "Earth",
  },
  {
    houseNumber: "H-004",
    address: "45, Beach Road, Hambantota",
    telephone: "0475544332",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Concrete",
    wallType: "Brick",
    floorType: "Stone",
  },
  {
    houseNumber: "H-005",
    address: "No. 7, Post Office Row, Hambantota",
    telephone: "0472233441",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Tiles",
    wallType: "Brick",
    floorType: "Cement",
  },
  {
    houseNumber: "H-006",
    address: "12/B, Market Street, Hambantota",
    telephone: "0473344552",
    electricity: true,
    water: false,
    toilet: true,
    roofType: "Asbestos",
    wallType: "Cement",
    floorType: "Tiles",
  },
  {
    houseNumber: "H-007",
    address: "No. 88, Lake View, Hambantota",
    telephone: "0474455663",
    electricity: false,
    water: true,
    toilet: false,
    roofType: "Cadjan",
    wallType: "Earth",
    floorType: "Earth",
  },
  {
    houseNumber: "H-008",
    address: "15, Hill Top Road, Hambantota",
    telephone: "0475566774",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Concrete",
    wallType: "Brick",
    floorType: "Stone",
  },
  {
    houseNumber: "H-009",
    address: "No. 3, Coconut Grove, Hambantota",
    telephone: "0476677885",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Tiles",
    wallType: "Brick",
    floorType: "Cement",
  },
  {
    houseNumber: "H-010",
    address: "9/A, Paddy Field Lane, Hambantota",
    telephone: "0477788996",
    electricity: true,
    water: false,
    toilet: true,
    roofType: "Asbestos",
    wallType: "Cement",
    floorType: "Tiles",
  },
  {
    houseNumber: "H-011",
    address: "No. 22, Old Town, Hambantota",
    telephone: "0478899007",
    electricity: false,
    water: false,
    toilet: false,
    roofType: "Cadjan",
    wallType: "Earth",
    floorType: "Earth",
  },
  {
    houseNumber: "H-012",
    address: "56, Harbour Road, Hambantota",
    telephone: "0479900118",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Concrete",
    wallType: "Brick",
    floorType: "Stone",
  },
  {
    houseNumber: "H-013",
    address: "No. 14, Railway Road, Hambantota",
    telephone: "0470011229",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Tiles",
    wallType: "Brick",
    floorType: "Cement",
  },
  {
    houseNumber: "H-014",
    address: "33/C, Temple View, Hambantota",
    telephone: "0471122330",
    electricity: true,
    water: false,
    toilet: true,
    roofType: "Asbestos",
    wallType: "Cement",
    floorType: "Tiles",
  },
  {
    houseNumber: "H-015",
    address: "No. 1, Junction Way, Hambantota",
    telephone: "0472233441",
    electricity: false,
    water: true,
    toilet: false,
    roofType: "Cadjan",
    wallType: "Earth",
    floorType: "Earth",
  },
  {
    houseNumber: "H-016",
    address: "77, Industrial Zone, Hambantota",
    telephone: "0473344552",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Concrete",
    wallType: "Brick",
    floorType: "Stone",
  },
  {
    houseNumber: "H-017",
    address: "No. 5, Salt Pan Road, Hambantota",
    telephone: "0474455663",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Tiles",
    wallType: "Brick",
    floorType: "Cement",
  },
  {
    houseNumber: "H-018",
    address: "21/A, New Colony, Hambantota",
    telephone: "0475566774",
    electricity: true,
    water: false,
    toilet: true,
    roofType: "Asbestos",
    wallType: "Cement",
    floorType: "Tiles",
  },
  {
    houseNumber: "H-019",
    address: "No. 9, Windmill Close, Hambantota",
    telephone: "0476677885",
    electricity: false,
    water: false,
    toilet: false,
    roofType: "Cadjan",
    wallType: "Earth",
    floorType: "Earth",
  },
  {
    houseNumber: "H-020",
    address: "101, Highway Side, Hambantota",
    telephone: "0477788996",
    electricity: true,
    water: true,
    toilet: true,
    roofType: "Concrete",
    wallType: "Brick",
    floorType: "Stone",
  },
];

const HEADS = [
  {
    houseNumber: "H-001",
    uniqueNumber: "U-001",
    fullName: "Perera Gamage Sunil",
    nicNumber: "197512345678",
    birthYear: 1975,
    age: 51,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Secondary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Farmer",
    sector: "Agricultural",
    monthlyIncome: "35000-50000",
  },
  {
    houseNumber: "H-002",
    uniqueNumber: "U-002",
    fullName: "Mohamed Razik",
    nicNumber: "196555667788",
    birthYear: 1965,
    age: 61,
    nationality: "Sri Lankan",
    religion: "Islam",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Degree",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Teacher",
    sector: "Government",
    monthlyIncome: "75000-100000",
  },
  {
    houseNumber: "H-003",
    uniqueNumber: "U-003",
    fullName: "Velu Murugan",
    nicNumber: "198233445566",
    birthYear: 1982,
    age: 44,
    nationality: "Sri Lankan",
    religion: "Hindu",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Primary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Laborer",
    sector: "Private",
    monthlyIncome: "15000-25000",
  },
  {
    houseNumber: "H-004",
    uniqueNumber: "U-004",
    fullName: "Fernando Silva",
    nicNumber: "197066778899",
    birthYear: 1970,
    age: 56,
    nationality: "Sri Lankan",
    religion: "Christian",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Diploma",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Merchant",
    sector: "Private",
    monthlyIncome: "50000-75000",
  },
  {
    houseNumber: "H-005",
    uniqueNumber: "U-005",
    fullName: "Kamal Karunaratne",
    nicNumber: "198511223344",
    birthYear: 1985,
    age: 41,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Degree",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Clerk",
    sector: "Government",
    monthlyIncome: "45000-60000",
  },
  {
    houseNumber: "H-006",
    uniqueNumber: "U-006",
    fullName: "Samanthi Silva",
    nicNumber: "199022334455",
    birthYear: 1990,
    age: 36,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Female",
    maritalStatus: "Single",
    educationStatus: "Degree",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Nurse",
    sector: "Government",
    monthlyIncome: "60000-80000",
  },
  {
    houseNumber: "H-007",
    uniqueNumber: "U-007",
    fullName: "Aruna Jayawardene",
    nicNumber: "196033445566",
    birthYear: 1960,
    age: 66,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Widowed",
    educationStatus: "Secondary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Retired",
    sector: "Government",
    monthlyIncome: "25000-35000",
  },
  {
    houseNumber: "H-008",
    uniqueNumber: "U-008",
    fullName: "Fathima Naushad",
    nicNumber: "198844556677",
    birthYear: 1988,
    age: 38,
    nationality: "Sri Lankan",
    religion: "Islam",
    gender: "Female",
    maritalStatus: "Married",
    educationStatus: "Secondary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Housewife",
    sector: "Private",
    monthlyIncome: "None",
  },
  {
    houseNumber: "H-009",
    uniqueNumber: "U-009",
    fullName: "Ravi Chandran",
    nicNumber: "197555667788",
    birthYear: 1975,
    age: 51,
    nationality: "Sri Lankan",
    religion: "Hindu",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Primary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Driver",
    sector: "Private",
    monthlyIncome: "30000-45000",
  },
  {
    houseNumber: "H-010",
    uniqueNumber: "U-010",
    fullName: "Nimal Siriwardene",
    nicNumber: "196866778899",
    birthYear: 1968,
    age: 58,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Secondary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Farmer",
    sector: "Agricultural",
    monthlyIncome: "40000-55000",
  },
  {
    houseNumber: "H-011",
    uniqueNumber: "U-011",
    fullName: "Latha Perera",
    nicNumber: "197277889900",
    birthYear: 1972,
    age: 54,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Female",
    maritalStatus: "Single",
    educationStatus: "Primary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Laborer",
    sector: "Private",
    monthlyIncome: "15000-20000",
  },
  {
    houseNumber: "H-012",
    uniqueNumber: "U-012",
    fullName: "Samantha Kumara",
    nicNumber: "198088990011",
    birthYear: 1980,
    age: 46,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Secondary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Police Officer",
    sector: "Government",
    monthlyIncome: "55000-75000",
  },
  {
    houseNumber: "H-013",
    uniqueNumber: "U-013",
    fullName: "Irfan Ahmed",
    nicNumber: "199599001122",
    birthYear: 1995,
    age: 31,
    nationality: "Sri Lankan",
    religion: "Islam",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Diploma",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Salesman",
    sector: "Private",
    monthlyIncome: "40000-50000",
  },
  {
    houseNumber: "H-014",
    uniqueNumber: "U-014",
    fullName: "Pushpa Kumari",
    nicNumber: "196500112233",
    birthYear: 1965,
    age: 61,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Female",
    maritalStatus: "Married",
    educationStatus: "Diploma",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Teacher",
    sector: "Government",
    monthlyIncome: "70000-90000",
  },
  {
    houseNumber: "H-015",
    uniqueNumber: "U-015",
    fullName: "Siva Lingam",
    nicNumber: "197811223344",
    birthYear: 1978,
    age: 48,
    nationality: "Sri Lankan",
    religion: "Hindu",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Primary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Farmer",
    sector: "Agricultural",
    monthlyIncome: "30000-40000",
  },
  {
    houseNumber: "H-016",
    uniqueNumber: "U-016",
    fullName: "Asela Gunaratne",
    nicNumber: "198222334455",
    birthYear: 1982,
    age: 44,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Degree",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Manager",
    sector: "Private",
    monthlyIncome: "80000-120000",
  },
  {
    houseNumber: "H-017",
    uniqueNumber: "U-017",
    fullName: "Dilini Fonseka",
    nicNumber: "199233445566",
    birthYear: 1992,
    age: 34,
    nationality: "Sri Lankan",
    religion: "Christian",
    gender: "Female",
    maritalStatus: "Single",
    educationStatus: "Postgraduate",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Doctor",
    sector: "Government",
    monthlyIncome: "150000+",
  },
  {
    houseNumber: "H-018",
    uniqueNumber: "U-018",
    fullName: "Nuwan Hettiarachchi",
    nicNumber: "198744556677",
    birthYear: 1987,
    age: 39,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Secondary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Mason",
    sector: "Private",
    monthlyIncome: "50000-70000",
  },
  {
    houseNumber: "H-019",
    uniqueNumber: "U-019",
    fullName: "Zahira Banu",
    nicNumber: "197055667788",
    birthYear: 1970,
    age: 56,
    nationality: "Sri Lankan",
    religion: "Islam",
    gender: "Female",
    maritalStatus: "Married",
    educationStatus: "Secondary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Tailor",
    sector: "Private",
    monthlyIncome: "20000-30000",
  },
  {
    houseNumber: "H-020",
    uniqueNumber: "U-020",
    fullName: "Jagath Wickramasinghe",
    nicNumber: "196266778899",
    birthYear: 1962,
    age: 64,
    nationality: "Sri Lankan",
    religion: "Buddhist",
    gender: "Male",
    maritalStatus: "Married",
    educationStatus: "Secondary",
    isHeadOfHousehold: true,
    memberType: "regular",
    jobType: "Security Guard",
    sector: "Private",
    monthlyIncome: "25000-35000",
  },
];

const STUDENTS = Array.from({ length: 20 }).map((_, i) => ({
  houseNumber: `H-${(i + 1).toString().padStart(3, "0")}`,
  uniqueNumber: `S-0${(i + 1).toString().padStart(2, "0")}`,
  fullName: `Student Name ${i + 1}`,
  nicNumber: `200${(5 + i).toString().padStart(2, "0")}12345678`,
  birthYear: 2005 + (i % 5),
  age: 21 - (i % 5),
  nationality: "Sri Lankan",
  religion: "Buddhist",
  gender: i % 2 === 0 ? "Male" : "Female",
  maritalStatus: "Single",
  educationStatus: i < 10 ? "Secondary" : "Degree",
  grade: i < 10 ? `Grade ${10 + (i % 3)}` : `Year ${1 + (i % 4)}`, // FIX: Adding Grade
  isHeadOfHousehold: false,
  memberType: "student",
  institutionName:
    i < 10 ? "Hambantota Central College" : "University of Ruhuna",
  monthlyIncome: "None",
}));

const BOARDERS = Array.from({ length: 20 }).map((_, i) => ({
  houseNumber: `H-${(i + 1).toString().padStart(3, "0")}`,
  uniqueNumber: `B-0${(i + 1).toString().padStart(2, "0")}`,
  fullName: `Boarder Person ${i + 1}`,
  nicNumber: `198${i.toString().padStart(2, "0")}99887766`,
  birthYear: 1980 + (i % 20),
  age: 46 - (i % 20),
  nationality: "Sri Lankan",
  religion: i % 3 === 0 ? "Buddhist" : i % 3 === 1 ? "Islam" : "Hindu",
  gender: i % 2 === 0 ? "Male" : "Female",
  maritalStatus: "Single",
  educationStatus: "Secondary",
  isHeadOfHousehold: false,
  memberType: "boarder",
  boarderDistrict:
    i < 5 ? "Colombo" : i < 10 ? "Galle" : i < 15 ? "Matara" : "Kandy",
  purpose: ["Education", "Job", "Medical", "Business", "Other"][i % 5],
  jobType: "Worker",
  sector: "Private",
  monthlyIncome: "30000-45000",
}));

const VEHICLES = [
  {
    houseNumber: "H-001",
    ownerName: "Perera Gamage Sunil",
    ownerAddress: "No. 12, Main Street, Hambantota",
    ownerPhone: "0471234567",
    vehicleType: "Tractor",
    vehicleNumber: "WP RA-1234",
    registrationYear: 2015,
  },
  {
    houseNumber: "H-002",
    ownerName: "Mohamed Razik",
    ownerAddress: "24/A, Temple Road, Hambantota",
    ownerPhone: "0471112223",
    vehicleType: "Car",
    vehicleNumber: "CP ABC-5678",
    registrationYear: 2020,
  },
  {
    houseNumber: "H-004",
    ownerName: "Fernando Silva",
    ownerAddress: "45, Beach Road, Hambantota",
    ownerPhone: "0475544332",
    vehicleType: "Van",
    vehicleNumber: "WP PX-9090",
    registrationYear: 2018,
  },
  {
    houseNumber: "H-005",
    ownerName: "Kamal Karunaratne",
    ownerAddress: "No. 7, Post Office Row, Hambantota",
    ownerPhone: "0472233441",
    vehicleType: "Motorcycle",
    vehicleNumber: "SP BD-1122",
    registrationYear: 2019,
  },
  {
    houseNumber: "H-006",
    ownerName: "Samanthi Silva",
    ownerAddress: "12/B, Market Street, Hambantota",
    ownerPhone: "0473344552",
    vehicleType: "Three-Wheeler",
    vehicleNumber: "WP AA-3344",
    registrationYear: 2021,
  },
  {
    houseNumber: "H-008",
    ownerName: "Fathima Naushad",
    ownerAddress: "15, Hill Top Road, Hambantota",
    ownerPhone: "0475566774",
    vehicleType: "Motorcycle",
    vehicleNumber: "WP KZ-5566",
    registrationYear: 2017,
  },
  {
    houseNumber: "H-009",
    ownerName: "Ravi Chandran",
    ownerAddress: "No. 3, Coconut Grove, Hambantota",
    ownerPhone: "0476677885",
    vehicleType: "Three-Wheeler",
    vehicleNumber: "SP QB-7788",
    registrationYear: 2016,
  },
  {
    houseNumber: "H-010",
    ownerName: "Nimal Siriwardene",
    ownerAddress: "9/A, Paddy Field Lane, Hambantota",
    ownerPhone: "0477788996",
    vehicleType: "Tractor",
    vehicleNumber: "SP RA-9900",
    registrationYear: 2014,
  },
  {
    houseNumber: "H-012",
    ownerName: "Samantha Kumara",
    ownerAddress: "56, Harbour Road, Hambantota",
    ownerPhone: "0479900118",
    vehicleType: "Motorcycle",
    vehicleNumber: "SP CC-1122",
    registrationYear: 2022,
  },
  {
    houseNumber: "H-013",
    ownerName: "Irfan Ahmed",
    ownerAddress: "No. 14, Railway Road, Hambantota",
    ownerPhone: "0470011229",
    vehicleType: "Three-Wheeler",
    vehicleNumber: "WP AA-2233",
    registrationYear: 2018,
  },
  {
    houseNumber: "H-014",
    ownerName: "Pushpa Kumari",
    ownerAddress: "33/C, Temple View, Hambantota",
    ownerPhone: "0471122330",
    vehicleType: "Car",
    vehicleNumber: "SP CAD-4455",
    registrationYear: 2019,
  },
  {
    houseNumber: "H-016",
    ownerName: "Asela Gunaratne",
    ownerAddress: "77, Industrial Zone, Hambantota",
    ownerPhone: "0473344552",
    vehicleType: "Van",
    vehicleNumber: "WP LX-6677",
    registrationYear: 2020,
  },
  {
    houseNumber: "H-017",
    ownerName: "Dilini Fonseka",
    ownerAddress: "No. 5, Salt Pan Road, Hambantota",
    ownerPhone: "0474455663",
    vehicleType: "Car",
    vehicleNumber: "WP KE-8899",
    registrationYear: 2023,
  },
  {
    houseNumber: "H-018",
    ownerName: "Nuwan Hettiarachchi",
    ownerAddress: "21/A, New Colony, Hambantota",
    ownerPhone: "0475566774",
    vehicleType: "Motorcycle",
    vehicleNumber: "SP BC-9900",
    registrationYear: 2015,
  },
  {
    houseNumber: "H-020",
    ownerName: "Jagath Wickramasinghe",
    ownerAddress: "101, Highway Side, Hambantota",
    ownerPhone: "0477788996",
    vehicleType: "Three-Wheeler",
    vehicleNumber: "WP AB-1122",
    registrationYear: 2017,
  },
  {
    houseNumber: "H-001",
    ownerName: "Perera Gamage Sunil",
    ownerAddress: "No. 12, Main Street, Hambantota",
    ownerPhone: "0471234567",
    vehicleType: "Motorcycle",
    vehicleNumber: "SP BD-2233",
    registrationYear: 2021,
  },
  {
    houseNumber: "H-004",
    ownerName: "Fernando Silva",
    ownerAddress: "45, Beach Road, Hambantota",
    ownerPhone: "0475544332",
    vehicleType: "Car",
    vehicleNumber: "WP KV-3344",
    registrationYear: 2022,
  },
  {
    houseNumber: "H-005",
    ownerName: "Kamal Karunaratne",
    ownerAddress: "No. 7, Post Office Row, Hambantota",
    ownerPhone: "0472233441",
    vehicleType: "Tractor",
    vehicleNumber: "SP RA-4455",
    registrationYear: 2013,
  },
  {
    houseNumber: "H-013",
    ownerName: "Irfan Ahmed",
    ownerAddress: "No. 14, Railway Road, Hambantota",
    ownerPhone: "0470011229",
    vehicleType: "Motorcycle",
    vehicleNumber: "WP LZ-5566",
    registrationYear: 2016,
  },
  {
    houseNumber: "H-017",
    ownerName: "Dilini Fonseka",
    ownerAddress: "No. 5, Salt Pan Road, Hambantota",
    ownerPhone: "0474455663",
    vehicleType: "Motorcycle",
    vehicleNumber: "SP BK-6677",
    registrationYear: 2018,
  },
];

const PROPERTIES = [
  {
    houseNumber: "H-001",
    ownerName: "Perera Gamage Sunil",
    ownerAddress: "No. 12, Main Street, Hambantota",
    ownerPhone: "0471234567",
    propertyType: "Agricultural",
    propertyCategory: "Paddy Land",
    oppuNumber: "OPPU-1001",
    landSize: "2 Acres",
    ownership: "Owner",
  },
  {
    houseNumber: "H-002",
    ownerName: "Mohamed Razik",
    ownerAddress: "24/A, Temple Road, Hambantota",
    ownerPhone: "0471112223",
    propertyType: "Living",
    propertyCategory: "House and Land",
    oppuNumber: "OPPU-1002",
    landSize: "20 Perches",
    ownership: "Owner",
  },
  {
    houseNumber: "H-004",
    ownerName: "Fernando Silva",
    ownerAddress: "45, Beach Road, Hambantota",
    ownerPhone: "0475544332",
    propertyType: "Commercial",
    propertyCategory: "Shop Premises",
    oppuNumber: "OPPU-1003",
    landSize: "5 Perches",
    ownership: "Owner",
  },
  {
    houseNumber: "H-005",
    ownerName: "Kamal Karunaratne",
    ownerAddress: "No. 7, Post Office Row, Hambantota",
    ownerPhone: "0472233441",
    propertyType: "Agricultural",
    propertyCategory: "Coconut Land",
    oppuNumber: "OPPU-1004",
    landSize: "1 Acre",
    ownership: "Permit",
  },
  {
    houseNumber: "H-007",
    ownerName: "Aruna Jayawardene",
    ownerAddress: "No. 88, Lake View, Hambantota",
    ownerPhone: "0474455663",
    propertyType: "Living",
    propertyCategory: "Residential Plot",
    oppuNumber: "OPPU-1005",
    landSize: "15 Perches",
    ownership: "Grant",
  },
  {
    houseNumber: "H-009",
    ownerName: "Ravi Chandran",
    ownerAddress: "No. 3, Coconut Grove, Hambantota",
    ownerPhone: "0476677885",
    propertyType: "Agricultural",
    propertyCategory: "Home Garden",
    oppuNumber: "OPPU-1006",
    landSize: "40 Perches",
    ownership: "Owner",
  },
  {
    houseNumber: "H-010",
    ownerName: "Nimal Siriwardene",
    ownerAddress: "9/A, Paddy Field Lane, Hambantota",
    ownerPhone: "0477788996",
    propertyType: "Agricultural",
    propertyCategory: "Paddy Land",
    oppuNumber: "OPPU-1007",
    landSize: "3 Acres",
    ownership: "Leasehold",
  },
  {
    houseNumber: "H-012",
    ownerName: "Samantha Kumara",
    ownerAddress: "56, Harbour Road, Hambantota",
    ownerPhone: "0479900118",
    propertyType: "Living",
    propertyCategory: "House and Land",
    oppuNumber: "OPPU-1008",
    landSize: "12 Perches",
    ownership: "Owner",
  },
  {
    houseNumber: "H-013",
    ownerName: "Irfan Ahmed",
    ownerAddress: "No. 14, Railway Road, Hambantota",
    ownerPhone: "0470011229",
    propertyType: "Commercial",
    propertyCategory: "Storage Unit",
    oppuNumber: "OPPU-1009",
    landSize: "8 Perches",
    ownership: "Owner",
  },
  {
    houseNumber: "H-015",
    ownerName: "Siva Lingam",
    ownerAddress: "No. 1, Junction Way, Hambantota",
    ownerPhone: "0472233441",
    propertyType: "Agricultural",
    propertyCategory: "Mixed Crop",
    oppuNumber: "OPPU-1010",
    landSize: "1.5 Acres",
    ownership: "Permit",
  },
  {
    houseNumber: "H-016",
    ownerName: "Asela Gunaratne",
    ownerAddress: "77, Industrial Zone, Hambantota",
    ownerPhone: "0473344552",
    propertyType: "Commercial",
    propertyCategory: "Factory Site",
    oppuNumber: "OPPU-1011",
    landSize: "1 Acre",
    ownership: "Owner",
  },
  {
    houseNumber: "H-017",
    ownerName: "Dilini Fonseka",
    ownerAddress: "No. 5, Salt Pan Road, Hambantota",
    ownerPhone: "0474455663",
    propertyType: "Investment",
    propertyCategory: "Vacant Land",
    oppuNumber: "OPPU-1012",
    landSize: "50 Perches",
    ownership: "Owner",
  },
  {
    houseNumber: "H-019",
    ownerName: "Zahira Banu",
    ownerAddress: "No. 9, Windmill Close, Hambantota",
    ownerPhone: "0476677885",
    propertyType: "Living",
    propertyCategory: "Residence",
    oppuNumber: "OPPU-1013",
    landSize: "10 Perches",
    ownership: "Grant",
  },
  {
    houseNumber: "H-020",
    ownerName: "Jagath Wickramasinghe",
    ownerAddress: "101, Highway Side, Hambantota",
    ownerPhone: "0477788996",
    propertyType: "Commercial",
    propertyCategory: "Small Stall",
    oppuNumber: "OPPU-1014",
    landSize: "2 Perches",
    ownership: "Leasehold",
  },
  {
    houseNumber: "H-001",
    ownerName: "Perera Gamage Sunil",
    ownerAddress: "No. 12, Main Street, Hambantota",
    ownerPhone: "0471234567",
    propertyType: "Agricultural",
    propertyCategory: "Vegetable Plot",
    oppuNumber: "OPPU-1015",
    landSize: "1 Acre",
    ownership: "Owner",
  },
  {
    houseNumber: "H-004",
    ownerName: "Fernando Silva",
    ownerAddress: "45, Beach Road, Hambantota",
    ownerPhone: "0475544332",
    propertyType: "Living",
    propertyCategory: "Rental Property",
    oppuNumber: "OPPU-1016",
    landSize: "10 Perches",
    ownership: "Owner",
  },
  {
    houseNumber: "H-005",
    ownerName: "Kamal Karunaratne",
    ownerAddress: "No. 7, Post Office Row, Hambantota",
    ownerPhone: "0472233441",
    propertyType: "Living",
    propertyCategory: "House and Land",
    oppuNumber: "OPPU-1017",
    landSize: "18 Perches",
    ownership: "Owner",
  },
  {
    houseNumber: "H-009",
    ownerName: "Ravi Chandran",
    ownerAddress: "No. 3, Coconut Grove, Hambantota",
    ownerPhone: "0476677885",
    propertyType: "Investment",
    propertyCategory: "Rural Plot",
    oppuNumber: "OPPU-1018",
    landSize: "2 Acres",
    ownership: "Owner",
  },
  {
    houseNumber: "H-012",
    ownerName: "Samantha Kumara",
    ownerAddress: "56, Harbour Road, Hambantota",
    ownerPhone: "0479900118",
    propertyType: "Agricultural",
    propertyCategory: "Cinnamon Land",
    oppuNumber: "OPPU-1019",
    landSize: "1 Acre",
    ownership: "Permit",
  },
  {
    houseNumber: "H-017",
    ownerName: "Dilini Fonseka",
    ownerAddress: "No. 5, Salt Pan Road, Hambantota",
    ownerPhone: "0474455663",
    propertyType: "Commercial",
    propertyCategory: "Clinic Premises",
    oppuNumber: "OPPU-1020",
    landSize: "10 Perches",
    ownership: "Owner",
  },
];

const DEFAULT_HASH =
  "$2b$10$kRtLdDIoacFvpVSRa5wJ1eVqbIdAdE98nETkCzwG1wouGgv.NZ6jG"; // 'admin@123'

const USERS = [
  {
    full_name: "Sunil Perera",
    email: "sunil@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Hambantota Central",
    status: "Active",
  },
  {
    full_name: "Fathima Razik",
    email: "fathima@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "Admin",
    division: "Hambantota Head Office",
    status: "Active",
  },
  {
    full_name: "Sathis Kumar",
    email: "sathis@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "Divisional Secretariat",
    division: "Hambantota District Office",
    status: "Active",
  },
  {
    full_name: "Nimali Jayasundara",
    email: "nimali@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Hambantota West",
    status: "Active",
  },
  {
    full_name: "Aruna Shantha",
    email: "aruna@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Hambantota East",
    status: "Active",
  },
  {
    full_name: "Priyantha De Silva",
    email: "priyantha@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Hambantota North",
    status: "Active",
  },
  {
    full_name: "Dilani Perera",
    email: "dilani@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "Admin",
    division: "Hambantota Head Office",
    status: "Active",
  },
  {
    full_name: "Nuwan Jayaweera",
    email: "nuwan@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "Divisional Secretariat",
    division: "Hambantota District Office",
    status: "Active",
  },
  {
    full_name: "Saman Kumara",
    email: "saman@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Ambalantota South",
    status: "Active",
  },
  {
    full_name: "Latha Kumari",
    email: "latha@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Ambalantota North",
    status: "Active",
  },
  {
    full_name: "Irfan Mohamed",
    email: "irfan@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Tissamaharama",
    status: "Active",
  },
  {
    full_name: "Suraj Ahmed",
    email: "suraj@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "Admin",
    division: "District Secretariat",
    status: "Active",
  },
  {
    full_name: "Chathura Fonseka",
    email: "chathura@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Tangalle",
    status: "Active",
  },
  {
    full_name: "Kasun Kalhara",
    email: "kasun@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Beliatta",
    status: "Active",
  },
  {
    full_name: "Madhu Shanthi",
    email: "madhu@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Walasmulla",
    status: "Active",
  },
  {
    full_name: "Ruwan Silva",
    email: "ruwan@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Katuwana",
    status: "Active",
  },
  {
    full_name: "Deepika Damayanthi",
    email: "deepika@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "Admin",
    division: "Provincial Office",
    status: "Active",
  },
  {
    full_name: "Sumudu Perera",
    email: "sumudu@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Weeraketiya",
    status: "Active",
  },
  {
    full_name: "Shanika Jayawardene",
    email: "shanika@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Sooriyawewa",
    status: "Active",
  },
  {
    full_name: "Jagath Bandara",
    email: "jagath@gnims.lk",
    password_hash: DEFAULT_HASH,
    role: "GN Officer",
    division: "Lunugamvehera",
    status: "Active",
  },
];

async function seed() {
  console.log("🚀 Starting Seeding via Supabase Client...");

  try {
    // 1. Animals
    console.log("Seeding Animals...");
    const { data: existingAnimals } = await supabase
      .from("animals")
      .select("id, name");
    const existingNames = new Set(existingAnimals?.map((a) => a.name) || []);
    const animalsToInsert = ANIMALS.filter((a) => !existingNames.has(a.name));

    let animalsData = existingAnimals;
    if (animalsToInsert.length > 0) {
      const { data, error } = await supabase
        .from("animals")
        .insert(animalsToInsert)
        .select();
      if (error) throw error;
      animalsData = [...(existingAnimals || []), ...(data || [])];
      console.log(`✅ Inserted ${animalsToInsert.length} new animals.`);
    } else {
      console.log("ℹ️ Animals already seeded.");
    }

    // 2. Households
    console.log("Seeding Households...");
    const { error: houseErr } = await supabase
      .from("households")
      .upsert(HOUSEHOLDS, { onConflict: "houseNumber" });
    if (houseErr) throw houseErr;
    console.log(`✅ Seeded ${HOUSEHOLDS.length} households.`);

    // 3. Family Members (Heads, Students, Boarders)
    console.log("Seeding Family Members (Heads, Students, Boarders)...");
    const ALL_MEMBERS = [...HEADS, ...STUDENTS, ...BOARDERS];
    const { error: membersErr } = await supabase
      .from("family_members")
      .upsert(ALL_MEMBERS, { onConflict: "uniqueNumber" });
    if (membersErr) throw membersErr;
    console.log(
      `✅ Seeded ${ALL_MEMBERS.length} total family members (Heads: ${HEADS.length}, Students: ${STUDENTS.length}, Boarders: ${BOARDERS.length}).`,
    );

    // 4. Vehicles
    console.log("Seeding Vehicles...");
    const { data: existingVehicles } = await supabase
      .from("vehicles")
      .select("vehicleNumber");
    const existingVNums = new Set(
      existingVehicles?.map((v) => v.vehicleNumber) || [],
    );
    const vehiclesToInsert = VEHICLES.filter(
      (v) => !existingVNums.has(v.vehicleNumber),
    );
    if (vehiclesToInsert.length > 0) {
      const { error } = await supabase
        .from("vehicles")
        .insert(vehiclesToInsert);
      if (error) throw error;
      console.log(`✅ Inserted ${vehiclesToInsert.length} new vehicles.`);
    } else {
      console.log("ℹ️ Vehicles already seeded.");
    }

    // 5. Properties
    console.log("Seeding Properties...");
    const { error: propertiesErr } = await supabase
      .from("properties")
      .upsert(PROPERTIES, { onConflict: "oppuNumber" });
    if (propertiesErr) throw propertiesErr;
    console.log(`✅ Seeded ${PROPERTIES.length} properties.`);

    // 6. Users
    console.log("Seeding Users...");
    const { error: usersErr = null } = await supabase
      .from("users")
      .upsert(USERS, { onConflict: "email" });
    if (usersErr) throw usersErr;
    console.log(`✅ Seeded ${USERS.length} system users.`);

    // 7. Household Animals Relationship (LINKING TO ALL HOUSES)
    console.log("Seeding Household Animals Relationships...");
    const houseAnimalData = [];

    // Link each house to 2-5 random animals with more realistic counts
    HOUSEHOLDS.forEach((h, index) => {
      const numAnimals = Math.floor(Math.random() * 4) + 2; // 2-5 animals per household
      const shuffled = [...animalsData].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numAnimals);

      selected.forEach((a) => {
        // More realistic animal counts based on animal type
        let count = 1;
        if (
          a.name.toLowerCase().includes("chicken") ||
          a.name.toLowerCase().includes("duck")
        ) {
          count = Math.floor(Math.random() * 20) + 5; // Poultry: 5-25
        } else if (
          a.name.toLowerCase().includes("cow") ||
          a.name.toLowerCase().includes("buffalo")
        ) {
          count = Math.floor(Math.random() * 3) + 1; // Large livestock: 1-3
        } else if (
          a.name.toLowerCase().includes("goat") ||
          a.name.toLowerCase().includes("sheep")
        ) {
          count = Math.floor(Math.random() * 4) + 1; // Small livestock: 1-4
        } else if (a.name.toLowerCase().includes("pig")) {
          count = Math.floor(Math.random() * 2) + 1; // Pigs: 1-2
        } else {
          count = Math.floor(Math.random() * 3) + 1; // Other animals: 1-3
        }

        houseAnimalData.push({
          houseNumber: h.houseNumber,
          animalId: a.id,
          count: count,
        });
      });
    });

    const { error: relErr } = await supabase
      .from("household_animals")
      .upsert(houseAnimalData, { onConflict: "houseNumber,animalId" });
    if (relErr) throw relErr;
    console.log(
      `✅ Seeded ${houseAnimalData.length} household-animal relationships.`,
    );

    console.log("\n🌟 ALL DATA EXPANDED AND SEEDED SUCCESSFULLY!");
  } catch (err) {
    console.error("\n❌ Seeding Error:", err.message);
  }
}

seed();
