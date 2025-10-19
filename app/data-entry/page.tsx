"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, getUserProfile, getActiveAcademicYear } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  FileText,
  DollarSign,
  Map,
  LogOut,
  UserCircle
} from "lucide-react"

interface Worksheet {
  id: string
  title: string
  description: string
  icon: any
  status: 'not_started' | 'in_progress' | 'completed'
  path: string
}

export default function DataEntryPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [academicYear, setAcademicYear] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const worksheets: Worksheet[] = [
    {
      id: 'institutions',
      title: 'Institutions',
      description: 'Educational institutions by type and ownership',
      icon: Building2,
      status: 'not_started',
      path: '/data-entry/institutions'
    },
    {
      id: 'enrollment',
      title: 'Student Enrolment',
      description: 'Student enrollment across all education levels',
      icon: GraduationCap,
      status: 'not_started',
      path: '/data-entry/enrollment'
    },
    {
      id: 'staff_qualifications',
      title: 'Leaders/Teachers/Qualifications',
      description: 'Staff qualifications and professional development',
      icon: Users,
      status: 'not_started',
      path: '/data-entry/staff-qualifications'
    },
    {
      id: 'staff_demographics',
      title: 'Age & Years of Service',
      description: 'Staff demographics and experience',
      icon: UserCircle,
      status: 'not_started',
      path: '/data-entry/staff-demographics'
    },
    {
      id: 'internal_efficiency',
      title: 'Internal Efficiency',
      description: 'Repeaters, dropouts, and efficiency metrics',
      icon: TrendingUp,
      status: 'not_started',
      path: '/data-entry/internal-efficiency'
    },
    {
      id: 'systems_output',
      title: 'Systems Output',
      description: 'CCSLC, CSEC, and CAPE examination results',
      icon: FileText,
      status: 'not_started',
      path: '/data-entry/systems-output'
    },
    {
      id: 'financial',
      title: 'Financial',
      description: 'Education budget and expenditure',
      icon: DollarSign,
      status: 'not_started',
      path: '/data-entry/financial'
    },
    {
      id: 'population',
      title: 'Population',
      description: 'Population data for rate calculations',
      icon: Map,
      status: 'not_started',
      path: '/data-entry/population'
    }
  ]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      const userProfile = await getUserProfile(user.id)
      setProfile(userProfile)

      const activeYear = await getActiveAcademicYear()
      setAcademicYear(activeYear)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in_progress':
        return 'In Progress'
      default:
        return 'Not Started'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#DCE8D5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DA11D] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#DCE8D5]">
      {/* Header */}
      <div className="bg-[#4DA11D] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">OECS Education Data Entry</h1>
            <p className="text-sm opacity-90">
              {profile?.countries?.country_name} | {academicYear?.year_label || 'Academic Year'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{profile?.full_name}</p>
              <p className="text-xs opacity-90">{profile?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-black">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Data Collection Worksheets</h2>
          <p className="text-muted-foreground">
            Select a worksheet below to enter or update your education data for {academicYear?.year_label}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worksheets.map((worksheet) => {
            const Icon = worksheet.icon
            return (
              <Card
                key={worksheet.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(worksheet.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#4DA11D] bg-opacity-10 rounded-lg">
                        <Icon className="h-6 w-6 text-[#4DA11D]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{worksheet.title}</CardTitle>
                      </div>
                    </div>
                    <Badge className={getStatusColor(worksheet.status)}>
                      {getStatusLabel(worksheet.status)}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">
                    {worksheet.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    {worksheet.status === 'completed' ? 'View/Edit' : worksheet.status === 'in_progress' ? 'Continue' : 'Start'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Help Section */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>Save Progress:</strong> Your data is automatically saved as you type.
            </p>
            <p className="text-sm">
              <strong>Submit Data:</strong> Once all worksheets are complete, you can submit your data for review.
            </p>
            <p className="text-sm">
              <strong>Technical Support:</strong> Contact your OECS coordinator for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
