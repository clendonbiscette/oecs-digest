import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, ArrowLeft, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ComparisonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Regional Comparisons</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Compare educational metrics across OECS member states
            </p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 rounded-full inline-block mb-6">
            <Globe className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Cross-Country Comparisons Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Compare educational performance, infrastructure, and policies across all OECS member states. 
            This section will provide side-by-side analysis and benchmarking tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-purple-500 p-3 rounded-lg w-fit">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare student performance, graduation rates, and academic achievements across countries.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-pink-500 p-3 rounded-lg w-fit">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Infrastructure Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare educational infrastructure, facilities, and resource allocation across member states.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-indigo-500 p-3 rounded-lg w-fit">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Policy Benchmarking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Benchmark educational policies and best practices across the OECS region.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 