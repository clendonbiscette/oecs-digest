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

interface StaffQualificationData {
  education_level: string
  ownership_type: string
  role: string
  qualification_category: string
  gender: string
  count: number
}

interface ProfDevData {
  education_level: string
  role: string
  participants_count: number
}

export default function StaffQualificationsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const educationLevels = ['pre_primary', 'primary', 'secondary', 'post_secondary']
  const ownershipTypes = ['public', 'private']
  const roles = {
    pre_primary: ['principal', 'teacher', 'care_giver'],
    primary: ['principal', 'deputy_principal', 'teacher'],
    secondary: ['principal', 'deputy_principal', 'teacher'],
    post_secondary: ['principal', 'deputy_principal', 'teacher']
  }
  const qualificationCategories = [
    'graduate_trained',
    'graduate_untrained',
    'non_graduate_trained',
    'non_graduate_untrained'
  ]
  const genders = ['male', 'female']

  const [staffData, setStaffData] = useState<Map<string, number>>(new Map())
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

      // Load existing staff qualifications data
      if (userProfile?.country_id && activeYear?.id) {
        const { data, error } = await supabase
          .from('staff_qualifications')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (data && !error) {
          const dataMap = new Map<string, number>()
          data.forEach(row => {
            const key = `${row.education_level}|${row.ownership_type}|${row.role}|${row.qualification_category}|${row.gender}`
            dataMap.set(key, row.count || 0)
          })
          setStaffData(dataMap)
          if (data.length > 0) {
            setLastSaved(new Date(data[0].updated_at))
          }
        }

        // Load professional development data
        const { data: profData, error: profError } = await supabase
          .from('professional_development')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (profData && !profError) {
          const profMap = new Map<string, number>()
          profData.forEach(row => {
            const key = `${row.education_level}|${row.role}`
            profMap.set(key, row.participants_count || 0)
          })
          setProfDevData(profMap)
        }
      }

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStaffKey = (level: string, ownership: string, role: string, qual: string, gender: string) => {
    return `${level}|${ownership}|${role}|${qual}|${gender}`
  }

  const getProfDevKey = (level: string, role: string) => {
    return `${level}|${role}`
  }

  const handleStaffChange = (level: string, ownership: string, role: string, qual: string, gender: string, value: string) => {
    const numValue = parseInt(value) || 0
    const key = getStaffKey(level, ownership, role, qual, gender)
    setStaffData(prev => {
      const newMap = new Map(prev)
      newMap.set(key, numValue)
      return newMap
    })
  }

  const handleProfDevChange = (level: string, role: string, value: string) => {
    const numValue = parseInt(value) || 0
    const key = getProfDevKey(level, role)
    setProfDevData(prev => {
      const newMap = new Map(prev)
      newMap.set(key, numValue)
      return newMap
    })
  }

  const calculateRowTotal = (level: string, ownership: string, role: string, qual: string) => {
    let total = 0
    genders.forEach(gender => {
      const key = getStaffKey(level, ownership, role, qual, gender)
      total += staffData.get(key) || 0
    })
    return total
  }

  const calculateCategoryTotal = (level: string, ownership: string, role: string) => {
    let total = 0
    qualificationCategories.forEach(qual => {
      genders.forEach(gender => {
        const key = getStaffKey(level, ownership, role, qual, gender)
        total += staffData.get(key) || 0
      })
    })
    return total
  }

  const calculateLevelTotal = (level: string, ownership: string) => {
    let total = 0
    const levelRoles = roles[level as keyof typeof roles]
    levelRoles.forEach(role => {
      qualificationCategories.forEach(qual => {
        genders.forEach(gender => {
          const key = getStaffKey(level, ownership, role, qual, gender)
          total += staffData.get(key) || 0
        })
      })
    })
    return total
  }

  const handleSave = async () => {
    if (!profile?.country_id || !academicYear?.id) {
      toast.error('Missing required information')
      return
    }

    setSaving(true)

    try {
      // Delete existing staff qualifications data
      await supabase
        .from('staff_qualifications')
        .delete()
        .eq('country_id', profile.country_id)
        .eq('academic_year_id', academicYear.id)

      // Insert new staff qualifications data
      const staffDataToInsert: any[] = []
      staffData.forEach((count, key) => {
        const [education_level, ownership_type, role, qualification_category, gender] = key.split('|')
        if (count > 0) {
          staffDataToInsert.push({
            country_id: profile.country_id,
            academic_year_id: academicYear.id,
            education_level,
            ownership_type,
            role,
            qualification_category,
            gender,
            count
          })
        }
      })

      if (staffDataToInsert.length > 0) {
        const { error: staffError } = await supabase
          .from('staff_qualifications')
          .insert(staffDataToInsert)

        if (staffError) throw staffError
      }

      // Delete existing professional development data
      await supabase
        .from('professional_development')
        .delete()
        .eq('country_id', profile.country_id)
        .eq('academic_year_id', academicYear.id)

      // Insert new professional development data
      const profDevDataToInsert: any[] = []
      profDevData.forEach((participants_count, key) => {
        const [education_level, role] = key.split('|')
        if (participants_count > 0) {
          profDevDataToInsert.push({
            country_id: profile.country_id,
            academic_year_id: academicYear.id,
            education_level,
            role,
            participants_count
          })
        }
      })

      if (profDevDataToInsert.length > 0) {
        const { error: profError } = await supabase
          .from('professional_development')
          .insert(profDevDataToInsert)

        if (profError) throw profError
      }

      setLastSaved(new Date())
      toast.success('Staff qualifications data saved successfully!')
    } catch (error: any) {
      console.error('Error saving data:', error)
      toast.error('Failed to save data: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const getLevelLabel = (level: string) => {
    const labels: any = {
      pre_primary: 'Pre-Primary (Pre-schools & Daycares)',
      primary: 'Primary',
      secondary: 'Secondary',
      post_secondary: 'Post-Secondary/Tertiary'
    }
    return labels[level] || level
  }

  const getRoleLabel = (role: string) => {
    const labels: any = {
      principal: 'Principals/Administrators',
      deputy_principal: 'Deputy Principals',
      teacher: 'Teachers',
      care_giver: 'Care Givers'
    }
    return labels[role] || role
  }

  const getQualLabel = (qual: string) => {
    const labels: any = {
      graduate_trained: 'Graduate & Trained',
      graduate_untrained: 'Graduate & Untrained',
      non_graduate_trained: 'Non-Graduate & Trained',
      non_graduate_untrained: 'Non-Graduate & Untrained'
    }
    return labels[qual] || qual
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
                <h1 className="text-xl font-bold">Staff Qualifications Data Entry</h1>
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
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
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
          <CardContent>
            <p className="text-sm">
              Enter staff qualifications data by education level, ownership type, role, and qualification category.
              Totals are calculated automatically. Professional development participation is tracked separately.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="pre_primary" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="pre_primary">Pre-Primary</TabsTrigger>
            <TabsTrigger value="primary">Primary</TabsTrigger>
            <TabsTrigger value="secondary">Secondary</TabsTrigger>
            <TabsTrigger value="post_secondary">Post-Secondary</TabsTrigger>
          </TabsList>

          {educationLevels.map(level => (
            <TabsContent key={level} value={level} className="space-y-6">
              {ownershipTypes.map(ownership => (
                <Card key={ownership}>
                  <CardHeader>
                    <CardTitle>{getLevelLabel(level)} - {ownership.toUpperCase()}</CardTitle>
                    <CardDescription>Academic Year: {academicYear?.year_label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border p-2 text-left font-semibold">Role</th>
                            <th className="border p-2 text-left font-semibold">Qualification</th>
                            <th className="border p-2 text-center font-semibold">Male</th>
                            <th className="border p-2 text-center font-semibold">Female</th>
                            <th className="border p-2 text-center font-semibold bg-gray-200">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roles[level as keyof typeof roles].map((role, roleIdx) => (
                            <>
                              {qualificationCategories.map((qual, qualIdx) => (
                                <tr key={`${role}-${qual}`} className="hover:bg-muted/50">
                                  {qualIdx === 0 && (
                                    <td
                                      className="border p-2 font-medium bg-gray-50"
                                      rowSpan={qualificationCategories.length}
                                    >
                                      {getRoleLabel(role)}
                                    </td>
                                  )}
                                  <td className="border p-2 text-sm">{getQualLabel(qual)}</td>
                                  <td className="border p-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      className="text-center h-8"
                                      value={staffData.get(getStaffKey(level, ownership, role, qual, 'male')) || 0}
                                      onChange={(e) => handleStaffChange(level, ownership, role, qual, 'male', e.target.value)}
                                    />
                                  </td>
                                  <td className="border p-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      className="text-center h-8"
                                      value={staffData.get(getStaffKey(level, ownership, role, qual, 'female')) || 0}
                                      onChange={(e) => handleStaffChange(level, ownership, role, qual, 'female', e.target.value)}
                                    />
                                  </td>
                                  <td className="border p-2 text-center bg-gray-50 font-bold">
                                    {calculateRowTotal(level, ownership, role, qual)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-blue-50 font-semibold">
                                <td className="border p-2" colSpan={2}>Subtotal - {getRoleLabel(role)}</td>
                                <td className="border p-2 text-center" colSpan={3}>
                                  {calculateCategoryTotal(level, ownership, role)}
                                </td>
                              </tr>
                            </>
                          ))}
                          <tr className="bg-[#4DA11D] text-white font-bold">
                            <td className="border p-2" colSpan={2}>TOTAL - {ownership.toUpperCase()}</td>
                            <td className="border p-2 text-center" colSpan={3}>
                              {calculateLevelTotal(level, ownership)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Professional Development Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Continuous Professional Development - {getLevelLabel(level)}</CardTitle>
                  <CardDescription>Number of staff participating in professional development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles[level as keyof typeof roles].map(role => (
                      <div key={role} className="flex items-center gap-4">
                        <label className="text-sm font-medium w-48">{getRoleLabel(role)}</label>
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={profDevData.get(getProfDevKey(level, role)) || 0}
                          onChange={(e) => handleProfDevChange(level, role, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={() => router.push('/data-entry')}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
