import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Users, Building2, ArrowLeft, BarChart3, TrendingUp, LineChart, DollarSign } from "lucide-react"
import { getAllEducationData, getAllEnrollmentData, getInstitutionsTrendData, getFinancialTrendData, initializeDatabase, getAcademicYears } from "@/lib/supabase-data-service"
import { DashboardContent } from "../dashboard-content"
import { EnrollmentContent } from "../enrollment-content"
import { TrendsContent } from "../trends-content"
import { FinancialContent } from "../financial-content"
import { YearSelector } from "@/components/year-selector"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardPageProps {
  searchParams: { year?: string }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Initialize database first
  await initializeDatabase()

  // Get the selected year from URL params, or use active year
  const selectedYear = searchParams.year

  const [educationData, enrollmentData, trendData, financialData, academicYears] = await Promise.all([
    getAllEducationData(selectedYear),
    getAllEnrollmentData(selectedYear),
    getInstitutionsTrendData(),
    getFinancialTrendData(),
    getAcademicYears()
  ])

  // Calculate key metrics for institutions
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

  const countriesWithData = educationData.summary.filter(
    (country) => country.total_primary_schools > 0 || country.total_secondary_schools > 0,
  ).length

  // Calculate key metrics for enrollment
  const totalEnrollment = enrollmentData.primary.reduce((sum, item) => sum + (item.total || 0), 0) +
                         enrollmentData.secondary.reduce((sum, item) => sum + (item.total || 0), 0) +
                         enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.total || 0), 0)

  const countriesWithEnrollment = new Set([
    ...enrollmentData.primary.map(item => item.country_code),
    ...enrollmentData.secondary.map(item => item.country_code),
    ...enrollmentData.earlyChildhood.map(item => item.country_code)
  ]).size

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 h-full">
        {/* Header with Back Button and Year Selector */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Education Dashboard</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Comprehensive analysis of educational institutions and enrollment across the Organisation of Eastern Caribbean States
              </p>
            </div>
            <YearSelector years={academicYears} currentYear={selectedYear} />
          </div>
        </div>

        {/* Tabs for switching between Institutions, Enrollment, and Financial */}
        <Tabs defaultValue="institutions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="institutions" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Institutions
            </TabsTrigger>
            <TabsTrigger value="enrollment" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Enrollment
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="institutions">
            {/* Sub-tabs for Overview vs Historical Trends */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Current Overview</TabsTrigger>
                <TabsTrigger value="historical">Historical Trends</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                {/* Institutions Key Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Early Childhood</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {educationData.summary.reduce(
                          (sum, country) => sum + country.total_daycare_centres + country.total_preschools,
                          0,
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Daycare & Preschool Centers</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">K-12 Education</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {educationData.summary.reduce(
                          (sum, country) => sum + country.total_primary_schools + country.total_secondary_schools,
                          0,
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Primary & Secondary Schools</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Higher Education</CardTitle>
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {educationData.summary.reduce((sum, country) => sum + country.total_post_secondary, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">Post-Secondary Institutions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Specialized</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {educationData.summary.reduce(
                          (sum, country) => sum + country.total_special_ed_schools + country.total_tvet_institutions,
                          0,
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Special Ed & TVET</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Institutions Summary Badges */}
                <div className="flex justify-center gap-4 flex-wrap mb-8">
                  <Badge variant="secondary" className="text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    {countriesWithData} Active Countries
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Building2 className="h-4 w-4 mr-1" />
                    {totalInstitutions} Total Institutions
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {selectedYear || academicYears.find(y => y.is_active)?.year_label || '2022-2023'}
                  </Badge>
                </div>

                {/* Institutions Main Dashboard */}
                <Suspense fallback={<div>Loading dashboard...</div>}>
                  <DashboardContent educationData={educationData} />
                </Suspense>
              </TabsContent>

              {/* Historical Trends Tab */}
              <TabsContent value="historical">
                <Suspense fallback={<div>Loading trend data...</div>}>
                  <TrendsContent trendData={trendData} financialData={financialData} />
                </Suspense>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="enrollment">
            {/* Enrollment Key Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Early Childhood</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Students Enrolled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Primary Education</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {enrollmentData.primary.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Students Enrolled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Secondary Education</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {enrollmentData.secondary.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Students Enrolled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Special Education</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {enrollmentData.specialEducation.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Students Enrolled</p>
                </CardContent>
              </Card>
            </div>

            {/* Enrollment Summary Badges */}
            <div className="flex justify-center gap-4 flex-wrap mb-8">
              <Badge variant="secondary" className="text-sm">
                <Users className="h-4 w-4 mr-1" />
                {countriesWithEnrollment} Countries with Data
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                {totalEnrollment.toLocaleString()} Total Students
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                {selectedYear || academicYears.find(y => y.is_active)?.year_label || '2022-2023'}
              </Badge>
            </div>

            {/* Enrollment Main Dashboard */}
            <Suspense fallback={<div>Loading enrollment data...</div>}>
              <EnrollmentContent enrollmentData={enrollmentData} />
            </Suspense>
          </TabsContent>

          <TabsContent value="trends">
            {/* Trends Dashboard */}
            <Suspense fallback={<div>Loading trend data...</div>}>
              <TrendsContent trendData={trendData} financialData={financialData} />
            </Suspense>
          </TabsContent>

          <TabsContent value="financial">
            {/* Financial Dashboard */}
            <Suspense fallback={<div>Loading financial data...</div>}>
              <FinancialContent
                financialData={financialData}
                selectedYear={selectedYear}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 