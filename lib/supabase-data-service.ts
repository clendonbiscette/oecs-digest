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

export interface InstitutionTrendDataPoint {
  year_label: string
  country_code: string
  country_name: string
  total_institutions: number
  early_childhood: number
  primary: number
  secondary: number
  special_ed: number
  tvet: number
  post_secondary: number
}

export interface InstitutionsTrendData {
  byYear: InstitutionTrendDataPoint[]
  byCountry: {
    [countryCode: string]: InstitutionTrendDataPoint[]
  }
  years: string[]
  countries: Country[]
}

export interface FinancialData {
  country_code: string
  country_name: string
  year_label: string
  national_budget_total: number | null
  national_budget_recurrent: number | null
  national_budget_capital: number | null
  gdp: number | null
  education_budget_total: number | null
  education_budget_recurrent: number | null
  education_budget_capital: number | null
  education_pct_national_budget: number | null
  education_pct_gdp: number | null
  allocation_early_childhood: number | null
  allocation_primary: number | null
  allocation_secondary: number | null
  allocation_special_ed: number | null
  allocation_post_secondary: number | null
  allocation_tertiary: number | null
  allocation_other: number | null
}

export interface FinancialTrendData {
  byYear: FinancialData[]
  byCountry: {
    [countryCode: string]: FinancialData[]
  }
  years: string[]
  countries: Country[]
  summary: {
    total_education_budget: number
    total_gdp: number
    avg_education_pct_budget: number
    avg_education_pct_gdp: number
  }
}

/**
 * Helper function to get academic year ID
 * If yearLabel is provided, finds that specific year
 * Otherwise, returns the active academic year
 */
