import { supabase } from '../supabaseClient'
import { FamilyMember, FamilyMemberSchema } from '../validationSchemas'

const OPTIONAL_DATE_FIELDS = ['retiredDate'] as const
const STUDENT_PENSION_FIELDS = [
  'pensionNumber',
  'pensionSalary',
  'retiredDate',
  'pensionDetails',
] as const

/** Normalize raw form/API payloads before Zod parse. */
function normalizeFamilyMemberInput(
  member: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...member }

  for (const field of OPTIONAL_DATE_FIELDS) {
    if (next[field] === '' || next[field] === undefined) {
      delete next[field]
    }
  }

  const birthYear = Number(next.birthYear)
  if (!Number.isFinite(birthYear) || birthYear < 1900) {
    delete next.birthYear
  }

  if (next.memberType === 'student') {
    next.isRetired = false
    for (const field of STUDENT_PENSION_FIELDS) {
      delete next[field]
    }
  }

  return next
}

/** Build the row sent to Supabase — never send "" to DATE columns. */
function prepareFamilyMemberRow(
  row: Record<string, unknown>,
  mode: 'insert' | 'update',
): Record<string, unknown> {
  const next = { ...row }

  for (const field of OPTIONAL_DATE_FIELDS) {
    if (next[field] === '') {
      next[field] = null
    }
    if (mode === 'insert' && (next[field] === null || next[field] === undefined)) {
      delete next[field]
    }
  }

  if (next.memberType === 'student') {
    next.isRetired = false
    if (mode === 'insert') {
      for (const field of STUDENT_PENSION_FIELDS) {
        delete next[field]
      }
    } else {
      next.pensionNumber = null
      next.pensionSalary = null
      next.retiredDate = null
      next.pensionDetails = null
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
  const normalized = normalizeFamilyMemberInput(member as Record<string, unknown>)
  const validated = FamilyMemberSchema.parse(normalized)
  const row = prepareFamilyMemberRow(validated as Record<string, unknown>, 'insert')

  const { data, error } = await supabase
    .from('family_members')
    .insert([row])
    .select()
    .single()

  if (error) throw new Error(`Failed to create family member: ${error.message}`)
  return data
}

// UPDATE FAMILY MEMBER
export async function updateFamilyMember(id: number, member: Partial<FamilyMember>): Promise<FamilyMember> {
  const normalized = normalizeFamilyMemberInput(member as Record<string, unknown>)
  const validated = FamilyMemberSchema.partial().parse(normalized)
  const row = prepareFamilyMemberRow(validated as Record<string, unknown>, 'update')

  const { data, error } = await supabase
    .from('family_members')
    .update(row)
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
