"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomBarChart } from "@/components/charts/bar-chart"
import { CustomPieChart } from "@/components/charts/pie-chart"
import { StackedBarChart } from "@/components/charts/stacked-bar-chart"
import { AIChat } from "@/components/ai-chat"
import { VisualizationControls } from "@/components/visualization-controls"

interface DashboardContentProps {
  educationData: any
}

export function DashboardContent({ educationData }: DashboardContentProps) {
  const [currentVisualization, setCurrentVisualization] = useState({
    type: "bar",
    config: { metric: "all_levels", comparison: "by_country" },
  })

  const handleVisualizationChange = (type: string, config: any) => {
    setCurrentVisualization({ type, config })
  }

  // Prepare data for different visualizations
  const prepareChartData = () => {
    const { type, config } = currentVisualization

    switch (config.metric) {
      case "all_levels":
        return educationData.summary.map((country: any) => ({
          country: country.country_name,
          "Early Childhood": country.total_daycare_centres + country.total_preschools,
          Primary: country.total_primary_schools,
          Secondary: country.total_secondary_schools,
          "Post-Secondary": country.total_post_secondary,
          "Special Ed": country.total_special_ed_schools,
          TVET: country.total_tvet_institutions,
        }))

      case "early_childhood":
        return educationData.earlyChildhood.map((country: any) => ({
          country: country.country_name || country.country_code,
          "Daycare Public": country.daycare_public,
          "Daycare Private Church": country.daycare_private_church,
          "Daycare Private Non-Affiliated": country.daycare_private_non_affiliated,
          "Preschool Public": country.preschool_public,
          "Preschool Private Church": country.preschool_private_church,
          "Preschool Private Non-Affiliated": country.preschool_private_non_affiliated,
        }))

      case "public_private":
        return educationData.institutions.map((country: any) => ({
          country: country.country_name || country.country_code,
          Public: country.primary_public + country.secondary_public + country.special_ed_public + country.tvet_public,
          "Private Church":
            country.primary_private_church +
            country.secondary_private_church +
            country.special_ed_private_church +
            country.tvet_private_church,
          "Private Non-Affiliated":
            country.primary_private_non_affiliated +
            country.secondary_private_non_affiliated +
            country.special_ed_private_non_affiliated +
            country.tvet_private_non_affiliated,
        }))

      default:
        return educationData.summary.map((country: any) => ({
          country: country.country_name,
          total:
            country.total_daycare_centres +
            country.total_preschools +
            country.total_primary_schools +
            country.total_secondary_schools +
            country.total_special_ed_schools +
            country.total_tvet_institutions +
            country.total_post_secondary,
        }))
    }
  }

  const chartData = prepareChartData()

  const renderVisualization = () => {
    const { type, config } = currentVisualization

    switch (type) {
      case "pie":
        const pieData = chartData
          .map((item) => ({
            name: item.country,
            value: Object.values(item)
              .slice(1)
              .reduce((a: any, b: any) => a + b, 0),
          }))
          .filter((item) => item.value > 0)

        return (
          <CustomPieChart
            data={pieData}
            dataKey="value"
            nameKey="name"
            title="Distribution of Educational Institutions by Country"
          />
        )

      case "stacked":
        const stackKeys = Object.keys(chartData[0] || {}).filter((key) => key !== "country")
        return (
          <StackedBarChart
            data={chartData}
            xKey="country"
            stackKeys={stackKeys}
            title="Educational Institutions by Type and Country"
          />
        )

      default:
        const yKeys = Object.keys(chartData[0] || {}).filter((key) => key !== "country")
        return (
          <CustomBarChart
            data={chartData}
            xKey="country"
            yKeys={yKeys}
            title="Educational Institutions Across OECS Countries"
          />
        )
    }
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
        <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
        <TabsTrigger value="data">Raw Data</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Educational institutions across OECS member countries</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomBarChart
                data={educationData.summary.filter(
                  (country: any) => country.total_primary_schools > 0 || country.total_secondary_schools > 0,
                )}
                xKey="country_name"
                yKeys={["total_primary_schools", "total_secondary_schools", "total_post_secondary"]}
                title=""
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Institution Types</CardTitle>
              <CardDescription>Breakdown by education level across the region</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomPieChart
                data={[
                  {
                    name: "Primary Schools",
                    value: educationData.summary.reduce(
                      (sum: number, country: any) => sum + country.total_primary_schools,
                      0,
                    ),
                  },
                  {
                    name: "Secondary Schools",
                    value: educationData.summary.reduce(
                      (sum: number, country: any) => sum + country.total_secondary_schools,
                      0,
                    ),
                  },
                  {
                    name: "Early Childhood",
                    value: educationData.summary.reduce(
                      (sum: number, country: any) => sum + country.total_daycare_centres + country.total_preschools,
                      0,
                    ),
                  },
                  {
                    name: "Post-Secondary",
                    value: educationData.summary.reduce(
                      (sum: number, country: any) => sum + country.total_post_secondary,
                      0,
                    ),
                  },
                  {
                    name: "TVET",
                    value: educationData.summary.reduce(
                      (sum: number, country: any) => sum + country.total_tvet_institutions,
                      0,
                    ),
                  },
                  {
                    name: "Special Education",
                    value: educationData.summary.reduce(
                      (sum: number, country: any) => sum + country.total_special_ed_schools,
                      0,
                    ),
                  },
                ].filter((item) => item.value > 0)}
                dataKey="value"
                nameKey="name"
                title=""
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Country Comparison</CardTitle>
            <CardDescription>Comprehensive view of educational infrastructure by country</CardDescription>
          </CardHeader>
          <CardContent>
            <StackedBarChart
              data={educationData.summary.filter(
                (country: any) => country.total_primary_schools > 0 || country.total_secondary_schools > 0,
              )}
              xKey="country_name"
              stackKeys={[
                "total_daycare_centres",
                "total_preschools",
                "total_primary_schools",
                "total_secondary_schools",
                "total_post_secondary",
              ]}
              title=""
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="visualizations" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <VisualizationControls onVisualizationChange={handleVisualizationChange} />
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Custom Visualization</CardTitle>
                <CardDescription>Use the controls to create different views of the education data</CardDescription>
              </CardHeader>
              <CardContent>{renderVisualization()}</CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="analysis" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2 h-full">
            <AIChat educationData={educationData} />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sample Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-muted rounded-lg text-sm">
                  "Which countries have the highest concentration of private schools?"
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  "What are the trends in early childhood education across the region?"
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  "How does post-secondary education availability compare between countries?"
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  "What insights can you provide about TVET institutions in the OECS?"
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Grenada and Saint Lucia have the most comprehensive educational infrastructure</p>
                <p>• Early childhood education varies significantly across countries</p>
                <p>• Private institutions play a significant role in several countries</p>
                <p>• TVET availability is limited across the region</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="data" className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Education Summary by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Country</th>
                      <th className="text-right p-2">Daycare</th>
                      <th className="text-right p-2">Preschool</th>
                      <th className="text-right p-2">Primary</th>
                      <th className="text-right p-2">Secondary</th>
                      <th className="text-right p-2">Special Ed</th>
                      <th className="text-right p-2">TVET</th>
                      <th className="text-right p-2">Post-Secondary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationData.summary.map((country: any) => (
                      <tr key={country.country_code} className="border-b">
                        <td className="p-2 font-medium">{country.country_name}</td>
                        <td className="text-right p-2">{country.total_daycare_centres}</td>
                        <td className="text-right p-2">{country.total_preschools}</td>
                        <td className="text-right p-2">{country.total_primary_schools}</td>
                        <td className="text-right p-2">{country.total_secondary_schools}</td>
                        <td className="text-right p-2">{country.total_special_ed_schools}</td>
                        <td className="text-right p-2">{country.total_tvet_institutions}</td>
                        <td className="text-right p-2">{country.total_post_secondary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
