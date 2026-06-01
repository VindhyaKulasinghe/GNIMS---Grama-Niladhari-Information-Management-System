import { supabase } from '../supabaseClient'
import { FamilyMember, FamilyMemberSchema } from '../validationSchemas'

const OPTIONAL_DATE_FIELDS = ['retiredDate'] as const

/** Postgres DATE columns reject ""; normalize before insert/update. */
function sanitizeFamilyMemberForDb<T extends Record<string, unknown>>(row: T): T {
  const next = { ...row }

  for (const field of OPTIONAL_DATE_FIELDS) {
    if (field in next && (next[field] === '' || next[field] === undefined)) {
      next[field] = null
    }
  }

  if (next.memberType === 'student') {
    next.isRetired = false
    next.retiredDate = null
    for (const field of ['pensionNumber', 'pensionSalary', 'pensionDetails'] as const) {
      if (field in next && next[field] === '') {
        next[field] = null
      }
    }
  }

  return next
}

// GET ALL FAMILY MEMBERS
export async function getFamilyMembers(): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .order('fullName', { ascending: true })

  if (error) throw new Error(`Failed to fetch family members: ${error.message}`)
  return data || []
}

// GET FAMILY MEMBERS BY HOUSE
export async function getFamilyMembersByHouse(houseNumber: string): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('houseNumber', houseNumber)
    .order('isHeadOfHousehold', { ascending: false })

  if (error) throw new Error(`Failed to fetch family members: ${error.message}`)
  return data || []
}

// GET STUDENTS
export async function getStudents(): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('memberType', 'student')
    .order('fullName', { ascending: true })

  if (error) throw new Error(`Failed to fetch students: ${error.message}`)
  return data || []
}

// GET BOARDERS
export async function getBoarders(): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('memberType', 'boarder')
    .order('fullName', { ascending: true })

  if (error) throw new Error(`Failed to fetch boarders: ${error.message}`)
  return data || []
}

// CREATE FAMILY MEMBER
export async function createFamilyMember(member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<FamilyMember> {
  // Validate input
  const validated = sanitizeFamilyMemberForDb(
    FamilyMemberSchema.parse(member) as Record<string, unknown>,
  )

  const { data, error } = await supabase
    .from('family_members')
    .insert([validated])
    .select()
    .single()

  if (error) throw new Error(`Failed to create family member: ${error.message}`)
  return data
}

// UPDATE FAMILY MEMBER
export async function updateFamilyMember(id: number, member: Partial<FamilyMember>): Promise<FamilyMember> {
  // Validate input
  const validated = sanitizeFamilyMemberForDb(
    FamilyMemberSchema.partial().parse(member) as Record<string, unknown>,
  )

  const { data, error } = await supabase
    .from('family_members')
    .update(validated)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update family member: ${error.message}`)
  return data
}

// DELETE FAMILY MEMBER
export async function deleteFamilyMember(id: number): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete family member: ${error.message}`)
}
