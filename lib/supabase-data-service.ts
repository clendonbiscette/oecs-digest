import { supabase } from './supabase'

// Types for the aggregated data that dashboard expects
export interface EducationSummary {
  country_code: string
  country_name: string
  total_daycare_centres: number
  total_preschools: number
  total_primary_schools: number
  total_secondary_schools: number
  total_special_ed_schools: number
  total_tvet_institutions: number
  total_post_secondary: number
}

export interface Country {
  country_code: string
  country_name: string
  region: string
}

export interface EarlyChildhoodData {
  country_code: string
  country_name: string
  daycare_public: number
  daycare_private_church: number
  daycare_private_non_affiliated: number
  daycare_total: number
  preschool_public: number
  preschool_private_church: number
  preschool_private_non_affiliated: number
  preschool_total: number
}

export interface EducationalInstitutionsData {
  country_code: string
  country_name: string
  primary_public: number
  primary_private_church: number
  primary_private_non_affiliated: number
  primary_total: number
  secondary_public: number
  secondary_private_church: number
  secondary_private_non_affiliated: number
  secondary_total: number
  special_ed_public: number
  special_ed_private_church: number
  special_ed_private_non_affiliated: number
  special_ed_total: number
  tvet_public: number
  tvet_private_church: number
  tvet_private_non_affiliated: number
  tvet_total: number
}

export interface PostSecondaryData {
  country_code: string
  country_name: string
  public_institutions: number
  private_institutions: number
  total: number
}

/**
 * Get education summary for all countries for the active academic year
 * Aggregates institution counts from the institutions table
 */
export async function getEducationSummary(): Promise<EducationSummary[]> {
  try {
    // Get active academic year
    const { data: activeYear, error: yearError } = await supabase
      .from('academic_years')
      .select('id')
      .eq('is_active', true)
      .single()

    if (yearError) {
      console.error('Error fetching active academic year:', yearError)
      return []
    }

    // Get institutions data with country information
    const { data: institutions, error: instError } = await supabase
      .from('institutions')
      .select(`
        *,
        countries (
          country_code,
          country_name
        )
      `)
      .eq('academic_year_id', activeYear.id)

    if (instError) {
      console.error('Error fetching institutions:', instError)
      return []
    }

    if (!institutions || institutions.length === 0) {
      return []
    }

    // Transform to EducationSummary format
    const summary: EducationSummary[] = institutions.map((inst: any) => ({
      country_code: inst.countries.country_code,
      country_name: inst.countries.country_name,
      total_daycare_centres: inst.daycare_public + inst.daycare_private_church + inst.daycare_private_non_affiliated,
      total_preschools: inst.preschool_public + inst.preschool_private_church + inst.preschool_private_non_affiliated,
      total_primary_schools: inst.primary_public + inst.primary_private_church + inst.primary_private_non_affiliated,
      total_secondary_schools: inst.secondary_public + inst.secondary_private_church + inst.secondary_private_non_affiliated,
      total_special_ed_schools: inst.special_ed_public + inst.special_ed_private_church + inst.special_ed_private_non_affiliated,
      total_tvet_institutions: inst.tvet_public + inst.tvet_private_church + inst.tvet_private_non_affiliated,
      total_post_secondary: inst.post_secondary_public + inst.post_secondary_private,
    }))

    return summary.sort((a, b) => a.country_name.localeCompare(b.country_name))
  } catch (error) {
    console.error('Unexpected error in getEducationSummary:', error)
    return []
  }
}

/**
 * Get all countries
 */
export async function getCountries(): Promise<Country[]> {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('country_code, country_name, region')
      .order('country_name')

    if (error) {
      console.error('Error fetching countries:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error in getCountries:', error)
    return []
  }
}

/**
 * Get early childhood data (daycare and preschool) by country
 */
