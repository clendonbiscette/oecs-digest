"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomLineChart } from "@/components/charts/line-chart"
import { CustomBarChart } from "@/components/charts/bar-chart"
import { TrendingUp, TrendingDown, Download, DollarSign, PieChart as PieChartIcon } from "lucide-react"
import type { FinancialTrendData } from "@/lib/supabase-data-service"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

interface FinancialContentProps {
  financialData: FinancialTrendData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export function FinancialContent({ financialData }: FinancialContentProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL")
  const [selectedMetric, setSelectedMetric] = useState<string>("education_budget")

  // Prepare data based on selected country
  const displayData = useMemo(() => {
    if (selectedCountry === "ALL") {
      // Aggregate by year across all countries
      const aggregated = new Map<string, any>()

      financialData.byYear.forEach(point => {
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
      return financialData.byCountry[selectedCountry] || []
    }
  }, [selectedCountry, financialData])

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
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
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
      </div>

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
            <div className="text-2xl font-bold">{financialData.years.length}</div>
            <p className="text-xs text-muted-foreground">
              {financialData.years[0]} to {financialData.years[financialData.years.length - 1]}
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
              <CardDescription>Summary statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Education Budget</span>
                <Badge variant="secondary">
                  EC$ {(financialData.summary.total_education_budget / 1000000).toFixed(1)}M
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total GDP</span>
                <Badge variant="secondary">
                  EC$ {(financialData.summary.total_gdp / 1000000).toFixed(1)}M
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg % of National Budget</span>
                <Badge variant="secondary">
                  {financialData.summary.avg_education_pct_budget.toFixed(2)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg % of GDP</span>
                <Badge variant="secondary">
                  {financialData.summary.avg_education_pct_gdp.toFixed(2)}%
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
          <CardDescription>Detailed year-by-year breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Year</th>
                  <th className="text-right p-2">National Budget (M)</th>
                  <th className="text-right p-2">Education Budget (M)</th>
                  <th className="text-right p-2">GDP (M)</th>
                  <th className="text-right p-2">% of Budget</th>
                  <th className="text-right p-2">% of GDP</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{row.year_label}</td>
                    <td className="text-right p-2">
                      {row.national_budget_total ? `$${(row.national_budget_total / 1000000).toFixed(2)}` : '-'}
                    </td>
                    <td className="text-right p-2">
                      {row.education_budget_total ? `$${(row.education_budget_total / 1000000).toFixed(2)}` : '-'}
                    </td>
                    <td className="text-right p-2">
                      {row.gdp ? `$${(row.gdp / 1000000).toFixed(2)}` : '-'}
                    </td>
                    <td className="text-right p-2">
                      {row.education_pct_national_budget ? `${row.education_pct_national_budget.toFixed(2)}%` : '-'}
                    </td>
                    <td className="text-right p-2">
                      {row.education_pct_gdp ? `${row.education_pct_gdp.toFixed(2)}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
