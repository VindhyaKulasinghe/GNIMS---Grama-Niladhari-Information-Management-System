import { supabase } from '../supabaseClient'
import { Vehicle, VehicleSchema } from '../validationSchemas'

// GET ALL VEHICLES
export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('vehicleNumber', { ascending: true })

  if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`)
  return data || []
}

// GET VEHICLES BY HOUSE
export async function getVehiclesByHouse(houseNumber: string): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('houseNumber', houseNumber)
    .order('vehicleNumber', { ascending: true })

  if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`)
  return data || []
}

// CREATE VEHICLE
export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
  // Validate input
  const validated = VehicleSchema.parse(vehicle)

  const { data, error } = await supabase
    .from('vehicles')
    .insert([validated])
    .select()
    .single()

  if (error) throw new Error(`Failed to create vehicle: ${error.message}`)
  return data
}

// UPDATE VEHICLE
export async function updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
  // Validate input
  const validated = VehicleSchema.partial().parse(vehicle)

  const { data, error } = await supabase
    .from('vehicles')
    .update(validated)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update vehicle: ${error.message}`)
  return data
}

// DELETE VEHICLE
export async function deleteVehicle(id: number): Promise<void> {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete vehicle: ${error.message}`)
}
