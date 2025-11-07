"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomLineChart } from "@/components/charts/line-chart"
import { CustomBarChart } from "@/components/charts/bar-chart"
import { TrendingUp, TrendingDown, Download, DollarSign, PieChart as PieChartIcon, Calendar, BarChart3 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FinancialTrendData } from "@/lib/supabase-data-service"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { SortableTable } from "@/components/ui/sortable-table"
import { CountryComparison } from "@/components/country-comparison"

interface FinancialContentProps {
  financialData: FinancialTrendData
  selectedYear?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export function FinancialContent({ financialData, selectedYear }: FinancialContentProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL")
  const [selectedMetric, setSelectedMetric] = useState<string>("education_budget")
  const [showComparison, setShowComparison] = useState<boolean>(false)

  // Filter data by selected year if provided
  const yearFilteredData = useMemo(() => {
    if (!selectedYear) return financialData

    return {
      ...financialData,
      byYear: financialData.byYear.filter(point => point.year_label === selectedYear),
      byCountry: Object.fromEntries(
        Object.entries(financialData.byCountry).map(([country, data]) => [
          country,
          data.filter(point => point.year_label === selectedYear)
        ])
      )
    }
  }, [financialData, selectedYear])

  // Calculate summary statistics for filtered data
  const filteredSummary = useMemo(() => {
    const dataToSummarize = selectedYear ? yearFilteredData.byYear : financialData.byYear

    const validBudgets = dataToSummarize.filter(d => d.education_budget_total !== null)
    const validGDP = dataToSummarize.filter(d => d.gdp !== null)
    const validPctBudget = dataToSummarize.filter(d => d.education_pct_national_budget !== null)
    const validPctGDP = dataToSummarize.filter(d => d.education_pct_gdp !== null)

    return {
      total_education_budget: validBudgets.reduce((sum, d) => sum + (d.education_budget_total || 0), 0),
      total_gdp: validGDP.reduce((sum, d) => sum + (d.gdp || 0), 0),
      avg_education_pct_budget: validPctBudget.length > 0
        ? validPctBudget.reduce((sum, d) => sum + (d.education_pct_national_budget || 0), 0) / validPctBudget.length
        : 0,
      avg_education_pct_gdp: validPctGDP.length > 0
        ? validPctGDP.reduce((sum, d) => sum + (d.education_pct_gdp || 0), 0) / validPctGDP.length
        : 0
    }
  }, [yearFilteredData, financialData, selectedYear])

  // Prepare data based on selected country
  const displayData = useMemo(() => {
    if (selectedCountry === "ALL") {
      // Aggregate by year across all countries
      const aggregated = new Map<string, any>()

      yearFilteredData.byYear.forEach(point => {
        const existing = aggregated.get(point.year_label) || {
          year_label: point.year_label,
          national_budget_total: 0,
          education_budget_total: 0,
          gdp: 0,
          education_pct_national_budget: 0,
          education_pct_gdp: 0,
          count: 0
        }

        existing.national_budget_total += point.national_budget_total || 0
        existing.education_budget_total += point.education_budget_total || 0
        existing.gdp += point.gdp || 0
        if (point.education_pct_national_budget) {
          existing.education_pct_national_budget += point.education_pct_national_budget
          existing.count++
        }

        aggregated.set(point.year_label, existing)
      })

      // Calculate averages for percentages
      return Array.from(aggregated.values()).map(d => ({
        ...d,
        education_pct_national_budget: d.count > 0 ? d.education_pct_national_budget / d.count : 0,
      })).sort((a, b) => a.year_label.localeCompare(b.year_label))
    } else {
      return yearFilteredData.byCountry[selectedCountry] || []
    }
  }, [selectedCountry, yearFilteredData])

  // Calculate year-over-year change
  const yoyChange = useMemo(() => {
    if (displayData.length < 2) return null

    const latest = displayData[displayData.length - 1]
    const previous = displayData[displayData.length - 2]

    const change = (latest.education_budget_total || 0) - (previous.education_budget_total || 0)
    const percentChange = previous.education_budget_total
      ? ((change / previous.education_budget_total) * 100).toFixed(1)
      : "0.0"

    return {
      absolute: change,
      percent: percentChange,
      isPositive: change >= 0
    }
  }, [displayData])

  // Prepare chart data based on selected metric
  const chartData = useMemo(() => {
    if (selectedMetric === "education_budget") {
      return displayData.map(d => ({
        year: d.year_label,
        "Education Budget": d.education_budget_total ? (d.education_budget_total / 1000000).toFixed(2) : 0
      }))
    } else if (selectedMetric === "pct_budget") {
      return displayData.map(d => ({
        year: d.year_label,
        "% of National Budget": d.education_pct_national_budget ? d.education_pct_national_budget.toFixed(2) : 0
      }))
    } else if (selectedMetric === "pct_gdp") {
      return displayData.map(d => ({
        year: d.year_label,
        "% of GDP": d.education_pct_gdp ? d.education_pct_gdp.toFixed(2) : 0
      }))
    } else {
      // allocation breakdown
      return displayData.map(d => ({
        year: d.year_label,
        "Early Childhood": d.allocation_early_childhood || 0,
        "Primary": d.allocation_primary || 0,
        "Secondary": d.allocation_secondary || 0,
        "Special Ed": d.allocation_special_ed || 0,
        "Post-Secondary": d.allocation_post_secondary || 0,
        "Other": d.allocation_other || 0
      }))
    }
  }, [displayData, selectedMetric])

  // Latest allocation data for pie chart
  const allocationData = useMemo(() => {
    if (displayData.length === 0) return []

    const latest = displayData[displayData.length - 1]
    return [
      { name: 'Early Childhood', value: latest.allocation_early_childhood || 0 },
      { name: 'Primary', value: latest.allocation_primary || 0 },
      { name: 'Secondary', value: latest.allocation_secondary || 0 },
      { name: 'Special Ed', value: latest.allocation_special_ed || 0 },
      { name: 'Post-Secondary', value: latest.allocation_post_secondary || 0 },
      { name: 'Other', value: latest.allocation_other || 0 }
    ].filter(item => item.value > 0)
  }, [displayData])

  // Export function
  const handleExport = () => {
    const headers = ["Year", "Country", "National Budget", "Education Budget", "GDP", "Edu % National", "Edu % GDP"]
    const rows = displayData.map(d => [
      d.year_label,
      selectedCountry === "ALL" ? "OECS Total" : d.country_name,
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
    a.download = `financial-data-${selectedCountry}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (displayData.length === 0) {
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
    <div className="space-y-6">
      {/* Data Timestamp Alert */}
      <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-4">
          <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <AlertDescription className="text-sm">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <span className="font-semibold text-amber-900 dark:text-amber-100">Academic Years:</span>{" "}
                <span className="text-amber-700 dark:text-amber-300">
                  {selectedYear || `${financialData.years[0]} - ${financialData.years[financialData.years.length - 1]}`}
                </span>
              </div>
              <div>
                <span className="font-semibold text-amber-900 dark:text-amber-100">Data Source:</span>{" "}
                <span className="text-amber-700 dark:text-amber-300">OECS National Budgets & Financial Records</span>
              </div>
              <div>
                <span className="font-semibold text-amber-900 dark:text-amber-100">Years Available:</span>{" "}
                <span className="text-amber-700 dark:text-amber-300">
                  {selectedYear ? '1 year (filtered)' : `${financialData.years.length} years`}
                </span>
              </div>
            </div>
          </AlertDescription>
        </div>
      </Alert>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant={showComparison ? "default" : "outline"}
          onClick={() => setShowComparison(!showComparison)}
          className="gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {showComparison ? "Hide Comparison" : "Compare Countries"}
        </Button>

        {!showComparison && (
          <>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All OECS Countries</SelectItem>
                  {financialData.countries.map(country => (
                    <SelectItem key={country.country_code} value={country.country_code}>
                  {country.country_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="education_budget">Education Budget</SelectItem>
              <SelectItem value="pct_budget">% of National Budget</SelectItem>
              <SelectItem value="pct_gdp">% of GDP</SelectItem>
              <SelectItem value="allocation">Budget Allocation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleExport} className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
          </>
        )}
      </div>

      {/* Regular View */}
      {!showComparison && (
        <>
          {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Education Budget</CardTitle>
            {yoyChange && (
              yoyChange.isPositive ?
                <TrendingUp className="h-4 w-4 text-green-500" /> :
                <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((displayData[displayData.length - 1]?.education_budget_total || 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              {displayData[displayData.length - 1]?.year_label} Academic Year
            </p>
            {yoyChange && (
              <Badge
                variant={yoyChange.isPositive ? "default" : "destructive"}
                className="mt-2"
              >
                {yoyChange.isPositive ? "+" : ""}${(yoyChange.absolute / 1000000).toFixed(1)}M ({yoyChange.isPositive ? "+" : ""}{yoyChange.percent}%)
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% of National Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(displayData[displayData.length - 1]?.education_pct_national_budget || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Education spending ratio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% of GDP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(displayData[displayData.length - 1]?.education_pct_gdp || 0).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Economic investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Years of Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedYear ? 1 : financialData.years.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedYear || `${financialData.years[0]} to ${financialData.years[financialData.years.length - 1]}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedMetric === "education_budget" && "Education Budget Trends"}
            {selectedMetric === "pct_budget" && "Education as % of National Budget"}
            {selectedMetric === "pct_gdp" && "Education as % of GDP"}
            {selectedMetric === "allocation" && "Budget Allocation by Education Level"}
          </CardTitle>
          <CardDescription>
            {selectedCountry === "ALL"
              ? "Aggregated data across all OECS countries"
              : `Data for ${financialData.countries.find(c => c.country_code === selectedCountry)?.country_name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedMetric === "allocation" ? (
            <CustomLineChart
              data={chartData}
              xKey="year"
              yKeys={["Early Childhood", "Primary", "Secondary", "Special Ed", "Post-Secondary", "Other"]}
              colors={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c", "#d0ed57"]}
              height={400}
            />
          ) : (
            <CustomLineChart
              data={chartData}
              xKey="year"
              yKeys={Object.keys(chartData[0] || {}).filter(k => k !== "year")}
              colors={["#8884d8"]}
              height={400}
            />
          )}
        </CardContent>
      </Card>

      {/* Budget Allocation Pie Chart */}
      {allocationData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation by Level</CardTitle>
              <CardDescription>
                Latest year: {displayData[displayData.length - 1]?.year_label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`EC$ ${(value / 1000000).toFixed(2)}M`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Financial Indicators</CardTitle>
              <CardDescription>
                {selectedYear ? `Summary for ${selectedYear}` : 'Summary across all years'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Education Budget</span>
                <Badge variant="secondary">
                  EC$ {(filteredSummary.total_education_budget / 1000000).toFixed(1)}M
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total GDP</span>
                <Badge variant="secondary">
                  EC$ {(filteredSummary.total_gdp / 1000000).toFixed(1)}M
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg % of National Budget</span>
                <Badge variant="secondary">
                  {filteredSummary.avg_education_pct_budget.toFixed(2)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg % of GDP</span>
                <Badge variant="secondary">
                  {filteredSummary.avg_education_pct_gdp.toFixed(2)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Data Table</CardTitle>
          <CardDescription>Detailed year-by-year breakdown (click column headers to sort)</CardDescription>
        </CardHeader>
        <CardContent>
          <SortableTable
            data={displayData}
            columns={[
              {
                key: "year",
                header: "Year",
                accessor: (row) => row.year_label,
                align: "left",
                render: (value) => <span className="font-medium">{value}</span>
              },
              {
                key: "national_budget",
                header: "National Budget (M)",
                accessor: (row) => row.national_budget_total || 0,
                align: "right",
                render: (value) => value ? `$${(value / 1000000).toFixed(2)}` : '-'
              },
              {
                key: "education_budget",
                header: "Education Budget (M)",
                accessor: (row) => row.education_budget_total || 0,
                align: "right",
                render: (value) => value ? `$${(value / 1000000).toFixed(2)}` : '-'
              },
              {
                key: "gdp",
                header: "GDP (M)",
                accessor: (row) => row.gdp || 0,
                align: "right",
                render: (value) => value ? `$${(value / 1000000).toFixed(2)}` : '-'
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
        </>
      )}

      {/* Country Comparison View */}
      {showComparison && (
        <CountryComparison
          countries={financialData.countries}
          data={yearFilteredData.byYear}
          dataKey="country_code"
          metrics={[
            {
              key: "national_budget_total",
              label: "National Budget",
              format: (v) => v ? `$${(v / 1000000).toFixed(2)}M` : "-"
            },
            {
              key: "education_budget_total",
              label: "Education Budget",
              format: (v) => v ? `$${(v / 1000000).toFixed(2)}M` : "-"
            },
            {
              key: "gdp",
              label: "GDP",
              format: (v) => v ? `$${(v / 1000000).toFixed(2)}M` : "-"
            },
            {
              key: "education_pct_national_budget",
              label: "% of National Budget",
              format: (v) => v ? `${v.toFixed(2)}%` : "-"
            },
            {
              key: "education_pct_gdp",
              label: "% of GDP",
              format: (v) => v ? `${v.toFixed(2)}%` : "-"
            }
          ]}
          title="Financial Data Comparison"
          description="Compare financial metrics across OECS countries"
        />
      )}
    </div>
  )
}
