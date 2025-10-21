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

export default function StudentEnrollmentPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Data storage using Map for efficient lookup
  const [enrollmentData, setEnrollmentData] = useState<Map<string, number>>(new Map())

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
        // Load enrollment data
        const { data: enrollment } = await supabase
          .from('student_enrollment')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (enrollment) {
          const map = new Map<string, number>()
          enrollment.forEach(row => {
            const key = `${row.education_level}|${row.ownership_type || 'national'}|${row.age_group}|${row.category || 'none'}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setEnrollmentData(map)
          if (enrollment.length > 0) setLastSaved(new Date(enrollment[0].updated_at))
        }
      }

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Helper function for data keys
  const enrollKey = (level: string, ownership: string, age: string, category: string, gender: string) =>
    `${level}|${ownership}|${age}|${category}|${gender}`

  // Calculate row totals
  const calculateRowTotal = (level: string, ownership: string, age: string, category: string) => {
    const male = enrollmentData.get(enrollKey(level, ownership, age, category, 'male')) || 0
    const female = enrollmentData.get(enrollKey(level, ownership, age, category, 'female')) || 0
    return male + female
  }

  // Calculate category totals across all ages
  const calculateCategoryTotal = (level: string, ownership: string, category: string, gender: string, ageGroups: string[]) => {
    return ageGroups.reduce((sum, age) => {
      return sum + (enrollmentData.get(enrollKey(level, ownership, age, category, gender)) || 0)
    }, 0)
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

      // Delete existing enrollment data
      await supabase.from('student_enrollment').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      // Prepare inserts
      const inserts: any[] = []
      enrollmentData.forEach((count, key) => {
        const [education_level, ownership_str, age_group, category_str, gender] = key.split('|')
        const ownership_type = ownership_str === 'national' ? null : ownership_str
        const category = category_str === 'none' ? null : category_str

        if (count > 0) {
          inserts.push({
            country_id: countryId,
            academic_year_id: yearId,
            education_level,
            ownership_type,
            age_group,
            category,
            gender,
            count
          })
        }
      })

      if (inserts.length > 0) {
        await supabase.from('student_enrollment').insert(inserts)
      }

      setLastSaved(new Date())
      toast.success('All enrollment data saved successfully!')
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

  // Early Childhood Table (D1)
  const renderEarlyChildhood = (ownership: string) => {
    const ageGroups = [
      { key: 'under_1', label: '< 1 year' },
      { key: '1', label: '1 year' },
      { key: '2', label: '2 years' },
      { key: '3', label: '3 years' },
      { key: '4', label: '4 years' },
      { key: 'over_4', label: '> 4 years' },
      { key: 'unknown', label: 'Age Unknown' }
    ]

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-40">Age Group</th>
              <th className="border p-2 text-center w-28">Male</th>
              <th className="border p-2 text-center w-28">Female</th>
              <th className="border p-2 text-center w-28 bg-gray-200">Both</th>
            </tr>
          </thead>
          <tbody>
            {ageGroups.map(age => (
              <tr key={age.key}>
                <td className="border p-2 font-medium bg-gray-50">{age.label}</td>
                <td className="border p-1">
                  <Input
                    type="number"
                    min="0"
                    className="text-center h-8"
                    value={enrollmentData.get(enrollKey('early_childhood', ownership, age.key, 'none', 'male')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setEnrollmentData(prev => new Map(prev).set(enrollKey('early_childhood', ownership, age.key, 'none', 'male'), val))
                    }}
                  />
                </td>
                <td className="border p-1">
                  <Input
                    type="number"
                    min="0"
                    className="text-center h-8"
                    value={enrollmentData.get(enrollKey('early_childhood', ownership, age.key, 'none', 'female')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setEnrollmentData(prev => new Map(prev).set(enrollKey('early_childhood', ownership, age.key, 'none', 'female'), val))
                    }}
                  />
                </td>
                <td className="border p-2 text-center bg-gray-50 font-medium">
                  {calculateRowTotal('early_childhood', ownership, age.key, 'none')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Special Education Table (D2)
  const renderSpecialEducation = (ownership: string) => {
    const ageGroups = [
      { key: '5_8', label: '5-8 years' },
      { key: '9_11', label: '9-11 years' },
      { key: '12_14', label: '12-14 years' },
      { key: '15_17', label: '15-17 years' },
      { key: '18_20', label: '18-20 years' },
      { key: 'over_20', label: '> 20 years' },
      { key: 'unknown', label: 'Age Unknown' }
    ]

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-40">Age Group</th>
              <th className="border p-2 text-center w-28">Male</th>
              <th className="border p-2 text-center w-28">Female</th>
              <th className="border p-2 text-center w-28 bg-gray-200">Both</th>
            </tr>
          </thead>
          <tbody>
            {ageGroups.map(age => (
              <tr key={age.key}>
                <td className="border p-2 font-medium bg-gray-50">{age.label}</td>
                <td className="border p-1">
                  <Input
                    type="number"
                    min="0"
                    className="text-center h-8"
                    value={enrollmentData.get(enrollKey('special_education', ownership, age.key, 'none', 'male')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setEnrollmentData(prev => new Map(prev).set(enrollKey('special_education', ownership, age.key, 'none', 'male'), val))
                    }}
                  />
                </td>
                <td className="border p-1">
                  <Input
                    type="number"
                    min="0"
                    className="text-center h-8"
                    value={enrollmentData.get(enrollKey('special_education', ownership, age.key, 'none', 'female')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setEnrollmentData(prev => new Map(prev).set(enrollKey('special_education', ownership, age.key, 'none', 'female'), val))
                    }}
                  />
                </td>
                <td className="border p-2 text-center bg-gray-50 font-medium">
                  {calculateRowTotal('special_education', ownership, age.key, 'none')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Primary Schools Table (D3) - Age × Grade Matrix
  const renderPrimarySchools = (ownership: string) => {
    const ageGroups = [
      { key: 'under_5', label: '< 5' },
      { key: '5', label: '5' },
      { key: '6', label: '6' },
      { key: '7', label: '7' },
      { key: '8', label: '8' },
      { key: '9', label: '9' },
      { key: '10', label: '10' },
      { key: '11', label: '11' },
      { key: '12', label: '12' },
      { key: '13', label: '13' },
      { key: '14', label: '14' },
      { key: '15', label: '15' },
      { key: 'over_15', label: '16+' },
      { key: 'unknown', label: 'Unknown' }
    ]

    const grades = ['K', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6']

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-24">Age</th>
              <th className="border p-1 text-center w-12">Sex</th>
              {grades.map(grade => (
                <th key={grade} className="border p-1 text-center w-16">{grade}</th>
              ))}
              <th className="border p-1 text-center w-16 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {ageGroups.map(age => (
              <>
                <tr key={`${age.key}-m`}>
                  <td className="border p-2 font-medium bg-gray-50" rowSpan={2}>{age.label}</td>
                  <td className="border p-1 text-center font-medium">M</td>
                  {grades.map(grade => (
                    <td key={grade} className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-7 text-xs p-0"
                        value={enrollmentData.get(enrollKey('primary', ownership, age.key, grade, 'male')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setEnrollmentData(prev => new Map(prev).set(enrollKey('primary', ownership, age.key, grade, 'male'), val))
                        }}
                      />
                    </td>
                  ))}
                  <td className="border p-1 text-center bg-gray-50 font-medium text-xs">
                    {grades.reduce((sum, grade) => sum + (enrollmentData.get(enrollKey('primary', ownership, age.key, grade, 'male')) || 0), 0)}
                  </td>
                </tr>
                <tr key={`${age.key}-f`}>
                  <td className="border p-1 text-center font-medium">F</td>
                  {grades.map(grade => (
                    <td key={grade} className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-7 text-xs p-0"
                        value={enrollmentData.get(enrollKey('primary', ownership, age.key, grade, 'female')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setEnrollmentData(prev => new Map(prev).set(enrollKey('primary', ownership, age.key, grade, 'female'), val))
                        }}
                      />
                    </td>
                  ))}
                  <td className="border p-1 text-center bg-gray-50 font-medium text-xs">
                    {grades.reduce((sum, grade) => sum + (enrollmentData.get(enrollKey('primary', ownership, age.key, grade, 'female')) || 0), 0)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Secondary Schools Table (D4) - Age × Form Matrix
  const renderSecondarySchools = (ownership: string) => {
    const ageGroups = [
      { key: 'under_11', label: '< 11' },
      { key: '11', label: '11' },
      { key: '12', label: '12' },
      { key: '13', label: '13' },
      { key: '14', label: '14' },
      { key: '15', label: '15' },
      { key: '16', label: '16' },
      { key: '17', label: '17' },
      { key: '18', label: '18' },
      { key: 'over_18', label: '19+' },
      { key: 'unknown', label: 'Unknown' }
    ]

    const forms = ['F1', 'F2', 'F3', 'F4', 'F5']

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-24">Age</th>
              <th className="border p-1 text-center w-12">Sex</th>
              {forms.map(form => (
                <th key={form} className="border p-1 text-center w-16">{form}</th>
              ))}
              <th className="border p-1 text-center w-16 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {ageGroups.map(age => (
              <>
                <tr key={`${age.key}-m`}>
                  <td className="border p-2 font-medium bg-gray-50" rowSpan={2}>{age.label}</td>
                  <td className="border p-1 text-center font-medium">M</td>
                  {forms.map(form => (
                    <td key={form} className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-7 text-xs p-0"
                        value={enrollmentData.get(enrollKey('secondary', ownership, age.key, form, 'male')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setEnrollmentData(prev => new Map(prev).set(enrollKey('secondary', ownership, age.key, form, 'male'), val))
                        }}
                      />
                    </td>
                  ))}
                  <td className="border p-1 text-center bg-gray-50 font-medium text-xs">
                    {forms.reduce((sum, form) => sum + (enrollmentData.get(enrollKey('secondary', ownership, age.key, form, 'male')) || 0), 0)}
                  </td>
                </tr>
                <tr key={`${age.key}-f`}>
                  <td className="border p-1 text-center font-medium">F</td>
                  {forms.map(form => (
                    <td key={form} className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-7 text-xs p-0"
                        value={enrollmentData.get(enrollKey('secondary', ownership, age.key, form, 'female')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setEnrollmentData(prev => new Map(prev).set(enrollKey('secondary', ownership, age.key, form, 'female'), val))
                        }}
                      />
                    </td>
                  ))}
                  <td className="border p-1 text-center bg-gray-50 font-medium text-xs">
                    {forms.reduce((sum, form) => sum + (enrollmentData.get(enrollKey('secondary', ownership, age.key, form, 'female')) || 0), 0)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Post-Secondary Table (D5) - Age × Programme Matrix (National Level Only)
  const renderPostSecondary = () => {
    const ageGroups = [
      { key: 'under_16', label: '< 16' },
      { key: '16', label: '16' },
      { key: '17', label: '17' },
      { key: '18', label: '18' },
      { key: '19', label: '19' },
      { key: '20', label: '20' },
      { key: '21', label: '21' },
      { key: '22', label: '22' },
      { key: '23', label: '23' },
      { key: '24', label: '24' },
      { key: '25', label: '25' },
      { key: 'over_25', label: '> 25' },
      { key: 'unknown', label: 'Unknown' }
    ]

    const programmes = ['TVET', 'CAPE', 'Hospitality', 'Other', 'Tertiary']

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-24">Age</th>
              <th className="border p-1 text-center w-12">Sex</th>
              {programmes.map(prog => (
                <th key={prog} className="border p-1 text-center w-20">{prog}</th>
              ))}
              <th className="border p-1 text-center w-16 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {ageGroups.map(age => (
              <>
                <tr key={`${age.key}-m`}>
                  <td className="border p-2 font-medium bg-gray-50" rowSpan={2}>{age.label}</td>
                  <td className="border p-1 text-center font-medium">M</td>
                  {programmes.map(prog => (
                    <td key={prog} className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-7 text-xs p-0"
                        value={enrollmentData.get(enrollKey('post_secondary', 'national', age.key, prog, 'male')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setEnrollmentData(prev => new Map(prev).set(enrollKey('post_secondary', 'national', age.key, prog, 'male'), val))
                        }}
                      />
                    </td>
                  ))}
                  <td className="border p-1 text-center bg-gray-50 font-medium text-xs">
                    {programmes.reduce((sum, prog) => sum + (enrollmentData.get(enrollKey('post_secondary', 'national', age.key, prog, 'male')) || 0), 0)}
                  </td>
                </tr>
                <tr key={`${age.key}-f`}>
                  <td className="border p-1 text-center font-medium">F</td>
                  {programmes.map(prog => (
                    <td key={prog} className="border p-1">
                      <Input
                        type="number"
                        min="0"
                        className="text-center h-7 text-xs p-0"
                        value={enrollmentData.get(enrollKey('post_secondary', 'national', age.key, prog, 'female')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setEnrollmentData(prev => new Map(prev).set(enrollKey('post_secondary', 'national', age.key, prog, 'female'), val))
                        }}
                      />
                    </td>
                  ))}
                  <td className="border p-1 text-center bg-gray-50 font-medium text-xs">
                    {programmes.reduce((sum, prog) => sum + (enrollmentData.get(enrollKey('post_secondary', 'national', age.key, prog, 'female')) || 0), 0)}
                  </td>
                </tr>
              </>
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
                <h1 className="text-xl font-bold">Student Enrollment</h1>
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
            <p><strong>Enrollment Data:</strong> Report student counts by age, grade/form/programme, and gender</p>
            <p><strong>Public/Private:</strong> Early Childhood, Special Ed, Primary, and Secondary have separate sections for Public and Private schools</p>
            <p><strong>Post-Secondary:</strong> Reported at national level only (no public/private split)</p>
            <p>All totals are calculated automatically. Enter data for each age group and category.</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="early-childhood" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="early-childhood">Early Childhood</TabsTrigger>
            <TabsTrigger value="special-ed">Special Ed</TabsTrigger>
            <TabsTrigger value="primary">Primary</TabsTrigger>
            <TabsTrigger value="secondary">Secondary</TabsTrigger>
            <TabsTrigger value="post-secondary">Post-Secondary</TabsTrigger>
          </TabsList>

          {/* Early Childhood */}
          <TabsContent value="early-childhood" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Early Childhood Enrollment (Under 5 years)</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderEarlyChildhood('public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderEarlyChildhood('private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Special Education */}
          <TabsContent value="special-ed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Special Education Enrollment (5-20+ years)</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderSpecialEducation('public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderSpecialEducation('private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Primary Schools */}
          <TabsContent value="primary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Primary School Enrollment (K - G6)</CardTitle>
                <CardDescription>Public Schools - Age × Grade Matrix</CardDescription>
              </CardHeader>
              <CardContent>{renderPrimarySchools('public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools - Age × Grade Matrix</CardDescription>
              </CardHeader>
              <CardContent>{renderPrimarySchools('private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Secondary Schools */}
          <TabsContent value="secondary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Secondary School Enrollment (Forms 1-5)</CardTitle>
                <CardDescription>Public Schools - Age × Form Matrix</CardDescription>
              </CardHeader>
              <CardContent>{renderSecondarySchools('public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools - Age × Form Matrix</CardDescription>
              </CardHeader>
              <CardContent>{renderSecondarySchools('private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Post-Secondary */}
          <TabsContent value="post-secondary">
            <Card>
              <CardHeader>
                <CardTitle>Post-Secondary Enrollment (TVET, CAPE, Tertiary)</CardTitle>
                <CardDescription>National Level - Age × Programme Matrix</CardDescription>
              </CardHeader>
              <CardContent>{renderPostSecondary()}</CardContent>
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
            {saving ? 'Saving...' : 'Save All Enrollment Data'}
          </Button>
        </div>
      </div>
    </div>
  )
}
