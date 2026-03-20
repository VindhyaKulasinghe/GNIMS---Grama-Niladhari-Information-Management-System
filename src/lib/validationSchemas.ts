import { z } from 'zod'

// Household Schema
export const HouseholdSchema = z.object({
  id: z.number().optional(),
  houseNumber: z.string().min(1, 'House number is required'),
  address: z.string().min(1, 'Address is required'),
  telephone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  electricity: z.boolean(),
  water: z.boolean(),
  toilet: z.boolean(),
  roofType: z.string().min(1, 'Roof type is required'),
  wallType: z.string().min(1, 'Wall type is required'),
  floorType: z.string().min(1, 'Floor type is required'),
  cow: z.number().min(0),
  chicken: z.number().min(0),
  goat: z.number().min(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Household = z.infer<typeof HouseholdSchema>

// Family Member Schema
export const FamilyMemberSchema = z.object({
  id: z.number().optional(),
  houseNumber: z.string().min(1, 'House number is required'),
  uniqueNumber: z.string().min(1, 'Unique number is required'),
  fullName: z.string().min(1, 'Full name is required'),
  nicNumber: z.string().min(1, 'NIC number is required'),
  birthYear: z.number().min(1900).max(new Date().getFullYear()),
  age: z.number().min(0).max(150),
  nationality: z.string().min(1, 'Nationality is required'),
  religion: z.string().min(1, 'Religion is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  maritalStatus: z.enum(['Single', 'Married', 'Widowed', 'Separated', 'Divorced']),
  educationStatus: z.string().min(1, 'Education status is required'),
  isHeadOfHousehold: z.boolean(),
  memberType: z.enum(['regular', 'student', 'boarder']),
  jobType: z.string().optional(),
  trainingReceived: z.string().optional(),
  sector: z.string().optional(),
  monthlyIncome: z.string().optional(),
  grade: z.string().optional(),
  institutionName: z.string().optional(),
  purpose: z.string().optional(),
  boarderDistrict: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type FamilyMember = z.infer<typeof FamilyMemberSchema>

// Vehicle Schema
export const VehicleSchema = z.object({
  id: z.number().optional(),
  userId: z.string().optional(),
  houseNumber: z.string().min(1, 'House number is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  registrationYear: z.number().min(1900).max(new Date().getFullYear() + 1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Vehicle = z.infer<typeof VehicleSchema>

// Property Schema
export const PropertySchema = z.object({
  id: z.number().optional(),
  userId: z.string().optional(),
  houseNumber: z.string().min(1, 'House number is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  propertyType: z.string().min(1, 'Property type is required'),
  propertyCategory: z.enum(['living', 'additional']),
  oppuNumber: z.string().min(1, 'OPPU number is required'),
  landSize: z.string().min(1, 'Land size is required'),
  ownership: z.string().min(1, 'Ownership is required'),
  agriculturalUse: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Property = z.infer<typeof PropertySchema>

// Animal Schema
export const AnimalSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Animal name is required'),
  category: z.string().min(1, 'Animal category is required'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Animal = z.infer<typeof AnimalSchema>

// Household Animal Schema
export const HouseholdAnimalSchema = z.object({
  id: z.number().optional(),
  houseNumber: z.string().min(1, 'House number is required'),
  animalId: z.number(),
  count: z.number().min(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type HouseholdAnimal = z.infer<typeof HouseholdAnimalSchema>

// User Schema
export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['Admin', 'GN Officer', 'Divisional Secretariat']),
  division: z.string().min(1, 'Division is required'),
  status: z.enum(['Active', 'Inactive']),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>
