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
import { CCSLC_SUBJECTS, CSEC_SUBJECTS, CSEC_TRENDS_SUBJECTS, CAPE_SUBJECTS, TREND_YEARS } from "./data-config"

export default function SystemsOutputPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Data storage using Maps
  const [gradeLevelData, setGradeLevelData] = useState<Map<string, number>>(new Map())
  const [ccslcData, setCcslcData] = useState<Map<string, number>>(new Map())
  const [csecData, setCsecData] = useState<Map<string, number>>(new Map())
  const [csecTrendsData, setCsecTrendsData] = useState<Map<string, number>>(new Map())
  const [csecFivePlusData, setCsecFivePlusData] = useState<Map<string, number>>(new Map())
  const [capeData, setCapeData] = useState<Map<string, number>>(new Map())

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
        // Load all performance data
        await Promise.all([
          loadGradeLevelData(userProfile.country_id, activeYear.id),
          loadCcslcData(userProfile.country_id, activeYear.id),
          loadCsecData(userProfile.country_id, activeYear.id),
          loadCsecTrendsData(userProfile.country_id),
          loadCsecFivePlusData(userProfile.country_id),
          loadCapeData(userProfile.country_id, activeYear.id)
        ])
      }

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadGradeLevelData = async (countryId: number, yearId: number) => {
    const { data } = await supabase
      .from('performance_grade_level')
      .select('*')
      .eq('country_id', countryId)
      .eq('academic_year_id', yearId)

    if (data) {
      const map = new Map<string, number>()
      data.forEach(row => {
        const key = `${row.subject}|${row.grade_level}|${row.gender}`
        map.set(key, row.count_at_or_above_level || 0)
      })
      setGradeLevelData(map)
      if (data.length > 0) setLastSaved(new Date(data[0].updated_at))
    }
  }

  const loadCcslcData = async (countryId: number, yearId: number) => {
    const { data } = await supabase
      .from('performance_ccslc')
      .select('*')
      .eq('country_id', countryId)
      .eq('academic_year_id', yearId)

    if (data) {
      const map = new Map<string, number>()
      data.forEach(row => {
        map.set(`${row.subject}|${row.gender}|sitting`, row.students_sitting || 0)
        map.set(`${row.subject}|${row.gender}|merit`, row.students_achieving_merit || 0)
        map.set(`${row.subject}|${row.gender}|competent`, row.students_achieving_competent || 0)
      })
      setCcslcData(map)
    }
  }

  const loadCsecData = async (countryId: number, yearId: number) => {
    const { data } = await supabase
      .from('performance_csec')
      .select('*')
      .eq('country_id', countryId)
      .eq('academic_year_id', yearId)

    if (data) {
      const map = new Map<string, number>()
      data.forEach(row => {
        map.set(`${row.subject}|${row.gender}|sitting`, row.students_sitting || 0)
        map.set(`${row.subject}|${row.gender}|achieving`, row.students_achieving_i_iii || 0)
      })
      setCsecData(map)
    }
  }

  const loadCsecTrendsData = async (countryId: number) => {
    const { data } = await supabase
      .from('performance_csec_trends')
      .select('*')
      .eq('country_id', countryId)
      .in('year', [2020, 2021, 2022, 2023])

    if (data) {
      const map = new Map<string, number>()
      data.forEach(row => {
        map.set(`${row.year}|${row.subject}|${row.gender}|sitting`, row.students_sitting || 0)
        map.set(`${row.year}|${row.subject}|${row.gender}|achieving`, row.students_achieving_i_iii || 0)
      })
      setCsecTrendsData(map)
    }
  }

  const loadCsecFivePlusData = async (countryId: number) => {
    const { data } = await supabase
      .from('performance_csec_five_plus')
      .select('*')
      .eq('country_id', countryId)
      .in('year', [2020, 2021, 2022, 2023])

    if (data) {
      const map = new Map<string, number>()
      data.forEach(row => {
        map.set(`${row.year}|${row.gender}|sitting`, row.students_sitting || 0)
        map.set(`${row.year}|${row.gender}|sitting_five_plus`, row.students_sitting_five_plus || 0)
        map.set(`${row.year}|${row.gender}|achieving_five_plus`, row.students_achieving_five_plus_excluding_eng_math || 0)
        map.set(`${row.year}|${row.gender}|achieving_five_plus_with_eng_math`, row.students_achieving_five_plus_including_eng_math || 0)
      })
      setCsecFivePlusData(map)
    }
  }

  const loadCapeData = async (countryId: number, yearId: number) => {
    const { data } = await supabase
      .from('performance_cape')
      .select('*')
      .eq('country_id', countryId)
      .eq('academic_year_id', yearId)

    if (data) {
      const map = new Map<string, number>()
      data.forEach(row => {
        map.set(`${row.subject}|${row.unit}|${row.gender}|sitting`, row.students_sitting || 0)
        map.set(`${row.subject}|${row.unit}|${row.gender}|achieving`, row.students_achieving_i_v || 0)
      })
      setCapeData(map)
    }
  }

  // Helper functions for data keys
  const gradeLevelKey = (subject: string, grade: string, gender: string) => `${subject}|${grade}|${gender}`
  const ccslcKey = (subject: string, gender: string, metric: string) => `${subject}|${gender}|${metric}`
  const csecKey = (subject: string, gender: string, metric: string) => `${subject}|${gender}|${metric}`
  const csecTrendsKey = (year: number, subject: string, gender: string, metric: string) => `${year}|${subject}|${gender}|${metric}`
  const csecFivePlusKey = (year: number, gender: string, metric: string) => `${year}|${gender}|${metric}`
  const capeKey = (subject: string, unit: string, gender: string, metric: string) => `${subject}|${unit}|${gender}|${metric}`

  const handleSave = async () => {
    if (!profile?.country_id || !academicYear?.id) {
      toast.error('Missing profile or academic year')
      return
    }

    setSaving(true)

    try {
      const countryId = profile.country_id
      const yearId = academicYear.id

      // Save all data in parallel
      await Promise.all([
        saveGradeLevelData(countryId, yearId),
        saveCcslcData(countryId, yearId),
        saveCsecData(countryId, yearId),
        saveCsecTrendsData(countryId),
        saveCsecFivePlusData(countryId),
        saveCapeData(countryId, yearId)
      ])

      setLastSaved(new Date())
      toast.success('Data saved successfully!')
    } catch (error) {
      console.error('Error saving data:', error)
      toast.error('Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  const saveGradeLevelData = async (countryId: number, yearId: number) => {
    await supabase.from('performance_grade_level').delete()
      .eq('country_id', countryId).eq('academic_year_id', yearId)

    const inserts: any[] = []
    gradeLevelData.forEach((count, key) => {
      const [subject, grade_level, gender] = key.split('|')
      if (count > 0) {
        inserts.push({
          country_id: countryId,
          academic_year_id: yearId,
          subject,
          grade_level,
          gender,
          count_at_or_above_level: count
        })
      }
    })
    if (inserts.length > 0) {
      await supabase.from('performance_grade_level').insert(inserts)
    }
  }

  const saveCcslcData = async (countryId: number, yearId: number) => {
    await supabase.from('performance_ccslc').delete()
      .eq('country_id', countryId).eq('academic_year_id', yearId)

    const dataBySubjectGender = new Map<string, any>()
    ccslcData.forEach((value, key) => {
      const [subject, gender, metric] = key.split('|')
      const sgKey = `${subject}|${gender}`
      if (!dataBySubjectGender.has(sgKey)) {
        dataBySubjectGender.set(sgKey, { subject, gender, sitting: 0, merit: 0, competent: 0 })
      }
      const data = dataBySubjectGender.get(sgKey)
      if (metric === 'sitting') data.sitting = value
      if (metric === 'merit') data.merit = value
      if (metric === 'competent') data.competent = value
    })

    const inserts: any[] = []
    dataBySubjectGender.forEach(data => {
      if (data.sitting > 0 || data.merit > 0 || data.competent > 0) {
        inserts.push({
          country_id: countryId,
          academic_year_id: yearId,
          subject: data.subject,
          gender: data.gender,
          students_sitting: data.sitting,
          students_achieving_merit: data.merit,
          students_achieving_competent: data.competent
        })
      }
    })
    if (inserts.length > 0) {
      await supabase.from('performance_ccslc').insert(inserts)
    }
  }

  const saveCsecData = async (countryId: number, yearId: number) => {
    await supabase.from('performance_csec').delete()
      .eq('country_id', countryId).eq('academic_year_id', yearId)

    const dataBySubjectGender = new Map<string, any>()
    csecData.forEach((value, key) => {
      const [subject, gender, metric] = key.split('|')
      const sgKey = `${subject}|${gender}`
      if (!dataBySubjectGender.has(sgKey)) {
        dataBySubjectGender.set(sgKey, { subject, gender, sitting: 0, achieving: 0 })
      }
      const data = dataBySubjectGender.get(sgKey)
      if (metric === 'sitting') data.sitting = value
      if (metric === 'achieving') data.achieving = value
    })

    const inserts: any[] = []
    dataBySubjectGender.forEach(data => {
      if (data.sitting > 0 || data.achieving > 0) {
        inserts.push({
          country_id: countryId,
          academic_year_id: yearId,
          subject: data.subject,
          gender: data.gender,
          students_sitting: data.sitting,
          students_achieving_i_iii: data.achieving
        })
      }
    })
    if (inserts.length > 0) {
      await supabase.from('performance_csec').insert(inserts)
    }
  }

  const saveCsecTrendsData = async (countryId: number) => {
    await supabase.from('performance_csec_trends').delete()
      .eq('country_id', countryId)
      .in('year', [2020, 2021, 2022, 2023])

    const dataByYearSubjectGender = new Map<string, any>()
    csecTrendsData.forEach((value, key) => {
      const [year, subject, gender, metric] = key.split('|')
      const ysgKey = `${year}|${subject}|${gender}`
      if (!dataByYearSubjectGender.has(ysgKey)) {
        dataByYearSubjectGender.set(ysgKey, { year: parseInt(year), subject, gender, sitting: 0, achieving: 0 })
      }
      const data = dataByYearSubjectGender.get(ysgKey)
      if (metric === 'sitting') data.sitting = value
      if (metric === 'achieving') data.achieving = value
    })

    const inserts: any[] = []
    dataByYearSubjectGender.forEach(data => {
      if (data.sitting > 0 || data.achieving > 0) {
        inserts.push({
          country_id: countryId,
          year: data.year,
          subject: data.subject,
          gender: data.gender,
          students_sitting: data.sitting,
          students_achieving_i_iii: data.achieving
        })
      }
    })
    if (inserts.length > 0) {
      await supabase.from('performance_csec_trends').insert(inserts)
    }
  }

  const saveCsecFivePlusData = async (countryId: number) => {
    await supabase.from('performance_csec_five_plus').delete()
      .eq('country_id', countryId)
      .in('year', [2020, 2021, 2022, 2023])

    const dataByYearGender = new Map<string, any>()
    csecFivePlusData.forEach((value, key) => {
      const [year, gender, metric] = key.split('|')
      const ygKey = `${year}|${gender}`
      if (!dataByYearGender.has(ygKey)) {
        dataByYearGender.set(ygKey, {
          year: parseInt(year),
          gender,
          sitting: 0,
          sitting_five_plus: 0,
          achieving_five_plus: 0,
          achieving_five_plus_with_eng_math: 0
        })
      }
      const data = dataByYearGender.get(ygKey)
      if (metric === 'sitting') data.sitting = value
      if (metric === 'sitting_five_plus') data.sitting_five_plus = value
      if (metric === 'achieving_five_plus') data.achieving_five_plus = value
      if (metric === 'achieving_five_plus_with_eng_math') data.achieving_five_plus_with_eng_math = value
    })

    const inserts: any[] = []
    dataByYearGender.forEach(data => {
      if (data.sitting > 0 || data.sitting_five_plus > 0 || data.achieving_five_plus > 0 || data.achieving_five_plus_with_eng_math > 0) {
        inserts.push({
          country_id: countryId,
          year: data.year,
          gender: data.gender,
          students_sitting: data.sitting,
          students_sitting_five_plus: data.sitting_five_plus,
          students_achieving_five_plus_excluding_eng_math: data.achieving_five_plus,
          students_achieving_five_plus_including_eng_math: data.achieving_five_plus_with_eng_math
        })
      }
    })
    if (inserts.length > 0) {
      await supabase.from('performance_csec_five_plus').insert(inserts)
    }
  }

  const saveCapeData = async (countryId: number, yearId: number) => {
    await supabase.from('performance_cape').delete()
      .eq('country_id', countryId).eq('academic_year_id', yearId)

    const dataBySubjectUnitGender = new Map<string, any>()
    capeData.forEach((value, key) => {
      const [subject, unit, gender, metric] = key.split('|')
      const sugKey = `${subject}|${unit}|${gender}`
      if (!dataBySubjectUnitGender.has(sugKey)) {
        dataBySubjectUnitGender.set(sugKey, { subject, unit, gender, sitting: 0, achieving: 0 })
      }
      const data = dataBySubjectUnitGender.get(sugKey)
      if (metric === 'sitting') data.sitting = value
      if (metric === 'achieving') data.achieving = value
    })

    const inserts: any[] = []
    dataBySubjectUnitGender.forEach(data => {
      if (data.sitting > 0 || data.achieving > 0) {
        inserts.push({
          country_id: countryId,
          academic_year_id: yearId,
          subject: data.subject,
          unit: data.unit,
          gender: data.gender,
          students_sitting: data.sitting,
          students_achieving_i_v: data.achieving
        })
      }
    })
    if (inserts.length > 0) {
      await supabase.from('performance_cape').insert(inserts)
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

  // Continue in next message due to length...
  return (
    <div className="min-h-screen bg-[#DCE8D5]">
      <div className="bg-[#4DA11D] text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/data-entry')} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Systems Output: Student Performance & Examinations</h1>
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

      <div className="container mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Examination Performance & Educational Outcomes</CardTitle>
            <CardDescription>
              Track student achievement across national and external examinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complete all sections to document educational system performance and student achievement levels.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="grade-level" className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="grade-level">Grade Level</TabsTrigger>
            <TabsTrigger value="ccslc">CCSLC</TabsTrigger>
            <TabsTrigger value="csec">CSEC</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="five-plus">5+ CSEC</TabsTrigger>
            <TabsTrigger value="cape">CAPE</TabsTrigger>
          </TabsList>

          {/* F1: Grade Level Performance */}
          <TabsContent value="grade-level" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Level Performance</CardTitle>
                <CardDescription>Number of pupils performing at or above their grade level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {/* Reading */}
                  <div>
                    <h4 className="font-semibold mb-3">READING</h4>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border p-2 text-left">Grade Level</th>
                          <th className="border p-2 text-center w-24">Male</th>
                          <th className="border p-2 text-center w-24">Female</th>
                          <th className="border p-2 text-center w-24 bg-gray-200">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['grade_2', 'grade_4', 'grade_6'].map(grade => (
                          <tr key={grade}>
                            <td className="border p-2 font-medium bg-gray-50">
                              {grade.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8"
                                value={gradeLevelData.get(gradeLevelKey('reading', grade, 'male')) || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setGradeLevelData(prev => new Map(prev).set(gradeLevelKey('reading', grade, 'male'), val))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8"
                                value={gradeLevelData.get(gradeLevelKey('reading', grade, 'female')) || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setGradeLevelData(prev => new Map(prev).set(gradeLevelKey('reading', grade, 'female'), val))
                                }}
                              />
                            </td>
                            <td className="border p-2 text-center bg-gray-50 font-medium">
                              {(gradeLevelData.get(gradeLevelKey('reading', grade, 'male')) || 0) +
                               (gradeLevelData.get(gradeLevelKey('reading', grade, 'female')) || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mathematics */}
                  <div>
                    <h4 className="font-semibold mb-3">MATHEMATICS</h4>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border p-2 text-left">Grade Level</th>
                          <th className="border p-2 text-center w-24">Male</th>
                          <th className="border p-2 text-center w-24">Female</th>
                          <th className="border p-2 text-center w-24 bg-gray-200">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['grade_2', 'grade_4', 'grade_6'].map(grade => (
                          <tr key={grade}>
                            <td className="border p-2 font-medium bg-gray-50">
                              {grade.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8"
                                value={gradeLevelData.get(gradeLevelKey('mathematics', grade, 'male')) || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setGradeLevelData(prev => new Map(prev).set(gradeLevelKey('mathematics', grade, 'male'), val))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8"
                                value={gradeLevelData.get(gradeLevelKey('mathematics', grade, 'female')) || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setGradeLevelData(prev => new Map(prev).set(gradeLevelKey('mathematics', grade, 'female'), val))
                                }}
                              />
                            </td>
                            <td className="border p-2 text-center bg-gray-50 font-medium">
                              {(gradeLevelData.get(gradeLevelKey('mathematics', grade, 'male')) || 0) +
                               (gradeLevelData.get(gradeLevelKey('mathematics', grade, 'female')) || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* F2: CCSLC Results */}
          <TabsContent value="ccslc" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Caribbean Certificate of Secondary Level Competence (CCSLC)</CardTitle>
                <CardDescription>Achievement levels: M (Merit) and C (Competent)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {CCSLC_SUBJECTS.map(subject => (
                    <div key={subject} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">{subject}</h4>
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border p-2 text-left w-20">Gender</th>
                            <th className="border p-2 text-center">No. Sitting</th>
                            <th className="border p-2 text-center">No. Attaining M</th>
                            <th className="border p-2 text-center">No. Attaining C</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['male', 'female', 'total'].map(gender => (
                            <tr key={gender}>
                              <td className="border p-2 font-medium bg-gray-50">
                                {gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'All'}
                              </td>
                              <td className="border p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="text-center h-8"
                                  value={ccslcData.get(ccslcKey(subject, gender, 'sitting')) || 0}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    setCcslcData(prev => new Map(prev).set(ccslcKey(subject, gender, 'sitting'), val))
                                  }}
                                />
                              </td>
                              <td className="border p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="text-center h-8"
                                  value={ccslcData.get(ccslcKey(subject, gender, 'merit')) || 0}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    setCcslcData(prev => new Map(prev).set(ccslcKey(subject, gender, 'merit'), val))
                                  }}
                                />
                              </td>
                              <td className="border p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  className="text-center h-8"
                                  value={ccslcData.get(ccslcKey(subject, gender, 'competent')) || 0}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0
                                    setCcslcData(prev => new Map(prev).set(ccslcKey(subject, gender, 'competent'), val))
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* F3: CSEC Country Results */}
          <TabsContent value="csec" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CSEC Country Results (Current Year)</CardTitle>
                <CardDescription>Achievement of Grades I-III across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(CSEC_SUBJECTS).map(([category, subjects]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <h4 className="font-bold mb-4 text-lg">{category}</h4>
                      <div className="space-y-4">
                        {subjects.map(subject => (
                          <div key={subject} className="border-l-4 border-blue-300 pl-3">
                            <h5 className="font-semibold mb-2 text-sm">{subject}</h5>
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-muted">
                                  <th className="border p-2 text-left w-16">Gender</th>
                                  <th className="border p-2 text-center">No. Sitting</th>
                                  <th className="border p-2 text-center">No. Achieving I-III</th>
                                </tr>
                              </thead>
                              <tbody>
                                {['male', 'female', 'total'].map(gender => (
                                  <tr key={gender}>
                                    <td className="border p-2 font-medium bg-gray-50">
                                      {gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'T'}
                                    </td>
                                    <td className="border p-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        className="text-center h-8"
                                        value={csecData.get(csecKey(subject, gender, 'sitting')) || 0}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0
                                          setCsecData(prev => new Map(prev).set(csecKey(subject, gender, 'sitting'), val))
                                        }}
                                      />
                                    </td>
                                    <td className="border p-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        className="text-center h-8"
                                        value={csecData.get(csecKey(subject, gender, 'achieving')) || 0}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0
                                          setCsecData(prev => new Map(prev).set(csecKey(subject, gender, 'achieving'), val))
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* F4: CSEC Trends */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trends in Passes: English A, Mathematics and IT</CardTitle>
                <CardDescription>Track performance trends over 4 years (2020-2023)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {CSEC_TRENDS_SUBJECTS.map(subject => (
                    <div key={subject} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">{subject}</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border p-2 text-left" rowSpan={2}>Year</th>
                              <th className="border p-2 text-center" colSpan={3}>Number Sitting</th>
                              <th className="border p-2 text-center" colSpan={3}>Achieving I-III</th>
                            </tr>
                            <tr className="bg-muted">
                              <th className="border p-2 text-center w-24">M</th>
                              <th className="border p-2 text-center w-24">F</th>
                              <th className="border p-2 text-center w-24">T</th>
                              <th className="border p-2 text-center w-24">M</th>
                              <th className="border p-2 text-center w-24">F</th>
                              <th className="border p-2 text-center w-24">T</th>
                            </tr>
                          </thead>
                          <tbody>
                            {TREND_YEARS.map(year => (
                              <tr key={year}>
                                <td className="border p-2 font-medium bg-gray-50">{year}</td>
                                {['male', 'female', 'total'].map(gender => (
                                  <td key={`${gender}-sitting`} className="border p-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      className="text-center h-8"
                                      value={csecTrendsData.get(csecTrendsKey(year, subject, gender, 'sitting')) || 0}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0
                                        setCsecTrendsData(prev => new Map(prev).set(csecTrendsKey(year, subject, gender, 'sitting'), val))
                                      }}
                                    />
                                  </td>
                                ))}
                                {['male', 'female', 'total'].map(gender => (
                                  <td key={`${gender}-achieving`} className="border p-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      className="text-center h-8"
                                      value={csecTrendsData.get(csecTrendsKey(year, subject, gender, 'achieving')) || 0}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0
                                        setCsecTrendsData(prev => new Map(prev).set(csecTrendsKey(year, subject, gender, 'achieving'), val))
                                      }}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* F5: 5+ CSEC Achievement */}
          <TabsContent value="five-plus" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Achievement in at least 5 CSEC Subjects</CardTitle>
                <CardDescription>Track students achieving 5 or more CSEC subject passes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Metric</th>
                        {TREND_YEARS.map(year => (
                          <React.Fragment key={year}>
                            <th className="border p-2 text-center" colSpan={3}>{year}</th>
                          </React.Fragment>
                        ))}
                      </tr>
                      <tr className="bg-muted">
                        <th className="border p-2"></th>
                        {TREND_YEARS.map(year => (
                          <React.Fragment key={year}>
                            <th className="border p-2 text-center w-20">M</th>
                            <th className="border p-2 text-center w-20">F</th>
                            <th className="border p-2 text-center w-20">T</th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'sitting', label: 'No. students sitting' },
                        { key: 'sitting_five_plus', label: 'No. sitting at least 5 subjects' },
                        { key: 'achieving_five_plus', label: 'No. achieving 5 CSEC passes' },
                        { key: 'achieving_five_plus_with_eng_math', label: 'No. achieving 5 CSEC passes (incl. Eng A & Math)' }
                      ].map(metric => (
                        <tr key={metric.key}>
                          <td className="border p-2 font-medium bg-gray-50 text-xs">{metric.label}</td>
                          {TREND_YEARS.map(year => (
                            <React.Fragment key={year}>
                              {['male', 'female', 'total'].map(gender => (
                                <td key={gender} className="border p-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    className="text-center h-8 text-xs"
                                    value={csecFivePlusData.get(csecFivePlusKey(year, gender, metric.key)) || 0}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0
                                      setCsecFivePlusData(prev => new Map(prev).set(csecFivePlusKey(year, gender, metric.key), val))
                                    }}
                                  />
                                </td>
                              ))}
                            </React.Fragment>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* F6: CAPE Performance */}
          <TabsContent value="cape" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CAPE Performance</CardTitle>
                <CardDescription>Achievement of Grades I-V by subject and unit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {CAPE_SUBJECTS.map(subject => (
                    <div key={subject} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">{subject}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {['Unit 1', 'Unit 2'].map(unit => (
                          <div key={unit}>
                            <h5 className="text-sm font-medium mb-2 text-blue-700">{unit}</h5>
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-muted">
                                  <th className="border p-2 text-left w-16">Gender</th>
                                  <th className="border p-2 text-center">No. Sitting</th>
                                  <th className="border p-2 text-center">Achieving I-V</th>
                                </tr>
                              </thead>
                              <tbody>
                                {['male', 'female', 'total'].map(gender => (
                                  <tr key={gender}>
                                    <td className="border p-2 font-medium bg-gray-50">
                                      {gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'T'}
                                    </td>
                                    <td className="border p-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        className="text-center h-8"
                                        value={capeData.get(capeKey(subject, unit, gender, 'sitting')) || 0}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0
                                          setCapeData(prev => new Map(prev).set(capeKey(subject, unit, gender, 'sitting'), val))
                                        }}
                                      />
                                    </td>
                                    <td className="border p-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        className="text-center h-8"
                                        value={capeData.get(capeKey(subject, unit, gender, 'achieving')) || 0}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0
                                          setCapeData(prev => new Map(prev).set(capeKey(subject, unit, gender, 'achieving'), val))
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
