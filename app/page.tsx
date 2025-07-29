"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Building2, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  MapPin,
  Database,
  FileText,
  Settings,
  Globe
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const navigationCards = [
    {
      title: "Education Dashboard",
      description: "Comprehensive analysis of educational institutions across the OECS",
      icon: <BookOpen className="h-8 w-8" />,
      href: "/dashboard",
      color: "bg-blue-500",
      stats: "9 Countries"
    },
    {
      title: "Data Analytics",
      description: "Advanced analytics and statistical tools for education data",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "/analytics",
      color: "bg-green-500",
      stats: "Interactive Charts"
    },
    {
      title: "Regional Comparisons",
      description: "Compare educational metrics across OECS member states",
      icon: <Globe className="h-8 w-8" />,
      href: "/comparisons",
      color: "bg-purple-500",
      stats: "Cross-Country"
    },
    {
      title: "Trends & Insights",
      description: "Historical trends and predictive analytics for education",
      icon: <TrendingUp className="h-8 w-8" />,
      href: "/trends",
      color: "bg-orange-500",
      stats: "Time Series"
    },
    {
      title: "Geographic Analysis",
      description: "Spatial distribution and mapping of educational facilities",
      icon: <MapPin className="h-8 w-8" />,
      href: "/geography",
      color: "bg-red-500",
      stats: "Spatial Data"
    },
    {
      title: "Data Export",
      description: "Export education data in various formats for further analysis",
      icon: <FileText className="h-8 w-8" />,
      href: "/export",
      color: "bg-indigo-500",
      stats: "Multiple Formats"
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#DCE8D5' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <img src="/favlogo.png" alt="OECS Logo" className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            OECS Interactive Statistical Digest
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            Comprehensive education data platform for the Organisation of Eastern Caribbean States. 
            Access, analyze, and visualize educational statistics across member countries.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              <Users className="h-4 w-4 mr-1" />
              9 Member States
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Building2 className="h-4 w-4 mr-1" />
              Real-time Data
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              Interactive Analytics
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Institutions</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">Across OECS</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Enrolled</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89,432</div>
              <p className="text-xs text-muted-foreground">Active Students</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,689</div>
              <p className="text-xs text-muted-foreground">Metrics Tracked</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">Real-time Updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card, index) => (
            <Link href={card.href} key={index}>
              <Card className="group hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 cursor-pointer transform hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className={`p-3 rounded-lg ${card.color} text-white`}>
                    {card.icon}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {card.stats}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by the Organisation of Eastern Caribbean States • 
            Data updated in real-time • 
            <span className="text-blue-600 dark:text-blue-400"> Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
