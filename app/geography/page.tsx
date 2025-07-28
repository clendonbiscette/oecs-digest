import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, ArrowLeft, Globe, Navigation } from "lucide-react"
import Link from "next/link"

export default function GeographyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Geographic Analysis</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Spatial distribution and mapping of educational facilities
            </p>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 rounded-full inline-block mb-6">
            <MapPin className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Spatial Analysis Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore the geographic distribution of educational institutions and analyze spatial patterns across the OECS region.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-red-500 p-3 rounded-lg w-fit">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Interactive Maps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Interactive maps showing the distribution of schools and educational facilities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-pink-500 p-3 rounded-lg w-fit">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Spatial Clustering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyze clustering patterns and accessibility of educational institutions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-purple-500 p-3 rounded-lg w-fit">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Location Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyze proximity, accessibility, and coverage of educational services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 