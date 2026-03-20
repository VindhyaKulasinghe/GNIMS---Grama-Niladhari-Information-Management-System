import { supabase } from '../supabaseClient'
import { Property, PropertySchema } from '../validationSchemas'

// GET ALL PROPERTIES
export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('oppuNumber', { ascending: true })

  if (error) throw new Error(`Failed to fetch properties: ${error.message}`)
  return data || []
}

// GET PROPERTIES BY HOUSE
export async function getPropertiesByHouse(houseNumber: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('houseNumber', houseNumber)
    .order('propertyType', { ascending: true })

  if (error) throw new Error(`Failed to fetch properties: ${error.message}`)
  return data || []
}

// CREATE PROPERTY
export async function createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
  // Validate input
  const validated = PropertySchema.parse(property)

  const { data, error } = await supabase
    .from('properties')
    .insert([validated])
    .select()
    .single()

  if (error) throw new Error(`Failed to create property: ${error.message}`)
  return data
}

// UPDATE PROPERTY
export async function updateProperty(id: number, property: Partial<Property>): Promise<Property> {
  // Validate input
  const validated = PropertySchema.partial().parse(property)

  const { data, error } = await supabase
    .from('properties')
    .update(validated)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update property: ${error.message}`)
  return data
}

// DELETE PROPERTY
export async function deleteProperty(id: number): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete property: ${error.message}`)
}
