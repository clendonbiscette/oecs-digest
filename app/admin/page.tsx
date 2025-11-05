"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, getUserProfile } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Users, Database, FileText, Settings, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    countries: 0,
    submissions: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const userProfile = await getUserProfile(user.id)

      // Check if user is admin
      if (userProfile?.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.')
        router.push('/data-entry')
        return
      }

      setProfile(userProfile)

      // Load statistics
      const [usersData, countriesData] = await Promise.all([
        supabase.from('user_profiles').select('id, is_active'),
        supabase.from('countries').select('id')
      ])

      setStats({
        totalUsers: usersData.data?.length || 0,
        activeUsers: usersData.data?.filter(u => u.is_active).length || 0,
        countries: countriesData.data?.length || 0,
        submissions: 0
      })

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load admin dashboard')
    } finally {
      setLoading(false)
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
      <div className="bg-[#4DA11D] text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">EDMU Admin Dashboard</h1>
              <p className="text-sm opacity-90">Education Development Management Unit - System Administration</p>
            </div>
            <Button variant="secondary" onClick={() => router.push('/data-entry')}>
              Go to Data Entry
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Welcome Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome, {profile?.full_name}</CardTitle>
            <CardDescription>
              Manage the OECS Education Statistical Digest data collection system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
                <div className="text-sm text-blue-600">Total Users</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{stats.activeUsers}</div>
                <div className="text-sm text-green-600">Active Users</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{stats.countries}</div>
                <div className="text-sm text-purple-600">Member States</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">8</div>
                <div className="text-sm text-orange-600">Data Entry Forms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/users')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage statisticians and data experts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create accounts, assign roles, and manage access for statisticians across all OECS Member States.
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Database className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <CardTitle>Data Overview</CardTitle>
                  <CardDescription>View all submitted data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access and review data submissions from all Member States. Coming soon.
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create Chapter files and Digest</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatically generate the 6 Chapter files and complete Statistical Digest. Coming soon.
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-700" />
                </div>
                <div>
                  <CardTitle>Analytics & Dashboards</CardTitle>
                  <CardDescription>Visualizations and insights</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Interactive dashboards with trends, comparisons, and regional aggregations. Coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
