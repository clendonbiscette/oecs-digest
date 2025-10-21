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
import { Separator } from "@/components/ui/separator"

export default function StaffQualificationsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Data storage using Maps for efficient lookup
  const [staffQualData, setStaffQualData] = useState<Map<string, number>>(new Map())
  const [leadershipData, setLeadershipData] = useState<Map<string, number>>(new Map())
  const [teacherAcademicData, setTeacherAcademicData] = useState<Map<string, number>>(new Map())
  const [specialistData, setSpecialistData] = useState<Map<string, number>>(new Map())
  const [profDevData, setProfDevData] = useState<Map<string, number>>(new Map())

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
        // Load staff qualifications (B1-B4)
        const { data: staffData } = await supabase
          .from('staff_qualifications')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (staffData) {
          const map = new Map<string, number>()
          staffData.forEach(row => {
            const key = `${row.education_level}|${row.ownership_type}|${row.role}|${row.qualification_category}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setStaffQualData(map)
          if (staffData.length > 0) setLastSaved(new Date(staffData[0].updated_at))
        }

        // Load leadership degree holders
        const { data: leadershipDegrees } = await supabase
          .from('leadership_degree_holders')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (leadershipDegrees) {
          const map = new Map<string, number>()
          leadershipDegrees.forEach(row => {
            const key = `${row.education_level}|${row.role}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setLeadershipData(map)
        }

        // Load teacher academic qualifications (B5)
        const { data: teacherQual } = await supabase
          .from('teacher_academic_qualifications')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (teacherQual) {
          const map = new Map<string, number>()
          teacherQual.forEach(row => {
            const key = `${row.education_level}|${row.qualification}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setTeacherAcademicData(map)
        }

        // Load specialist teachers (B6)
        const { data: specialists } = await supabase
          .from('specialist_teachers')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (specialists) {
          const map = new Map<string, number>()
          specialists.forEach(row => {
            const key = `${row.specialization}|${row.gender}`
            map.set(key, row.count || 0)
          })
          setSpecialistData(map)
        }

        // Load professional development (B7)
        const { data: profDev } = await supabase
          .from('professional_development')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (profDev) {
          const map = new Map<string, number>()
          profDev.forEach(row => {
            const key = `${row.education_level}|${row.role}`
            map.set(key, row.participants_count || 0)
          })
          setProfDevData(map)
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
  const staffKey = (level: string, ownership: string, role: string, qual: string, gender: string) =>
    `${level}|${ownership}|${role}|${qual}|${gender}`

  const leadershipKey = (level: string, role: string, gender: string) =>
    `${level}|${role}|${gender}`

  const teacherAcademicKey = (level: string, qual: string, gender: string) =>
    `${level}|${qual}|${gender}`

  const specialistKey = (spec: string, gender: string) =>
    `${spec}|${gender}`

  const profDevKey = (level: string, role: string) =>
    `${level}|${role}`

  // Calculate totals
  const calculateStaffRowTotal = (level: string, ownership: string, role: string, qual: string) => {
    const male = staffQualData.get(staffKey(level, ownership, role, qual, 'male')) || 0
    const female = staffQualData.get(staffKey(level, ownership, role, qual, 'female')) || 0
    return male + female
  }

  const calculateTeacherAcademicRowTotal = (level: string, qual: string) => {
    const male = teacherAcademicData.get(teacherAcademicKey(level, qual, 'male')) || 0
    const female = teacherAcademicData.get(teacherAcademicKey(level, qual, 'female')) || 0
    return male + female
  }

  const calculateSpecialistRowTotal = (spec: string) => {
    const male = specialistData.get(specialistKey(spec, 'male')) || 0
    const female = specialistData.get(specialistKey(spec, 'female')) || 0
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

      // Save staff qualifications (B1-B4)
      await supabase.from('staff_qualifications').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const staffInserts: any[] = []
      staffQualData.forEach((count, key) => {
        const [education_level, ownership_type, role, qualification_category, gender] = key.split('|')
        if (count > 0) {
          staffInserts.push({ country_id: countryId, academic_year_id: yearId,
            education_level, ownership_type, role, qualification_category, gender, count })
        }
      })
      if (staffInserts.length > 0) {
        await supabase.from('staff_qualifications').insert(staffInserts)
      }

      // Save leadership degree holders
      await supabase.from('leadership_degree_holders').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const leadershipInserts: any[] = []
      leadershipData.forEach((count, key) => {
        const [education_level, role, gender] = key.split('|')
        if (count > 0) {
          leadershipInserts.push({ country_id: countryId, academic_year_id: yearId,
            education_level, role, gender, count })
        }
      })
      if (leadershipInserts.length > 0) {
        await supabase.from('leadership_degree_holders').insert(leadershipInserts)
      }

      // Save teacher academic qualifications (B5)
      await supabase.from('teacher_academic_qualifications').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const teacherAcademicInserts: any[] = []
      teacherAcademicData.forEach((count, key) => {
        const [education_level, qualification, gender] = key.split('|')
        if (count > 0) {
          teacherAcademicInserts.push({ country_id: countryId, academic_year_id: yearId,
            education_level, qualification, gender, count })
        }
      })
      if (teacherAcademicInserts.length > 0) {
        await supabase.from('teacher_academic_qualifications').insert(teacherAcademicInserts)
      }

      // Save specialist teachers (B6)
      await supabase.from('specialist_teachers').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const specialistInserts: any[] = []
      specialistData.forEach((count, key) => {
        const [specialization, gender] = key.split('|')
        if (count > 0) {
          specialistInserts.push({ country_id: countryId, academic_year_id: yearId,
            specialization, gender, count })
        }
      })
      if (specialistInserts.length > 0) {
        await supabase.from('specialist_teachers').insert(specialistInserts)
      }

      // Save professional development (B7)
      await supabase.from('professional_development').delete()
        .eq('country_id', countryId).eq('academic_year_id', yearId)

      const profDevInserts: any[] = []
      profDevData.forEach((participants_count, key) => {
        const [education_level, role] = key.split('|')
        if (participants_count > 0) {
          profDevInserts.push({ country_id: countryId, academic_year_id: yearId,
            education_level, role, participants_count })
        }
      })
      if (profDevInserts.length > 0) {
        await supabase.from('professional_development').insert(profDevInserts)
      }

      setLastSaved(new Date())
      toast.success('All staff qualifications data saved successfully!')
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

  // Table B1: Pre-schools
  const renderPreSchoolsTable = (ownership: string) => {
    const qualifications = [
      { level: 'graduate', training: 'trained', label: 'Graduate & Trained' },
      { level: 'graduate', training: 'untrained', label: 'Graduate & Untrained' },
      { level: 'non_graduate', training: 'trained', label: 'Non-Graduate & Trained' },
      { level: 'non_graduate', training: 'untrained', label: 'Non-Graduate & Untrained' },
      { level: 'unknown', training: '', label: 'Unknown' }
    ]
    const roles = [
      { key: 'administrator', label: 'Administrators' },
      { key: 'deputy_principal', label: 'Deputy Principal' },
      { key: 'care_giver', label: 'Care Givers' }
    ]

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Qualification</th>
              <th className="border p-2 text-center w-24">Male</th>
              <th className="border p-2 text-center w-24">Female</th>
              <th className="border p-2 text-center w-24 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <>
                {qualifications.map((qual, idx) => {
                  const qualKey = qual.training ? `${qual.level}_${qual.training}` : qual.level
                  return (
                    <tr key={`${role.key}-${qualKey}`}>
                      {idx === 0 && (
                        <td className="border p-2 font-medium bg-gray-50" rowSpan={qualifications.length}>
                          {role.label}
                        </td>
                      )}
                      <td className="border p-2">{qual.label}</td>
                      <td className="border p-1">
                        <Input type="number" min="0" className="text-center h-8"
                          value={staffQualData.get(staffKey('pre_primary', ownership, role.key, qualKey, 'male')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setStaffQualData(prev => new Map(prev).set(staffKey('pre_primary', ownership, role.key, qualKey, 'male'), val))
                          }}
                        />
                      </td>
                      <td className="border p-1">
                        <Input type="number" min="0" className="text-center h-8"
                          value={staffQualData.get(staffKey('pre_primary', ownership, role.key, qualKey, 'female')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setStaffQualData(prev => new Map(prev).set(staffKey('pre_primary', ownership, role.key, qualKey, 'female'), val))
                          }}
                        />
                      </td>
                      <td className="border p-2 text-center bg-gray-50 font-medium">
                        {calculateStaffRowTotal('pre_primary', ownership, role.key, qualKey)}
                      </td>
                    </tr>
                  )
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Table B2/B3: Primary/Secondary
  const renderPrimarySecondaryTable = (level: string, ownership: string) => {
    const qualifications = [
      { level: 'graduate', training: 'trained', label: 'Graduate & Trained' },
      { level: 'graduate', training: 'untrained', label: 'Graduate & Untrained' },
      { level: 'non_graduate', training: 'trained', label: 'Non-Graduate & Trained' },
      { level: 'non_graduate', training: 'untrained', label: 'Non-Graduate & Untrained' },
      { level: 'unknown', training: '', label: 'Unknown' }
    ]
    const roles = [
      { key: 'principal', label: 'Principal' },
      { key: 'deputy_principal', label: 'Deputy Principal' },
      { key: 'teacher', label: 'Teachers' }
    ]

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Qualification</th>
              <th className="border p-2 text-center w-24">Male</th>
              <th className="border p-2 text-center w-24">Female</th>
              <th className="border p-2 text-center w-24 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <>
                {qualifications.map((qual, idx) => {
                  const qualKey = qual.training ? `${qual.level}_${qual.training}` : qual.level
                  return (
                    <tr key={`${role.key}-${qualKey}`}>
                      {idx === 0 && (
                        <td className="border p-2 font-medium bg-gray-50" rowSpan={qualifications.length}>
                          {role.label}
                        </td>
                      )}
                      <td className="border p-2">{qual.label}</td>
                      <td className="border p-1">
                        <Input type="number" min="0" className="text-center h-8"
                          value={staffQualData.get(staffKey(level, ownership, role.key, qualKey, 'male')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setStaffQualData(prev => new Map(prev).set(staffKey(level, ownership, role.key, qualKey, 'male'), val))
                          }}
                        />
                      </td>
                      <td className="border p-1">
                        <Input type="number" min="0" className="text-center h-8"
                          value={staffQualData.get(staffKey(level, ownership, role.key, qualKey, 'female')) || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setStaffQualData(prev => new Map(prev).set(staffKey(level, ownership, role.key, qualKey, 'female'), val))
                          }}
                        />
                      </td>
                      <td className="border p-2 text-center bg-gray-50 font-medium">
                        {calculateStaffRowTotal(level, ownership, role.key, qualKey)}
                      </td>
                    </tr>
                  )
                })}
              </>
            ))}
          </tbody>
        </table>

        {/* Leadership Degree Section - only for Primary and Secondary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-3">With at least a degree in Leadership/Management/Administration</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Principal (Male)</label>
              <Input type="number" min="0" className="text-center"
                value={leadershipData.get(leadershipKey(level, 'principal', 'male')) || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0
                  setLeadershipData(prev => new Map(prev).set(leadershipKey(level, 'principal', 'male'), val))
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Principal (Female)</label>
              <Input type="number" min="0" className="text-center"
                value={leadershipData.get(leadershipKey(level, 'principal', 'female')) || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0
                  setLeadershipData(prev => new Map(prev).set(leadershipKey(level, 'principal', 'female'), val))
                }}
              />
            </div>
            {level === 'secondary' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deputy Principal (Male)</label>
                  <Input type="number" min="0" className="text-center"
                    value={leadershipData.get(leadershipKey(level, 'deputy_principal', 'male')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setLeadershipData(prev => new Map(prev).set(leadershipKey(level, 'deputy_principal', 'male'), val))
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deputy Principal (Female)</label>
                  <Input type="number" min="0" className="text-center"
                    value={leadershipData.get(leadershipKey(level, 'deputy_principal', 'female')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setLeadershipData(prev => new Map(prev).set(leadershipKey(level, 'deputy_principal', 'female'), val))
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Table B4: Post-Secondary
  const renderPostSecondaryTable = (ownership: string) => {
    const qualifications = [
      { key: 'graduate', label: 'Graduate' },
      { key: 'non_graduate', label: 'Non-graduate' }
    ]
    const roles = [
      { key: 'principal', label: 'Principal' },
      { key: 'deputy_principal', label: 'Deputy Principal' },
      { key: 'teacher', label: 'Teachers' }
    ]

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Qualification</th>
              <th className="border p-2 text-center w-24">Male</th>
              <th className="border p-2 text-center w-24">Female</th>
              <th className="border p-2 text-center w-24 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <>
                {qualifications.map((qual, idx) => (
                  <tr key={`${role.key}-${qual.key}`}>
                    {idx === 0 && (
                      <td className="border p-2 font-medium bg-gray-50" rowSpan={qualifications.length}>
                        {role.label}
                      </td>
                    )}
                    <td className="border p-2">{qual.label}</td>
                    <td className="border p-1">
                      <Input type="number" min="0" className="text-center h-8"
                        value={staffQualData.get(staffKey('post_secondary', ownership, role.key, qual.key, 'male')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setStaffQualData(prev => new Map(prev).set(staffKey('post_secondary', ownership, role.key, qual.key, 'male'), val))
                        }}
                      />
                    </td>
                    <td className="border p-1">
                      <Input type="number" min="0" className="text-center h-8"
                        value={staffQualData.get(staffKey('post_secondary', ownership, role.key, qual.key, 'female')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setStaffQualData(prev => new Map(prev).set(staffKey('post_secondary', ownership, role.key, qual.key, 'female'), val))
                        }}
                      />
                    </td>
                    <td className="border p-2 text-center bg-gray-50 font-medium">
                      {calculateStaffRowTotal('post_secondary', ownership, role.key, qual.key)}
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Table B5: Teacher Academic Qualifications
  const renderTeacherAcademicQualifications = () => {
    const qualifications = [
      { key: 'csec', label: 'CSEC/O-Level' },
      { key: 'cape', label: 'CAPE/A-Levels' },
      { key: 'certificate', label: 'Certificate' },
      { key: 'associate', label: 'Associate degree' },
      { key: 'bachelors', label: 'Bachelors degree' },
      { key: 'postgraduate', label: 'Post-graduate degree' },
      { key: 'masters', label: 'Masters degree' },
      { key: 'other', label: 'Other' },
      { key: 'unknown', label: 'Unknown/Unavailable' }
    ]
    const levels = [
      { key: 'pre_primary', label: 'Pre-schools & Daycares' },
      { key: 'primary', label: 'Primary' },
      { key: 'secondary', label: 'Secondary' },
      { key: 'post_secondary', label: 'Post-secondary/Tertiary' }
    ]

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Qualification</th>
              {levels.map(level => (
                <>
                  <th key={`${level.key}-m`} className="border p-2 text-center w-20" colSpan={1}>
                    {level.label} (M)
                  </th>
                  <th key={`${level.key}-f`} className="border p-2 text-center w-20" colSpan={1}>
                    {level.label} (F)
                  </th>
                  <th key={`${level.key}-t`} className="border p-2 text-center w-20 bg-gray-200" colSpan={1}>
                    Total
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {qualifications.map(qual => (
              <tr key={qual.key}>
                <td className="border p-2 font-medium">{qual.label}</td>
                {levels.map(level => (
                  <>
                    <td key={`${level.key}-${qual.key}-m`} className="border p-1">
                      <Input type="number" min="0" className="text-center h-8"
                        value={teacherAcademicData.get(teacherAcademicKey(level.key, qual.key, 'male')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setTeacherAcademicData(prev => new Map(prev).set(teacherAcademicKey(level.key, qual.key, 'male'), val))
                        }}
                      />
                    </td>
                    <td key={`${level.key}-${qual.key}-f`} className="border p-1">
                      <Input type="number" min="0" className="text-center h-8"
                        value={teacherAcademicData.get(teacherAcademicKey(level.key, qual.key, 'female')) || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setTeacherAcademicData(prev => new Map(prev).set(teacherAcademicKey(level.key, qual.key, 'female'), val))
                        }}
                      />
                    </td>
                    <td key={`${level.key}-${qual.key}-t`} className="border p-2 text-center bg-gray-50 font-medium">
                      {calculateTeacherAcademicRowTotal(level.key, qual.key)}
                    </td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Table B6: Specialist Teachers
  const renderSpecialistTeachers = () => {
    const specializations = [
      { key: 'agriculture', label: 'Agriculture' },
      { key: 'french', label: 'French' },
      { key: 'home_economics', label: 'Home Economics' },
      { key: 'it', label: 'I T' },
      { key: 'music', label: 'Music' },
      { key: 'pe_sports', label: 'PE & Sports' },
      { key: 'plumbing', label: 'Plumbing' },
      { key: 'reading', label: 'Reading' },
      { key: 'spanish', label: 'Spanish' },
      { key: 'special_education', label: 'Special Education' },
      { key: 'theatre_arts', label: 'Theatre Arts' },
      { key: 'hfle', label: 'HFLE' },
      { key: 'other_1', label: '(Additional Specialty 1)' },
      { key: 'other_2', label: '(Additional Specialty 2)' }
    ]

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Specialization</th>
              <th className="border p-2 text-center w-32">Male</th>
              <th className="border p-2 text-center w-32">Female</th>
              <th className="border p-2 text-center w-32 bg-gray-200">Total</th>
            </tr>
          </thead>
          <tbody>
            {specializations.map(spec => (
              <tr key={spec.key}>
                <td className="border p-2">{spec.label}</td>
                <td className="border p-1">
                  <Input type="number" min="0" className="text-center h-8"
                    value={specialistData.get(specialistKey(spec.key, 'male')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setSpecialistData(prev => new Map(prev).set(specialistKey(spec.key, 'male'), val))
                    }}
                  />
                </td>
                <td className="border p-1">
                  <Input type="number" min="0" className="text-center h-8"
                    value={specialistData.get(specialistKey(spec.key, 'female')) || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setSpecialistData(prev => new Map(prev).set(specialistKey(spec.key, 'female'), val))
                    }}
                  />
                </td>
                <td className="border p-2 text-center bg-gray-50 font-medium">
                  {calculateSpecialistRowTotal(spec.key)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Table B7: Professional Development
  const renderProfessionalDevelopment = () => {
    const cpd = [
      { level: 'primary', role: 'principal', label: 'Primary school principals engaged in at least 24 hours CPD annually' },
      { level: 'secondary', role: 'principal', label: 'Secondary school principals engaged in at least 24 hours CPD annually' },
      { level: 'primary', role: 'teacher', label: 'Primary school teachers engaged in at least 24 hours CPD annually' },
      { level: 'secondary', role: 'teacher', label: 'Secondary school teachers engaged in at least 24 hours CPD annually' }
    ]

    return (
      <div className="space-y-4">
        {cpd.map(item => (
          <div key={`${item.level}-${item.role}`} className="flex items-center gap-4">
            <label className="text-sm font-medium flex-1">{item.label}</label>
            <Input type="number" min="0" className="text-center w-32"
              value={profDevData.get(profDevKey(item.level, item.role)) || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0
                setProfDevData(prev => new Map(prev).set(profDevKey(item.level, item.role), val))
              }}
            />
          </div>
        ))}
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
                <h1 className="text-xl font-bold">Leaders, Teachers & Qualifications</h1>
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
            <p><strong>Trained teacher:</strong> Has completed an accredited teaching methodology course</p>
            <p><strong>Graduate:</strong> Has a minimum undergraduate degree from an accredited institution</p>
            <p>Complete all 7 sections as per the OECS template. Totals are calculated automatically.</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="b1" className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="b1">Pre-schools</TabsTrigger>
            <TabsTrigger value="b2">Primary</TabsTrigger>
            <TabsTrigger value="b3">Secondary</TabsTrigger>
            <TabsTrigger value="b4">Tertiary</TabsTrigger>
            <TabsTrigger value="b5">Academic Qual</TabsTrigger>
            <TabsTrigger value="b6">Specialists</TabsTrigger>
            <TabsTrigger value="b7">CPD</TabsTrigger>
          </TabsList>

          {/* Pre-schools */}
          <TabsContent value="b1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Qualifications & Training: Pre-schools</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderPreSchoolsTable('public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderPreSchoolsTable('private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Primary */}
          <TabsContent value="b2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Qualifications & Training: Primary</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderPrimarySecondaryTable('primary', 'public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderPrimarySecondaryTable('primary', 'private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Secondary */}
          <TabsContent value="b3" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Qualifications & Training: Secondary</CardTitle>
                <CardDescription>Public Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderPrimarySecondaryTable('secondary', 'public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Private Schools</CardDescription>
              </CardHeader>
              <CardContent>{renderPrimarySecondaryTable('secondary', 'private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Post-Secondary */}
          <TabsContent value="b4" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Qualifications & Training: Post-secondary/Tertiary</CardTitle>
                <CardDescription>National Colleges - Public</CardDescription>
              </CardHeader>
              <CardContent>{renderPostSecondaryTable('public')}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>National Colleges - Private</CardDescription>
              </CardHeader>
              <CardContent>{renderPostSecondaryTable('private')}</CardContent>
            </Card>
          </TabsContent>

          {/* Teacher Academic Qualifications */}
          <TabsContent value="b5">
            <Card>
              <CardHeader>
                <CardTitle>Teachers: Highest Academic Qualifications</CardTitle>
                <CardDescription>Highest academic qualification by education stage</CardDescription>
              </CardHeader>
              <CardContent>{renderTeacherAcademicQualifications()}</CardContent>
            </Card>
          </TabsContent>

          {/* Specialist Teachers */}
          <TabsContent value="b6">
            <Card>
              <CardHeader>
                <CardTitle>Specialist Teachers</CardTitle>
                <CardDescription>Teachers by area of specialization</CardDescription>
              </CardHeader>
              <CardContent>{renderSpecialistTeachers()}</CardContent>
            </Card>
          </TabsContent>

          {/* Professional Development */}
          <TabsContent value="b7">
            <Card>
              <CardHeader>
                <CardTitle>Continuous Professional Development (CPD)</CardTitle>
                <CardDescription>Number of staff engaged in at least 24 hours of CPD annually</CardDescription>
              </CardHeader>
              <CardContent>{renderProfessionalDevelopment()}</CardContent>
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
            {saving ? 'Saving...' : 'Save All Tables'}
          </Button>
        </div>
      </div>
    </div>
  )
}
