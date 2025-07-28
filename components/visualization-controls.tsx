"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, PieChart, TrendingUp, Map } from "lucide-react"

interface VisualizationControlsProps {
  onVisualizationChange: (type: string, config: any) => void
}

export function VisualizationControls({ onVisualizationChange }: VisualizationControlsProps) {
  const [selectedType, setSelectedType] = useState<string>("bar")
  const [selectedMetric, setSelectedMetric] = useState<string>("all_levels")
  const [selectedComparison, setSelectedComparison] = useState<string>("by_country")

  const visualizationTypes = [
    { value: "bar", label: "Bar Chart", icon: BarChart3 },
    { value: "pie", label: "Pie Chart", icon: PieChart },
    { value: "stacked", label: "Stacked Bar", icon: TrendingUp },
    { value: "comparison", label: "Country Comparison", icon: Map },
  ]

  const metrics = [
    { value: "all_levels", label: "All Education Levels" },
    { value: "early_childhood", label: "Early Childhood" },
    { value: "primary_secondary", label: "Primary & Secondary" },
    { value: "post_secondary", label: "Post-Secondary" },
    { value: "public_private", label: "Public vs Private" },
  ]

  const comparisons = [
    { value: "by_country", label: "By Country" },
    { value: "by_type", label: "By Institution Type" },
    { value: "regional_total", label: "Regional Totals" },
  ]

  const handleApplyVisualization = () => {
    onVisualizationChange(selectedType, {
      metric: selectedMetric,
      comparison: selectedComparison,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualization Controls</CardTitle>
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
            <Badge variant="secondary">9 OECS Countries</Badge>
            <Badge variant="secondary">Multiple Education Levels</Badge>
            <Badge variant="secondary">Public/Private Split</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
