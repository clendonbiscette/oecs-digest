import {
  sql,
  type EducationSummary,
  type EarlyChildhoodData,
  type EducationalInstitutionsData,
  type PostSecondaryData,
  type Country,
} from "./database"

// Helper function to safely execute sql queries
async function safeSqlQuery(queryFn: () => Promise<any>): Promise<any> {
  try {
    if (typeof sql !== 'function') {
      console.warn("SQL connection not available, returning empty result")
      return []
    }
    return await queryFn()
  } catch (error) {
    console.error("SQL query error:", error)
    return []
  }
}

export async function getEducationSummary(): Promise<EducationSummary[]> {
  return safeSqlQuery(async () => {
    // Try to use the view first
    const result = await sql`SELECT * FROM education_summary ORDER BY country_name`
    return result as EducationSummary[]
  }).catch(() => {
    // Return sample data if database fails
    return [
      {
        country_code: "DOM",
        country_name: "Dominica",
        total_daycare_centres: 14,
        total_preschools: 74,
        total_primary_schools: 57,
        total_secondary_schools: 15,
        total_special_ed_schools: 2,
        total_tvet_institutions: 0,
        total_post_secondary: 5,
      },
      {
        country_code: "GRD",
        country_name: "Grenada",
        total_daycare_centres: 5,
        total_preschools: 104,
        total_primary_schools: 95,
        total_secondary_schools: 25,
        total_special_ed_schools: 3,
        total_tvet_institutions: 2,
        total_post_secondary: 2,
      },
    ] as EducationSummary[]
  })
}

export async function getCountries(): Promise<Country[]> {
  return safeSqlQuery(async () => {
    const result = await sql`SELECT * FROM countries ORDER BY country_name`
    return result as Country[]
  }).catch(() => {
    return [
      { country_code: "DOM", country_name: "Dominica", region: "OECS" },
      { country_code: "GRD", country_name: "Grenada", region: "OECS" },
    ] as Country[]
  })
}

export async function getEarlyChildhoodData(): Promise<EarlyChildhoodData[]> {
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT ecc.*, c.country_name 
      FROM early_childhood_centres ecc
      JOIN countries c ON ecc.country_code = c.country_code
      ORDER BY c.country_name
    `
    return result as EarlyChildhoodData[]
  }).catch(() => {
    return [] as EarlyChildhoodData[]
  })
}

export async function getEducationalInstitutionsData(): Promise<EducationalInstitutionsData[]> {
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT ei.*, c.country_name 
      FROM educational_institutions ei
      JOIN countries c ON ei.country_code = c.country_code
      ORDER BY c.country_name
    `
    return result as EducationalInstitutionsData[]
  }).catch(() => {
    return [] as EducationalInstitutionsData[]
  })
}

export async function getPostSecondaryData(): Promise<PostSecondaryData[]> {
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT psi.*, c.country_name 
      FROM post_secondary_institutions psi
      JOIN countries c ON psi.country_code = c.country_code
      ORDER BY c.country_name
    `
    return result as PostSecondaryData[]
  }).catch(() => {
    return [] as PostSecondaryData[]
  })
}

export async function getRegionalSummary() {
  return safeSqlQuery(async () => {
    // Try to use the view first
    const result = await sql`SELECT * FROM oecs_regional_summary`
    return result[0]
  }).catch(() => {
    return {
      region: "OECS",
      daycare_total: 91,
      preschool_total: 290,
      primary_total: 268,
      secondary_total: 80,
      special_ed_total: 10,
      tvet_total: 5,
      post_secondary_total: 15,
    }
  })
}

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
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT ece.*, c.country_name 
      FROM early_childhood_enrollment ece
      JOIN countries c ON ece.country_code = c.country_code
      ORDER BY c.country_name, ece.institution_type, ece.age_group
    `
    return result
  }).catch(() => {
    return [] as any[]
  })
}

