"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, Pencil, Plus, UserCheck, UserX, ChevronDown, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Import all data and types from userdata.tsx
import {
  type User,
  companies,
  stores,
  permissionLabels,
  permissionCategories,
  roles,
  initialUsers,
  getCompanyName,
} from "./userdata"

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<User[]>(initialUsers)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [userSearch, setUserSearch] = React.useState("")
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState<string>("all")
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>("all")
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [editFormData, setEditFormData] = React.useState<User>({
    id: "",
    name: "",
    email: "",
    role: "",
    status: "active",
    lastLogin: "",
    companyAccess: [],
    storeAccess: [],
    permissions: {
      dashboard: false,
      aiChatbot: false,
      financialReports: false,
      managementReports: false,
      purchases: false,
      sales: false,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: false,
      payroll: false,
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  })

  // State for collapsible permission sections
  const [accountingExpanded, setAccountingExpanded] = React.useState(true)
  const [settingsExpanded, setSettingsExpanded] = React.useState(true)

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditFormData({ ...user })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    setUsers(prev => prev.map(user => 
      user.id === editFormData.id ? editFormData : user
    ))
    setIsEditDialogOpen(false)
    setSelectedUser(null)
  }

  const handleCreateUser = () => {
    const newUser: User = {
      ...editFormData,
      id: (users.length + 1).toString(),
      lastLogin: "Never",
    }
    setUsers(prev => [...prev, newUser])
    setIsCreateDialogOpen(false)
    setEditFormData({
      id: "",
      name: "",
      email: "",
      role: "",
      status: "active",
      lastLogin: "",
      companyAccess: [],
      storeAccess: [],
      permissions: {
        dashboard: false,
        aiChatbot: false,
        financialReports: false,
        managementReports: false,
        purchases: false,
        sales: false,
        contacts: false,
        chartOfAccounts: false,
        manualJournals: false,
        stockControl: false,
        payroll: false,
        storeManagement: false,
        xeroIntegration: false,
        franchiseSettings: false,
        userManagement: false,
      }
    })
  }

  const handlePermissionChange = (permission: keyof User['permissions'], checked: boolean) => {
    setEditFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }))
  }

  const handleCompanyAccessChange = (companyId: string, checked: boolean) => {
    setEditFormData(prev => {
      const newCompanyAccess = checked 
        ? [...prev.companyAccess, companyId]
        : prev.companyAccess.filter(id => id !== companyId)
      
      // Auto-select/deselect all stores in the company
      const company = companies.find(c => c.id === companyId)
      const newStoreAccess = checked
        ? [...new Set([...prev.storeAccess, ...company!.storeIds])]
        : prev.storeAccess.filter(storeId => !company!.storeIds.includes(storeId))
      
      return {
        ...prev,
        companyAccess: newCompanyAccess,
        storeAccess: newStoreAccess
      }
    })
  }

  const handleStoreAccessChange = (storeId: string, checked: boolean) => {
    setEditFormData(prev => {
      const newStoreAccess = checked 
        ? [...prev.storeAccess, storeId]
        : prev.storeAccess.filter(id => id !== storeId)
      
      // Check if we need to update company access
      const store = stores.find(s => s.id === storeId)
      const company = companies.find(c => c.id === store!.companyId)
      const allCompanyStoresSelected = company!.storeIds.every(id => 
        id === storeId ? checked : newStoreAccess.includes(id)
      )
      
      const newCompanyAccess = allCompanyStoresSelected
        ? [...new Set([...prev.companyAccess, company!.id])]
        : prev.companyAccess.filter(id => id !== company!.id)
      
      return {
        ...prev,
        storeAccess: newStoreAccess,
        companyAccess: newCompanyAccess
      }
    })
  }

  const handleStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" } 
        : user
    ))
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = selectedRoleFilter === "all" || user.role === selectedRoleFilter
    const matchesStatus = selectedStatusFilter === "all" || user.status === selectedStatusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  function stringToColor(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 50%)`
  }

  const getActivePermissionsCount = (permissions: User['permissions']) => {
    return Object.values(permissions).filter(Boolean).length
  }

  // Helper functions for category permissions
  const isAccountingCategorySelected = (permissions: User['permissions']) => {
    return permissionCategories.accounting.items.every(item => 
      permissions[item.key as keyof User['permissions']]
    )
  }

  const isSettingsCategorySelected = (permissions: User['permissions']) => {
    return permissionCategories.settings.items.every(item => 
      permissions[item.key as keyof User['permissions']]
    )
  }

  const handleAccountingCategoryChange = (checked: boolean) => {
    setEditFormData(prev => {
      const newPermissions = { ...prev.permissions }
      permissionCategories.accounting.items.forEach(item => {
        newPermissions[item.key as keyof User['permissions']] = checked
      })
      return { ...prev, permissions: newPermissions }
    })
  }

  const handleSettingsCategoryChange = (checked: boolean) => {
    setEditFormData(prev => {
      const newPermissions = { ...prev.permissions }
      permissionCategories.settings.items.forEach(item => {
        newPermissions[item.key as keyof User['permissions']] = checked
      })
      return { ...prev, permissions: newPermissions }
    })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user and configure their access permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@franchise.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={editFormData.role} onValueChange={(value) => setEditFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={editFormData.status} onValueChange={(value: "active" | "inactive") => setEditFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Access Permissions</Label>
                <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto border rounded-lg p-4">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={editFormData.permissions[key as keyof User['permissions']]}
                        onCheckedChange={(checked) => handlePermissionChange(key as keyof User['permissions'], checked as boolean)}
                      />
                      <Label htmlFor={key} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Company Access</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`company-${company.id}`}
                          checked={editFormData.companyAccess.includes(company.id)}
                          onCheckedChange={(checked) => handleCompanyAccessChange(company.id, checked as boolean)}
                        />
                        <Label htmlFor={`company-${company.id}`} className="text-sm font-medium">
                          {company.name}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          ({company.storeIds.length} stores)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Individual Store Access</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                    {companies.map((company) => (
                      <div key={company.id} className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground">
                          {company.name}
                        </Label>
                        {company.storeIds.map((storeId) => {
                          const store = stores.find(s => s.id === storeId)
                          return (
                            <div key={storeId} className="flex items-center space-x-2 ml-4">
                              <Checkbox
                                id={`store-${storeId}`}
                                checked={editFormData.storeAccess.includes(storeId)}
                                onCheckedChange={(checked) => handleStoreAccessChange(storeId, checked as boolean)}
                              />
                              <Label htmlFor={`store-${storeId}`} className="text-sm">
                                {store?.name}, {store?.location}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-8"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-filter">Role</Label>
                    <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Users table */}
          <div className="overflow-x-auto">
            <div className="flex items-center px-2 py-3 border-b bg-muted text-sm font-semibold min-w-max">
              <span className="w-64 sticky left-0 bg-muted">User</span>
              <span className="w-48">Role</span>
              <span className="w-32">Status</span>
              <span className="w-40">Last Login</span>
              <span className="w-32">Permissions</span>
              <span className="w-48">Company Access</span>
              <span className="w-48">Store Access</span>
              <span className="w-32">Actions</span>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="min-w-max">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center px-2 py-4 border-b hover:bg-accent transition-colors min-w-max"
                  >
                    <div className="w-64 sticky left-0 bg-white flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback 
                          className="text-white font-semibold"
                          style={{ backgroundColor: stringToColor(user.name) }}
                        >
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="w-48">
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    
                    <div className="w-32">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusToggle(user.id)}
                              className={user.status === "active" ? "text-green-600 hover:bg-green-50" : "text-red-600 hover:bg-red-50"}
                            >
                              {user.status === "active" ? (
                                <UserCheck className="h-4 w-4 mr-1" />
                              ) : (
                                <UserX className="h-4 w-4 mr-1" />
                              )}
                              {user.status === "active" ? "Active" : "Inactive"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to {user.status === "active" ? "deactivate" : "activate"} user
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="w-40 text-sm text-muted-foreground">
                      {user.lastLogin}
                    </div>
                    
                    <div className="w-32">
                      <Badge variant="outline" className="text-xs">
                        {getActivePermissionsCount(user.permissions)} of {Object.keys(permissionLabels).length}
                      </Badge>
                    </div>
                    
                    <div className="w-48">
                      <div className="flex flex-wrap gap-1">
                        {user.companyAccess.slice(0, 2).map(companyId => (
                          <Badge key={companyId} variant="outline" className="text-xs">
                            {getCompanyName(companyId)}
                          </Badge>
                        ))}
                        {user.companyAccess.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.companyAccess.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-48">
                      <div className="flex flex-wrap gap-1">
                        {user.storeAccess.slice(0, 2).map(storeId => (
                          <Badge key={storeId} variant="outline" className="text-xs">
                            {stores.find(s => s.id === storeId)?.name || storeId}
                          </Badge>
                        ))}
                        {user.storeAccess.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.storeAccess.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-32">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="h-8"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback 
                  className="text-white font-bold text-lg"
                  style={{ backgroundColor: stringToColor(selectedUser?.name || "") }}
                >
                  {getInitials(selectedUser?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>Edit User Profile</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {selectedUser?.name} - {selectedUser?.role}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-6 h-[70vh]">
            {/* Left Panel - User Details */}
            <div className="w-1/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select value={editFormData.role} onValueChange={(value) => setEditFormData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Account Status</Label>
                    <Select value={editFormData.status} onValueChange={(value: "active" | "inactive") => setEditFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Inactive
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Company & Store Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Company Access</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {companies.map((company) => (
                          <div key={company.id} className="flex items-center space-x-2 p-2 rounded hover:bg-accent">
                            <Checkbox
                              id={`edit-company-${company.id}`}
                              checked={editFormData.companyAccess.includes(company.id)}
                              onCheckedChange={(checked) => handleCompanyAccessChange(company.id, checked as boolean)}
                            />
                            <Label htmlFor={`edit-company-${company.id}`} className="text-sm font-medium flex-1">
                              {company.name}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              {company.storeIds.length} stores
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Individual Store Access</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {companies.map((company) => (
                          <div key={company.id} className="space-y-1">
                            <Label className="text-xs font-semibold text-muted-foreground px-2">
                              {company.name}
                            </Label>
                            {company.storeIds.map((storeId) => {
                              const store = stores.find(s => s.id === storeId)
                              return (
                                <div key={storeId} className="flex items-center space-x-2 ml-4 p-1 rounded hover:bg-accent">
                                  <Checkbox
                                    id={`edit-store-${storeId}`}
                                    checked={editFormData.storeAccess.includes(storeId)}
                                    onCheckedChange={(checked) => handleStoreAccessChange(storeId, checked as boolean)}
                                  />
                                  <Label htmlFor={`edit-store-${storeId}`} className="text-sm flex-1">
                                    {store?.name}
                                  </Label>
                                  <span className="text-xs text-muted-foreground">
                                    {store?.location}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Permissions */}
            <div className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">System Permissions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure what areas of the system this user can access
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[50vh] pr-4">
                    <div className="space-y-6">
                      {/* Standalone Permissions */}
                      <div className="space-y-3">
                        {permissionCategories.standalone.map((permission) => (
                          <div key={permission.key} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                            <Checkbox
                              id={`edit-${permission.key}`}
                              checked={editFormData.permissions[permission.key as keyof User['permissions']]}
                              onCheckedChange={(checked) => handlePermissionChange(permission.key as keyof User['permissions'], checked as boolean)}
                            />
                            <Label htmlFor={`edit-${permission.key}`} className="font-medium flex-1 cursor-pointer">
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>

                      {/* Accounting Category */}
                      <div className="border rounded-lg overflow-hidden">
                        <div 
                          className="flex items-center justify-between p-4 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setAccountingExpanded(!accountingExpanded)}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={isAccountingCategorySelected(editFormData.permissions)}
                              onCheckedChange={handleAccountingCategoryChange}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Label className="font-semibold text-base cursor-pointer">
                              {permissionCategories.accounting.label}
                            </Label>
                          </div>
                          {accountingExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                        {accountingExpanded && (
                          <div className="p-4 space-y-2 bg-white">
                            {permissionCategories.accounting.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-3 p-2 rounded hover:bg-accent transition-colors">
                                <Checkbox
                                  id={`edit-${item.key}`}
                                  checked={editFormData.permissions[item.key as keyof User['permissions']]}
                                  onCheckedChange={(checked) => handlePermissionChange(item.key as keyof User['permissions'], checked as boolean)}
                                />
                                <Label htmlFor={`edit-${item.key}`} className="text-sm flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Settings Category */}
                      <div className="border rounded-lg overflow-hidden">
                        <div 
                          className="flex items-center justify-between p-4 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setSettingsExpanded(!settingsExpanded)}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={isSettingsCategorySelected(editFormData.permissions)}
                              onCheckedChange={handleSettingsCategoryChange}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Label className="font-semibold text-base cursor-pointer">
                              {permissionCategories.settings.label}
                            </Label>
                          </div>
                          {settingsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                        {settingsExpanded && (
                          <div className="p-4 space-y-2 bg-white">
                            {permissionCategories.settings.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-3 p-2 rounded hover:bg-accent transition-colors">
                                <Checkbox
                                  id={`edit-${item.key}`}
                                  checked={editFormData.permissions[item.key as keyof User['permissions']]}
                                  onCheckedChange={(checked) => handlePermissionChange(item.key as keyof User['permissions'], checked as boolean)}
                                />
                                <Label htmlFor={`edit-${item.key}`} className="text-sm flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-muted-foreground">
                Last login: {selectedUser?.lastLogin}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