async function getAcademicYearId(yearLabel?: string): Promise<number | null> {
  try {
    console.log('[getAcademicYearId] Looking for year:', yearLabel || '(active year)')

    let query = supabase.from('academic_years').select('id')

    if (yearLabel) {
      query = query.eq('year_label', yearLabel)
    } else {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query.single()

    console.log('[getAcademicYearId] Query result:', { data, error })

    if (error) {
      console.error('[getAcademicYearId] Error fetching academic year:', error)
      return null
    }

    return data?.id || null
  } catch (error) {
    console.error('[getAcademicYearId] Unexpected error:', error)
    return null
  }
}

/**
 * Get all academic years available
 */
export async function getAcademicYears(): Promise<Array<{id: number, year_label: string, is_active: boolean}>> {
  try {
    const { data, error } = await supabase
      .from('academic_years')
      .select('id, year_label, is_active, start_year')
      .order('year_label', { ascending: false })

    if (error) {
      console.error('Error fetching academic years:', error)
      return []
    }

    // Only return years with actual data (2020-2021 through 2022-2023)
    // Filter out future placeholder years (2023-2024 onwards)
    const filteredData = (data || []).filter(year => {
      const startYear = year.start_year
      return startYear <= 2022 // Only show years starting 2022 or earlier
    })

    return filteredData
  } catch (error) {
    console.error('Unexpected error getting academic years:', error)
    return []
  }
}

/**
 * Get education summary for all countries for a specific academic year
 * Aggregates institution counts from the institutions table
 * @param yearLabel - Optional year label (e.g., "2022-2023"). If not provided, uses active year.
 */
export async function getEducationSummary(yearLabel?: string): Promise<EducationSummary[]> {
  try {
    console.log('[getEducationSummary] Called with yearLabel:', yearLabel)

    // Get academic year ID
    const yearId = await getAcademicYearId(yearLabel)
    console.log('[getEducationSummary] Year ID:', yearId)

    if (!yearId) {
      console.error('[getEducationSummary] No academic year found')
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
      .eq('academic_year_id', yearId)

    console.log('[getEducationSummary] Institutions query result:', {
      count: institutions?.length || 0,
      hasError: !!instError,
      error: instError
    })

    if (instError) {
      console.error('[getEducationSummary] Error fetching institutions:', instError)
      return []
    }

    if (!institutions || institutions.length === 0) {
      console.log('[getEducationSummary] No institutions found')
      return []
    }

    // Get all countries to map IDs to codes/names
    const { data: allCountries } = await supabase.from('countries').select('*')
    const countryMap = new Map(allCountries?.map(c => [c.id, c]) || [])

    // Transform to EducationSummary format
    const summary: EducationSummary[] = institutions.map((inst: any) => {
      const country = countryMap.get(inst.country_id)
      return {
        country_code: country?.country_code || 'UNKNOWN',
        country_name: country?.country_name || 'Unknown',
        total_daycare_centres: inst.daycare_public + inst.daycare_private_church + inst.daycare_private_non_affiliated,
        total_preschools: inst.preschool_public + inst.preschool_private_church + inst.preschool_private_non_affiliated,
        total_primary_schools: inst.primary_public + inst.primary_private_church + inst.primary_private_non_affiliated,
        total_secondary_schools: inst.secondary_public + inst.secondary_private_church + inst.secondary_private_non_affiliated,
        total_special_ed_schools: inst.special_ed_public + inst.special_ed_private_church + inst.special_ed_private_non_affiliated,
        total_tvet_institutions: inst.tvet_public + inst.tvet_private_church + inst.tvet_private_non_affiliated,
        total_post_secondary: inst.post_secondary_public + inst.post_secondary_private,
      }
    })

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
 * @param yearLabel - Optional year label (e.g., "2022-2023"). If not provided, uses active year.
 */
export async function getEarlyChildhoodData(yearLabel?: string): Promise<EarlyChildhoodData[]> {
  try {
    // Get academic year ID
    const yearId = await getAcademicYearId(yearLabel)

    if (!yearId) {
      console.error('No academic year found')
      return []
    }

    const { data: institutions, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('academic_year_id', yearId)

    if (error) {
      console.error('Error fetching early childhood data:', error)
      return []
    }

    if (!institutions) return []

    // Get all countries
    const { data: allCountries } = await supabase.from('countries').select('*').execute()
    const countryMap = new Map(allCountries?.map(c => [c.id, c]) || [])

    return institutions.map((inst: any) => {
      const country = countryMap.get(inst.country_id)
      return {
        country_code: country?.country_code || 'UNKNOWN',
        country_name: country?.country_name || 'Unknown',
        daycare_public: inst.daycare_public,
        daycare_private_church: inst.daycare_private_church,
        daycare_private_non_affiliated: inst.daycare_private_non_affiliated,
        daycare_total: inst.daycare_public + inst.daycare_private_church + inst.daycare_private_non_affiliated,
        preschool_public: inst.preschool_public,
        preschool_private_church: inst.preschool_private_church,
        preschool_private_non_affiliated: inst.preschool_private_non_affiliated,
        preschool_total: inst.preschool_public + inst.preschool_private_church + inst.preschool_private_non_affiliated,
      }
    }).sort((a, b) => a.country_name.localeCompare(b.country_name))
  } catch (error) {
    console.error('Unexpected error in getEarlyChildhoodData:', error)
    return []
  }
}

/**
 * Get educational institutions data (primary, secondary, special ed, TVET)
 * @param yearLabel - Optional year label (e.g., "2022-2023"). If not provided, uses active year.
 */
export async function getEducationalInstitutionsData(yearLabel?: string): Promise<EducationalInstitutionsData[]> {
  try {
    // Get academic year ID
    const yearId = await getAcademicYearId(yearLabel)

    if (!yearId) {
      console.error('No academic year found')
      return []
    }

    const { data: institutions, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('academic_year_id', yearId)

    if (error) {
      console.error('Error fetching educational institutions data:', error)
      return []
    }

    if (!institutions) return []

    // Get all countries
    const { data: allCountries } = await supabase.from('countries').select('*').execute()
    const countryMap = new Map(allCountries?.map(c => [c.id, c]) || [])

    return institutions.map((inst: any) => {
      const country = countryMap.get(inst.country_id)
      return {
        country_code: country?.country_code || 'UNKNOWN',
        country_name: country?.country_name || 'Unknown',
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
      }
    }).sort((a, b) => a.country_name.localeCompare(b.country_name))
  } catch (error) {
    console.error('Unexpected error in getEducationalInstitutionsData:', error)
    return []
  }
}

/**
 * Get post-secondary institutions data
 * @param yearLabel - Optional year label (e.g., "2022-2023"). If not provided, uses active year.
 */
export async function getPostSecondaryData(yearLabel?: string): Promise<PostSecondaryData[]> {
  try {
    // Get academic year ID
    const yearId = await getAcademicYearId(yearLabel)

    if (!yearId) {
      console.error('No academic year found')
      return []
    }

    const { data: institutions, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('academic_year_id', yearId)

    if (error) {
      console.error('Error fetching post-secondary data:', error)
      return []
    }

    if (!institutions) return []

    // Get all countries
    const { data: allCountries } = await supabase.from('countries').select('*').execute()
    const countryMap = new Map(allCountries?.map(c => [c.id, c]) || [])

    return institutions.map((inst: any) => {
      const country = countryMap.get(inst.country_id)
      return {
        country_code: country?.country_code || 'UNKNOWN',
        country_name: country?.country_name || 'Unknown',
        public_institutions: inst.post_secondary_public,
        private_institutions: inst.post_secondary_private,
        total: inst.post_secondary_public + inst.post_secondary_private,
      }
    }).sort((a, b) => a.country_name.localeCompare(b.country_name))
  } catch (error) {
    console.error('Unexpected error in getPostSecondaryData:', error)
    return []
  }
}

/**
 * Get regional summary (aggregates across all countries)
 * @param yearLabel - Optional year label (e.g., "2022-2023"). If not provided, uses active year.
 */
export async function getRegionalSummary(yearLabel?: string) {
  try {
    const summary = await getEducationSummary(yearLabel)

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
 * @param yearLabel - Optional year label (e.g., "2022-2023"). If not provided, uses active year.
 */
export async function getAllEducationData(yearLabel?: string) {
  const [summary, earlyChildhood, institutions, postSecondary, regional] = await Promise.all([
    getEducationSummary(yearLabel),
    getEarlyChildhoodData(yearLabel),
    getEducationalInstitutionsData(yearLabel),
    getPostSecondaryData(yearLabel),
    getRegionalSummary(yearLabel),
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

export async function getEarlyChildhoodEnrollment(yearLabel?: string): Promise<any[]> {
  try {
    const yearId = await getAcademicYearId(yearLabel)
    if (!yearId) return []

    const { data, error } = await supabase
      .from('early_childhood_enrollment')
      .select(`
        *,
        countries (country_code, country_name)
      `)
      .eq('academic_year_id', yearId)

    if (error) {
      console.error('Error fetching early childhood enrollment:', error)
      return []
    }

    return (data || []).map((record: any) => ({
      country_code: record.countries?.country_code || 'UNKNOWN',
      country_name: record.countries?.country_name || 'Unknown',
      institution_type: record.institution_type,
      age_group: record.age_group,
      male: record.male || 0,
      female: record.female || 0,
      total: (record.male || 0) + (record.female || 0)
    }))
  } catch (error) {
    console.error('Unexpected error in getEarlyChildhoodEnrollment:', error)
    return []
  }
}

export async function getPrimaryEnrollment(yearLabel?: string): Promise<any[]> {
  try {
    const yearId = await getAcademicYearId(yearLabel)
    if (!yearId) return []

    const { data, error } = await supabase
      .from('primary_enrollment')
      .select(`
        *,
        countries (country_code, country_name)
      `)
      .eq('academic_year_id', yearId)

    if (error) {
      console.error('Error fetching primary enrollment:', error)
      return []
    }

    return (data || []).map((record: any) => ({
      country_code: record.countries?.country_code || 'UNKNOWN',
      country_name: record.countries?.country_name || 'Unknown',
      school_type: record.school_type,
      age_group: record.age_group,
      k_male: record.k_male || 0,
      k_female: record.k_female || 0,
      g1_male: record.g1_male || 0,
      g1_female: record.g1_female || 0,
      g2_male: record.g2_male || 0,
      g2_female: record.g2_female || 0,
      g3_male: record.g3_male || 0,
      g3_female: record.g3_female || 0,
      g4_male: record.g4_male || 0,
      g4_female: record.g4_female || 0,
      g5_male: record.g5_male || 0,
      g5_female: record.g5_female || 0,
      g6_male: record.g6_male || 0,
      g6_female: record.g6_female || 0,
      subtotal_male: record.subtotal_male || 0,
      subtotal_female: record.subtotal_female || 0,
      total: (record.subtotal_male || 0) + (record.subtotal_female || 0)
    }))
  } catch (error) {
    console.error('Unexpected error in getPrimaryEnrollment:', error)
    return []
  }
}

export async function getSecondaryEnrollment(yearLabel?: string): Promise<any[]> {
  try {
    const yearId = await getAcademicYearId(yearLabel)
    if (!yearId) return []

    const { data, error } = await supabase
      .from('secondary_enrollment')
      .select(`
        *,
        countries (country_code, country_name)
      `)
      .eq('academic_year_id', yearId)

    if (error) {
      console.error('Error fetching secondary enrollment:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error in getSecondaryEnrollment:', error)
    return []
  }
}

export async function getSpecialEducationEnrollment(yearLabel?: string): Promise<any[]> {
  try {
    const yearId = await getAcademicYearId(yearLabel)
    if (!yearId) return []

    const { data, error } = await supabase
      .from('special_education_enrollment')
      .select(`
        *,
        countries (country_code, country_name)
      `)
      .eq('academic_year_id', yearId)

    if (error) {
      console.error('Error fetching special education enrollment:', error)
      return []
    }

    return (data || []).map((record: any) => ({
      country_code: record.countries?.country_code || 'UNKNOWN',
      country_name: record.countries?.country_name || 'Unknown',
      institution_type: record.institution_type,
      age_group: record.age_group,
      male: record.male || 0,
      female: record.female || 0,
      total: (record.male || 0) + (record.female || 0)
    }))
  } catch (error) {
    console.error('Unexpected error in getSpecialEducationEnrollment:', error)
    return []
  }
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

export async function getAllEnrollmentData(yearLabel?: string): Promise<EnrollmentData> {
  const [
    earlyChildhood,
    primary,
    secondary,
    specialEducation,
    primaryAgeDistribution,
    secondaryAgeDistribution,
    trends
  ] = await Promise.all([
    getEarlyChildhoodEnrollment(yearLabel),
    getPrimaryEnrollment(yearLabel),
    getSecondaryEnrollment(yearLabel),
    getSpecialEducationEnrollment(yearLabel),
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

/**
 * Get institutions trend data across multiple years
 * Returns data grouped by year and by country for trend visualization
 */
export async function getInstitutionsTrendData(): Promise<InstitutionsTrendData> {
  try {
    // Fetch all academic years
    const { data: academicYears, error: yearError } = await supabase
      .from('academic_years')
      .select('id, year_label, start_year')
      .order('start_year')

    if (yearError) {
      console.error('Error fetching academic years:', yearError)
      return { byYear: [], byCountry: {}, years: [], countries: [] }
    }

    // Fetch all countries
    const { data: countries, error: countryError } = await supabase
      .from('countries')
      .select('id, country_code, country_name')
      .order('country_name')

    if (countryError) {
      console.error('Error fetching countries:', countryError)
      return { byYear: [], byCountry: {}, years: [], countries: [] }
    }

    // Fetch all institutions data across all years
    const { data: institutions, error: instError } = await supabase
      .from('institutions')
      .select('*')

    if (instError) {
      console.error('Error fetching institutions:', instError)
      return { byYear: [], byCountry: {}, years: [], countries: [] }
    }

    if (!institutions || !academicYears || !countries) {
      return { byYear: [], byCountry: {}, years: [], countries: [] }
    }

    // Create lookup maps
    const yearMap = new Map(academicYears.map(y => [y.id, y.year_label]))
    const countryMap = new Map(countries.map(c => [c.id, c]))

    // Transform data to trend format
    const trendData: InstitutionTrendDataPoint[] = institutions.map((inst: any) => {
      const year = yearMap.get(inst.academic_year_id) || 'Unknown'
      const country = countryMap.get(inst.country_id)

      const early_childhood = inst.daycare_public + inst.daycare_private_church + inst.daycare_private_non_affiliated +
                              inst.preschool_public + inst.preschool_private_church + inst.preschool_private_non_affiliated
      const primary = inst.primary_public + inst.primary_private_church + inst.primary_private_non_affiliated
      const secondary = inst.secondary_public + inst.secondary_private_church + inst.secondary_private_non_affiliated
      const special_ed = inst.special_ed_public + inst.special_ed_private_church + inst.special_ed_private_non_affiliated
      const tvet = inst.tvet_public + inst.tvet_private_church + inst.tvet_private_non_affiliated
      const post_secondary = inst.post_secondary_public + inst.post_secondary_private

      return {
        year_label: year,
        country_code: country?.country_code || 'UNKNOWN',
        country_name: country?.country_name || 'Unknown',
        early_childhood,
        primary,
        secondary,
        special_ed,
        tvet,
        post_secondary,
        total_institutions: early_childhood + primary + secondary + special_ed + tvet + post_secondary
      }
    })

    // Group by country
    const byCountry: { [countryCode: string]: InstitutionTrendDataPoint[] } = {}
    trendData.forEach(point => {
      if (!byCountry[point.country_code]) {
        byCountry[point.country_code] = []
      }
      byCountry[point.country_code].push(point)
    })

    // Sort each country's data by year
    Object.keys(byCountry).forEach(countryCode => {
      byCountry[countryCode].sort((a, b) => a.year_label.localeCompare(b.year_label))
    })

    return {
      byYear: trendData.sort((a, b) => a.year_label.localeCompare(b.year_label)),
      byCountry,
      years: academicYears.map(y => y.year_label),
      countries: countries.map(c => ({
        country_code: c.country_code,
        country_name: c.country_name,
        region: 'OECS'
      }))
    }
  } catch (error) {
    console.error('Unexpected error in getInstitutionsTrendData:', error)
    return { byYear: [], byCountry: {}, years: [], countries: [] }
  }
}

/**
 * Get financial data trends across multiple years
 * Returns budget, GDP, and education spending data for trend analysis
 */
export async function getFinancialTrendData(): Promise<FinancialTrendData> {
  try {
    console.log('[Financial Data] Starting fetch...')

    // Fetch all academic years
    const { data: academicYears, error: yearError } = await supabase
      .from('academic_years')
      .select('id, year_label, start_year')
      .order('start_year')

    console.log('[Financial Data] Academic years:', academicYears?.length || 0, 'records')

    if (yearError) {
      console.error('Error fetching academic years:', yearError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    // Fetch all countries
    const { data: countries, error: countryError } = await supabase
      .from('countries')
      .select('id, country_code, country_name')
      .order('country_name')

    console.log('[Financial Data] Countries:', countries?.length || 0, 'records')

    if (countryError) {
      console.error('Error fetching countries:', countryError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    // Fetch all financial data
    const { data: financial, error: finError } = await supabase
      .from('financial_data')
      .select('*')

    console.log('[Financial Data] Financial records:', financial?.length || 0, 'records')
    console.log('[Financial Data] Sample record:', financial?.[0])

    if (finError) {
      console.error('Error fetching financial data:', finError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    if (!financial || !academicYears || !countries) {
      console.log('[Financial Data] Missing data - financial:', !!financial, 'academicYears:', !!academicYears, 'countries:', !!countries)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    if (financial.length === 0) {
      console.log('[Financial Data] No financial records found in database')
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    // Create lookup maps
    const yearMap = new Map(academicYears.map(y => [y.id, y.year_label]))
    const countryMap = new Map(countries.map(c => [c.id, c]))

    // Transform data
    const trendData: FinancialData[] = financial.map((fin: any) => {
      const year = yearMap.get(fin.academic_year_id) || 'Unknown'
      const country = countryMap.get(fin.country_id)

      return {
        country_code: country?.country_code || 'UNKNOWN',
        country_name: country?.country_name || 'Unknown',
        year_label: year,
        national_budget_total: fin.national_budget_total,
        national_budget_recurrent: fin.national_budget_recurrent,
        national_budget_capital: fin.national_budget_capital,
        gdp: fin.gdp,
        education_budget_total: fin.education_budget_total,
        education_budget_recurrent: fin.education_budget_recurrent,
        education_budget_capital: fin.education_budget_capital,
        education_pct_national_budget: fin.education_pct_national_budget,
        education_pct_gdp: fin.education_pct_gdp,
        allocation_early_childhood: fin.allocation_early_childhood,
        allocation_primary: fin.allocation_primary,
        allocation_secondary: fin.allocation_secondary,
        allocation_special_ed: fin.allocation_special_ed,
        allocation_post_secondary: fin.allocation_post_secondary,
        allocation_tertiary: fin.allocation_tertiary,
        allocation_other: fin.allocation_other
      }
    })

    // Group by country
    const byCountry: { [countryCode: string]: FinancialData[] } = {}
    trendData.forEach(point => {
      if (!byCountry[point.country_code]) {
        byCountry[point.country_code] = []
      }
      byCountry[point.country_code].push(point)
    })

    // Sort each country's data by year
    Object.keys(byCountry).forEach(countryCode => {
      byCountry[countryCode].sort((a, b) => a.year_label.localeCompare(b.year_label))
    })

    // Calculate summary statistics
    const validBudgets = trendData.filter(d => d.education_budget_total !== null)
    const validGDP = trendData.filter(d => d.gdp !== null)
    const validPctBudget = trendData.filter(d => d.education_pct_national_budget !== null)
    const validPctGDP = trendData.filter(d => d.education_pct_gdp !== null)

    const summary = {
      total_education_budget: validBudgets.reduce((sum, d) => sum + (d.education_budget_total || 0), 0),
      total_gdp: validGDP.reduce((sum, d) => sum + (d.gdp || 0), 0),
      avg_education_pct_budget: validPctBudget.length > 0
        ? validPctBudget.reduce((sum, d) => sum + (d.education_pct_national_budget || 0), 0) / validPctBudget.length
        : 0,
      avg_education_pct_gdp: validPctGDP.length > 0
        ? validPctGDP.reduce((sum, d) => sum + (d.education_pct_gdp || 0), 0) / validPctGDP.length
        : 0
    }

    const result = {
      byYear: trendData.sort((a, b) => a.year_label.localeCompare(b.year_label)),
      byCountry,
      years: academicYears.map(y => y.year_label),
      countries: countries.map(c => ({
        country_code: c.country_code,
        country_name: c.country_name,
        region: 'OECS'
      })),
      summary
    }

    console.log('[Financial Data] Returning data - byYear:', result.byYear.length, 'records')
    console.log('[Financial Data] Years available:', result.years)
    console.log('[Financial Data] Countries available:', result.countries.length)
    console.log('[Financial Data] Summary:', result.summary)

    return result
  } catch (error) {
    console.error('Unexpected error in getFinancialTrendData:', error)
    return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
  }
}

// No need for database initialization with Supabase - schema is already set up
export async function initializeDatabase() {
  // No-op for Supabase
  console.log('Using Supabase - no local database initialization needed')
}
