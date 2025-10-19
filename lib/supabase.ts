import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (generated from Supabase schema)
export interface Country {
  id: number
  country_code: string
  country_name: string
  region: string
  created_at?: string
}

export interface AcademicYear {
  id: number
  year_label: string
  start_year: number
  end_year: number
  is_active: boolean
  created_at?: string
}

export interface User {
  id: string
  email: string
  full_name: string
  country_id?: number
  role: 'statistician' | 'admin' | 'viewer'
  created_at?: string
}

export interface DataSubmission {
  id: number
  country_id: number
  academic_year_id: number
  submitted_by: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submitted_at?: string
  approved_at?: string
  approved_by?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

// Institutions
export interface Institutions {
  id: number
  country_id: number
  academic_year_id: number
  daycare_public: number
  daycare_private_church: number
  daycare_private_non_affiliated: number
  preschool_public: number
  preschool_private_church: number
  preschool_private_non_affiliated: number
  primary_public: number
  primary_private_church: number
  primary_private_non_affiliated: number
  secondary_public: number
  secondary_private_church: number
  secondary_private_non_affiliated: number
  special_ed_public: number
  special_ed_private_church: number
  special_ed_private_non_affiliated: number
  tvet_public: number
  tvet_private_church: number
  tvet_private_non_affiliated: number
  post_secondary_public: number
  post_secondary_private: number
  created_at?: string
  updated_at?: string
}

// Student Enrollment - Early Childhood
export interface EarlyChildhoodEnrollment {
  id: number
  country_id: number
  academic_year_id: number
  institution_type: 'Public' | 'Private/Gov Assisted'
  age_group: string
  male: number
  female: number
  created_at?: string
  updated_at?: string
}

// Student Enrollment - Primary
export interface PrimaryEnrollment {
  id: number
  country_id: number
  academic_year_id: number
  school_type: 'Public' | 'Private'
  age_group: string
  k_male: number
  k_female: number
  g1_male: number
  g1_female: number
  g2_male: number
  g2_female: number
  g3_male: number
  g3_female: number
  g4_male: number
  g4_female: number
  g5_male: number
  g5_female: number
  g6_male: number
  g6_female: number
  subtotal_male: number
  subtotal_female: number
  created_at?: string
  updated_at?: string
}

// Student Enrollment - Secondary
export interface SecondaryEnrollment {
  id: number
  country_id: number
  academic_year_id: number
  school_type: 'Public' | 'Private'
  age_group: string
  f1_male: number
  f1_female: number
  f2_male: number
  f2_female: number
  f3_male: number
  f3_female: number
  f4_male: number
  f4_female: number
  f5_male: number
  f5_female: number
  f6_male: number
  f6_female: number
  subtotal_male: number
  subtotal_female: number
  created_at?: string
  updated_at?: string
}

// Helper functions for data operations
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*, countries(*)')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error getting user profile:', error)
    return null
  }
  return data
}

export async function getCountries() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('country_name')

  if (error) {
    console.error('Error fetching countries:', error)
    return []
  }
  return data
}

export async function getAcademicYears() {
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .order('start_year', { ascending: false })

  if (error) {
    console.error('Error fetching academic years:', error)
    return []
  }
  return data
}

export async function getActiveAcademicYear() {
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching active academic year:', error)
    return null
  }
  return data
}
