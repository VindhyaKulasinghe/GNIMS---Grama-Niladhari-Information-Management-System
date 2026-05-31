import { supabase } from '../supabaseClient';

export interface Division {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// GET ALL DIVISIONS
export async function getDivisions(): Promise<Division[]> {
  try {
    const { data, error } = await supabase
      .from('divisions')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching divisions:', error);
    throw error;
  }
}

// CREATE DIVISION
export async function createDivision(name: string): Promise<Division> {
  try {
    const { data, error } = await supabase
      .from('divisions')
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating division:', error);
    throw error;
  }
}

// DELETE DIVISION
export async function deleteDivision(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('divisions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting division:', error);
    throw error;
  }
}
