"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, getUserProfile, getActiveAcademicYear } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Save, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InternalEfficiencyPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Data storage using Maps
  const [repeatersData, setRepeatersData] = useState<Map<string, number>>(new Map())
  const [dropoutsData, setDropoutsData] = useState<Map<string, number>>(new Map())
  const [classStatsData, setClassStatsData] = useState<Map<string, any>>(new Map())
  const [schoolMgmtData, setSchoolMgmtData] = useState<Map<string, number>>(new Map())

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
        // Load repeaters data
        const { data: repeaters } = await supabase
          .from('repeaters')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (repeaters) {
          const map = new Map<string, number>()
          repeaters.forEach(row => {
            const key = `${row.education_level}|${row.grade_or_form}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setRepeatersData(map)
          if (repeaters.length > 0) setLastSaved(new Date(repeaters[0].updated_at))
        }

        // Load dropouts data - Using same structure as repeaters
        // Note: If dropouts table doesn't exist, will need to create it with same schema as repeaters
        const { data: dropouts } = await supabase
          .from('dropouts')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (dropouts) {
          const map = new Map<string, number>()
          dropouts.forEach(row => {
            const key = `${row.education_level}|${row.grade_or_form}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setDropoutsData(map)
        }

        // Load class statistics
        const { data: classStats } = await supabase
          .from('class_statistics')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (classStats) {
          const map = new Map<string, any>()
          classStats.forEach(row => {
            const key = `${row.education_level}|${row.ownership_type}`
            map.set(key, {
              total_students: row.total_students || 0,
              number_of_classes: row.number_of_classes || 0,
              number_of_teachers: row.number_of_teachers || 0,
              number_of_specialist_teachers: row.number_of_specialist_teachers || 0
            })
          })
          setClassStatsData(map)
        }

        // Load school management data
        const { data: schoolMgmt } = await supabase
          .from('school_management')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (schoolMgmt) {
          const map = new Map<string, number>()
          schoolMgmt.forEach(row => {
            // Map the database fields to our UI fields
            map.set(`${row.education_level}|school_boards`, row.schools_managed_by_boards || 0)
            map.set(`${row.education_level}|development_plans`, row.schools_with_development_plans || 0)
            map.set(`${row.education_level}|disaster_plans`, row.schools_with_disaster_plans || 0)
          })
          setSchoolMgmtData(map)
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
  const repeatersKey = (level: string, gradeForm: string, gender: string) =>
    `${level}|${gradeForm}|${gender}`

  const dropoutsKey = (level: string, gradeForm: string, gender: string) =>
    `${level}|${gradeForm}|${gender}`

  const classStatsKey = (level: string, ownership: string) =>
    `${level}|${ownership}`

  const schoolMgmtKey = (level: string, field: string) =>
    `${level}|${field}`

  // Calculate row totals
  const calculateRepeatersTotal = (level: string, gradeForm: string) => {
    const male = repeatersData.get(repeatersKey(level, gradeForm, 'male')) || 0
    const female = repeatersData.get(repeatersKey(level, gradeForm, 'female')) || 0
    return male + female
  }

  const calculateDropoutsTotal = (level: string, gradeForm: string) => {
    const male = dropoutsData.get(dropoutsKey(level, gradeForm, 'male')) || 0
    const female = dropoutsData.get(dropoutsKey(level, gradeForm, 'female')) || 0
    return male + female
  }

  // Calculate class statistics derived fields
  const calculateClassSize = (level: string, ownership: string) => {
    const data = classStatsData.get(classStatsKey(level, ownership))
    if (!data || data.number_of_classes === 0) return 0
    return (data.total_students / data.number_of_classes).toFixed(1)
  }

  const calculateStudentTeacherRatio = (level: string, ownership: string) => {
    const data = classStatsData.get(classStatsKey(level, ownership))
    if (!data || data.number_of_teachers === 0) return 0
    return (data.total_students / data.number_of_teachers).toFixed(1)
  }

  const calculateEffectiveRatio = (level: string, ownership: string) => {
    const data = classStatsData.get(classStatsKey(level, ownership))
    if (!data || level !== 'primary') return null
    const effectiveTeachers = data.number_of_teachers - (data.number_of_specialist_teachers || 0)
    if (effectiveTeachers === 0) return 0
    return (data.total_students / effectiveTeachers).toFixed(1)
  }

  const handleSave = async () => {
    if (!profile?.country_id || !academicYear?.id) {
      toast.error('Missing profile or academic year')
      return
    }

    setSaving(true)

    try {
      const countryId = profile.country_id
      const yearId = academicYear.id

      // Save repeaters data
      await supabase.from('repeaters').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const repeatersInserts: any[] = []
      repeatersData.forEach((count, key) => {
        const [education_level, grade_or_form, gender] = key.split('|')
        if (count > 0) {
          repeatersInserts.push({
            country_id: countryId,
            academic_year_id: yearId,
            education_level,
            grade_or_form,
            gender,
            count
          })
        }
      })
      if (repeatersInserts.length > 0) {
        await supabase.from('repeaters').insert(repeatersInserts)
      }

      // Save dropouts data
      await supabase.from('dropouts').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const dropoutsInserts: any[] = []
      dropoutsData.forEach((count, key) => {
        const [education_level, grade_or_form, gender] = key.split('|')
        if (count > 0) {
          dropoutsInserts.push({
            country_id: countryId,
            academic_year_id: yearId,
            education_level,
            grade_or_form,
            gender,
            count
          })
        }
      })
      if (dropoutsInserts.length > 0) {
        await supabase.from('dropouts').insert(dropoutsInserts)
      }

      // Save class statistics
      await supabase.from('class_statistics').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const classStatsInserts: any[] = []
      classStatsData.forEach((data, key) => {
        const [education_level, ownership_type] = key.split('|')
        if (data.total_students > 0 || data.number_of_classes > 0 || data.number_of_teachers > 0) {
          classStatsInserts.push({
            country_id: countryId,
            academic_year_id: yearId,
            education_level,
            ownership_type,
            ...data
          })
        }
      })
      if (classStatsInserts.length > 0) {
        await supabase.from('class_statistics').insert(classStatsInserts)
      }

      // Save school management data
      // Note: Need to restructure to match database schema
      await supabase.from('school_management').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const schoolMgmtInserts: any[] = []
      const levels = ['primary', 'secondary']
      levels.forEach(level => {
        const schoolBoards = schoolMgmtData.get(schoolMgmtKey(level, 'school_boards')) || 0
        const devPlans = schoolMgmtData.get(schoolMgmtKey(level, 'development_plans')) || 0
        const disasterPlans = schoolMgmtData.get(schoolMgmtKey(level, 'disaster_plans')) || 0

        if (schoolBoards > 0 || devPlans > 0 || disasterPlans > 0) {
          schoolMgmtInserts.push({
            country_id: countryId,
            academic_year_id: yearId,
            education_level: level,
            schools_managed_by_boards: schoolBoards,
            schools_with_development_plans: devPlans,
            schools_with_disaster_plans: disasterPlans
          })
        }
      })
      if (schoolMgmtInserts.length > 0) {
        await supabase.from('school_management').insert(schoolMgmtInserts)
      }

      setLastSaved(new Date())
      toast.success('Data saved successfully!')
    } catch (error) {
      console.error('Error saving data:', error)
      toast.error('Failed to save data')
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

  // Grade/Form lists
  const primaryGrades = ['K', '1', '2', '3', '4', '5', '6']
  const secondaryForms = ['1', '2', '3', '4', '5']
  const educationStages = [
    { key: 'pre_primary', label: 'Pre-primary' },
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' }
  ]

  // Render E1 - Repeaters table
  const renderRepeatersTable = (level: string, items: string[], title: string) => {
    return (
      <div className="overflow-x-auto">
        <h4 className="font-semibold mb-2">{title}</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-24">{level === 'primary' ? 'GRADE' : 'FORM'}</th>
              <th className="border p-2 text-center w-24">Male</th>
              <th className="border p-2 text-center w-24">Female</th>
              <th className="border p-2 text-center w-24 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item}>
                <td className="border p-2 font-medium bg-gray-50">{item}</td>
                <td className="border p-1">
                  <Input
                    type="number"
                    min="0"
                    className="text-center h-8"
                    value={repeatersData.get(repeatersKey(level, item, 'male')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setRepeatersData(prev => new Map(prev).set(repeatersKey(level, item, 'male'), val))
                    }}
                  />
                </td>
                <td className="border p-1">
                  <Input
                    type="number"
                    min="0"
                    className="text-center h-8"
                    value={repeatersData.get(repeatersKey(level, item, 'female')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setRepeatersData(prev => new Map(prev).set(repeatersKey(level, item, 'female'), val))
                    }}
                  />
                </td>
                <td className="border p-2 text-center bg-gray-50 font-medium">
                  {calculateRepeatersTotal(level, item)}
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr className="bg-blue-100 font-bold">
              <td className="border p-2">TOTAL</td>
              <td className="border p-2 text-center">
                {items.reduce((sum, item) => sum + (repeatersData.get(repeatersKey(level, item, 'male')) || 0), 0)}
              </td>
              <td className="border p-2 text-center">
                {items.reduce((sum, item) => sum + (repeatersData.get(repeatersKey(level, item, 'female')) || 0), 0)}
              </td>
              <td className="border p-2 text-center bg-gray-200">
                {items.reduce((sum, item) => sum + calculateRepeatersTotal(level, item), 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  // Render E2 - Dropouts table (similar structure to repeaters)
  const renderDropoutsTable = (level: string, items: string[], title: string) => {
    return (
      <div className="overflow-x-auto">
        <h4 className="font-semibold mb-2">{title}</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-24">{level === 'primary' ? 'GRADE' : 'FORM'}</th>
              <th className="border p-2 text-center w-24">Male</th>
              <th className="border p-2 text-center w-24">Female</th>
              <th className="border p-2 text-center w-24 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item}>
                <td className="border p-2 font-medium bg-gray-50">{item}</td>
                <td className="border p-1">
                  <Input
                    type="number"
                    min="0"
                    className="text-center h-8"
                    value={dropoutsData.get(dropoutsKey(level, item, 'male')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setDropoutsData(prev => new Map(prev).set(dropoutsKey(level, item, 'male'), val))
                    }}
                  />
                </td>
                <td className="border p-1">
                  <Input
                    type="number"
                    min="0"
                    className="text-center h-8"
                    value={dropoutsData.get(dropoutsKey(level, item, 'female')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setDropoutsData(prev => new Map(prev).set(dropoutsKey(level, item, 'female'), val))
                    }}
                  />
                </td>
                <td className="border p-2 text-center bg-gray-50 font-medium">
                  {calculateDropoutsTotal(level, item)}
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr className="bg-blue-100 font-bold">
              <td className="border p-2">TOTAL</td>
              <td className="border p-2 text-center">
                {items.reduce((sum, item) => sum + (dropoutsData.get(dropoutsKey(level, item, 'male')) || 0), 0)}
              </td>
              <td className="border p-2 text-center">
                {items.reduce((sum, item) => sum + (dropoutsData.get(dropoutsKey(level, item, 'female')) || 0), 0)}
              </td>
              <td className="border p-2 text-center bg-gray-200">
                {items.reduce((sum, item) => sum + calculateDropoutsTotal(level, item), 0)}
              </td>
            </tr>
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
                <h1 className="text-xl font-bold">Internal Efficiency</h1>
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
      <div className="container mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Internal Efficiency: Dropouts, Repeaters & Class Sizes</CardTitle>
            <CardDescription>
              Track student retention, repetition rates, and classroom efficiency metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Note:</strong> Repeaters and Dropouts data refer to the previous academic year (e.g., 2022-23 for 2023-24 collection)
            </p>
            <p className="text-sm text-muted-foreground">
              Class Sizes data refer to the current academic year. Calculated fields update automatically.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="repeaters" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="repeaters">E1: Repeaters</TabsTrigger>
            <TabsTrigger value="dropouts">E2: Dropouts</TabsTrigger>
            <TabsTrigger value="class-sizes">E3: Class Sizes</TabsTrigger>
            <TabsTrigger value="school-mgmt">E4: School Management</TabsTrigger>
          </TabsList>

          {/* E1: Repeaters */}
          <TabsContent value="repeaters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>E1 - Repeaters (Previous Academic Year)</CardTitle>
                <CardDescription>Number of students repeating each grade/form by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {renderRepeatersTable('primary', primaryGrades, 'Primary Schools')}
                  {renderRepeatersTable('secondary', secondaryForms, 'Secondary Schools')}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* E2: Dropouts - Will implement next */}
          <TabsContent value="dropouts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>E2 - Dropouts (Previous Academic Year)</CardTitle>
                <CardDescription>Number of students dropping out of each grade/form by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {renderDropoutsTable('primary', primaryGrades, 'Primary Schools')}
                  {renderDropoutsTable('secondary', secondaryForms, 'Secondary Schools')}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* E3: Class Sizes */}
          <TabsContent value="class-sizes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>E3 - Class Sizes (Current Academic Year)</CardTitle>
                <CardDescription>Student-teacher ratios and class size metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left" rowSpan={2}>Stage</th>
                        <th className="border p-2 text-center" colSpan={8}>Public Schools</th>
                        <th className="border p-2 text-center" colSpan={4}>Private Schools</th>
                        <th className="border p-2 text-center" rowSpan={2}>Total<br/>Students</th>
                      </tr>
                      <tr className="bg-muted text-xs">
                        <th className="border p-1 text-center">Total Students</th>
                        <th className="border p-1 text-center">No. of Classes</th>
                        <th className="border p-1 text-center">No. of Teachers</th>
                        <th className="border p-1 text-center">No. of Specialist<br/>Teachers</th>
                        <th className="border p-1 text-center bg-blue-50">Class Size</th>
                        <th className="border p-1 text-center bg-blue-50">Student/<br/>Teacher Ratio</th>
                        <th className="border p-1 text-center bg-blue-50">Effective<br/>S/T Ratio</th>
                        <th className="border p-1 text-center">Total Students</th>
                        <th className="border p-1 text-center">No. of Classes</th>
                        <th className="border p-1 text-center">No. of Teachers</th>
                        <th className="border p-1 text-center bg-blue-50">Class Size</th>
                        <th className="border p-1 text-center bg-blue-50">Student/<br/>Teacher Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {educationStages.map(stage => {
                        const publicData = classStatsData.get(classStatsKey(stage.key, 'public')) || {
                          total_students: 0,
                          number_of_classes: 0,
                          number_of_teachers: 0,
                          number_of_specialist_teachers: 0
                        }
                        const privateData = classStatsData.get(classStatsKey(stage.key, 'private')) || {
                          total_students: 0,
                          number_of_classes: 0,
                          number_of_teachers: 0
                        }

                        return (
                          <tr key={stage.key}>
                            <td className="border p-2 font-medium bg-gray-50">{stage.label}</td>
                            {/* Public Schools */}
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8 text-xs"
                                value={publicData.total_students}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setClassStatsData(prev => new Map(prev).set(
                                    classStatsKey(stage.key, 'public'),
                                    { ...publicData, total_students: val }
                                  ))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8 text-xs"
                                value={publicData.number_of_classes}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setClassStatsData(prev => new Map(prev).set(
                                    classStatsKey(stage.key, 'public'),
                                    { ...publicData, number_of_classes: val }
                                  ))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8 text-xs"
                                value={publicData.number_of_teachers}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setClassStatsData(prev => new Map(prev).set(
                                    classStatsKey(stage.key, 'public'),
                                    { ...publicData, number_of_teachers: val }
                                  ))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              {stage.key === 'primary' ? (
                                <Input
                                  type="number"
                                  min="0"
                                  className="text-center h-8 text-xs"
                                  value={publicData.number_of_specialist_teachers}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    setClassStatsData(prev => new Map(prev).set(
                                      classStatsKey(stage.key, 'public'),
                                      { ...publicData, number_of_specialist_teachers: val }
                                    ))
                                  }}
                                />
                              ) : (
                                <div className="text-center text-xs text-muted-foreground">-</div>
                              )}
                            </td>
                            <td className="border p-2 text-center bg-blue-50 font-medium text-xs">
                              {calculateClassSize(stage.key, 'public')}
                            </td>
                            <td className="border p-2 text-center bg-blue-50 font-medium text-xs">
                              {calculateStudentTeacherRatio(stage.key, 'public')}
                            </td>
                            <td className="border p-2 text-center bg-blue-50 font-medium text-xs">
                              {stage.key === 'primary' ? calculateEffectiveRatio(stage.key, 'public') : '-'}
                            </td>
                            {/* Private Schools */}
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8 text-xs"
                                value={privateData.total_students}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setClassStatsData(prev => new Map(prev).set(
                                    classStatsKey(stage.key, 'private'),
                                    { ...privateData, total_students: val }
                                  ))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8 text-xs"
                                value={privateData.number_of_classes}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setClassStatsData(prev => new Map(prev).set(
                                    classStatsKey(stage.key, 'private'),
                                    { ...privateData, number_of_classes: val }
                                  ))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8 text-xs"
                                value={privateData.number_of_teachers}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setClassStatsData(prev => new Map(prev).set(
                                    classStatsKey(stage.key, 'private'),
                                    { ...privateData, number_of_teachers: val }
                                  ))
                                }}
                              />
                            </td>
                            <td className="border p-2 text-center bg-blue-50 font-medium text-xs">
                              {calculateClassSize(stage.key, 'private')}
                            </td>
                            <td className="border p-2 text-center bg-blue-50 font-medium text-xs">
                              {calculateStudentTeacherRatio(stage.key, 'private')}
                            </td>
                            {/* Total Students */}
                            <td className="border p-2 text-center bg-gray-200 font-bold text-xs">
                              {publicData.total_students + privateData.total_students}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded text-xs">
                  <p className="font-semibold mb-1">Calculated Fields:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Class Size</strong> = Total Students ÷ Number of Classes</li>
                    <li><strong>Student/Teacher Ratio</strong> = Total Students ÷ Number of Teachers</li>
                    <li><strong>Effective S/T Ratio</strong> (Primary only) = Total Students ÷ (Teachers - Specialist Teachers)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* E4: School Management */}
          <TabsContent value="school-mgmt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>E4 - School Boards, Development Plans & Disaster Management</CardTitle>
                <CardDescription>School governance and planning indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Primary Schools */}
                  <div>
                    <h4 className="font-semibold mb-4 text-lg">Primary Schools</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          No. of schools managed by a school board
                        </label>
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={schoolMgmtData.get(schoolMgmtKey('primary', 'school_boards')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setSchoolMgmtData(prev => new Map(prev).set(schoolMgmtKey('primary', 'school_boards'), val))
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          No. of schools with a school development plan
                        </label>
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={schoolMgmtData.get(schoolMgmtKey('primary', 'development_plans')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setSchoolMgmtData(prev => new Map(prev).set(schoolMgmtKey('primary', 'development_plans'), val))
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          No. of schools with a Disaster Management plan
                        </label>
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={schoolMgmtData.get(schoolMgmtKey('primary', 'disaster_plans')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setSchoolMgmtData(prev => new Map(prev).set(schoolMgmtKey('primary', 'disaster_plans'), val))
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4 text-lg">Secondary Schools</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          No. of schools managed by a school board
                        </label>
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={schoolMgmtData.get(schoolMgmtKey('secondary', 'school_boards')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setSchoolMgmtData(prev => new Map(prev).set(schoolMgmtKey('secondary', 'school_boards'), val))
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          No. of schools with a school development plan
                        </label>
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={schoolMgmtData.get(schoolMgmtKey('secondary', 'development_plans')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setSchoolMgmtData(prev => new Map(prev).set(schoolMgmtKey('secondary', 'development_plans'), val))
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          No. of schools with a Disaster Management plan
                        </label>
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={schoolMgmtData.get(schoolMgmtKey('secondary', 'disaster_plans')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setSchoolMgmtData(prev => new Map(prev).set(schoolMgmtKey('secondary', 'disaster_plans'), val))
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 rounded border border-amber-200">
                    <p className="text-sm text-amber-900">
                      <strong>Note:</strong> These indicators track school governance structures and emergency preparedness.
                      School boards provide community oversight, development plans guide improvement, and disaster management
                      plans ensure safety and continuity during emergencies.
                    </p>
                  </div>
                </div>
              </CardContent>
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
