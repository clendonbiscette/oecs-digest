import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ArrowLeft, Calendar, LineChart } from "lucide-react"
import Link from "next/link"

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Trends & Insights</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Historical trends and predictive analytics for education
            </p>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 rounded-full inline-block mb-6">
            <TrendingUp className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Time Series Analysis Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track historical trends, identify patterns, and predict future developments in OECS education.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-orange-500 p-3 rounded-lg w-fit">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Historical Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyze long-term trends in enrollment, performance, and infrastructure development.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-red-500 p-3 rounded-lg w-fit">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Seasonal Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Identify seasonal variations and cyclical patterns in education data.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-yellow-500 p-3 rounded-lg w-fit">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Predictive Models</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Forecast future trends and outcomes using advanced predictive modeling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 