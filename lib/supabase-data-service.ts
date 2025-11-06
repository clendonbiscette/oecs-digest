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

    // Get all countries to map IDs to codes/names
    const { data: allCountries } = await supabase.from('countries').select('*').execute()
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
      .select('*')
      .eq('academic_year_id', activeYear.id)

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
      .select('*')
      .eq('academic_year_id', activeYear.id)

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
      .select('*')
      .eq('academic_year_id', activeYear.id)

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
    // Fetch all academic years
    const { data: academicYears, error: yearError } = await supabase
      .from('academic_years')
      .select('id, year_label, start_year')
      .order('start_year')

    if (yearError) {
      console.error('Error fetching academic years:', yearError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    // Fetch all countries
    const { data: countries, error: countryError } = await supabase
      .from('countries')
      .select('id, country_code, country_name')
      .order('country_name')

    if (countryError) {
      console.error('Error fetching countries:', countryError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    // Fetch all financial data
    const { data: financial, error: finError } = await supabase
      .from('financial_data')
      .select('*')

    if (finError) {
      console.error('Error fetching financial data:', finError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    if (!financial || !academicYears || !countries) {
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

    return {
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
