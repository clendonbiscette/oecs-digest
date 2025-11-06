"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomLineChart } from "@/components/charts/line-chart"
import { CustomBarChart } from "@/components/charts/bar-chart"
import { TrendingUp, TrendingDown, Download, Filter, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { InstitutionsTrendData, FinancialTrendData } from "@/lib/supabase-data-service"
import { SortableTable } from "@/components/ui/sortable-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, DollarSign } from "lucide-react"

interface TrendsContentProps {
  trendData: InstitutionsTrendData
  financialData: FinancialTrendData
}

export function TrendsContent({ trendData, financialData }: TrendsContentProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL")
  const [selectedMetric, setSelectedMetric] = useState<string>("total_institutions")
  const [trendType, setTrendType] = useState<"institutions" | "financial">("institutions")

  // Prepare data based on selected country
  const displayData = useMemo(() => {
    if (selectedCountry === "ALL") {
      // Aggregate by year across all countries
      const aggregated = new Map<string, any>()

      trendData.byYear.forEach(point => {
        const existing = aggregated.get(point.year_label) || {
          year_label: point.year_label,
          total_institutions: 0,
          early_childhood: 0,
          primary: 0,
          secondary: 0,
          special_ed: 0,
          tvet: 0,
          post_secondary: 0
        }

        existing.total_institutions += point.total_institutions
        existing.early_childhood += point.early_childhood
        existing.primary += point.primary
        existing.secondary += point.secondary
        existing.special_ed += point.special_ed
        existing.tvet += point.tvet
        existing.post_secondary += point.post_secondary

        aggregated.set(point.year_label, existing)
      })

      return Array.from(aggregated.values()).sort((a, b) => a.year_label.localeCompare(b.year_label))
    } else {
      // Return country-specific data
      return trendData.byCountry[selectedCountry] || []
    }
  }, [selectedCountry, trendData])

  // Calculate year-over-year change
  const yoyChange = useMemo(() => {
    if (displayData.length < 2) return null

    const latest = displayData[displayData.length - 1]
    const previous = displayData[displayData.length - 2]

    const change = latest.total_institutions - previous.total_institutions
    const percentChange = ((change / previous.total_institutions) * 100).toFixed(1)

    return {
      absolute: change,
      percent: percentChange,
      isPositive: change >= 0
    }
  }, [displayData])

  // Prepare chart data based on selected metric
  const chartData = useMemo(() => {
    if (selectedMetric === "total_institutions") {
      return displayData.map(d => ({
        year: d.year_label,
        institutions: d.total_institutions
      }))
    } else {
      // Show breakdown by institution type
      return displayData.map(d => ({
        year: d.year_label,
        "Early Childhood": d.early_childhood,
        "Primary": d.primary,
        "Secondary": d.secondary,
        "Special Ed": d.special_ed,
        "TVET": d.tvet,
        "Post-Secondary": d.post_secondary
      }))
    }
  }, [displayData, selectedMetric])

  // Prepare country comparison data (latest year)
  const countryComparisonData = useMemo(() => {
    if (!trendData.years.length) return []

    const latestYear = trendData.years[trendData.years.length - 1]
    const latestData = trendData.byYear.filter(d => d.year_label === latestYear)

    return latestData
      .map(d => ({
        country: d.country_code,
        institutions: d.total_institutions
      }))
      .sort((a, b) => b.institutions - a.institutions)
  }, [trendData])

  // Export function
  const handleExport = () => {
    const csv = [
      ["Year", "Country", "Total", "Early Childhood", "Primary", "Secondary", "Special Ed", "TVET", "Post-Secondary"].join(","),
      ...displayData.map(d => [
        d.year_label,
        selectedCountry === "ALL" ? "OECS Total" : d.country_name,
        d.total_institutions,
        d.early_childhood,
        d.primary,
        d.secondary,
        d.special_ed,
        d.tvet,
        d.post_secondary
      ].join(","))
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `institutions-trends-${selectedCountry}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (displayData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Historical Data Available</CardTitle>
          <CardDescription>
            Historical institutions data will appear here once imported. Run the setup and import scripts to load data from 2021-2024.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Data Timestamp Alert */}
      <Alert className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
          <AlertDescription className="text-sm">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <span className="font-semibold text-purple-900 dark:text-purple-100">Academic Years:</span>{" "}
                <span className="text-purple-700 dark:text-purple-300">{trendData.years[0]} - {trendData.years[trendData.years.length - 1]}</span>
              </div>
              <div>
                <span className="font-semibold text-purple-900 dark:text-purple-100">Data Source:</span>{" "}
                <span className="text-purple-700 dark:text-purple-300">OECS Historical Institutions Data</span>
              </div>
              <div>
                <span className="font-semibold text-purple-900 dark:text-purple-100">Years Available:</span>{" "}
                <span className="text-purple-700 dark:text-purple-300">{trendData.years.length} years</span>
              </div>
            </div>
          </AlertDescription>
        </div>
      </Alert>

      {/* Trend Type Selector */}
      <div className="flex gap-2">
        <Button
          variant={trendType === "institutions" ? "default" : "outline"}
          onClick={() => setTrendType("institutions")}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          Institutions
        </Button>
        <Button
          variant={trendType === "financial" ? "default" : "outline"}
          onClick={() => setTrendType("financial")}
          className="gap-2"
        >
          <DollarSign className="h-4 w-4" />
          Financial
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All OECS Countries</SelectItem>
              {trendData.countries.map(country => (
                <SelectItem key={country.country_code} value={country.country_code}>
                  {country.country_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total_institutions">Total Institutions</SelectItem>
              <SelectItem value="by_type">By Institution Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleExport} className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Total</CardTitle>
            {yoyChange && (
              yoyChange.isPositive ?
                <TrendingUp className="h-4 w-4 text-green-500" /> :
                <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayData[displayData.length - 1]?.total_institutions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {displayData[displayData.length - 1]?.year_label} Academic Year
            </p>
            {yoyChange && (
              <Badge
                variant={yoyChange.isPositive ? "default" : "destructive"}
                className="mt-2"
              >
                {yoyChange.isPositive ? "+" : ""}{yoyChange.absolute} ({yoyChange.isPositive ? "+" : ""}{yoyChange.percent}%)
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Years of Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trendData.years.length}</div>
            <p className="text-xs text-muted-foreground">
              {trendData.years[0]} to {trendData.years[trendData.years.length - 1]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trendData.countries.length}</div>
            <p className="text-xs text-muted-foreground">
              OECS Member States
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedMetric === "total_institutions"
              ? "Total Institutions Over Time"
              : "Institutions by Type Over Time"}
          </CardTitle>
          <CardDescription>
            {selectedCountry === "ALL"
              ? "Aggregated data across all OECS countries"
              : `Data for ${trendData.countries.find(c => c.country_code === selectedCountry)?.country_name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedMetric === "total_institutions" ? (
            <CustomLineChart
              data={chartData}
              xKey="year"
              yKeys={["institutions"]}
              colors={["#8884d8"]}
              height={400}
            />
          ) : (
            <CustomLineChart
              data={chartData}
              xKey="year"
              yKeys={["Early Childhood", "Primary", "Secondary", "Special Ed", "TVET", "Post-Secondary"]}
              colors={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c", "#d0ed57"]}
              height={400}
            />
          )}
        </CardContent>
      </Card>

      {/* Country Comparison (only show if ALL selected) */}
      {selectedCountry === "ALL" && (
        <Card>
          <CardHeader>
            <CardTitle>Country Comparison</CardTitle>
            <CardDescription>
              Total institutions by country ({trendData.years[trendData.years.length - 1]})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomBarChart
              data={countryComparisonData}
              xKey="country"
              yKeys={["institutions"]}
              colors={["#8884d8"]}
            />
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Data Table</CardTitle>
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
                key: "total",
                header: "Total",
                accessor: (row) => row.total_institutions,
                align: "right"
              },
              {
                key: "early_childhood",
                header: "Early Childhood",
                accessor: (row) => row.early_childhood,
                align: "right"
              },
              {
                key: "primary",
                header: "Primary",
                accessor: (row) => row.primary,
                align: "right"
              },
              {
                key: "secondary",
                header: "Secondary",
                accessor: (row) => row.secondary,
                align: "right"
              },
              {
                key: "special_ed",
                header: "Special Ed",
                accessor: (row) => row.special_ed,
                align: "right"
              },
              {
                key: "tvet",
                header: "TVET",
                accessor: (row) => row.tvet,
                align: "right"
              },
              {
                key: "post_secondary",
                header: "Post-Secondary",
                accessor: (row) => row.post_secondary,
                align: "right"
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