export async function getPrimaryEnrollment(): Promise<any[]> {
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT pe.*, c.country_name 
      FROM primary_enrollment pe
      JOIN countries c ON pe.country_code = c.country_code
      ORDER BY c.country_name, pe.school_type, pe.age_group
    `
    return result
  }).catch(() => {
    return [] as any[]
  })
}

export async function getSecondaryEnrollment(): Promise<any[]> {
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT se.*, c.country_name 
      FROM secondary_enrollment se
      JOIN countries c ON se.country_code = c.country_code
      ORDER BY c.country_name, se.school_type, se.age_group
    `
    return result
  }).catch(() => {
    return [] as any[]
  })
}

export async function getSpecialEducationEnrollment(): Promise<any[]> {
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT see.*, c.country_name 
      FROM special_education_enrollment see
      JOIN countries c ON see.country_code = c.country_code
      ORDER BY c.country_name, see.institution_type, see.age_group
    `
    return result
  }).catch(() => {
    return [] as any[]
  })
}

export async function getPrimaryAgeDistribution(): Promise<any[]> {
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT pad.*, c.country_name 
      FROM primary_age_distribution pad
      JOIN countries c ON pad.country_code = c.country_code
      ORDER BY c.country_name, pad.grade
    `
    return result
  }).catch(() => {
    return [] as any[]
  })
}

export async function getSecondaryAgeDistribution(): Promise<any[]> {
  return safeSqlQuery(async () => {
    const result = await sql`
      SELECT sad.*, c.country_name 
      FROM secondary_age_distribution sad
      JOIN countries c ON sad.country_code = c.country_code
      ORDER BY c.country_name, sad.form
    `
    return result
  }).catch(() => {
    return [] as any[]
  })
}

