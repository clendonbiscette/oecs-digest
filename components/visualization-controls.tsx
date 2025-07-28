"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, PieChart, TrendingUp, Map, Users, GraduationCap, Baby, School } from "lucide-react"

interface VisualizationControlsProps {
  onVisualizationChange: (type: string, config: any) => void
  dataType?: "institutional" | "enrollment"
}

export function VisualizationControls({ onVisualizationChange, dataType = "institutional" }: VisualizationControlsProps) {
  const [selectedType, setSelectedType] = useState<string>("bar")
  const [selectedMetric, setSelectedMetric] = useState<string>("all_levels")
  const [selectedComparison, setSelectedComparison] = useState<string>("by_country")

  const visualizationTypes = [
    { value: "bar", label: "Bar Chart", icon: BarChart3 },
    { value: "pie", label: "Pie Chart", icon: PieChart },
    { value: "stacked", label: "Stacked Bar", icon: TrendingUp },
    { value: "comparison", label: "Country Comparison", icon: Map },
    { value: "area", label: "Area Chart", icon: TrendingUp },
    { value: "line", label: "Line Chart", icon: TrendingUp },
  ]

  const institutionalMetrics = [
    { value: "all_levels", label: "All Education Levels" },
    { value: "early_childhood", label: "Early Childhood" },
    { value: "primary_secondary", label: "Primary & Secondary" },
    { value: "post_secondary", label: "Post-Secondary" },
    { value: "public_private", label: "Public vs Private" },
    { value: "special_education", label: "Special Education" },
    { value: "tvet", label: "TVET Institutions" },
  ]

  const enrollmentMetrics = [
    { value: "total_enrollment", label: "Total Enrollment" },
    { value: "gender_breakdown", label: "Gender Breakdown" },
    { value: "age_distribution", label: "Age Distribution" },
    { value: "education_levels", label: "Education Levels" },
    { value: "early_childhood_enrollment", label: "Early Childhood" },
    { value: "primary_enrollment", label: "Primary Education" },
    { value: "secondary_enrollment", label: "Secondary Education" },
    { value: "special_education_enrollment", label: "Special Education" },
    { value: "gender_parity", label: "Gender Parity Index" },
    { value: "over_under_age", label: "Over/Under Age Analysis" },
  ]

  const institutionalComparisons = [
    { value: "by_country", label: "By Country" },
    { value: "by_type", label: "By Institution Type" },
    { value: "regional_total", label: "Regional Totals" },
    { value: "public_private_split", label: "Public vs Private" },
  ]

  const enrollmentComparisons = [
    { value: "by_country", label: "By Country" },
    { value: "by_gender", label: "By Gender" },
    { value: "by_age_group", label: "By Age Group" },
    { value: "by_education_level", label: "By Education Level" },
    { value: "by_grade", label: "By Grade/Form" },
    { value: "trends", label: "Historical Trends" },
    { value: "gender_parity", label: "Gender Parity" },
  ]

  const metrics = dataType === "enrollment" ? enrollmentMetrics : institutionalMetrics
  const comparisons = dataType === "enrollment" ? enrollmentComparisons : institutionalComparisons

  const handleApplyVisualization = () => {
    onVisualizationChange(selectedType, {
      metric: selectedMetric,
      comparison: selectedComparison,
      dataType: dataType,
    })
  }

  const getQuickInsights = () => {
    if (dataType === "enrollment") {
      return [
        "Student Enrollment Data",
        "Gender Disaggregated",
        "Age Distribution",
        "Historical Trends",
        "Gender Parity Analysis",
        "Grade-Level Breakdown"
      ]
    }
    return [
      "9 OECS Countries",
      "Multiple Education Levels",
      "Public/Private Split",
      "Institutional Data"
    ]
  }

  const getDataTypeIcon = () => {
    if (dataType === "enrollment") {
      return <Users className="h-4 w-4" />
    }
    return <School className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getDataTypeIcon()}
          {dataType === "enrollment" ? "Enrollment" : "Institutional"} Visualization Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Chart Type</label>
          <div className="grid grid-cols-2 gap-2">
            {visualizationTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Metric</label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Comparison</label>
          <Select value={selectedComparison} onValueChange={setSelectedComparison}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {comparisons.map((comparison) => (
                <SelectItem key={comparison.value} value={comparison.value}>
                  {comparison.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleApplyVisualization} className="w-full">
          Apply Visualization
        </Button>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Quick Insights</h4>
          <div className="flex flex-wrap gap-2">
            {getQuickInsights().map((insight, index) => (
              <Badge key={index} variant="secondary">
                {insight}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
