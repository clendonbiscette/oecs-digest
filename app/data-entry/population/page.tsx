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

interface PopulationRow {
  age: number
  male: number
  female: number
}

export default function PopulationDataEntryPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Age ranges from 0 to 25+
  const ages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]

  const [populationData, setPopulationData] = useState<Map<number, PopulationRow>>(new Map())

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

      // Load existing population data
      if (userProfile?.country_id && activeYear?.id) {
        const { data, error } = await supabase
          .from('population_data')
          .select('*')
          .eq('country_id', userProfile.country_id)
          .eq('academic_year_id', activeYear.id)

        if (data && !error) {
          const dataMap = new Map<number, PopulationRow>()
          data.forEach(row => {
            dataMap.set(row.age, {
              age: row.age,
              male: row.male || 0,
              female: row.female || 0
            })
          })
          setPopulationData(dataMap)
          if (data.length > 0) {
            setLastSaved(new Date(data[0].updated_at))
          }
        }
      }

      // Initialize empty rows for all ages
      const initialData = new Map<number, PopulationRow>()
      ages.forEach(age => {
        if (!populationData.has(age)) {
          initialData.set(age, { age, male: 0, female: 0 })
        }
      })
      setPopulationData(prev => new Map([...initialData, ...prev]))

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (age: number, field: 'male' | 'female', value: string) => {
    const numValue = parseInt(value) || 0
    setPopulationData(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(age) || { age, male: 0, female: 0 }
      newMap.set(age, { ...existing, [field]: numValue })
      return newMap
    })
  }

  const calculateTotal = (age: number): number => {
    const row = populationData.get(age)
    if (!row) return 0
    return row.male + row.female
  }

  const calculateGrandTotal = (field: 'male' | 'female' | 'total'): number => {
    let sum = 0
    populationData.forEach(row => {
      if (field === 'male') sum += row.male
      else if (field === 'female') sum += row.female
      else sum += row.male + row.female
    })
    return sum
  }

  const handleSave = async () => {
    if (!profile?.country_id || !academicYear?.id) {
      toast.error('Missing required information')
      return
    }

    setSaving(true)

    try {
      // Delete existing data for this country/year
      await supabase
        .from('population_data')
        .delete()
        .eq('country_id', profile.country_id)
        .eq('academic_year_id', academicYear.id)

      // Insert all population rows
      const dataToInsert = Array.from(populationData.values()).map(row => ({
        country_id: profile.country_id,
        academic_year_id: academicYear.id,
        age: row.age,
        male: row.male,
        female: row.female
      }))

      const { error } = await supabase
        .from('population_data')
        .insert(dataToInsert)

      if (error) throw error

      setLastSaved(new Date())
      toast.success('Population data saved successfully!')
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
                <h1 className="text-xl font-bold">Population Data Entry</h1>
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
              Enter the population data for your country by age and sex. Age ranges from 0 to 25+ years.
              Totals are calculated automatically.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Population by Age and Sex</CardTitle>
            <CardDescription>Academic Year: {academicYear?.year_label}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left font-semibold">Age</th>
                    <th className="border p-2 text-center font-semibold">Male</th>
                    <th className="border p-2 text-center font-semibold">Female</th>
                    <th className="border p-2 text-center font-semibold bg-gray-200">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ages.map(age => (
                    <tr key={age} className="hover:bg-muted/50">
                      <td className="border p-2 font-medium">
                        {age === 25 ? '25+' : age}
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={populationData.get(age)?.male || 0}
                          onChange={(e) => handleInputChange(age, 'male', e.target.value)}
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          min="0"
                          className="text-center"
                          value={populationData.get(age)?.female || 0}
                          onChange={(e) => handleInputChange(age, 'female', e.target.value)}
                        />
                      </td>
                      <td className="border p-2 text-center bg-gray-50 font-bold">
                        {calculateTotal(age)}
                      </td>
                    </tr>
                  ))}
                  {/* Grand Total Row */}
                  <tr className="bg-[#4DA11D] text-white font-bold">
                    <td className="border p-2">GRAND TOTAL</td>
                    <td className="border p-2 text-center">{calculateGrandTotal('male')}</td>
                    <td className="border p-2 text-center">{calculateGrandTotal('female')}</td>
                    <td className="border p-2 text-center">{calculateGrandTotal('total')}</td>
                  </tr>
                </tbody>
              </table>
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