export async function getEarlyChildhoodData(): Promise<EarlyChildhoodData[]> {
  try {
    // Get active academic year
    const { data: activeYear, error: yearError } = await supabase
      .from('academic_years')
      .select('id')
      .eq('is_active', true)
      .single()

    if (yearError) {
      console.error('Error fetching active academic year:', yearError)
      return []
    }

    const { data: institutions, error } = await supabase
      .from('institutions')
      .select(`
        daycare_public,
        daycare_private_church,
        daycare_private_non_affiliated,
        preschool_public,
        preschool_private_church,
        preschool_private_non_affiliated,
        countries (
          country_code,
          country_name
        )
      `)
      .eq('academic_year_id', activeYear.id)
      .order('countries(country_name)')

    if (error) {
      console.error('Error fetching early childhood data:', error)
      return []
    }

    if (!institutions) return []

    return institutions.map((inst: any) => ({
      country_code: inst.countries.country_code,
      country_name: inst.countries.country_name,
      daycare_public: inst.daycare_public,
      daycare_private_church: inst.daycare_private_church,
      daycare_private_non_affiliated: inst.daycare_private_non_affiliated,
      daycare_total: inst.daycare_public + inst.daycare_private_church + inst.daycare_private_non_affiliated,
      preschool_public: inst.preschool_public,
      preschool_private_church: inst.preschool_private_church,
      preschool_private_non_affiliated: inst.preschool_private_non_affiliated,
      preschool_total: inst.preschool_public + inst.preschool_private_church + inst.preschool_private_non_affiliated,
    }))
  } catch (error) {
    console.error('Unexpected error in getEarlyChildhoodData:', error)
    return []
  }
}

/**
 * Get educational institutions data (primary, secondary, special ed, TVET)
 */
export async function getEducationalInstitutionsData(): Promise<EducationalInstitutionsData[]> {
  try {
    // Get active academic year
    const { data: activeYear, error: yearError } = await supabase
      .from('academic_years')
      .select('id')
      .eq('is_active', true)
      .single()

    if (yearError) {
      console.error('Error fetching active academic year:', yearError)
      return []
    }

    const { data: institutions, error } = await supabase
      .from('institutions')
      .select(`
        primary_public,
        primary_private_church,
        primary_private_non_affiliated,
        secondary_public,
        secondary_private_church,
        secondary_private_non_affiliated,
        special_ed_public,
        special_ed_private_church,
        special_ed_private_non_affiliated,
        tvet_public,
        tvet_private_church,
        tvet_private_non_affiliated,
        countries (
          country_code,
          country_name
        )
      `)
      .eq('academic_year_id', activeYear.id)
      .order('countries(country_name)')

    if (error) {
      console.error('Error fetching educational institutions data:', error)
      return []
    }

    if (!institutions) return []

    return institutions.map((inst: any) => ({
      country_code: inst.countries.country_code,
      country_name: inst.countries.country_name,
      primary_public: inst.primary_public,
      primary_private_church: inst.primary_private_church,
      primary_private_non_affiliated: inst.primary_private_non_affiliated,
      primary_total: inst.primary_public + inst.primary_private_church + inst.primary_private_non_affiliated,
      secondary_public: inst.secondary_public,
      secondary_private_church: inst.secondary_private_church,
      secondary_private_non_affiliated: inst.secondary_private_non_affiliated,
      secondary_total: inst.secondary_public + inst.secondary_private_church + inst.secondary_private_non_affiliated,
      special_ed_public: inst.special_ed_public,
      special_ed_private_church: inst.special_ed_private_church,
      special_ed_private_non_affiliated: inst.special_ed_private_non_affiliated,
      special_ed_total: inst.special_ed_public + inst.special_ed_private_church + inst.special_ed_private_non_affiliated,
      tvet_public: inst.tvet_public,
      tvet_private_church: inst.tvet_private_church,
      tvet_private_non_affiliated: inst.tvet_private_non_affiliated,
      tvet_total: inst.tvet_public + inst.tvet_private_church + inst.tvet_private_non_affiliated,
    }))
  } catch (error) {
    console.error('Unexpected error in getEducationalInstitutionsData:', error)
    return []
  }
}

/**
 * Get post-secondary institutions data
 */
export async function getPostSecondaryData(): Promise<PostSecondaryData[]> {
  try {
    // Get active academic year
    const { data: activeYear, error: yearError } = await supabase
      .from('academic_years')
      .select('id')
      .eq('is_active', true)
      .single()

    if (yearError) {
      console.error('Error fetching active academic year:', yearError)
      return []
    }

    const { data: institutions, error } = await supabase
      .from('institutions')
      .select(`
        post_secondary_public,
        post_secondary_private,
        countries (
          country_code,
          country_name
        )
      `)
      .eq('academic_year_id', activeYear.id)
      .order('countries(country_name)')

    if (error) {
      console.error('Error fetching post-secondary data:', error)
      return []
    }

    if (!institutions) return []

    return institutions.map((inst: any) => ({
      country_code: inst.countries.country_code,
      country_name: inst.countries.country_name,
      public_institutions: inst.post_secondary_public,
      private_institutions: inst.post_secondary_private,
      total: inst.post_secondary_public + inst.post_secondary_private,
    }))
  } catch (error) {
    console.error('Unexpected error in getPostSecondaryData:', error)
    return []
  }
}

