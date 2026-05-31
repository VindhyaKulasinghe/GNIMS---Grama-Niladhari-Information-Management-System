import { supabase } from "../supabaseClient";
import {
  HouseholdBenefit,
  HouseholdBenefitSchema,
} from "../validationSchemas";
import { BenefitType } from "../benefitTypes";

export async function getAllHouseholdBenefits(): Promise<HouseholdBenefit[]> {
  const { data, error } = await supabase
    .from("household_benefits")
    .select("*")
    .order("houseNumber", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch household benefits: ${error.message}`);
  }

  return data || [];
}

export async function upsertHouseholdBenefit(
  benefit: Omit<HouseholdBenefit, "id" | "createdAt" | "updatedAt">,
): Promise<HouseholdBenefit> {
  const validated = HouseholdBenefitSchema.parse(benefit);

  const { data, error } = await supabase
    .from("household_benefits")
    .upsert([validated], {
      onConflict: "division,houseNumber,benefitType",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save household benefit: ${error.message}`);
  }

  return data;
}

export type BenefitSaveInput = {
  benefitType: BenefitType;
  isReceiving: boolean;
  receiverMemberId?: number | null;
  otherNotes?: string | null;
};

export async function saveBenefitsForHouse(
  houseNumber: string,
  division: string,
  benefits: BenefitSaveInput[],
): Promise<HouseholdBenefit[]> {
  if (!division) {
    throw new Error("Division is required for household benefits");
  }

  const results = await Promise.all(
    benefits.map((row) =>
      upsertHouseholdBenefit({
        houseNumber,
        division,
        benefitType: row.benefitType,
        isReceiving: row.isReceiving,
        receiverMemberId: row.isReceiving ? row.receiverMemberId ?? null : null,
        otherNotes: row.otherNotes?.trim() || null,
      }),
    ),
  );

  return results;
}
