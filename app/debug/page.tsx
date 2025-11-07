import { getAllEducationData, getAllEnrollmentData, getAcademicYears } from "@/lib/supabase-data-service"

export default async function DebugPage() {
  const [educationData, enrollmentData, academicYears] = await Promise.all([
    getAllEducationData('2021-2022'),
    getAllEnrollmentData('2021-2022'),
    getAcademicYears()
  ])

  const totalInstitutions = educationData.summary.reduce(
    (sum, country) =>
      sum +
      country.total_daycare_centres +
      country.total_preschools +
      country.total_primary_schools +
      country.total_secondary_schools +
      country.total_special_ed_schools +
      country.total_tvet_institutions +
      country.total_post_secondary,
    0,
  )

  const totalEnrollment = enrollmentData.primary.reduce((sum, item) => sum + (item.total || 0), 0) +
                         enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.total || 0), 0) +
                         enrollmentData.specialEducation.reduce((sum, item) => sum + (item.total || 0), 0)

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Debug Page</h1>

      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Academic Years</h2>
          <p>Total years: {academicYears.length}</p>
          <ul className="list-disc ml-6">
            {academicYears.map(y => (
              <li key={y.id}>{y.year_label} {y.is_active && '(ACTIVE)'}</li>
            ))}
          </ul>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Institutions Data (2021-2022)</h2>
          <p className="text-2xl font-bold text-green-600">Total: {totalInstitutions}</p>
          <p>Countries with data: {educationData.summary.length}</p>
          <div className="mt-4">
            <h3 className="font-semibold">By Country:</h3>
            <ul className="list-disc ml-6">
              {educationData.summary.map((country: any) => {
                const total = country.total_daycare_centres + country.total_preschools +
                             country.total_primary_schools + country.total_secondary_schools
                return (
                  <li key={country.country_code}>
                    {country.country_code} - {country.country_name}: {total} institutions
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Enrollment Data (2021-2022)</h2>
          <p className="text-2xl font-bold text-blue-600">Total Students: {totalEnrollment.toLocaleString()}</p>
          <ul className="list-disc ml-6">
            <li>Early Childhood: {enrollmentData.earlyChildhood.length} records</li>
            <li>Primary: {enrollmentData.primary.length} records</li>
            <li>Secondary: {enrollmentData.secondary.length} records</li>
            <li>Special Education: {enrollmentData.specialEducation.length} records</li>
          </ul>
        </div>

        <div className="border p-4 rounded bg-yellow-50">
          <h2 className="text-xl font-bold mb-2">Expected Values</h2>
          <ul className="list-disc ml-6">
            <li>Total Institutions for 2021-2022: <strong>1,041</strong></li>
            <li>Countries: <strong>9</strong></li>
            <li>Academic Years: <strong>6</strong></li>
          </ul>
          <p className="mt-4">
            If numbers match, the backend is working correctly!
          </p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Raw Data Sample</h2>
          <details>
            <summary className="cursor-pointer">Click to see raw educationData.summary</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(educationData.summary, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}
