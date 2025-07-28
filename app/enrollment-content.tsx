"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, BookOpen, GraduationCap, Building2, TrendingUp, BarChart3, Target, Activity, Eye, Brain, Database, BarChart4 } from "lucide-react"
import { type EnrollmentData } from "@/lib/data-service"
import { AIChat } from "@/components/ai-chat"
import { VisualizationControls } from "@/components/visualization-controls"

interface EnrollmentContentProps {
  enrollmentData: EnrollmentData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function EnrollmentContent({ enrollmentData }: EnrollmentContentProps) {
  // Prepare data for charts
  const earlyChildhoodByCountry = enrollmentData.earlyChildhood.reduce((acc, item) => {
    if (!acc[item.country_name]) {
      acc[item.country_name] = 0
    }
    acc[item.country_name] += item.total || 0
    return acc
  }, {} as Record<string, number>)

  const primaryByCountry = enrollmentData.primary.reduce((acc, item) => {
    if (!acc[item.country_name]) {
      acc[item.country_name] = 0
    }
    acc[item.country_name] += item.total || 0
    return acc
  }, {} as Record<string, number>)

  const secondaryByCountry = enrollmentData.secondary.reduce((acc, item) => {
    if (!acc[item.country_name]) {
      acc[item.country_name] = 0
    }
    acc[item.country_name] += item.total || 0
    return acc
  }, {} as Record<string, number>)

  const earlyChildhoodChartData = Object.entries(earlyChildhoodByCountry).map(([country, total]) => ({
    country,
    total
  }))

  const primaryChartData = Object.entries(primaryByCountry).map(([country, total]) => ({
    country,
    total
  }))

  const secondaryChartData = Object.entries(secondaryByCountry).map(([country, total]) => ({
    country,
    total
  }))

  // Gender distribution data
  const genderDistribution = {
    earlyChildhood: {
      male: enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.male || 0), 0),
      female: enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.female || 0), 0)
    },
    primary: {
      male: enrollmentData.primary.reduce((sum, item) => sum + (item.subtotal_male || 0), 0),
      female: enrollmentData.primary.reduce((sum, item) => sum + (item.subtotal_female || 0), 0)
    },
    secondary: {
      male: enrollmentData.secondary.reduce((sum, item) => sum + (item.subtotal_male || 0), 0),
      female: enrollmentData.secondary.reduce((sum, item) => sum + (item.subtotal_female || 0), 0)
    }
  }

  const genderChartData = [
    { name: 'Early Childhood', male: genderDistribution.earlyChildhood.male, female: genderDistribution.earlyChildhood.female },
    { name: 'Primary', male: genderDistribution.primary.male, female: genderDistribution.primary.female },
    { name: 'Secondary', male: genderDistribution.secondary.male, female: genderDistribution.secondary.female }
  ]

  // Gender Parity Index calculations
  const calculateGenderParityIndex = (male: number, female: number) => {
    if (male === 0) return female > 0 ? 2.0 : 1.0
    return female / male
  }

  const genderParityData = [
    {
      level: 'Early Childhood',
      gpi: calculateGenderParityIndex(genderDistribution.earlyChildhood.male, genderDistribution.earlyChildhood.female),
      male: genderDistribution.earlyChildhood.male,
      female: genderDistribution.earlyChildhood.female
    },
    {
      level: 'Primary',
      gpi: calculateGenderParityIndex(genderDistribution.primary.male, genderDistribution.primary.female),
      male: genderDistribution.primary.male,
      female: genderDistribution.primary.female
    },
    {
      level: 'Secondary',
      gpi: calculateGenderParityIndex(genderDistribution.secondary.male, genderDistribution.secondary.female),
      male: genderDistribution.secondary.male,
      female: genderDistribution.secondary.female
    }
  ]

  // Age distribution analysis
  const ageDistributionData = enrollmentData.primaryAgeDistribution.map(item => ({
    country: item.country_name,
    grade: item.grade,
    underAged: (item.under_aged_male_pct || 0) + (item.under_aged_female_pct || 0),
    classAged: (item.class_aged_male_pct || 0) + (item.class_aged_female_pct || 0),
    overAged: (item.over_aged_male_pct || 0) + (item.over_aged_female_pct || 0)
  }))

  // Trend analysis
  const trendData = enrollmentData.trends.primary.map(item => ({
    year: item.academic_year,
    country: item.country_name,
    total: item.total,
    male: item.total_male,
    female: item.total_female
  }))

  // Enrollment summary statistics
  const totalEnrollment = enrollmentData.primary.reduce((sum, item) => sum + (item.total || 0), 0) +
                         enrollmentData.secondary.reduce((sum, item) => sum + (item.total || 0), 0) +
                         enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.total || 0), 0)

  const totalMale = enrollmentData.primary.reduce((sum, item) => sum + (item.subtotal_male || 0), 0) +
                   enrollmentData.secondary.reduce((sum, item) => sum + (item.subtotal_male || 0), 0) +
                   enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.male || 0), 0)

  const totalFemale = enrollmentData.primary.reduce((sum, item) => sum + (item.subtotal_female || 0), 0) +
                     enrollmentData.secondary.reduce((sum, item) => sum + (item.subtotal_female || 0), 0) +
                     enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.female || 0), 0)

  // AI Analysis insights
  const generateAIAnalysis = () => {
    const insights = []
    
    // Gender parity analysis
    const overallGPI = totalFemale / totalMale
    if (overallGPI < 0.95) {
      insights.push("⚠️ Gender disparity detected: Male enrollment is significantly higher than female enrollment")
    } else if (overallGPI > 1.05) {
      insights.push("⚠️ Gender disparity detected: Female enrollment is significantly higher than male enrollment")
    } else {
      insights.push("✅ Gender parity achieved: Enrollment is balanced between male and female students")
    }

    // Age distribution analysis
    if (ageDistributionData.length > 0) {
      const avgOverAged = ageDistributionData.reduce((sum, item) => sum + item.overAged, 0) / ageDistributionData.length
      if (avgOverAged > 20) {
        insights.push("⚠️ High over-aged enrollment: Many students are older than expected for their grade level")
      } else {
        insights.push("✅ Age-appropriate enrollment: Most students are in age-appropriate grade levels")
      }
    }

    // Enrollment trends analysis
    if (trendData.length > 1) {
      const recentYears = trendData.slice(-2)
      const growth = ((recentYears[1]?.total || 0) - (recentYears[0]?.total || 0)) / (recentYears[0]?.total || 1) * 100
      if (growth > 5) {
        insights.push("📈 Positive enrollment trend: Student enrollment is increasing")
      } else if (growth < -5) {
        insights.push("📉 Declining enrollment trend: Student enrollment is decreasing")
      } else {
        insights.push("➡️ Stable enrollment: Student numbers are relatively consistent")
      }
    }

    // Country coverage analysis
    const countriesWithData = new Set([
      ...enrollmentData.primary.map(item => item.country_name),
      ...enrollmentData.secondary.map(item => item.country_name),
      ...enrollmentData.earlyChildhood.map(item => item.country_name)
    ]).size

    if (countriesWithData < 5) {
      insights.push("📊 Limited data coverage: Enrollment data available for fewer than 5 OECS countries")
    } else {
      insights.push("📊 Comprehensive coverage: Enrollment data available for most OECS countries")
    }

    return insights
  }

  const aiInsights = generateAIAnalysis()

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="visualizations" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            Visualizations
          </TabsTrigger>
          <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="raw-data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Raw Data
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEnrollment.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all education levels</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gender Ratio</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(totalFemale / totalMale).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Female to Male ratio</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Countries</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set([
                    ...enrollmentData.primary.map(item => item.country_name),
                    ...enrollmentData.secondary.map(item => item.country_name),
                    ...enrollmentData.earlyChildhood.map(item => item.country_name)
                  ]).size}
                </div>
                <p className="text-xs text-muted-foreground">With enrollment data</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {[
                    enrollmentData.primary.length > 0,
                    enrollmentData.secondary.length > 0,
                    enrollmentData.earlyChildhood.length > 0,
                    enrollmentData.trends.primary.length > 0
                  ].filter(Boolean).length}/4
                </div>
                <p className="text-xs text-muted-foreground">Data categories available</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment by Education Level</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Early Childhood', value: enrollmentData.earlyChildhood.reduce((sum, item) => sum + (item.total || 0), 0) },
                        { name: 'Primary', value: enrollmentData.primary.reduce((sum, item) => sum + (item.total || 0), 0) },
                        { name: 'Secondary', value: enrollmentData.secondary.reduce((sum, item) => sum + (item.total || 0), 0) },
                        { name: 'Special Education', value: enrollmentData.specialEducation.reduce((sum, item) => sum + (item.total || 0), 0) }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Students']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genderChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Students']} />
                    <Legend />
                    <Bar dataKey="male" fill="#0088FE" name="Male" />
                    <Bar dataKey="female" fill="#FF69B4" name="Female" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Visualizations Tab */}
        <TabsContent value="visualizations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Early Childhood Enrollment by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={earlyChildhoodChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Students']} />
                    <Bar dataKey="total" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Primary Education Enrollment by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={primaryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Students']} />
                    <Bar dataKey="total" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Secondary Education Enrollment by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={secondaryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Students']} />
                    <Bar dataKey="total" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Gender Parity Index Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genderParityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [name === 'gpi' ? Number(value).toFixed(2) : value.toLocaleString(), name === 'gpi' ? 'GPI' : 'Students']} />
                    <Legend />
                    <Bar dataKey="gpi" fill="#FF6B6B" name="Gender Parity Index" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {enrollmentData.primaryAgeDistribution.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Age Distribution Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={ageDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                    <Bar dataKey="underAged" fill="#FF6B6B" name="Under-aged" />
                    <Bar dataKey="classAged" fill="#4ECDC4" name="Class-aged" />
                    <Bar dataKey="overAged" fill="#45B7D1" name="Over-aged" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {enrollmentData.trends.primary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Enrollment Trends (5-Year Historical Data)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Students']} />
                    <Legend />
                    <Area type="monotone" dataKey="total" fill="#8884d8" stroke="#8884d8" name="Total Enrollment" />
                    <Area type="monotone" dataKey="male" fill="#0088FE" stroke="#0088FE" name="Male" />
                    <Area type="monotone" dataKey="female" fill="#FF69B4" stroke="#FF69B4" name="Female" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <VisualizationControls 
              onVisualizationChange={(type, config) => {
                console.log('Visualization changed:', type, config)
                // Handle visualization changes here
              }}
              dataType="enrollment"
            />
          </div>
        </div>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai-analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="h-full">
              <AIChat educationData={enrollmentData} isEnrollmentData={true} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gender Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Male Students:</span>
                  <Badge variant="secondary">
                    {totalMale.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Female Students:</span>
                  <Badge variant="secondary">
                    {totalFemale.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Gender Ratio:</span>
                  <Badge variant="secondary">
                    {(totalFemale / totalMale).toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Overall GPI:</span>
                  <Badge variant={totalFemale / totalMale >= 0.95 && totalFemale / totalMale <= 1.05 ? "default" : "destructive"}>
                    {(totalFemale / totalMale).toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Quality Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Primary Data:</span>
                  <Badge variant={enrollmentData.primary.length > 0 ? "default" : "destructive"}>
                    {enrollmentData.primary.length > 0 ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Secondary Data:</span>
                  <Badge variant={enrollmentData.secondary.length > 0 ? "default" : "destructive"}>
                    {enrollmentData.secondary.length > 0 ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Early Childhood:</span>
                  <Badge variant={enrollmentData.earlyChildhood.length > 0 ? "default" : "destructive"}>
                    {enrollmentData.earlyChildhood.length > 0 ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Special Education:</span>
                  <Badge variant={enrollmentData.specialEducation.length > 0 ? "default" : "destructive"}>
                    {enrollmentData.specialEducation.length > 0 ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Age Distribution:</span>
                  <Badge variant={enrollmentData.primaryAgeDistribution.length > 0 ? "default" : "destructive"}>
                    {enrollmentData.primaryAgeDistribution.length > 0 ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Trend Data:</span>
                  <Badge variant={enrollmentData.trends.primary.length > 0 ? "default" : "destructive"}>
                    {enrollmentData.trends.primary.length > 0 ? "Available" : "Missing"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="raw-data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Primary Enrollment Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead>School Type</TableHead>
                      <TableHead>Age Group</TableHead>
                      <TableHead>Male</TableHead>
                      <TableHead>Female</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollmentData.primary.slice(0, 10).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.country_name}</TableCell>
                        <TableCell>{item.school_type}</TableCell>
                        <TableCell>{item.age_group}</TableCell>
                        <TableCell>{item.subtotal_male?.toLocaleString() || 0}</TableCell>
                        <TableCell>{item.subtotal_female?.toLocaleString() || 0}</TableCell>
                        <TableCell>{item.total?.toLocaleString() || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secondary Enrollment Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead>School Type</TableHead>
                      <TableHead>Age Group</TableHead>
                      <TableHead>Male</TableHead>
                      <TableHead>Female</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollmentData.secondary.slice(0, 10).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.country_name}</TableCell>
                        <TableCell>{item.school_type}</TableCell>
                        <TableCell>{item.age_group}</TableCell>
                        <TableCell>{item.subtotal_male?.toLocaleString() || 0}</TableCell>
                        <TableCell>{item.subtotal_female?.toLocaleString() || 0}</TableCell>
                        <TableCell>{item.total?.toLocaleString() || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {enrollmentData.primaryAgeDistribution.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Country</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Under-aged Male %</TableHead>
                        <TableHead>Class-aged Male %</TableHead>
                        <TableHead>Over-aged Male %</TableHead>
                        <TableHead>Under-aged Female %</TableHead>
                        <TableHead>Class-aged Female %</TableHead>
                        <TableHead>Over-aged Female %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollmentData.primaryAgeDistribution.slice(0, 10).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.country_name}</TableCell>
                          <TableCell>{item.grade}</TableCell>
                                                   <TableCell>{typeof item.under_aged_male_pct === 'number' ? item.under_aged_male_pct.toFixed(1) : '0.0'}%</TableCell>
                         <TableCell>{typeof item.class_aged_male_pct === 'number' ? item.class_aged_male_pct.toFixed(1) : '0.0'}%</TableCell>
                         <TableCell>{typeof item.over_aged_male_pct === 'number' ? item.over_aged_male_pct.toFixed(1) : '0.0'}%</TableCell>
                         <TableCell>{typeof item.under_aged_female_pct === 'number' ? item.under_aged_female_pct.toFixed(1) : '0.0'}%</TableCell>
                         <TableCell>{typeof item.class_aged_female_pct === 'number' ? item.class_aged_female_pct.toFixed(1) : '0.0'}%</TableCell>
                         <TableCell>{typeof item.over_aged_female_pct === 'number' ? item.over_aged_female_pct.toFixed(1) : '0.0'}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 