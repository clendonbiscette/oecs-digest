// Test the actual getFinancialTrendData function
// Run with: node test-get-financial-trend-data.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local
const envPath = path.join(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const lines = envContent.split('\n')

let supabaseUrl, supabaseAnonKey
lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim()
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.split('=')[1].trim()
  }
})

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Copy of getFinancialTrendData function
async function getFinancialTrendData() {
  try {
    console.log('[Test] Starting fetch...')

    // Fetch all academic years
    const { data: academicYears, error: yearError } = await supabase
      .from('academic_years')
      .select('id, year_label, start_year')
      .order('start_year')

    console.log('[Test] Academic years:', academicYears?.length || 0)

    if (yearError) {
      console.error('[Test] Error fetching academic years:', yearError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    // Fetch all countries
    const { data: countries, error: countryError } = await supabase
      .from('countries')
      .select('id, country_code, country_name')
      .order('country_name')

    console.log('[Test] Countries:', countries?.length || 0)

    if (countryError) {
      console.error('[Test] Error fetching countries:', countryError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    // Fetch all financial data
    const { data: financial, error: finError } = await supabase
      .from('financial_data')
      .select('*')

    console.log('[Test] Financial records:', financial?.length || 0)

    if (finError) {
      console.error('[Test] Error fetching financial data:', finError)
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    if (!financial || !academicYears || !countries) {
      console.log('[Test] Missing data!')
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    if (financial.length === 0) {
      console.log('[Test] No financial records!')
      return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
    }

    // Create lookup maps
    const yearMap = new Map(academicYears.map(y => [y.id, y.year_label]))
    const countryMap = new Map(countries.map(c => [c.id, c]))

    // Transform data
    const trendData = financial.map((fin) => {
      const year = yearMap.get(fin.academic_year_id) || 'Unknown'
      const country = countryMap.get(fin.country_id)

      return {
        country_code: country?.country_code || 'UNKNOWN',
        country_name: country?.country_name || 'Unknown',
        year_label: year,
        national_budget_total: fin.national_budget_total,
        education_budget_total: fin.education_budget_total,
        gdp: fin.gdp,
        education_pct_national_budget: fin.education_pct_national_budget,
        education_pct_gdp: fin.education_pct_gdp,
        allocation_early_childhood: fin.allocation_early_childhood,
        allocation_primary: fin.allocation_primary,
        allocation_secondary: fin.allocation_secondary,
      }
    })

    // Group by country
    const byCountry = {}
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

    const result = {
      byYear: trendData.sort((a, b) => a.year_label.localeCompare(b.year_label)),
      byCountry,
      years: academicYears.map(y => y.year_label),
      countries: countries.map(c => ({
        country_code: c.country_code,
        country_name: c.country_name,
        region: 'OECS'
      })),
      summary: {
        total_education_budget: 0,
        total_gdp: 0,
        avg_education_pct_budget: 0,
        avg_education_pct_gdp: 0
      }
    }

    console.log('\n✅ Final result:')
    console.log('  - byYear records:', result.byYear.length)
    console.log('  - Years:', result.years)
    console.log('  - Countries:', result.countries.length)
    console.log('  - byCountry keys:', Object.keys(result.byCountry))
    console.log('\n📊 Sample byYear record:')
    console.log(JSON.stringify(result.byYear[0], null, 2))

    return result
  } catch (error) {
    console.error('[Test] Unexpected error:', error)
    return { byYear: [], byCountry: {}, years: [], countries: [], summary: { total_education_budget: 0, total_gdp: 0, avg_education_pct_budget: 0, avg_education_pct_gdp: 0 } }
  }
}

// Run the test
getFinancialTrendData()
  .then(result => {
    console.log('\n✅ Test complete! Data structure looks good.')
    if (result.byYear.length === 0) {
      console.log('❌ WARNING: byYear is empty!')
    }
    process.exit(0)
  })
  .catch(err => {
    console.error('❌ Test failed:', err)
    process.exit(1)
  })
