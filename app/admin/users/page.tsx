"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, getUserProfile, getCountries } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeft, UserPlus, Edit, Trash2, Check, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface UserProfile {
  id: string
  email: string
  full_name: string
  country_id: number | null
  role: string
  is_active: boolean
  last_login: string | null
  created_at: string
  countries?: {
    country_name: string
    country_code: string
  }
}

export default function UserManagementPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  // Form states
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteFullName, setInviteFullName] = useState('')
  const [inviteCountryId, setInviteCountryId] = useState('')
  const [inviteRole, setInviteRole] = useState('statistician')
  const [invitePassword, setInvitePassword] = useState('')

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

      // Load countries
      const countriesData = await getCountries()
      setCountries(countriesData)

      // Load all users
      await loadUsers()

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, countries(country_name, country_code)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } else {
      setUsers(data || [])
    }
  }

  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteFullName || !invitePassword) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      // Create user in Supabase Auth using the admin API
      // Note: This requires Supabase service role key for production
      // For now, we'll use the client-side approach
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: inviteEmail,
        password: invitePassword,
        options: {
          data: {
            full_name: inviteFullName,
            role: inviteRole,
            country_id: inviteCountryId ? parseInt(inviteCountryId) : null
          }
        }
      })

      if (authError) throw authError

      // Update user profile with country assignment
      if (authData.user && inviteCountryId) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            country_id: parseInt(inviteCountryId),
            role: inviteRole
          })
          .eq('id', authData.user.id)

        if (profileError) {
          console.error('Error updating profile:', profileError)
        }
      }

      toast.success(`User invitation sent to ${inviteEmail}`)
      setIsInviteDialogOpen(false)

      // Reset form
      setInviteEmail('')
      setInviteFullName('')
      setInviteCountryId('')
      setInviteRole('statistician')
      setInvitePassword('')

      // Reload users
      await loadUsers()

    } catch (error: any) {
      console.error('Error inviting user:', error)
      toast.error(error.message || 'Failed to invite user')
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: selectedUser.full_name,
          country_id: selectedUser.country_id,
          role: selectedUser.role,
          is_active: selectedUser.is_active
        })
        .eq('id', selectedUser.id)

      if (error) throw error

      toast.success('User updated successfully')
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      await loadUsers()

    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Failed to update user')
    }
  }

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`)
      await loadUsers()

    } catch (error: any) {
      console.error('Error toggling user status:', error)
      toast.error(error.message || 'Failed to update user status')
    }
  }

  const getRoleBadge = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: 'bg-purple-100 text-purple-800',
      statistician: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800'
    }
    return <Badge className={colors[role] || ''}>{role.toUpperCase()}</Badge>
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/admin')} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">User Management</h1>
                <p className="text-sm opacity-90">Manage statisticians and data experts across OECS Member States</p>
              </div>
            </div>
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>Create a new account for a statistician or data expert</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={inviteFullName}
                      onChange={(e) => setInviteFullName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Temporary Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={invitePassword}
                      onChange={(e) => setInvitePassword(e.target.value)}
                      placeholder="Min. 6 characters"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Member State</Label>
                    <Select value={inviteCountryId} onValueChange={setInviteCountryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None (Admin only)</SelectItem>
                        {countries.map(country => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.country_name} ({country.country_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="statistician">Statistician (Data Entry)</SelectItem>
                        <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                        <SelectItem value="admin">Admin (Full Access)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleInviteUser}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
            <CardDescription>Manage user accounts, roles, and country assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Member State</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.countries ? (
                        <Badge variant="outline">{user.countries.country_name}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No assignment</span>
                      )}
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <X className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={user.is_active ? "destructive" : "default"}
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                        >
                          {user.is_active ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information and permissions</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit_full_name">Full Name</Label>
                  <Input
                    id="edit_full_name"
                    value={selectedUser.full_name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_country">Member State</Label>
                  <Select
                    value={selectedUser.country_id?.toString() || ''}
                    onValueChange={(val) => setSelectedUser({ ...selectedUser, country_id: val ? parseInt(val) : null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.country_name} ({country.country_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_role">Role</Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(val) => setSelectedUser({ ...selectedUser, role: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statistician">Statistician</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedUser(null)
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
