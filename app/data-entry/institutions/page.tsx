"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, getUserProfile, getActiveAcademicYear } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowLeft, Save, Check } from "lucide-react"

interface InstitutionsData {
  daycare_public: number
  daycare_private_church: number
  daycare_private_non_affiliated: number
  preschool_public: number
  preschool_private_church: number
  preschool_private_non_affiliated: number
  primary_public: number
  primary_private_church: number
  primary_private_non_affiliated: number
  secondary_public: number
  secondary_private_church: number
  secondary_private_non_affiliated: number
  special_ed_public: number
  special_ed_private_church: number
  special_ed_private_non_affiliated: number
  tvet_public: number
  tvet_private_church: number
  tvet_private_non_affiliated: number
  post_secondary_public: number
  post_secondary_private: number
}

export default function InstitutionsDataEntryPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [formData, setFormData] = useState<InstitutionsData>({
    daycare_public: 0,
    daycare_private_church: 0,
    daycare_private_non_affiliated: 0,
    preschool_public: 0,
    preschool_private_church: 0,
    preschool_private_non_affiliated: 0,
    primary_public: 0,
    primary_private_church: 0,
    primary_private_non_affiliated: 0,
    secondary_public: 0,
    secondary_private_church: 0,
    secondary_private_non_affiliated: 0,
    special_ed_public: 0,
    special_ed_private_church: 0,
    special_ed_private_non_affiliated: 0,
    tvet_public: 0,
    tvet_private_church: 0,
    tvet_private_non_affiliated: 0,
    post_secondary_public: 0,
    post_secondary_private: 0,
  })

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

      // Load existing data if any
      if (userProfile?.country_id && activeYear?.id) {
        const { data, error } = await supabase
          .from('institutions')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)
          .single()

        if (data && !error) {
          setFormData(data)
          setLastSaved(new Date(data.updated_at))
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof InstitutionsData, value: string) => {
    const numValue = parseInt(value) || 0
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }))
  }

  const handleSave = async () => {
    if (!profile?.country_id || !academicYear?.id) {
      toast.error('Missing required information')
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from('institutions')
        .upsert({
          country_id: profile.country_id,
          academic_year_id: academicYear.id,
          ...formData,
        }, {
          onConflict: 'country_id,academic_year_id'
        })

      if (error) throw error

      setLastSaved(new Date())
      toast.success('Data saved successfully!')
    } catch (error: any) {
      console.error('Error saving data:', error)
      toast.error('Failed to save data: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // Calculate totals
  const calculateTotal = (level: string) => {
    switch (level) {
      case 'daycare':
        return formData.daycare_public + formData.daycare_private_church + formData.daycare_private_non_affiliated
      case 'preschool':
        return formData.preschool_public + formData.preschool_private_church + formData.preschool_private_non_affiliated
      case 'primary':
        return formData.primary_public + formData.primary_private_church + formData.primary_private_non_affiliated
      case 'secondary':
        return formData.secondary_public + formData.secondary_private_church + formData.secondary_private_non_affiliated
      case 'special_ed':
        return formData.special_ed_public + formData.special_ed_private_church + formData.special_ed_private_non_affiliated
      case 'tvet':
        return formData.tvet_public + formData.tvet_private_church + formData.tvet_private_non_affiliated
      case 'post_secondary':
        return formData.post_secondary_public + formData.post_secondary_private
      default:
        return 0
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

  const FormSection = ({ title, prefix }: { title: string, prefix: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor={`${prefix}_public`}>Public</Label>
            <Input
              id={`${prefix}_public`}
              type="number"
              min="0"
              value={formData[`${prefix}_public` as keyof InstitutionsData]}
              onChange={(e) => handleInputChange(`${prefix}_public` as keyof InstitutionsData, e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}_private_church`}>Private/Church</Label>
            <Input
              id={`${prefix}_private_church`}
              type="number"
              min="0"
              value={formData[`${prefix}_private_church` as keyof InstitutionsData]}
              onChange={(e) => handleInputChange(`${prefix}_private_church` as keyof InstitutionsData, e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}_private_non_affiliated`}>Private/Non-Affiliated</Label>
            <Input
              id={`${prefix}_private_non_affiliated`}
              type="number"
              min="0"
              value={formData[`${prefix}_private_non_affiliated` as keyof InstitutionsData]}
              onChange={(e) => handleInputChange(`${prefix}_private_non_affiliated` as keyof InstitutionsData, e.target.value)}
            />
          </div>
          <div>
            <Label>Total</Label>
            <div className="h-10 flex items-center justify-center bg-muted rounded-md font-bold text-lg">
              {calculateTotal(prefix)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
                <h1 className="text-xl font-bold">Institutions Data Entry</h1>
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
              Enter the number of educational institutions in your country for the {academicYear?.year_label} academic year.
              Classify each institution by type and ownership. Totals are calculated automatically.
            </p>
          </CardContent>
        </Card>

        <FormSection title="Daycare Centres" prefix="daycare" />
        <FormSection title="Preschools" prefix="preschool" />
        <FormSection title="Primary Schools" prefix="primary" />
        <FormSection title="Secondary Schools" prefix="secondary" />
        <FormSection title="Special Education Schools" prefix="special_ed" />
        <FormSection title="TVET Institutions" prefix="tvet" />

        {/* Post-Secondary (different structure) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post-Secondary Institutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="post_secondary_public">Public</Label>
                <Input
                  id="post_secondary_public"
                  type="number"
                  min="0"
                  value={formData.post_secondary_public}
                  onChange={(e) => handleInputChange('post_secondary_public', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="post_secondary_private">Private</Label>
                <Input
                  id="post_secondary_private"
                  type="number"
                  min="0"
                  value={formData.post_secondary_private}
                  onChange={(e) => handleInputChange('post_secondary_private', e.target.value)}
                />
              </div>
              <div>
                <Label>Total</Label>
                <div className="h-10 flex items-center justify-center bg-muted rounded-md font-bold text-lg">
                  {calculateTotal('post_secondary')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
