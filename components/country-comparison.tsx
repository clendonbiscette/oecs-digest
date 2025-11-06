"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, BarChart3, TrendingUp, Download } from "lucide-react"
import { CustomBarChart } from "./charts/bar-chart"

interface Country {
  country_code: string
  country_name: string
}

interface CountryComparisonProps {
  countries: Country[]
  data: any[]
  dataKey: string // e.g., "country_code"
  metrics: {
    key: string
    label: string
    format?: (value: any) => string
  }[]
  title?: string
  description?: string
}

export function CountryComparison({
  countries,
  data,
  dataKey,
  metrics,
  title = "Country Comparison",
  description = "Compare data across selected countries"
}: CountryComparisonProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  // Toggle country selection
  const toggleCountry = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(c => c !== countryCode))
    } else {
      if (selectedCountries.length < 5) {
        setSelectedCountries([...selectedCountries, countryCode])
      }
    }
  }

  // Filter data for selected countries
  const comparisonData = data.filter((item: any) =>
    selectedCountries.includes(item[dataKey])
  )

  // Prepare chart data
  const chartData = metrics.map(metric => ({
    name: metric.label,
    ...selectedCountries.reduce((acc, countryCode) => {
      const countryData = data.find((item: any) => item[dataKey] === countryCode)
      const country = countries.find(c => c.country_code === countryCode)
      if (countryData && country) {
        acc[country.country_name] = countryData[metric.key] || 0
      }
      return acc
    }, {} as Record<string, number>)
  }))

  // Export comparison data as CSV
  const exportCSV = () => {
    if (comparisonData.length === 0) return

    // Build CSV header
    const header = ["Country", ...metrics.map(m => m.label)].join(",")

    // Build CSV rows
    const rows = comparisonData.map((item: any) => {
      const country = countries.find(c => c.country_code === item[dataKey])
      const values = metrics.map(m => {
        const value = item[m.key]
        return m.format ? m.format(value) : (value || 0)
      })
      return [country?.country_name, ...values].join(",")
    })

    const csv = [header, ...rows].join("\\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `country-comparison-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Country Selector */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description} (select 2-5 countries)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Countries */}
            {selectedCountries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map(code => {
                  const country = countries.find(c => c.country_code === code)
                  return (
                    <Badge key={code} variant="secondary" className="flex items-center gap-1">
                      {country?.country_name}
                      <button
                        onClick={() => toggleCountry(code)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCountries([])}
                  className="h-6"
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Country List */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {countries.map(country => {
                const isSelected = selectedCountries.includes(country.country_code)
                const isDisabled = !isSelected && selectedCountries.length >= 5

                return (
                  <div
                    key={country.country_code}
                    className={`flex items-center space-x-2 p-2 rounded-md border ${
                      isSelected ? "bg-primary/10 border-primary" : "border-border"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-muted"}`}
                    onClick={() => !isDisabled && toggleCountry(country.country_code)}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={isDisabled}
                      onCheckedChange={() => !isDisabled && toggleCountry(country.country_code)}
                    />
                    <label className="text-sm cursor-pointer">
                      {country.country_name}
                    </label>
                  </div>
                )
              })}
            </div>

            {selectedCountries.length >= 5 && (
              <Alert>
                <AlertDescription>
                  Maximum of 5 countries can be compared at once. Deselect a country to add another.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {selectedCountries.length >= 2 && (
        <>
          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Comparison Table</CardTitle>
                  <CardDescription>Side-by-side data comparison</CardDescription>
                </div>
                <Button onClick={exportCSV} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Metric</th>
                      {selectedCountries.map(code => {
                        const country = countries.find(c => c.country_code === code)
                        return (
                          <th key={code} className="text-right p-2 font-medium">
                            {country?.country_name}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map(metric => {
                      const values = selectedCountries.map(code => {
                        const countryData = data.find((item: any) => item[dataKey] === code)
                        return countryData?.[metric.key] || 0
                      })
                      const max = Math.max(...values)

                      return (
                        <tr key={metric.key} className="border-b hover:bg-muted/50">
                          <td className="p-2">{metric.label}</td>
                          {selectedCountries.map((code, idx) => {
                            const countryData = data.find((item: any) => item[dataKey] === code)
                            const value = countryData?.[metric.key]
                            const formatted = metric.format ? metric.format(value) : value
                            const isMax = value === max && max > 0

                            return (
                              <td
                                key={code}
                                className={`text-right p-2 ${isMax ? "font-bold text-primary" : ""}`}
                              >
                                {formatted || "-"}
                                {isMax && max > 0 && (
                                  <TrendingUp className="inline h-3 w-3 ml-1" />
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Comparison</CardTitle>
              <CardDescription>Bar chart showing metric differences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <CustomBarChart
                  data={chartData}
                  xKey="name"
                  yKeys={selectedCountries.map(code =>
                    countries.find(c => c.country_code === code)?.country_name || code
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedCountries.length === 1 && (
        <Alert>
          <BarChart3 className="h-4 w-4" />
          <AlertDescription>
            Select at least one more country to start comparing
          </AlertDescription>
        </Alert>
      )}

      {selectedCountries.length === 0 && (
        <Alert>
          <BarChart3 className="h-4 w-4" />
          <AlertDescription>
            Select 2-5 countries from the list above to begin comparison
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
