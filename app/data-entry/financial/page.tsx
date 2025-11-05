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

// Programme definitions
const SAFETY_NET_PROGRAMMES = [
  { name: "School Feeding Programme", target: "Public Primary and Preschool" },
  { name: "Textbook Rental Programme", target: "Primary Schools" },
  { name: "Textbook Rental Programme", target: "Secondary Schools (Form's 1-5)" },
  { name: "Government Transfer Grant", target: "Primary to Secondary Schools" },
  { name: "Transportation Subsidy Programme", target: "Secondary Schools" },
  { name: "Education Trust Fund - CXC Fees", target: "Secondary Schools" },
  { name: "Education Trust Fund - School Registration Fees", target: "Secondary Schools" }
]

const EDUCATION_STAGES = [
  { key: 'pre_primary', label: 'Pre-Primary/Daycare' },
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'tvet', label: 'TVET' },
  { key: 'special_education', label: 'Special Education' },
  { key: 'post_secondary', label: 'Post Secondary-/non-tertiary' },
  { key: 'tertiary', label: 'Tertiary' },
  { key: 'other', label: 'Other Education Expenditure' }
]

export default function FinancialPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Data storage using Maps
  const [safetyNetData, setSafetyNetData] = useState<Map<string, number>>(new Map())
  const [budgetAllocationData, setBudgetAllocationData] = useState<Map<string, number>>(new Map())
  const [nationalContextData, setNationalContextData] = useState<Map<string, number>>(new Map())

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
        await Promise.all([
          loadSafetyNetData(userProfile.country_id, activeYear.id),
          loadBudgetAllocationData(userProfile.country_id, activeYear.id),
          loadNationalContextData(userProfile.country_id, activeYear.id)
        ])
      }

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadSafetyNetData = async (countryId: number, yearId: number) => {
    const { data } = await supabase
      .from('social_safety_net_programmes')
      .select('*')
      .eq('country_id', countryId)
      .eq('academic_year_id', yearId)

    if (data) {
      const map = new Map<string, number>()
      data.forEach(row => {
        const key = `${row.programme_name}|${row.target_population}`
        map.set(`${key}|participating`, row.number_participating || 0)
        map.set(`${key}|amount`, row.total_amount_spent || 0)
      })
      setSafetyNetData(map)
      if (data.length > 0) setLastSaved(new Date(data[0].updated_at))
    }
  }

  const loadBudgetAllocationData = async (countryId: number, yearId: number) => {
    const { data } = await supabase
      .from('education_budget_allocation')
      .select('*')
      .eq('country_id', countryId)
      .eq('academic_year_id', yearId)

    if (data) {
      const map = new Map<string, number>()
      data.forEach(row => {
        map.set(`${row.education_stage}|recurrent`, row.recurrent_expenditure || 0)
        map.set(`${row.education_stage}|capital`, row.capital_expenditure || 0)
      })
      setBudgetAllocationData(map)
    }
  }

  const loadNationalContextData = async (countryId: number, yearId: number) => {
    const { data } = await supabase
      .from('national_financial_context')
      .select('*')
      .eq('country_id', countryId)
      .eq('academic_year_id', yearId)
      .single()

    if (data) {
      const map = new Map<string, number>()
      map.set('national_recurrent', data.national_budget_recurrent || 0)
      map.set('national_capital', data.national_budget_capital || 0)
      map.set('gdp', data.gdp_estimate || 0)
      map.set('spending_gdp_percent', data.spending_on_education_percent_gdp || 0)
      map.set('tertiary_allocation', data.tertiary_allocation || 0)
      setNationalContextData(map)
    }
  }

  // Helper functions for data keys
  const safetyNetKey = (programme: string, target: string, field: string) => `${programme}|${target}|${field}`
  const budgetKey = (stage: string, field: string) => `${stage}|${field}`

  const handleSave = async () => {
    if (!profile?.country_id || !academicYear?.id) {
      toast.error('Missing profile or academic year')
      return
    }

    setSaving(true)

    try {
      const countryId = profile.country_id
      const yearId = academicYear.id

      await Promise.all([
        saveSafetyNetData(countryId, yearId),
        saveBudgetAllocationData(countryId, yearId),
        saveNationalContextData(countryId, yearId)
      ])

      setLastSaved(new Date())
      toast.success('Financial data saved successfully!')
    } catch (error) {
      console.error('Error saving data:', error)
      toast.error('Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  const saveSafetyNetData = async (countryId: number, yearId: number) => {
    await supabase.from('social_safety_net_programmes').delete()
      .eq('country_id', countryId).eq('academic_year_id', yearId)

    const inserts: any[] = []
    SAFETY_NET_PROGRAMMES.forEach(prog => {
      const participating = safetyNetData.get(safetyNetKey(prog.name, prog.target, 'participating')) || 0
      const amount = safetyNetData.get(safetyNetKey(prog.name, prog.target, 'amount')) || 0

      if (participating > 0 || amount > 0) {
        inserts.push({
          country_id: countryId,
          academic_year_id: yearId,
          programme_name: prog.name,
          target_population: prog.target,
          number_participating: participating,
          total_amount_spent: amount
        })
      }
    })

    if (inserts.length > 0) {
      await supabase.from('social_safety_net_programmes').insert(inserts)
    }
  }

  const saveBudgetAllocationData = async (countryId: number, yearId: number) => {
    await supabase.from('education_budget_allocation').delete()
      .eq('country_id', countryId).eq('academic_year_id', yearId)

    const inserts: any[] = []
    EDUCATION_STAGES.forEach(stage => {
      const recurrent = budgetAllocationData.get(budgetKey(stage.key, 'recurrent')) || 0
      const capital = budgetAllocationData.get(budgetKey(stage.key, 'capital')) || 0

      if (recurrent > 0 || capital > 0) {
        inserts.push({
          country_id: countryId,
          academic_year_id: yearId,
          education_stage: stage.key,
          recurrent_expenditure: recurrent,
          capital_expenditure: capital
        })
      }
    })

    if (inserts.length > 0) {
      await supabase.from('education_budget_allocation').insert(inserts)
    }
  }

  const saveNationalContextData = async (countryId: number, yearId: number) => {
    await supabase.from('national_financial_context').delete()
      .eq('country_id', countryId).eq('academic_year_id', yearId)

    const data = {
      country_id: countryId,
      academic_year_id: yearId,
      national_budget_recurrent: nationalContextData.get('national_recurrent') || 0,
      national_budget_capital: nationalContextData.get('national_capital') || 0,
      gdp_estimate: nationalContextData.get('gdp') || 0,
      spending_on_education_percent_gdp: nationalContextData.get('spending_gdp_percent') || 0,
      tertiary_allocation: nationalContextData.get('tertiary_allocation') || 0
    }

    await supabase.from('national_financial_context').insert(data)
  }

  // Calculation helpers
  const calculateCostPerChild = (participating: number, amount: number) => {
    if (participating === 0) return 0
    return (amount / participating).toFixed(2)
  }

  const calculateBudgetTotal = (stage: string) => {
    const recurrent = budgetAllocationData.get(budgetKey(stage, 'recurrent')) || 0
    const capital = budgetAllocationData.get(budgetKey(stage, 'capital')) || 0
    return recurrent + capital
  }

  const calculateBudgetTotals = () => {
    let recurrent = 0
    let capital = 0
    EDUCATION_STAGES.forEach(stage => {
      recurrent += budgetAllocationData.get(budgetKey(stage.key, 'recurrent')) || 0
      capital += budgetAllocationData.get(budgetKey(stage.key, 'capital')) || 0
    })
    return { recurrent, capital, total: recurrent + capital }
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
      <div className="bg-[#4DA11D] text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/data-entry')} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Financial: Government Expenditure on Education</h1>
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
            <CardTitle>Government Financial Data</CardTitle>
            <CardDescription>
              Track education expenditure, budget allocation, and financial context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complete all sections for comprehensive financial reporting. All amounts in EC$.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="safety-net" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="safety-net">Safety Net Programmes</TabsTrigger>
            <TabsTrigger value="budget">Budget Allocation</TabsTrigger>
            <TabsTrigger value="analysis">Financial Analysis</TabsTrigger>
          </TabsList>

          {/* G1: Safety Net Programmes */}
          <TabsContent value="safety-net" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Safety Net Programmes</CardTitle>
                <CardDescription>Expenditure on educational support programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Programme</th>
                        <th className="border p-2 text-left">Target Population</th>
                        <th className="border p-2 text-center w-32">Number Participating</th>
                        <th className="border p-2 text-center w-32">Total Amount Spent (EC$)</th>
                        <th className="border p-2 text-center w-32 bg-gray-200">Cost per Child (EC$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAFETY_NET_PROGRAMMES.map((prog, idx) => {
                        const participating = safetyNetData.get(safetyNetKey(prog.name, prog.target, 'participating')) || 0
                        const amount = safetyNetData.get(safetyNetKey(prog.name, prog.target, 'amount')) || 0
                        return (
                          <tr key={idx}>
                            <td className="border p-2 font-medium">{prog.name}</td>
                            <td className="border p-2 text-sm text-muted-foreground">{prog.target}</td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                className="text-center h-8"
                                value={participating || ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setSafetyNetData(prev => new Map(prev).set(safetyNetKey(prog.name, prog.target, 'participating'), val))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="text-center h-8"
                                value={amount || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0
                                  setSafetyNetData(prev => new Map(prev).set(safetyNetKey(prog.name, prog.target, 'amount'), val))
                                }}
                              />
                            </td>
                            <td className="border p-2 text-center bg-gray-50 font-medium">
                              {calculateCostPerChild(participating, amount)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* G2: Budget Allocation */}
          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Education Budget Allocation by Stages</CardTitle>
                <CardDescription>Recurrent and capital expenditure across education levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Education Stage</th>
                        <th className="border p-2 text-center w-40">Recurrent (EC$)</th>
                        <th className="border p-2 text-center w-40">Capital (EC$)</th>
                        <th className="border p-2 text-center w-40 bg-gray-200">Total (EC$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EDUCATION_STAGES.map(stage => {
                        const recurrent = budgetAllocationData.get(budgetKey(stage.key, 'recurrent')) || 0
                        const capital = budgetAllocationData.get(budgetKey(stage.key, 'capital')) || 0
                        return (
                          <tr key={stage.key}>
                            <td className="border p-2 font-medium">{stage.label}</td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="text-center h-8"
                                value={recurrent || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0
                                  setBudgetAllocationData(prev => new Map(prev).set(budgetKey(stage.key, 'recurrent'), val))
                                }}
                              />
                            </td>
                            <td className="border p-1">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className="text-center h-8"
                                value={capital || ''}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0
                                  setBudgetAllocationData(prev => new Map(prev).set(budgetKey(stage.key, 'capital'), val))
                                }}
                              />
                            </td>
                            <td className="border p-2 text-center bg-gray-50 font-medium">
                              {calculateBudgetTotal(stage.key).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                          </tr>
                        )
                      })}
                      <tr className="bg-blue-50 font-bold">
                        <td className="border p-2">TOTAL</td>
                        <td className="border p-2 text-center">
                          {calculateBudgetTotals().recurrent.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </td>
                        <td className="border p-2 text-center">
                          {calculateBudgetTotals().capital.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </td>
                        <td className="border p-2 text-center bg-blue-100">
                          {calculateBudgetTotals().total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* G3: Financial Analysis */}
          <TabsContent value="analysis" className="space-y-4">
            {/* National Budget Section */}
            <Card>
              <CardHeader>
                <CardTitle>National Budget Context</CardTitle>
                <CardDescription>National budget figures for comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">National Budget - Recurrent (EC$)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-1"
                      value={nationalContextData.get('national_recurrent') || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0
                        setNationalContextData(prev => new Map(prev).set('national_recurrent', val))
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">National Budget - Capital (EC$)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-1"
                      value={nationalContextData.get('national_capital') || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0
                        setNationalContextData(prev => new Map(prev).set('national_capital', val))
                      }}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border">
                  <div className="text-sm font-medium mb-2">Total National Budget (EC$)</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {((nationalContextData.get('national_recurrent') || 0) + (nationalContextData.get('national_capital') || 0)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">GDP Estimate at Current Market Prices - EC$ (2021)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1"
                    value={nationalContextData.get('gdp') || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setNationalContextData(prev => new Map(prev).set('gdp', val))
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Spending on Education as % GDP (2020)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="mt-1"
                    value={nationalContextData.get('spending_gdp_percent') || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setNationalContextData(prev => new Map(prev).set('spending_gdp_percent', val))
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Education Budget Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Education Budget Summary</CardTitle>
                <CardDescription>Calculated from budget allocation data above</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Education Budget - Recurrent (EC$)</span>
                    <span className="text-lg font-bold">
                      {calculateBudgetTotals().recurrent.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Education Budget - Capital (EC$)</span>
                    <span className="text-lg font-bold">
                      {calculateBudgetTotals().capital.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-100 rounded border-2 border-blue-300">
                    <span className="font-bold">Total Education Budget (EC$)</span>
                    <span className="text-xl font-bold text-blue-700">
                      {calculateBudgetTotals().total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-300">
                    <span className="font-medium">Education Budget as % of National Budget</span>
                    <span className="text-lg font-bold text-green-700">
                      {(() => {
                        const totalNational = (nationalContextData.get('national_recurrent') || 0) + (nationalContextData.get('national_capital') || 0)
                        const totalEducation = calculateBudgetTotals().total
                        if (totalNational === 0) return '0.00%'
                        return ((totalEducation / totalNational) * 100).toFixed(2) + '%'
                      })()}
                    </span>
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
