/* eslint-disable */
import { z } from "zod";
import { BENEFIT_TYPES } from "./benefitTypes";
import { CERTIFICATE_TYPES } from "./certificateTypes";

const currentYear = new Date().getFullYear();

const looseText = z.preprocess(
  (val) => (val === null || val === undefined ? "" : String(val)),
  z.string(),
);

const loosePhone = z.preprocess(
  (val) => (val === null || val === undefined ? "" : String(val)),
  z
    .string()
    .refine((v) => v === "" || /^\d{10}$/.test(v), {
      message: "Phone must be 10 digits when provided",
    }),
);

const looseNic = z.preprocess(
  (val) => (val === null || val === undefined ? "" : String(val)),
  z
    .string()
    .refine((v) => !v || /^(\d{9}[VvXx]|\d{12})$/.test(v), {
      message: "Invalid NIC format",
    }),
);

const looseYear = z.preprocess((val) => {
  if (val === null || val === undefined || val === "") {
    return currentYear;
  }
  const n = Number(val);
  return Number.isFinite(n) ? n : currentYear;
}, z.number().min(1900).max(currentYear + 1));

const looseCount = z.preprocess((val) => {
  if (val === null || val === undefined || val === "") {
    return 0;
  }
  const n = Number(val);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}, z.number().min(0));

const looseGender = z.preprocess(
  (val) => (val === null || val === undefined || val === "" ? "Male" : val),
  z.enum(["Male", "Female", "Other"]),
);

const looseMaritalStatus = z.preprocess(
  (val) => (val === null || val === undefined || val === "" ? "Single" : val),
  z.enum(["Single", "Married", "Widowed", "Separated", "Divorced"]),
);

const looseMemberType = z.preprocess(
  (val) => (val === null || val === undefined || val === "" ? "regular" : val),
  z.enum(["regular", "student", "boarder"]),
);

const loosePropertyCategory = z.preprocess(
  (val) => (val === null || val === undefined || val === "" ? "living" : val),
  z.enum(["living", "additional"]),
);

const looseCertificateType = z.preprocess((val) => {
  const text = val === null || val === undefined ? "" : String(val);
  if ((CERTIFICATE_TYPES as readonly string[]).includes(text)) {
    return text;
  }
  return CERTIFICATE_TYPES[0];
}, z.enum(CERTIFICATE_TYPES));

const looseIssueDate = z.preprocess((val) => {
  const text = val === null || val === undefined ? "" : String(val).trim();
  return text || new Date().toISOString().slice(0, 10);
}, z.string());

/** Empty strings → null for optional Postgres DATE columns */
const looseOptionalDate = z.preprocess((val) => {
  if (val === null || val === undefined) return null;
  const text = String(val).trim();
  return text === "" ? null : text;
}, z.string().nullable().optional());

// Household Schema — all fields optional for partial GN records
export const HouseholdSchema = z.object({
  id: z.number().optional(),
  houseNumber: looseText,
  address: looseText,
  telephone: loosePhone,
  electricity: z.boolean().default(false),
  water: z.boolean().default(false),
  toilet: z.boolean().default(false),
  roofType: looseText,
  wallType: looseText,
  floorType: looseText,
  cow: looseCount,
  chicken: looseCount,
  goat: looseCount,
  division: looseText.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Household = z.infer<typeof HouseholdSchema>;

// Family Member Schema
export const FamilyMemberSchema = z.object({
  id: z.number().optional(),
  houseNumber: looseText,
  uniqueNumber: looseText,
  fullName: looseText,
  nicNumber: looseNic,
  birthYear: looseYear,
  age: looseCount,
  nationality: looseText,
  religion: looseText,
  gender: looseGender,
  maritalStatus: looseMaritalStatus,
  educationStatus: looseText,
  isHeadOfHousehold: z.boolean().default(false),
  memberType: looseMemberType,
  jobType: z.string().nullish(),
  trainingReceived: z.string().nullish(),
  sector: z.string().nullish(),
  monthlyIncome: z.string().nullish(),
  isRetired: z.boolean().default(false),
  pensionNumber: z.string().nullish(),
  pensionSalary: z.string().nullish(),
  retiredDate: looseOptionalDate,
  pensionDetails: z.string().nullish(),
  grade: z.string().nullish(),
  institutionName: z.string().nullish(),
  purpose: z.string().nullish(),
  boarderDistrict: z.string().nullish(),
  boarderCountry: z.string().nullish(),
  division: looseText.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type FamilyMember = z.infer<typeof FamilyMemberSchema>;

// Vehicle Schema
export const VehicleSchema = z.object({
  id: z.number().optional(),
  userId: z.string().nullish(),
  houseNumber: looseText,
  ownerName: looseText,
  ownerAddress: looseText,
  ownerPhone: loosePhone,
  vehicleType: looseText,
  vehicleNumber: looseText,
  registrationYear: looseYear,
  division: looseText.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

// Property Schema
export const PropertySchema = z.object({
  id: z.number().optional(),
  userId: z.string().nullish(),
  houseNumber: looseText,
  ownerName: looseText,
  ownerAddress: looseText,
  ownerPhone: loosePhone,
  propertyType: looseText,
  propertyCategory: loosePropertyCategory,
  oppuNumber: looseText,
  landSize: looseText,
  ownership: looseText,
  agriculturalUse: z.string().nullish(),
  division: looseText.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Property = z.infer<typeof PropertySchema>;

// Animal Schema
export const AnimalSchema = z.object({
  id: z.number().optional(),
  name: looseText,
  category: looseText,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Animal = z.infer<typeof AnimalSchema>;

// Household Animal Schema
export const HouseholdAnimalSchema = z.object({
  id: z.number().optional(),
  houseNumber: looseText,
  animalId: z.preprocess((val) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  }, z.number()),
  count: z.preprocess((val) => {
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, z.number().min(1)),
  division: looseText.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type HouseholdAnimal = z.infer<typeof HouseholdAnimalSchema>;

export const HouseholdBenefitSchema = z.object({
  id: z.number().optional(),
  houseNumber: looseText,
  division: looseText,
  benefitType: z.enum(BENEFIT_TYPES),
  isReceiving: z.boolean(),
  receiverMemberId: z.number().nullish(),
  otherNotes: z.string().nullish(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type HouseholdBenefit = z.infer<typeof HouseholdBenefitSchema>;

export const CertificateIssuanceSchema = z.object({
  id: z.number().optional(),
  division: looseText,
  certificateType: looseCertificateType,
  issueDate: looseIssueDate,
  houseNumber: z.string().nullish(),
  recipientMemberId: z.number().nullish(),
  recipientName: looseText,
  recipientNic: z.string().nullish(),
  recipientAddress: z.string().nullish(),
  purpose: z.string().nullish(),
  referenceNumber: z.string().nullish(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CertificateIssuance = z.infer<typeof CertificateIssuanceSchema>;

// User Schema — keep required for admin user management / auth
export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["Admin", "GN Officer", "Divisional Secretariat"]),
  division: z.string().min(1, "Division is required"),
  status: z.enum(["Active", "Inactive"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
