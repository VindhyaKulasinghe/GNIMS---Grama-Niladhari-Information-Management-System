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
  gender: string;
  maritalStatus: string;
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
  createdAt?: string;
  updatedAt?: string;
}

interface HouseholdDataContextType {
  // State
  households: Household[];
  familyMembers: FamilyMember[];
  animals: Animal[];
  householdAnimals: HouseholdAnimal[];
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
      setHouseholds(hh);
      setFamilyMembers(fm);
      setAnimals(a);
      setVehicles(v);
      setProperties(p);
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
      const newHousehold = await householdService.createHousehold(household);
      setHouseholds([...households, newHousehold]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add household';
      setError(message);
      throw err;
    }
  };

  const updateHousehold = async (id: number, household: Partial<Household>) => {
    try {
      const updated = await householdService.updateHousehold(id, household);
      setHouseholds(households.map(h => h.id === id ? updated : h));
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
      setHouseholds(hh);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh households';
      setError(message);
    }
  };

  // Family Member CRUD
  const addFamilyMember = async (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newMember = await familyMemberService.createFamilyMember(member);
      setFamilyMembers([...familyMembers, newMember]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add family member';
      setError(message);
      throw err;
    }
  };

  const updateFamilyMember = async (id: number, member: Partial<FamilyMember>) => {
    try {
      const updated = await familyMemberService.updateFamilyMember(id, member);
      setFamilyMembers(familyMembers.map(m => m.id === id ? updated : m));
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
      setFamilyMembers(fm);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh family members';
      setError(message);
    }
  };

  // Vehicle CRUD
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newVehicle = await vehicleService.createVehicle(vehicle);
      setVehicles([...vehicles, newVehicle]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add vehicle';
      setError(message);
      throw err;
    }
  };

  const updateVehicle = async (id: number, vehicle: Partial<Vehicle>) => {
    try {
      const updated = await vehicleService.updateVehicle(id, vehicle);
      setVehicles(vehicles.map(v => v.id === id ? updated : v));
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
      setVehicles(v);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh vehicles';
      setError(message);
    }
  };

  // Property CRUD
  const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProperty = await propertyService.createProperty(property);
      setProperties([...properties, newProperty]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add property';
      setError(message);
      throw err;
    }
  };

  const updateProperty = async (id: number, property: Partial<Property>) => {
    try {
      const updated = await propertyService.updateProperty(id, property);
      setProperties(properties.map(p => p.id === id ? updated : p));
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
      setProperties(p);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh properties';
      setError(message);
    }
  };

  // Animal CRUD
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
      setAnimals(a);
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
        familyMembers,
        animals,
        householdAnimals,
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
