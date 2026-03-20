import { supabase } from '../supabaseClient'
import { Household, HouseholdSchema } from '../validationSchemas'

// GET ALL HOUSEHOLDS
export async function getHouseholds(): Promise<Household[]> {
  const { data, error } = await supabase
    .from('households')
    .select('*')
    .order('houseNumber', { ascending: true })

  if (error) throw new Error(`Failed to fetch households: ${error.message}`)
  return data || []
}

// GET SINGLE HOUSEHOLD
export async function getHouseholdByNumber(houseNumber: string): Promise<Household | null> {
  const { data, error } = await supabase
    .from('households')
    .select('*')
    .eq('houseNumber', houseNumber)
    .single()

  if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch household: ${error.message}`)
  return data || null
}

// CREATE HOUSEHOLD
export async function createHousehold(household: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>): Promise<Household> {
  // Validate input
  const validated = HouseholdSchema.parse(household)

  const { data, error } = await supabase
    .from('households')
    .insert([validated])
    .select()
    .single()

  if (error) throw new Error(`Failed to create household: ${error.message}`)
  return data
}

// UPDATE HOUSEHOLD
export async function updateHousehold(id: number, household: Partial<Household>): Promise<Household> {
  // Validate input
  const validated = HouseholdSchema.partial().parse(household)

  const { data, error } = await supabase
    .from('households')
    .update(validated)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update household: ${error.message}`)
  return data
}

// DELETE HOUSEHOLD
export async function deleteHousehold(id: number): Promise<void> {
  const { error } = await supabase
    .from('households')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete household: ${error.message}`)
}

// GET HOUSEHOLDS BY STATISTICS
export async function getHouseholdStatistics() {
  const { data, error } = await supabase
    .from('households')
    .select('*')

  if (error) throw new Error(`Failed to fetch statistics: ${error.message}`)

  const total = data?.length || 0
  const withElectricity = data?.filter(h => h.electricity).length || 0
  const withWater = data?.filter(h => h.water).length || 0
  const withToilet = data?.filter(h => h.toilet).length || 0

  return {
    total,
    withElectricity,
    withWater,
    withToilet,
    withoutElectricity: total - withElectricity,
    withoutWater: total - withWater,
    withoutToilet: total - withToilet,
  }
}
