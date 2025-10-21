"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, getUserProfile, getActiveAcademicYear } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Save, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StaffDemographicsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Data storage using Maps for efficient lookup
  const [ageData, setAgeData] = useState<Map<string, number>>(new Map())
  const [serviceData, setServiceData] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const userProfile = await getUserProfile(user.id)
      setProfile(userProfile)

      const activeYear = await getActiveAcademicYear()
      setAcademicYear(activeYear)

      if (userProfile?.country_id && activeYear?.id) {
        // Load age distribution data
        const { data: ageDistribution } = await supabase
          .from('staff_age_distribution')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (ageDistribution) {
          const map = new Map<string, number>()
          ageDistribution.forEach(row => {
            const key = `${row.role}|${row.education_level}|${row.ownership_type}|${row.age_range}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setAgeData(map)
          if (ageDistribution.length > 0) setLastSaved(new Date(ageDistribution[0].updated_at))
        }

        // Load years of service data
        const { data: serviceYears } = await supabase
          .from('staff_years_of_service')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (serviceYears) {
          const map = new Map<string, number>()
          serviceYears.forEach(row => {
            const key = `${row.role}|${row.education_level}|${row.ownership_type}|${row.service_range}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setServiceData(map)
        }
      }

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Helper functions for data keys
  const ageKey = (role: string, level: string, ownership: string, ageRange: string, gender: string) =>
    `${role}|${level}|${ownership}|${ageRange}|${gender}`

  const serviceKey = (role: string, level: string, ownership: string, serviceRange: string, gender: string) =>
    `${role}|${level}|${ownership}|${serviceRange}|${gender}`

  // Calculate row totals
  const calculateAgeRowTotal = (role: string, level: string, ownership: string, ageRange: string) => {
    const male = ageData.get(ageKey(role, level, ownership, ageRange, 'male')) || 0
    const female = ageData.get(ageKey(role, level, ownership, ageRange, 'female')) || 0
    return male + female
  }

  const calculateServiceRowTotal = (role: string, level: string, ownership: string, serviceRange: string) => {
    const male = serviceData.get(serviceKey(role, level, ownership, serviceRange, 'male')) || 0
    const female = serviceData.get(serviceKey(role, level, ownership, serviceRange, 'female')) || 0
    return male + female
  }

  const handleSave = async () => {
    if (!profile?.country_id || !academicYear?.id) {
      toast.error('Missing required information')
      return
    }

    setSaving(true)

    try {
      const countryId = profile.country_id
      const yearId = academicYear.id

      // Save age distribution data
      await supabase.from('staff_age_distribution').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const ageInserts: any[] = []
      ageData.forEach((count, key) => {
        const [role, education_level, ownership_type, age_range, gender] = key.split('|')
        if (count > 0) {
          ageInserts.push({
            country_id: countryId,
            academic_year_id: yearId,
            role,
            education_level,
            ownership_type,
            age_range,
            gender,
            count
          })
        }
      })
      if (ageInserts.length > 0) {
        await supabase.from('staff_age_distribution').insert(ageInserts)
      }

      // Save years of service data
      await supabase.from('staff_years_of_service').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const serviceInserts: any[] = []
      serviceData.forEach((count, key) => {
        const [role, education_level, ownership_type, service_range, gender] = key.split('|')
        if (count > 0) {
          serviceInserts.push({
            country_id: countryId,
            academic_year_id: yearId,
            role,
            education_level,
            ownership_type,
            service_range,
            gender,
            count
          })
        }
      })
      if (serviceInserts.length > 0) {
        await supabase.from('staff_years_of_service').insert(serviceInserts)
      }

      setLastSaved(new Date())
      toast.success('All staff demographics data saved successfully!')
    } catch (error: any) {
      console.error('Error saving data:', error)
      toast.error('Failed to save data: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#DCE8D5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DA11D] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const educationLevels = [
    { key: 'pre_primary', label: 'Pre-schools' },
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'post_secondary', label: 'Post-secondary/Tertiary' }
  ]

  const ageRanges = [
    { key: 'under_19', label: '<19 years' },
    { key: '20_29', label: '20-29 years' },
    { key: '30_39', label: '30-39 years' },
    { key: '40_49', label: '40-49 years' },
    { key: '50_59', label: '50-59 years' },
    { key: '60_plus', label: '60+ years' },
    { key: 'unknown', label: 'Unknown' }
  ]

  const serviceRanges = [
    { key: 'under_1', label: '<1 year' },
    { key: '1_5', label: '1-5 years' },
    { key: '6_10', label: '6-10 years' },
    { key: '11_15', label: '11-15 years' },
    { key: '16_20', label: '16-20 years' },
    { key: '21_25', label: '21-25 years' },
    { key: '26_30', label: '26-30 years' },
    { key: '31_35', label: '31-35 years' },
    { key: 'over_35', label: '35+ years' },
    { key: 'unknown', label: 'Unknown' }
  ]

  // Render age distribution table
  const renderAgeTable = (role: string, ownership: string) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-32">Age Range</th>
              {educationLevels.map(level => (
                <React.Fragment key={level.key}>
                  <th className="border p-2 text-center w-20">M</th>
                  <th className="border p-2 text-center w-20">F</th>
                  <th className="border p-2 text-center w-20 bg-gray-200">Tot</th>
                </React.Fragment>
              ))}
            </tr>
            <tr className="bg-muted/50 text-xs">
              <th className="border p-1"></th>
              {educationLevels.map(level => (
                <React.Fragment key={level.key}>
                  <th colSpan={3} className="border p-1 text-center">{level.label}</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {ageRanges.map(ageRange => (
              <tr key={ageRange.key}>
                <td className="border p-2 font-medium bg-gray-50">{ageRange.label}</td>
                {educationLevels.map(level => (
                  <React.Fragment key={level.key}>
                    <td className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-8 w-full"
                        value={ageData.get(ageKey(role, level.key, ownership, ageRange.key, 'male')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setAgeData(prev => new Map(prev).set(ageKey(role, level.key, ownership, ageRange.key, 'male'), val))
                        }}
                      />
                    </td>
                    <td className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-8 w-full"
                        value={ageData.get(ageKey(role, level.key, ownership, ageRange.key, 'female')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setAgeData(prev => new Map(prev).set(ageKey(role, level.key, ownership, ageRange.key, 'female'), val))
                        }}
                      />
                    </td>
                    <td className="border p-2 text-center bg-gray-50 font-medium">
                      {calculateAgeRowTotal(role, level.key, ownership, ageRange.key)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Render years of service table
  const renderServiceTable = (role: string, ownership: string) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-32">Years of Service</th>
              {educationLevels.map(level => (
                <React.Fragment key={level.key}>
                  <th className="border p-2 text-center w-20">M</th>
                  <th className="border p-2 text-center w-20">F</th>
                  <th className="border p-2 text-center w-20 bg-gray-200">Tot</th>
                </React.Fragment>
              ))}
            </tr>
            <tr className="bg-muted/50 text-xs">
              <th className="border p-1"></th>
              {educationLevels.map(level => (
                <React.Fragment key={level.key}>
                  <th colSpan={3} className="border p-1 text-center">{level.label}</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {serviceRanges.map(serviceRange => (
              <tr key={serviceRange.key}>
                <td className="border p-2 font-medium bg-gray-50">{serviceRange.label}</td>
                {educationLevels.map(level => (
                  <React.Fragment key={level.key}>
                    <td className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-8 w-full"
                        value={serviceData.get(serviceKey(role, level.key, ownership, serviceRange.key, 'male')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setServiceData(prev => new Map(prev).set(serviceKey(role, level.key, ownership, serviceRange.key, 'male'), val))
                        }}
                      />
                    </td>
                    <td className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-8 w-full"
                        value={serviceData.get(serviceKey(role, level.key, ownership, serviceRange.key, 'female')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setServiceData(prev => new Map(prev).set(serviceKey(role, level.key, ownership, serviceRange.key, 'female'), val))
                        }}
                      />
                    </td>
                    <td className="border p-2 text-center bg-gray-50 font-medium">
                      {calculateServiceRowTotal(role, level.key, ownership, serviceRange.key)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#DCE8D5]">
      {/* Header */}
      <div className="bg-[#4DA11D] text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/data-entry')} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Staff Demographics: Age & Years of Service</h1>
                <p className="text-sm opacity-90">
                  {profile?.countries?.country_name} | {academicYear?.year_label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastSaved && (
                <div className="text-sm opacity-90 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Last saved: {lastSaved.toLocaleTimeString()}
                </div>
              )}
              <Button variant="secondary" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save All'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Age Range:</strong> Report staff count by age category for each school type</p>
            <p><strong>Years of Service:</strong> Report staff count by years of experience in the education system</p>
            <p><strong>Disaggregation:</strong> All data should be entered by gender (Male/Female) and institution type (Public/Private)</p>
            <p>Complete all sections for both Principals/Deputy Principals and Teachers. Totals are calculated automatically.</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="leaders-age" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="leaders-age">Leaders: Age</TabsTrigger>
            <TabsTrigger value="leaders-service">Leaders: Service</TabsTrigger>
            <TabsTrigger value="teachers-age">Teachers: Age</TabsTrigger>
            <TabsTrigger value="teachers-service">Teachers: Service</TabsTrigger>
          </TabsList>

          {/* Leaders - Age Distribution */}
          <TabsContent value="leaders-age" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution: Principals and Deputy Principals</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderAgeTable('principal_deputy', 'public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderAgeTable('principal_deputy', 'private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Leaders - Years of Service */}
          <TabsContent value="leaders-service" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Years of Service: Principals and Deputy Principals</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderServiceTable('principal_deputy', 'public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderServiceTable('principal_deputy', 'private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Teachers - Age Distribution */}
          <TabsContent value="teachers-age" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution: Teachers</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderAgeTable('teacher', 'public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderAgeTable('teacher', 'private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Teachers - Years of Service */}
          <TabsContent value="teachers-service" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Years of Service: Teachers</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderServiceTable('teacher', 'public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderServiceTable('teacher', 'private')}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 pb-8">
          <Button variant="outline" onClick={() => router.push('/data-entry')}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Data'}
          </Button>
        </div>
      </div>
    </div>
  )
}
