"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CustomLineChart } from "@/components/charts/line-chart"
import { CustomBarChart } from "@/components/charts/bar-chart"
import { TrendingUp, TrendingDown, Download, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FinancialTrendData } from "@/lib/supabase-data-service"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { SortableTable } from "@/components/ui/sortable-table"

interface FinancialContentProps {
  financialData: FinancialTrendData
  selectedYear?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export function FinancialContent({ financialData, selectedYear }: FinancialContentProps) {

  // Get the year to use for year-specific analysis (selected year or latest available)
  const analysisYear = selectedYear || financialData.years[financialData.years.length - 1]

  // Filter data for the analysis year only
  const analysisYearData = useMemo(() => {
    return financialData.byYear.filter(point => point.year_label === analysisYear)
  }, [financialData.byYear, analysisYear])

  // Filter table data by selected year if provided
  const tableData = useMemo(() => {
    if (!selectedYear) return financialData.byYear
    return financialData.byYear.filter(point => point.year_label === selectedYear)
  }, [financialData.byYear, selectedYear])

  // Calculate key metrics based on selected year or all years
  const keyMetrics = useMemo(() => {
    const dataToUse = selectedYear ? tableData : financialData.byYear

    const validBudgets = dataToUse.filter(d => d.education_budget_total !== null)
    const validGDP = dataToUse.filter(d => d.gdp !== null)
    const validPctBudget = dataToUse.filter(d => d.education_pct_national_budget !== null)
    const validPctGDP = dataToUse.filter(d => d.education_pct_gdp !== null)

    const totalBudget = validBudgets.reduce((sum, d) => sum + (d.education_budget_total || 0), 0)
    const totalGDP = validGDP.reduce((sum, d) => sum + (d.gdp || 0), 0)
    const avgPctBudget = validPctBudget.length > 0
      ? validPctBudget.reduce((sum, d) => sum + (d.education_pct_national_budget || 0), 0) / validPctBudget.length
      : 0
    const avgPctGDP = validPctGDP.length > 0
      ? validPctGDP.reduce((sum, d) => sum + (d.education_pct_gdp || 0), 0) / validPctGDP.length
      : 0

    return {
      total_education_budget: totalBudget,
      total_gdp: totalGDP,
      avg_education_pct_budget: avgPctBudget,
      avg_education_pct_gdp: avgPctGDP,
      year_count: selectedYear ? 1 : financialData.years.length
    }
  }, [tableData, financialData, selectedYear])

  // SECTION 1: Trend Charts Data (ALWAYS all years - never filtered)
  const trendChartsData = useMemo(() => {
    // Aggregate by year across all countries
    const aggregatedByYear = new Map<string, any>()

    financialData.byYear.forEach(point => {
      const existing = aggregatedByYear.get(point.year_label) || {
        year_label: point.year_label,
        education_budget_total: 0,
        pct_budget_sum: 0,
        pct_budget_count: 0,
        pct_gdp_sum: 0,
        pct_gdp_count: 0
      }

      existing.education_budget_total += point.education_budget_total || 0
      if (point.education_pct_national_budget) {
        existing.pct_budget_sum += point.education_pct_national_budget
        existing.pct_budget_count++
      }
      if (point.education_pct_gdp) {
        existing.pct_gdp_sum += point.education_pct_gdp
        existing.pct_gdp_count++
      }

      aggregatedByYear.set(point.year_label, existing)
    })

    const sorted = Array.from(aggregatedByYear.values())
      .sort((a, b) => a.year_label.localeCompare(b.year_label))

    return {
      budgetTrend: sorted.map(d => ({
        year: d.year_label,
        "Education Budget (M)": (d.education_budget_total / 1000000).toFixed(2)
      })),
      pctBudgetTrend: sorted.map(d => ({
        year: d.year_label,
        "% of National Budget": d.pct_budget_count > 0
          ? (d.pct_budget_sum / d.pct_budget_count).toFixed(2)
          : 0
      })),
      pctGdpTrend: sorted.map(d => ({
        year: d.year_label,
        "% of GDP": d.pct_gdp_count > 0
          ? (d.pct_gdp_sum / d.pct_gdp_count).toFixed(2)
          : 0
      }))
    }
  }, [financialData.byYear])

  // SECTION 2: Year-Specific Analysis Data
  const yearSpecificData = useMemo(() => {
    // Bar chart: Budget by country for the analysis year
    const countryBudgets = analysisYearData
      .filter(d => d.education_budget_total)
      .map(d => ({
        country: d.country_name,
        "Budget (M)": (d.education_budget_total / 1000000).toFixed(2)
      }))
      .sort((a, b) => parseFloat(b["Budget (M)"]) - parseFloat(a["Budget (M)"]))

    // Pie chart: Allocation breakdown
    const totalAllocations = analysisYearData.reduce((acc, d) => ({
      early_childhood: acc.early_childhood + (d.allocation_early_childhood || 0),
      primary: acc.primary + (d.allocation_primary || 0),
      secondary: acc.secondary + (d.allocation_secondary || 0),
      special_ed: acc.special_ed + (d.allocation_special_ed || 0),
      post_secondary: acc.post_secondary + (d.allocation_post_secondary || 0),
      other: acc.other + (d.allocation_other || 0)
    }), { early_childhood: 0, primary: 0, secondary: 0, special_ed: 0, post_secondary: 0, other: 0 })

    const allocationPie = [
      { name: 'Early Childhood', value: totalAllocations.early_childhood },
      { name: 'Primary', value: totalAllocations.primary },
      { name: 'Secondary', value: totalAllocations.secondary },
      { name: 'Special Ed', value: totalAllocations.special_ed },
      { name: 'Post-Secondary', value: totalAllocations.post_secondary },
      { name: 'Other', value: totalAllocations.other }
    ].filter(item => item.value > 0)

    // Summary stats for this year
    const validBudgets = analysisYearData.filter(d => d.education_budget_total !== null)
    const validGDP = analysisYearData.filter(d => d.gdp !== null)
    const validPctBudget = analysisYearData.filter(d => d.education_pct_national_budget !== null)
    const validPctGDP = analysisYearData.filter(d => d.education_pct_gdp !== null)

    return {
      countryBudgets,
      allocationPie,
      summary: {
        total_budget: validBudgets.reduce((sum, d) => sum + (d.education_budget_total || 0), 0),
        total_gdp: validGDP.reduce((sum, d) => sum + (d.gdp || 0), 0),
        avg_pct_budget: validPctBudget.length > 0
          ? validPctBudget.reduce((sum, d) => sum + (d.education_pct_national_budget || 0), 0) / validPctBudget.length
          : 0,
        avg_pct_gdp: validPctGDP.length > 0
          ? validPctGDP.reduce((sum, d) => sum + (d.education_pct_gdp || 0), 0) / validPctGDP.length
          : 0
      }
    }
  }, [analysisYearData])

  // Export function
  const handleExport = () => {
    const headers = ["Year", "Country", "National Budget", "Education Budget", "GDP", "Edu % National", "Edu % GDP"]
    const rows = tableData.map(d => [
      d.year_label,
      d.country_name,
      d.national_budget_total || 0,
      d.education_budget_total || 0,
      d.gdp || 0,
      d.education_pct_national_budget || 0,
      d.education_pct_gdp || 0
    ])

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financial-data-${selectedYear || 'all-years'}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (financialData.byYear.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Financial Data Available</CardTitle>
          <CardDescription>
            Historical financial data will appear here once imported. The data includes national budgets, education spending, and GDP figures.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* TOP SECTION: Key Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Financial Overview</h2>
          <Badge variant="secondary" className="text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {selectedYear || `All ${financialData.years.length} Years`}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Education Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                EC$ {(keyMetrics.total_education_budget / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedYear ? `For ${selectedYear}` : 'Across all years'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total GDP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                EC$ {(keyMetrics.total_gdp / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Combined economic output
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg % of National Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {keyMetrics.avg_education_pct_budget.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Education spending ratio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg % of GDP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {keyMetrics.avg_education_pct_gdp.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Economic investment in education
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 1: Trends Over Time (Always all years) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Trends Over Time</h2>
          <p className="text-muted-foreground">Historical trends across all available years ({financialData.years.length} years)</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Education Budget Trends</CardTitle>
              <CardDescription>Total education spending across OECS countries</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomLineChart
                data={trendChartsData.budgetTrend}
                xKey="year"
                yKeys={["Education Budget (M)"]}
                colors={["#0088FE"]}
                height={300}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>% of National Budget</CardTitle>
                <CardDescription>Average education share of national budgets</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomLineChart
                  data={trendChartsData.pctBudgetTrend}
                  xKey="year"
                  yKeys={["% of National Budget"]}
                  colors={["#00C49F"]}
                  height={250}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>% of GDP</CardTitle>
                <CardDescription>Average education investment as % of GDP</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomLineChart
                  data={trendChartsData.pctGdpTrend}
                  xKey="year"
                  yKeys={["% of GDP"]}
                  colors={["#FFBB28"]}
                  height={250}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* SECTION 2: Year-Specific Analysis */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{analysisYear} Analysis</h2>
          <p className="text-muted-foreground">Detailed breakdown for {analysisYear}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Education Budget by Country</CardTitle>
              <CardDescription>Budget allocation across OECS countries</CardDescription>
            </CardHeader>
            <CardContent>
              {yearSpecificData.countryBudgets.length > 0 ? (
                <CustomBarChart
                  data={yearSpecificData.countryBudgets}
                  xKey="country"
                  yKeys={["Budget (M)"]}
                  colors={["#8884d8"]}
                  height={300}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No budget data available for {analysisYear}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation by Education Level</CardTitle>
              <CardDescription>Distribution across education sectors</CardDescription>
            </CardHeader>
            <CardContent>
              {yearSpecificData.allocationPie.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={yearSpecificData.allocationPie}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {yearSpecificData.allocationPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`EC$ ${(value / 1000000).toFixed(2)}M`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No allocation data available for {analysisYear}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Year-specific indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Key Indicators for {analysisYear}</CardTitle>
            <CardDescription>Summary statistics</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-xl font-bold">EC$ {(yearSpecificData.summary.total_budget / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total GDP</p>
              <p className="text-xl font-bold">EC$ {(yearSpecificData.summary.total_gdp / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg % of Budget</p>
              <p className="text-xl font-bold">{yearSpecificData.summary.avg_pct_budget.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg % of GDP</p>
              <p className="text-xl font-bold">{yearSpecificData.summary.avg_pct_gdp.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Detailed Financial Data</h2>
            <p className="text-muted-foreground">
              {selectedYear
                ? `Showing ${tableData.length} records for ${selectedYear}`
                : `Showing all ${tableData.length} records across ${financialData.years.length} years`}
            </p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <SortableTable
              data={tableData}
              columns={[
                {
                  key: "year",
                  header: "Year",
                  accessor: (row) => row.year_label,
                  align: "left",
                  render: (value) => <span className="font-medium">{value}</span>
                },
                {
                  key: "country",
                  header: "Country",
                  accessor: (row) => row.country_name,
                  align: "left"
                },
                {
                  key: "national_budget",
                  header: "National Budget (M)",
                  accessor: (row) => row.national_budget_total || 0,
                  align: "right",
                  render: (value) => value ? `EC$ ${(value / 1000000).toFixed(2)}` : '-'
                },
                {
                  key: "education_budget",
                  header: "Education Budget (M)",
                  accessor: (row) => row.education_budget_total || 0,
                  align: "right",
                  render: (value) => value ? `EC$ ${(value / 1000000).toFixed(2)}` : '-'
                },
                {
                  key: "gdp",
                  header: "GDP (M)",
                  accessor: (row) => row.gdp || 0,
                  align: "right",
                  render: (value) => value ? `EC$ ${(value / 1000000).toFixed(2)}` : '-'
                },
                {
                  key: "pct_budget",
                  header: "% of Budget",
                  accessor: (row) => row.education_pct_national_budget || 0,
                  align: "right",
                  render: (value) => value ? `${value.toFixed(2)}%` : '-'
                },
                {
                  key: "pct_gdp",
                  header: "% of GDP",
                  accessor: (row) => row.education_pct_gdp || 0,
                  align: "right",
                  render: (value) => value ? `${value.toFixed(2)}%` : '-'
                }
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