export async function getEnrollmentTrends(): Promise<any> {
  const [prePrimary, primary, secondary] = await Promise.all([
    safeSqlQuery(async () => {
      const result = await sql`
        SELECT ppt.*, c.country_name 
        FROM preprimary_enrollment_trends ppt
        JOIN countries c ON ppt.country_code = c.country_code
        ORDER BY c.country_name, ppt.academic_year
      `
      return result
    }).catch(() => []),
    safeSqlQuery(async () => {
      const result = await sql`
        SELECT pet.*, c.country_name 
        FROM primary_enrollment_trends pet
        JOIN countries c ON pet.country_code = c.country_code
        ORDER BY c.country_name, pet.academic_year
      `
      return result
    }).catch(() => []),
    safeSqlQuery(async () => {
      const result = await sql`
        SELECT set.*, c.country_name 
        FROM secondary_enrollment_trends set
        JOIN countries c ON set.country_code = c.country_code
        ORDER BY c.country_name, set.academic_year
      `
      return result
    }).catch(() => [])
  ])

  return {
    prePrimary,
    primary,
    secondary
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

// Helper function to ensure all tables and views exist
export async function initializeDatabase() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL environment variable is not configured - using mock data")
      return
    }

    // Check if sql is properly initialized
    if (typeof sql !== 'function') {
      console.warn("Database connection not available - using mock data")
      return
    }

    // Check if tables exist, if not create them
    await sql`
      CREATE TABLE IF NOT EXISTS countries (
        country_code VARCHAR(3) PRIMARY KEY,
        country_name VARCHAR(100),
        region VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS early_childhood_centres (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        daycare_public INT DEFAULT 0,
        daycare_private_church INT DEFAULT 0,
        daycare_private_non_affiliated INT DEFAULT 0,
        daycare_total INT DEFAULT 0,
        preschool_public INT DEFAULT 0,
        preschool_private_church INT DEFAULT 0,
        preschool_private_non_affiliated INT DEFAULT 0,
        preschool_total INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(country_code)
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS educational_institutions (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        primary_public INT DEFAULT 0,
        primary_private_church INT DEFAULT 0,
        primary_private_non_affiliated INT DEFAULT 0,
        primary_total INT DEFAULT 0,
        secondary_public INT DEFAULT 0,
        secondary_private_church INT DEFAULT 0,
        secondary_private_non_affiliated INT DEFAULT 0,
        secondary_total INT DEFAULT 0,
        special_ed_public INT DEFAULT 0,
        special_ed_private_church INT DEFAULT 0,
        special_ed_private_non_affiliated INT DEFAULT 0,
        special_ed_total INT DEFAULT 0,
        tvet_public INT DEFAULT 0,
        tvet_private_church INT DEFAULT 0,
        tvet_private_non_affiliated INT DEFAULT 0,
        tvet_total INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(country_code)
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS post_secondary_institutions (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        public_institutions INT DEFAULT 0,
        private_institutions INT DEFAULT 0,
        total INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(country_code)
      )
    `

    // Create enrollment tables
    await sql`
      CREATE TABLE IF NOT EXISTS early_childhood_enrollment (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        institution_type VARCHAR(50) NOT NULL CHECK (institution_type IN ('Public', 'Private/Gov Assisted', 'Total')),
        age_group VARCHAR(20) NOT NULL,
        male INT DEFAULT 0,
        female INT DEFAULT 0,
        total INT GENERATED ALWAYS AS (male + female) STORED,
        academic_year VARCHAR(10) DEFAULT '2022-23',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS primary_enrollment (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        school_type VARCHAR(20) DEFAULT 'Public' CHECK (school_type IN ('Public', 'Private', 'Total')),
        age_group VARCHAR(20) NOT NULL,
        k_male INT DEFAULT 0,
        k_female INT DEFAULT 0,
        g1_male INT DEFAULT 0,
        g1_female INT DEFAULT 0,
        g2_male INT DEFAULT 0,
        g2_female INT DEFAULT 0,
        g3_male INT DEFAULT 0,
        g3_female INT DEFAULT 0,
        g4_male INT DEFAULT 0,
        g4_female INT DEFAULT 0,
        g5_male INT DEFAULT 0,
        g5_female INT DEFAULT 0,
        g6_male INT DEFAULT 0,
        g6_female INT DEFAULT 0,
        subtotal_male INT DEFAULT 0,
        subtotal_female INT DEFAULT 0,
        total INT GENERATED ALWAYS AS (subtotal_male + subtotal_female) STORED,
        academic_year VARCHAR(10) DEFAULT '2022-23',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS secondary_enrollment (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        school_type VARCHAR(20) DEFAULT 'Public' CHECK (school_type IN ('Public', 'Private', 'Total')),
        age_group VARCHAR(20) NOT NULL,
        f1_male INT DEFAULT 0,
        f1_female INT DEFAULT 0,
        f2_male INT DEFAULT 0,
        f2_female INT DEFAULT 0,
        f3_male INT DEFAULT 0,
        f3_female INT DEFAULT 0,
        f4_male INT DEFAULT 0,
        f4_female INT DEFAULT 0,
        f5_male INT DEFAULT 0,
        f5_female INT DEFAULT 0,
        f6_male INT DEFAULT 0,
        f6_female INT DEFAULT 0,
        subtotal_male INT DEFAULT 0,
        subtotal_female INT DEFAULT 0,
        total INT GENERATED ALWAYS AS (subtotal_male + subtotal_female) STORED,
        academic_year VARCHAR(10) DEFAULT '2022-23',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS special_education_enrollment (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        institution_type VARCHAR(50) NOT NULL CHECK (institution_type IN ('Public', 'Private/Gov Assisted', 'Total')),
        age_group VARCHAR(20) NOT NULL CHECK (age_group IN ('≤5 Years', '6-10 Years', '11-15 Years', '16-20 Years', '≥21 Years')),
        male INT DEFAULT 0,
        female INT DEFAULT 0,
        total INT GENERATED ALWAYS AS (male + female) STORED,
        academic_year VARCHAR(10) DEFAULT '2022-23',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS primary_age_distribution (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        grade VARCHAR(3) NOT NULL CHECK (grade IN ('K', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6')),
        under_aged_male_pct DECIMAL(5,2),
        under_aged_female_pct DECIMAL(5,2),
        class_aged_male_pct DECIMAL(5,2),
        class_aged_female_pct DECIMAL(5,2),
        over_aged_male_pct DECIMAL(5,2),
        over_aged_female_pct DECIMAL(5,2),
        academic_year VARCHAR(10) DEFAULT '2022-23',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(country_code, grade, academic_year)
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS secondary_age_distribution (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        form VARCHAR(3) NOT NULL CHECK (form IN ('F1', 'F2', 'F3', 'F4', 'F5', 'F6')),
        under_aged_male_pct DECIMAL(5,2),
        under_aged_female_pct DECIMAL(5,2),
        class_aged_male_pct DECIMAL(5,2),
        class_aged_female_pct DECIMAL(5,2),
        over_aged_male_pct DECIMAL(5,2),
        over_aged_female_pct DECIMAL(5,2),
        academic_year VARCHAR(10) DEFAULT '2022-23',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(country_code, form, academic_year)
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS preprimary_enrollment_trends (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        academic_year VARCHAR(10) NOT NULL,
        age_lt3_male INT DEFAULT 0,
        age_lt3_female INT DEFAULT 0,
        age_3_male INT DEFAULT 0,
        age_3_female INT DEFAULT 0,
        age_4_male INT DEFAULT 0,
        age_4_female INT DEFAULT 0,
        age_gte5_male INT DEFAULT 0,
        age_gte5_female INT DEFAULT 0,
        unknown_male INT DEFAULT 0,
        unknown_female INT DEFAULT 0,
        total INT GENERATED ALWAYS AS (
          age_lt3_male + age_lt3_female + age_3_male + age_3_female + 
          age_4_male + age_4_female + age_gte5_male + age_gte5_female + 
          unknown_male + unknown_female
        ) STORED,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(country_code, academic_year)
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS primary_enrollment_trends (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        academic_year VARCHAR(10) NOT NULL,
        k_male INT DEFAULT 0,
        k_female INT DEFAULT 0,
        g1_male INT DEFAULT 0,
        g1_female INT DEFAULT 0,
        g2_male INT DEFAULT 0,
        g2_female INT DEFAULT 0,
        g3_male INT DEFAULT 0,
        g3_female INT DEFAULT 0,
        g4_male INT DEFAULT 0,
        g4_female INT DEFAULT 0,
        g5_male INT DEFAULT 0,
        g5_female INT DEFAULT 0,
        g6_male INT DEFAULT 0,
        g6_female INT DEFAULT 0,
        total_male INT GENERATED ALWAYS AS (k_male + g1_male + g2_male + g3_male + g4_male + g5_male + g6_male) STORED,
        total_female INT GENERATED ALWAYS AS (k_female + g1_female + g2_female + g3_female + g4_female + g5_female + g6_female) STORED,
        total INT GENERATED ALWAYS AS (
          k_male + k_female + g1_male + g1_female + g2_male + g2_female + 
          g3_male + g3_female + g4_male + g4_female + g5_male + g5_female + g6_male + g6_female
        ) STORED,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(country_code, academic_year)
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS secondary_enrollment_trends (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3) NOT NULL,
        academic_year VARCHAR(10) NOT NULL,
        f1_male INT DEFAULT 0,
        f1_female INT DEFAULT 0,
        f2_male INT DEFAULT 0,
        f2_female INT DEFAULT 0,
        f3_male INT DEFAULT 0,
        f3_female INT DEFAULT 0,
        f4_male INT DEFAULT 0,
        f4_female INT DEFAULT 0,
        f5_male INT DEFAULT 0,
        f5_female INT DEFAULT 0,
        f6_male INT DEFAULT 0,
        f6_female INT DEFAULT 0,
        total_male INT GENERATED ALWAYS AS (f1_male + f2_male + f3_male + f4_male + f5_male + f6_male) STORED,
        total_female INT GENERATED ALWAYS AS (f1_female + f2_female + f3_female + f4_female + f5_female + f6_female) STORED,
        total INT GENERATED ALWAYS AS (
          f1_male + f1_female + f2_male + f2_female + f3_male + f3_female + 
          f4_male + f4_female + f5_male + f5_female + f6_male + f6_female
        ) STORED,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(country_code, academic_year)
      )
    `

    // Insert sample data if tables are empty
    const countryCount = await sql`SELECT COUNT(*) as count FROM countries`
    if (countryCount[0].count === 0) {
      await seedDatabase()
    }

    console.log("Database initialized successfully")
  } catch (error) {
    console.warn("Error initializing database:", error)
  }
}

