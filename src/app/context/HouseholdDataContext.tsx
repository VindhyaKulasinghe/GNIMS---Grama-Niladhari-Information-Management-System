import React, { createContext, useContext, useState, useEffect } from "react";
import * as householdService from "../../lib/services/householdService";
import * as familyMemberService from "../../lib/services/familyMemberService";
import * as animalService from "../../lib/services/animalService";
import * as vehicleService from "../../lib/services/vehicleService";
import * as propertyService from "../../lib/services/propertyService";

export interface Animal {
  id: number;
  name: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HouseholdAnimal {
  id?: number;
  houseNumber: string;
  animalId: number;
  count: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: number;
  userId?: string;
  houseNumber: string;
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
  vehicleType: string;
  vehicleNumber: string;
  registrationYear: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  id: number;
  userId?: string;
  houseNumber: string;
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
  propertyType: string;
  propertyCategory: "living" | "additional";
  oppuNumber: string;
  landSize: string;
  ownership: string;
  agriculturalUse?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Household {
  id: number;
  houseNumber: string;
  address: string;
  telephone: string;
  electricity: boolean;
  water: boolean;
  toilet: boolean;
  roofType: string;
  wallType: string;
  floorType: string;
  cow: number;
  chicken: number;
  goat: number;
  createdAt?: string;
  updatedAt?: string;
}

export type MemberType = "regular" | "student" | "boarder";

export interface FamilyMember {
  id: number;
  houseNumber: string;
  uniqueNumber: string;
  fullName: string;
  nicNumber: string;
  birthYear: number;
  age: number;
  nationality: string;
  religion: string;
  gender: "Male" | "Female" | "Other";
  maritalStatus: "Single" | "Married" | "Widowed" | "Separated" | "Divorced";
  educationStatus: string;
  isHeadOfHousehold: boolean;
  memberType: MemberType;
  jobType?: string;
  trainingReceived?: string;
  sector?: string;
  monthlyIncome?: string;
  grade?: string;
  institutionName?: string;
  purpose?: string;
  boarderDistrict?: string;
  boarderCountry?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HouseholdDataContextType {
  // State
  households: Household[];
  setHouseholds: React.Dispatch<React.SetStateAction<Household[]>>;
  familyMembers: FamilyMember[];
  animals: Animal[];
  householdAnimals: HouseholdAnimal[];
  setHouseholdAnimals: React.Dispatch<React.SetStateAction<HouseholdAnimal[]>>;
  vehicles: Vehicle[];
  properties: Property[];
  loading: boolean;
  error: string | null;

  // Household CRUD
  addHousehold: (household: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHousehold: (id: number, household: Partial<Household>) => Promise<void>;
  deleteHousehold: (id: number) => Promise<void>;
  refreshHouseholds: () => Promise<void>;

  // Family Member CRUD
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFamilyMember: (id: number, member: Partial<FamilyMember>) => Promise<void>;
  deleteFamilyMember: (id: number) => Promise<void>;
  refreshFamilyMembers: () => Promise<void>;

  // Vehicle CRUD
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
  refreshVehicles: () => Promise<void>;

  // Property CRUD
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProperty: (id: number, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: number) => Promise<void>;
  refreshProperties: () => Promise<void>;

  // Animal CRUD
  addAnimal: (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAnimal: (id: number, animal: Partial<Animal>) => Promise<void>;
  deleteAnimal: (id: number) => Promise<void>;
  addHouseholdAnimal: (houseNumber: string, animalId: number, count: number) => Promise<void>;
  deleteHouseholdAnimal: (houseNumber: string, animalId: number) => Promise<void>;
  refreshAnimals: () => Promise<void>;

  // Helper functions
  getMembersForHouse: (houseNumber: string) => FamilyMember[];
  getStudents: () => FamilyMember[];
  getBoarders: () => FamilyMember[];
  getAnimalsForHouse: (houseNumber: string) => HouseholdAnimal[];
}

const HouseholdDataContext = createContext<HouseholdDataContextType | undefined>(undefined);

export const HouseholdDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [householdAnimals, setHouseholdAnimals] = useState<HouseholdAnimal[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [hh, fm, a, v, p] = await Promise.all([
        householdService.getHouseholds(),
        familyMemberService.getFamilyMembers(),
        animalService.getAnimals(),
        vehicleService.getVehicles(),
        propertyService.getProperties(),
      ]);
      setHouseholds(hh as Household[]);
      setFamilyMembers(fm as FamilyMember[]);
      setAnimals(a as Animal[]);
      setVehicles(v as Vehicle[]);
      setProperties(p as Property[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Household CRUD
  const addHousehold = async (household: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newHousehold = await householdService.createHousehold(household as any);
      setHouseholds([...households, newHousehold as Household]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add household';
      setError(message);
      throw err;
    }
  };

  const updateHousehold = async (id: number, household: Partial<Household>) => {
    try {
      const updated = await householdService.updateHousehold(id, household as any);
      setHouseholds(households.map(h => h.id === id ? updated as Household : h));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update household';
      setError(message);
      throw err;
    }
  };

  const deleteHousehold = async (id: number) => {
    try {
      await householdService.deleteHousehold(id);
      setHouseholds(households.filter(h => h.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete household';
      setError(message);
      throw err;
    }
  };

  const refreshHouseholds = async () => {
    try {
      const hh = await householdService.getHouseholds();
      setHouseholds(hh as Household[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh households';
      setError(message);
    }
  };

  // Family Member CRUD
  const addFamilyMember = async (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newMember = await familyMemberService.createFamilyMember(member as any);
      setFamilyMembers([...familyMembers, newMember as FamilyMember]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add family member';
      setError(message);
      throw err;
    }
  };

  const updateFamilyMember = async (id: number, member: Partial<FamilyMember>) => {
    try {
      const updated = await familyMemberService.updateFamilyMember(id, member as any);
      setFamilyMembers(familyMembers.map(m => m.id === id ? updated as FamilyMember : m));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update family member';
      setError(message);
      throw err;
    }
  };

  const deleteFamilyMember = async (id: number) => {
    try {
      await familyMemberService.deleteFamilyMember(id);
      setFamilyMembers(familyMembers.filter(m => m.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete family member';
      setError(message);
      throw err;
    }
  };

  const refreshFamilyMembers = async () => {
    try {
      const fm = await familyMemberService.getFamilyMembers();
      setFamilyMembers(fm as FamilyMember[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh family members';
      setError(message);
    }
  };

  // Vehicle CRUD
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newVehicle = await vehicleService.createVehicle(vehicle as any);
      setVehicles([...vehicles, newVehicle as Vehicle]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add vehicle';
      setError(message);
      throw err;
    }
  };

  const updateVehicle = async (id: number, vehicle: Partial<Vehicle>) => {
    try {
      const updated = await vehicleService.updateVehicle(id, vehicle as any);
      setVehicles(vehicles.map(v => v.id === id ? updated as Vehicle : v));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update vehicle';
      setError(message);
      throw err;
    }
  };

  const deleteVehicle = async (id: number) => {
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete vehicle';
      setError(message);
      throw err;
    }
  };

  const refreshVehicles = async () => {
    try {
      const v = await vehicleService.getVehicles();
      setVehicles(v as Vehicle[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh vehicles';
      setError(message);
    }
  };

  // Property CRUD
  const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProperty = await propertyService.createProperty(property as any);
      setProperties([...properties, newProperty as Property]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add property';
      setError(message);
      throw err;
    }
  };

  const updateProperty = async (id: number, property: Partial<Property>) => {
    try {
      const updated = await propertyService.updateProperty(id, property as any);
      setProperties(properties.map(p => p.id === id ? updated as Property : p));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update property';
      setError(message);
      throw err;
    }
  };

  const deleteProperty = async (id: number) => {
    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete property';
      setError(message);
      throw err;
    }
  };

  const refreshProperties = async () => {
    try {
      const p = await propertyService.getProperties();
      setProperties(p as Property[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh properties';
      setError(message);
    }
  };

  // Animal CRUD
  const addAnimal = async (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAnimal = await animalService.createAnimal(animal as any);
      setAnimals([...animals, newAnimal as Animal]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add animal';
      setError(message);
      throw err;
    }
  };

  const updateAnimal = async (id: number, animal: Partial<Animal>) => {
    try {
      const updated = await animalService.updateAnimal(id, animal as any);
      setAnimals(animals.map(a => a.id === id ? updated as Animal : a));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update animal';
      setError(message);
      throw err;
    }
  };

  const deleteAnimal = async (id: number) => {
    try {
      await animalService.deleteAnimal(id);
      setAnimals(animals.filter(a => a.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete animal';
      setError(message);
      throw err;
    }
  };

  const addHouseholdAnimal = async (houseNumber: string, animalId: number, count: number) => {
    try {
      const newAnimal = await animalService.upsertHouseholdAnimal(houseNumber, animalId, count);
      const existing = householdAnimals.findIndex(ha => ha.houseNumber === houseNumber && ha.animalId === animalId);
      if (existing >= 0) {
        const updated = [...householdAnimals];
        updated[existing] = newAnimal;
        setHouseholdAnimals(updated);
      } else {
        setHouseholdAnimals([...householdAnimals, newAnimal]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add household animal';
      setError(message);
      throw err;
    }
  };

  const deleteHouseholdAnimal = async (houseNumber: string, animalId: number) => {
    try {
      await animalService.deleteHouseholdAnimal(houseNumber, animalId);
      setHouseholdAnimals(householdAnimals.filter(ha => !(ha.houseNumber === houseNumber && ha.animalId === animalId)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete household animal';
      setError(message);
      throw err;
    }
  };

  const refreshAnimals = async () => {
    try {
      const a = await animalService.getAnimals();
      setAnimals(a as Animal[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh animals';
      setError(message);
    }
  };

  // Helper functions
  const getMembersForHouse = (houseNumber: string) =>
    familyMembers.filter((m) => m.houseNumber === houseNumber);

  const getStudents = () => familyMembers.filter((m) => m.memberType === "student");

  const getBoarders = () => familyMembers.filter((m) => m.memberType === "boarder");

  const getAnimalsForHouse = (houseNumber: string) =>
    householdAnimals.filter((ha) => ha.houseNumber === houseNumber);

  return (
    <HouseholdDataContext.Provider
      value={{
        households,
        setHouseholds,
        familyMembers,
        animals,
        householdAnimals,
        setHouseholdAnimals,
        vehicles,
        properties,
        loading,
        error,
        addHousehold,
        updateHousehold,
        deleteHousehold,
        refreshHouseholds,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        refreshFamilyMembers,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        refreshVehicles,
        addProperty,
        updateProperty,
        deleteProperty,
        refreshProperties,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        addHouseholdAnimal,
        deleteHouseholdAnimal,
        refreshAnimals,
        getMembersForHouse,
        getStudents,
        getBoarders,
        getAnimalsForHouse,
      }}
    >
      {children}
    </HouseholdDataContext.Provider>
  );
};

export const useHouseholdData = () => {
  const context = useContext(HouseholdDataContext);
  if (!context) {
    throw new Error("useHouseholdData must be used within HouseholdDataProvider");
  }
  return context;
};
