// Create a conditional sql connection
let sql: any = null

try {
  if (process.env.DATABASE_URL) {
    const { neon } = require("@neondatabase/serverless")
    sql = neon(process.env.DATABASE_URL)
  } else {
    throw new Error("DATABASE_URL not set")
  }
} catch (error) {
  console.warn("Database not configured, using mock connection")
  // Create a mock sql function that handles template literals
  sql = function(strings: any, ...values: any[]) {
    console.warn("Database not configured, returning empty result")
    return Promise.resolve([])
  }
}

export { sql }

export interface Country {
  country_code: string
  country_name: string
  region: string
}

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

export interface EarlyChildhoodData {
  country_code: string
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
  public_institutions: number
  private_institutions: number
  total: number
}