/**
 * Get regional summary (aggregates across all countries)
 */
export async function getRegionalSummary() {
  try {
    const summary = await getEducationSummary()

    if (summary.length === 0) {
      return {
        region: 'OECS',
        daycare_total: 0,
        preschool_total: 0,
        primary_total: 0,
        secondary_total: 0,
        special_ed_total: 0,
        tvet_total: 0,
        post_secondary_total: 0,
      }
    }

    return {
      region: 'OECS',
      daycare_total: summary.reduce((sum, c) => sum + c.total_daycare_centres, 0),
      preschool_total: summary.reduce((sum, c) => sum + c.total_preschools, 0),
      primary_total: summary.reduce((sum, c) => sum + c.total_primary_schools, 0),
      secondary_total: summary.reduce((sum, c) => sum + c.total_secondary_schools, 0),
      special_ed_total: summary.reduce((sum, c) => sum + c.total_special_ed_schools, 0),
      tvet_total: summary.reduce((sum, c) => sum + c.total_tvet_institutions, 0),
      post_secondary_total: summary.reduce((sum, c) => sum + c.total_post_secondary, 0),
    }
  } catch (error) {
    console.error('Unexpected error in getRegionalSummary:', error)
    return {
      region: 'OECS',
      daycare_total: 0,
      preschool_total: 0,
      primary_total: 0,
      secondary_total: 0,
      special_ed_total: 0,
      tvet_total: 0,
      post_secondary_total: 0,
    }
  }
}

/**
 * Get all education data at once (used by dashboard)
 */
export async function getAllEducationData() {
  const [summary, earlyChildhood, institutions, postSecondary, regional] = await Promise.all([
    getEducationSummary(),
    getEarlyChildhoodData(),
    getEducationalInstitutionsData(),
    getPostSecondaryData(),
    getRegionalSummary(),
  ])

  return {
    summary,
    earlyChildhood,
    institutions,
    postSecondary,
    regional,
  }
}

// Enrollment data functions (return empty arrays for now since no enrollment data imported yet)
export interface EnrollmentData {
  earlyChildhood: any[]
  primary: any[]
  secondary: any[]
  specialEducation: any[]
  primaryAgeDistribution: any[]
  secondaryAgeDistribution: any[]
  trends: {
    prePrimary: any[]
    primary: any[]
    secondary: any[]
  }
}

export async function getEarlyChildhoodEnrollment(): Promise<any[]> {
  // TODO: Implement when enrollment data is imported
  return []
}

export async function getPrimaryEnrollment(): Promise<any[]> {
  // TODO: Implement when enrollment data is imported
  return []
}

export async function getSecondaryEnrollment(): Promise<any[]> {
  // TODO: Implement when enrollment data is imported
  return []
}

export async function getSpecialEducationEnrollment(): Promise<any[]> {
  // TODO: Implement when enrollment data is imported
  return []
}

export async function getPrimaryAgeDistribution(): Promise<any[]> {
  // TODO: Implement when enrollment data is imported
  return []
}

export async function getSecondaryAgeDistribution(): Promise<any[]> {
  // TODO: Implement when enrollment data is imported
  return []
}

export async function getEnrollmentTrends(): Promise<any> {
  // TODO: Implement when enrollment data is imported
  return {
    prePrimary: [],
    primary: [],
    secondary: []
  }
}

export async function getAllEnrollmentData(): Promise<EnrollmentData> {
  const [
    earlyChildhood,
    primary,
    secondary,
    specialEducation,
    primaryAgeDistribution,
    secondaryAgeDistribution,
    trends
  ] = await Promise.all([
    getEarlyChildhoodEnrollment(),
    getPrimaryEnrollment(),
    getSecondaryEnrollment(),
    getSpecialEducationEnrollment(),
    getPrimaryAgeDistribution(),
    getSecondaryAgeDistribution(),
    getEnrollmentTrends()
  ])

  return {
    earlyChildhood,
    primary,
    secondary,
    specialEducation,
    primaryAgeDistribution,
    secondaryAgeDistribution,
    trends
  }
}

// No need for database initialization with Supabase - schema is already set up
export async function initializeDatabase() {
  // No-op for Supabase
  console.log('Using Supabase - no local database initialization needed')
}
