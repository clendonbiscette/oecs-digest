// Test script to verify Supabase client can fetch financial data
// Run with: node test-financial-fetch.js

const { createClient } = require('@supabase/supabase-js')

// Read from .env.local manually
const fs = require('fs')
const path = require('path')
const envPath = path.join(__dirname, '.env.local')

let supabaseUrl, supabaseAnonKey

try {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')

  lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim()
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1].trim()
    }
  })
} catch (err) {
  console.error('❌ Error reading .env.local:', err.message)
  process.exit(1)
}

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl ? 'Found' : '❌ Missing')
console.log('Anon Key:', supabaseAnonKey ? 'Found (length: ' + supabaseAnonKey?.length + ')' : '❌ Missing')
console.log('')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure .env.local has:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL')
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testFinancialData() {
  console.log('📊 Fetching financial_data...')

  const { data, error } = await supabase
    .from('financial_data')
    .select('*')

  if (error) {
    console.error('❌ Error fetching financial data:', error)
    return
  }

  console.log('✅ Success! Records fetched:', data?.length || 0)

  if (data && data.length > 0) {
    console.log('📝 Sample record:', {
      id: data[0].id,
      country_id: data[0].country_id,
      academic_year_id: data[0].academic_year_id,
      education_budget_total: data[0].education_budget_total
    })
  } else {
    console.log('⚠️  No records returned - RLS might be blocking access')
  }

  console.log('')
  console.log('🔍 Testing with JOIN...')

  const { data: joinData, error: joinError } = await supabase
    .from('financial_data')
    .select(`
      id,
      country_id,
      academic_year_id,
      education_budget_total,
      countries (country_code, country_name),
      academic_years (year_label)
    `)

  if (joinError) {
    console.error('❌ Error with JOIN query:', joinError)
  } else {
    console.log('✅ JOIN query worked! Records:', joinData?.length || 0)
    if (joinData && joinData.length > 0) {
      console.log('📝 Sample with JOIN:', joinData[0])
    }
  }
}

testFinancialData()
  .then(() => {
    console.log('')
    console.log('✅ Test complete!')
    process.exit(0)
  })
  .catch(err => {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  })