async function seedDatabase() {
  try {
    // Insert countries
    await sql`
      INSERT INTO countries (country_code, country_name, region) VALUES
      ('ANU', 'Anguilla', 'OECS'),
      ('A&B', 'Antigua and Barbuda', 'OECS'),
      ('DOM', 'Dominica', 'OECS'),
      ('GRD', 'Grenada', 'OECS'),
      ('MON', 'Montserrat', 'OECS'),
      ('SKN', 'Saint Kitts and Nevis', 'OECS'),
      ('SLU', 'Saint Lucia', 'OECS'),
      ('SVG', 'Saint Vincent and the Grenadines', 'OECS'),
      ('VI', 'Virgin Islands', 'OECS')
      ON CONFLICT (country_code) DO NOTHING
    `

    // Insert early childhood data
    await sql`
      INSERT INTO early_childhood_centres 
      (country_code, daycare_public, daycare_private_church, daycare_private_non_affiliated, daycare_total, 
       preschool_public, preschool_private_church, preschool_private_non_affiliated, preschool_total) 
      VALUES
      ('ANU', 0, 0, 0, 0, 0, 0, 0, 0),
      ('A&B', 0, 0, 0, 0, 0, 0, 0, 0),
      ('DOM', 0, 0, 14, 14, 29, 14, 31, 74),
      ('GRD', 5, 0, 0, 5, 63, 10, 31, 104),
      ('MON', 0, 0, 0, 0, 0, 0, 0, 0),
      ('SKN', 0, 0, 0, 0, 14, 0, 3, 17),
      ('SLU', 12, 0, 34, 46, 13, 5, 47, 65),
      ('SVG', 0, 0, 0, 0, 0, 0, 0, 0),
      ('VI', 0, 6, 20, 26, 1, 9, 20, 30)
      ON CONFLICT (country_code) DO NOTHING
    `

    // Insert educational institutions data
    await sql`
      INSERT INTO educational_institutions
      (country_code, primary_public, primary_private_church, primary_private_non_affiliated, primary_total,
       secondary_public, secondary_private_church, secondary_private_non_affiliated, secondary_total,
       special_ed_public, special_ed_private_church, special_ed_private_non_affiliated, special_ed_total,
       tvet_public, tvet_private_church, tvet_private_non_affiliated, tvet_total)
      VALUES
      ('ANU', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      ('A&B', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      ('DOM', 45, 5, 7, 57, 7, 6, 2, 15, 0, 0, 2, 2, 0, 0, 0, 0),
      ('GRD', 56, 8, 31, 95, 21, 1, 3, 25, 3, 0, 0, 3, 1, 1, 0, 2),
      ('MON', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      ('SKN', 17, 0, 5, 22, 6, 0, 2, 8, 2, 0, 0, 2, 1, 0, 0, 1),
      ('SLU', 72, 15, 7, 94, 20, 1, 3, 24, 4, 0, 1, 5, 1, 1, 0, 2),
      ('SVG', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      ('VI', 13, 3, 8, 24, 4, 2, 2, 8, 1, 0, 0, 1, 1, 0, 0, 1)
      ON CONFLICT (country_code) DO NOTHING
    `

    // Insert post-secondary data
    await sql`
      INSERT INTO post_secondary_institutions
      (country_code, public_institutions, private_institutions, total)
      VALUES
      ('ANU', 0, 0, 0),
      ('A&B', 0, 0, 0),
      ('DOM', 1, 4, 5),
      ('GRD', 1, 1, 2),
      ('MON', 0, 0, 0),
      ('SKN', 2, 2, 4),
      ('SLU', 1, 0, 1),
      ('SVG', 2, 0, 2),
      ('VI', 1, 0, 1)
      ON CONFLICT (country_code) DO NOTHING
    `

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}