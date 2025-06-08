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
  type RoleTemplate,
  companies,
  stores,
  permissionLabels,
  permissionCategories,
  roleTemplates,
  initialUsers,
} from "./userdata"

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<User[]>(initialUsers)
  const [customRoles, setCustomRoles] = React.useState<RoleTemplate[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = React.useState(false)
  const [isViewRolesDialogOpen, setIsViewRolesDialogOpen] = React.useState(false)
  const [userSearch, setUserSearch] = React.useState("")
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState<string>("all")
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>("all")
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [selectedRoleForEdit, setSelectedRoleForEdit] = React.useState<RoleTemplate | null>(null)
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
      financialReports: false,
      managementReports: false,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: false,
      purchases: false,
      sales: false,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: false,
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  })

  const [roleFormData, setRoleFormData] = React.useState<RoleTemplate>({
    id: "",
    name: "",
    description: "",
    permissions: {
      dashboard: false,
      financialReports: false,
      managementReports: false,
      aiChatbot: false,
      payrollRuns: false,
      employeeManagement: false,
      purchases: false,
      sales: false,
      contacts: false,
      chartOfAccounts: false,
      manualJournals: false,
      stockControl: false,
      storeManagement: false,
      xeroIntegration: false,
      franchiseSettings: false,
      userManagement: false,
    }
  })

  // State for collapsible permission sections
  const [insightsExpanded, setInsightsExpanded] = React.useState(true)
  const [payrollExpanded, setPayrollExpanded] = React.useState(true)
  const [accountingExpanded, setAccountingExpanded] = React.useState(true)
  const [settingsExpanded, setSettingsExpanded] = React.useState(true)

  // Combined roles (presets + custom)
  const allRoleTemplates = [...roleTemplates, ...customRoles]
  const allRoleNames = allRoleTemplates.map(template => template.name)

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
        financialReports: false,
        managementReports: false,
        aiChatbot: false,
        payrollRuns: false,
        employeeManagement: false,
        purchases: false,
        sales: false,
        contacts: false,
        chartOfAccounts: false,
        manualJournals: false,
        stockControl: false,
        storeManagement: false,
        xeroIntegration: false,
        franchiseSettings: false,
        userManagement: false,
      }
    })
  }

  const handleCreateRole = () => {
    const newRole: RoleTemplate = {
      ...roleFormData,
      id: `custom-${Date.now()}`,
    }
    setCustomRoles(prev => [...prev, newRole])
    setIsCreateRoleDialogOpen(false)
    setRoleFormData({
      id: "",
      name: "",
      description: "",
      permissions: {
        dashboard: false,
        financialReports: false,
        managementReports: false,
        aiChatbot: false,
        payrollRuns: false,
        employeeManagement: false,
        purchases: false,
        sales: false,
        contacts: false,
        chartOfAccounts: false,
        manualJournals: false,
        stockControl: false,
        storeManagement: false,
        xeroIntegration: false,
        franchiseSettings: false,
        userManagement: false,
      }
    })
  }

  const handleRoleSelection = (roleName: string) => {
    const selectedRole = allRoleTemplates.find(template => template.name === roleName)
    if (selectedRole) {
      setEditFormData(prev => ({
        ...prev,
        role: roleName,
        permissions: { ...selectedRole.permissions }
      }))
    }
  }

  const handleRolePermissionChange = (permission: keyof User['permissions'], checked: boolean) => {
    setRoleFormData(prev => ({
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
  const isInsightsCategorySelected = (permissions: User['permissions']) => {
    return permissionCategories.insights.items.every(item => 
      permissions[item.key as keyof User['permissions']]
    )
  }

  const isPayrollCategorySelected = (permissions: User['permissions']) => {
    return permissionCategories.payroll.items.every(item => 
      permissions[item.key as keyof User['permissions']]
    )
  }

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

  const handleEditRole = (role: RoleTemplate) => {
    setSelectedRoleForEdit({ ...role })
    setIsViewRolesDialogOpen(true)
  }

  const handleSaveRoleEdit = () => {
    if (!selectedRoleForEdit) return
    
    // Update custom roles if it's a custom role
    if (selectedRoleForEdit.id.startsWith('custom-')) {
      setCustomRoles(prev => prev.map(role => 
        role.id === selectedRoleForEdit.id ? selectedRoleForEdit : role
      ))
    }
    // Note: Preset roles would need backend integration to update
    
    setSelectedRoleForEdit(null)
  }

  const handleRolePermissionEditChange = (permission: keyof User['permissions'], checked: boolean) => {
    if (!selectedRoleForEdit) return
    
    setSelectedRoleForEdit(prev => ({
      ...prev!,
      permissions: {
        ...prev!.permissions,
        [permission]: checked
      }
    }))
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-3">
          {/* Add Role Dialog */}
          <Dialog open={isCreateRoleDialogOpen} onOpenChange={setIsCreateRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Create a custom role template with specific permissions and access levels.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      value={roleFormData.name}
                      onChange={(e) => setRoleFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Regional Manager"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description</Label>
                    <Input
                      id="role-description"
                      value={roleFormData.description}
                      onChange={(e) => setRoleFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this role's responsibilities"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Access Permissions</Label>
                  
                  {/* Insights Modules */}
                  <div className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => setInsightsExpanded(!insightsExpanded)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={permissionCategories.insights.items.every(item => 
                            roleFormData.permissions[item.key as keyof User['permissions']]
                          )}
                          onCheckedChange={(checked) => {
                            setRoleFormData(prev => {
                              const newPermissions = { ...prev.permissions }
                              permissionCategories.insights.items.forEach(item => {
                                newPermissions[item.key as keyof User['permissions']] = checked as boolean
                              })
                              return { ...prev, permissions: newPermissions }
                            })
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Label className="font-semibold text-base cursor-pointer">
                          {permissionCategories.insights.label}
                        </Label>
                      </div>
                      {insightsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    {insightsExpanded && (
                      <div className="p-4 space-y-2 bg-white">
                        {permissionCategories.insights.items.map((item) => (
                          <div key={item.key} className="flex items-center space-x-3 p-2 rounded hover:bg-accent transition-colors">
                            <Checkbox
                              id={`role-${item.key}`}
                              checked={roleFormData.permissions[item.key as keyof User['permissions']]}
                              onCheckedChange={(checked) => handleRolePermissionChange(item.key as keyof User['permissions'], checked as boolean)}
                            />
                            <Label htmlFor={`role-${item.key}`} className="text-sm flex-1 cursor-pointer">
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payroll Modules */}
                  <div className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => setPayrollExpanded(!payrollExpanded)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={permissionCategories.payroll.items.every(item => 
                            roleFormData.permissions[item.key as keyof User['permissions']]
                          )}
                          onCheckedChange={(checked) => {
                            setRoleFormData(prev => {
                              const newPermissions = { ...prev.permissions }
                              permissionCategories.payroll.items.forEach(item => {
                                newPermissions[item.key as keyof User['permissions']] = checked as boolean
                              })
                              return { ...prev, permissions: newPermissions }
                            })
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Label className="font-semibold text-base cursor-pointer">
                          {permissionCategories.payroll.label}
                        </Label>
                      </div>
                      {payrollExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    {payrollExpanded && (
                      <div className="p-4 space-y-2 bg-white">
                        {permissionCategories.payroll.items.map((item) => (
                          <div key={item.key} className="flex items-center space-x-3 p-2 rounded hover:bg-accent transition-colors">
                            <Checkbox
                              id={`role-${item.key}`}
                              checked={roleFormData.permissions[item.key as keyof User['permissions']]}
                              onCheckedChange={(checked) => handleRolePermissionChange(item.key as keyof User['permissions'], checked as boolean)}
                            />
                            <Label htmlFor={`role-${item.key}`} className="text-sm flex-1 cursor-pointer">
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Accounting Modules */}
                  <div className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => setAccountingExpanded(!accountingExpanded)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={permissionCategories.accounting.items.every(item => 
                            roleFormData.permissions[item.key as keyof User['permissions']]
                          )}
                          onCheckedChange={(checked) => {
                            setRoleFormData(prev => {
                              const newPermissions = { ...prev.permissions }
                              permissionCategories.accounting.items.forEach(item => {
                                newPermissions[item.key as keyof User['permissions']] = checked as boolean
                              })
                              return { ...prev, permissions: newPermissions }
                            })
                          }}
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
                              id={`role-${item.key}`}
                              checked={roleFormData.permissions[item.key as keyof User['permissions']]}
                              onCheckedChange={(checked) => handleRolePermissionChange(item.key as keyof User['permissions'], checked as boolean)}
                            />
                            <Label htmlFor={`role-${item.key}`} className="text-sm flex-1 cursor-pointer">
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Settings Modules */}
                  <div className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => setSettingsExpanded(!settingsExpanded)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={permissionCategories.settings.items.every(item => 
                            roleFormData.permissions[item.key as keyof User['permissions']]
                          )}
                          onCheckedChange={(checked) => {
                            setRoleFormData(prev => {
                              const newPermissions = { ...prev.permissions }
                              permissionCategories.settings.items.forEach(item => {
                                newPermissions[item.key as keyof User['permissions']] = checked as boolean
                              })
                              return { ...prev, permissions: newPermissions }
                            })
                          }}
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
                              id={`role-${item.key}`}
                              checked={roleFormData.permissions[item.key as keyof User['permissions']]}
                              onCheckedChange={(checked) => handleRolePermissionChange(item.key as keyof User['permissions'], checked as boolean)}
                            />
                            <Label htmlFor={`role-${item.key}`} className="text-sm flex-1 cursor-pointer">
                              {item.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateRoleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole}>
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add User Dialog */}
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
                    <Select 
                      value={editFormData.role} 
                      
                      onValueChange={(value) => handleRoleSelection(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Preset Roles</div>
                        {roleTemplates.map(template => (
                          <SelectItem key={template.id} value={template.name}>
                            {template.name}
                          </SelectItem>
                        ))}
                        {customRoles.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Custom Roles</div>
                            {customRoles.map(template => (
                              <SelectItem key={template.id} value={template.name}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
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
      </div>

      <Card>
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
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsViewRolesDialogOpen(true)}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              View Roles
            </Button>
            
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
                        {allRoleNames.map(role => (
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
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2 font-semibold">User</th>
                    <th className="text-left p-2 font-semibold">Role</th>
                    <th className="text-left p-2 font-semibold">Status</th>
                    <th className="text-left p-2 font-semibold">Last Login</th>
                    <th className="text-left p-2 font-semibold">Permissions</th>
                    <th className="text-left p-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback 
                              className="text-white font-semibold text-xs"
                              style={{ backgroundColor: stringToColor(user.name) }}
                            >
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-2">
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                      </td>
                      
                      <td className="p-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusToggle(user.id)}
                                className={user.status === "active" ? "text-green-600 hover:bg-green-50 h-7 px-2" : "text-red-600 hover:bg-red-50 h-7 px-2"}
                              >
                                {user.status === "active" ? (
                                  <UserCheck className="h-3 w-3 mr-1" />
                                ) : (
                                  <UserX className="h-3 w-3 mr-1" />
                                )}
                                <span className="text-xs">{user.status === "active" ? "Active" : "Inactive"}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Click to {user.status === "active" ? "deactivate" : "activate"} user
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      
                      <td className="p-2 text-xs text-muted-foreground">
                        {user.lastLogin}
                      </td>
                      
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {getActivePermissionsCount(user.permissions)} of {Object.keys(permissionLabels).length}
                        </Badge>
                      </td>
                      
                      <td className="p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="h-7 px-2"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          <span className="text-xs">Edit</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent 
          className="overflow-hidden p-0"
          style={{ 
            width: '90vw', 
            maxWidth: '1600px', 
            height: '75vh',
            maxHeight: '75vh'
          }}
        >
          <DialogHeader className="pb-1 border-b px-4 pt-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback 
                  className="text-white font-bold text-sm"
                  style={{ backgroundColor: stringToColor(selectedUser?.name || "") }}
                >
                  {getInitials(selectedUser?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>{selectedUser?.name}</div>
                <div className="text-xs font-normal text-muted-foreground">
                  {selectedUser?.role}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-3 px-4 py-3 overflow-auto" style={{ height: 'calc(75vh - 140px)' }}>
            {/* Left Column - User Details */}
            <div className="space-y-3">
              <Card className="h-fit">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="space-y-1">
                    <Label htmlFor="edit-name" className="text-xs font-medium">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="font-medium h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-email" className="text-xs font-medium">Email Address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-role" className="text-xs font-medium">Role</Label>
                    <Select value={editFormData.role} onValueChange={(value) => handleRoleSelection(value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Preset Roles</div>
                        {roleTemplates.map(template => (
                          <SelectItem key={template.id} value={template.name}>
                            {template.name}
                          </SelectItem>
                        ))}
                        {customRoles.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Custom Roles</div>
                            {customRoles.map(template => (
                              <SelectItem key={template.id} value={template.name}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-status" className="text-xs font-medium">Account Status</Label>
                    <Select value={editFormData.status} onValueChange={(value: "active" | "inactive") => setEditFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="h-8">
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
            </div>

            {/* Second Column - Location Access */}
            <div className="space-y-3">
              <Card className="h-fit">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Company and Store Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs font-semibold mb-1 block">Company Access</Label>
                      <div className="space-y-1 max-h-20 overflow-y-auto border rounded-lg p-2">
                        {companies.map((company) => (
                          <div key={company.id} className="flex items-center space-x-2 p-1 rounded hover:bg-accent transition-colors">
                            <Checkbox
                              id={`edit-company-${company.id}`}
                              checked={editFormData.companyAccess.includes(company.id)}
                              onCheckedChange={(checked) => handleCompanyAccessChange(company.id, checked as boolean)}
                              className="h-3 w-3"
                            />
                            <Label htmlFor={`edit-company-${company.id}`} className="text-xs font-medium flex-1 cursor-pointer">
                              {company.name}
                            </Label>
                            <Badge variant="outline" className="text-xs h-4">
                              {company.storeIds.length}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold mb-1 block">Store Access</Label>
                      <div className="space-y-1 max-h-28 overflow-y-auto border rounded-lg p-2">
                        {companies.map((company) => (
                          <div key={company.id} className="space-y-0.5">
                            <Label className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-wide">
                              {company.name}
                            </Label>
                            <div className="space-y-0.5">
                              {company.storeIds.map((storeId) => {
                                const store = stores.find(s => s.id === storeId)
                                return (
                                  <div key={storeId} className="flex items-center space-x-2 ml-2 p-1 rounded hover:bg-accent transition-colors">
                                    <Checkbox
                                      id={`edit-store-${storeId}`}
                                      checked={editFormData.storeAccess.includes(storeId)}
                                      onCheckedChange={(checked) => handleStoreAccessChange(storeId, checked as boolean)}
                                      className="h-3 w-3"
                                    />
                                    <Label htmlFor={`edit-store-${storeId}`} className="text-xs flex-1 cursor-pointer">
                                      {store?.name}
                                    </Label>
                                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                      {store?.location}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Third & Fourth Columns - Permissions */}
            <div className="col-span-2">
              <Card className="h-fit">
                <CardHeader className="pb-0 border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    System Permissions
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Permissions are automatically assigned based on the selected role
                  </p>
                </CardHeader>
                <CardContent className="p-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Left Column - Insights & Payroll */}
                    <div className="space-y-1">
                      {/* Insights Modules */}
                      <div className="border rounded-lg overflow-hidden">
                        <div 
                          className="flex items-center justify-between p-1.5 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setInsightsExpanded(!insightsExpanded)}
                        >
                          <div className="flex items-center space-x-1.5">
                            <Checkbox
                              checked={isInsightsCategorySelected(editFormData.permissions)}
                              disabled={true}
                              className="h-3 w-3"
                            />
                            <Label className="font-medium text-xs cursor-pointer">
                              {permissionCategories.insights.label}
                            </Label>
                          </div>
                          {insightsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </div>
                        {insightsExpanded && (
                          <div className="p-1.5 space-y-0.5 bg-white">
                            {permissionCategories.insights.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-1.5 p-0.5 rounded">
                                <Checkbox
                                  id={`edit-${item.key}`}
                                  checked={editFormData.permissions[item.key as keyof User['permissions']]}
                                  disabled={true}
                                  className="h-3 w-3"
                                />
                                <Label htmlFor={`edit-${item.key}`} className="text-xs flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Payroll Modules */}
                      <div className="border rounded-lg overflow-hidden">
                        <div 
                          className="flex items-center justify-between p-1.5 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setPayrollExpanded(!payrollExpanded)}
                        >
                          <div className="flex items-center space-x-1.5">
                            <Checkbox
                              checked={isPayrollCategorySelected(editFormData.permissions)}
                              disabled={true}
                              className="h-3 w-3"
                            />
                            <Label className="font-medium text-xs cursor-pointer">
                              {permissionCategories.payroll.label}
                            </Label>
                          </div>
                          {payrollExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </div>
                        {payrollExpanded && (
                          <div className="p-1.5 space-y-0.5 bg-white">
                            {permissionCategories.payroll.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-1.5 p-0.5 rounded">
                                <Checkbox
                                  id={`edit-${item.key}`}
                                  checked={editFormData.permissions[item.key as keyof User['permissions']]}
                                  disabled={true}
                                  className="h-3 w-3"
                                />
                                <Label htmlFor={`edit-${item.key}`} className="text-xs flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Accounting & Settings */}
                    <div className="space-y-1">
                      {/* Accounting Category */}
                      <div className="border rounded-lg overflow-hidden">
                        <div 
                          className="flex items-center justify-between p-1.5 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setAccountingExpanded(!accountingExpanded)}
                        >
                          <div className="flex items-center space-x-1.5">
                            <Checkbox
                              checked={isAccountingCategorySelected(editFormData.permissions)}
                              disabled={true}
                              className="h-3 w-3"
                            />
                            <Label className="font-medium text-xs cursor-pointer">
                              {permissionCategories.accounting.label}
                            </Label>
                          </div>
                          {accountingExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </div>
                        {accountingExpanded && (
                          <div className="p-1.5 space-y-0.5 bg-white">
                            {permissionCategories.accounting.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-1.5 p-0.5 rounded">
                                <Checkbox
                                  id={`edit-${item.key}`}
                                  checked={editFormData.permissions[item.key as keyof User['permissions']]}
                                  disabled={true}
                                  className="h-3 w-3"
                                />
                                <Label htmlFor={`edit-${item.key}`} className="text-xs flex-1 cursor-pointer">
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
                          className="flex items-center justify-between p-1.5 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => setSettingsExpanded(!settingsExpanded)}
                        >
                          <div className="flex items-center space-x-1.5">
                            <Checkbox
                              checked={isSettingsCategorySelected(editFormData.permissions)}
                              disabled={true}
                              className="h-3 w-3"
                            />
                            <Label className="font-medium text-xs cursor-pointer">
                              {permissionCategories.settings.label}
                            </Label>
                          </div>
                          {settingsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </div>
                        {settingsExpanded && (
                          <div className="p-1.5 space-y-0.5 bg-white">
                            {permissionCategories.settings.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-1.5 p-0.5 rounded">
                                <Checkbox
                                  id={`edit-${item.key}`}
                                  checked={editFormData.permissions[item.key as keyof User['permissions']]}
                                  disabled={true}
                                  className="h-3 w-3"
                                />
                                <Label htmlFor={`edit-${item.key}`} className="text-xs flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter className="pt-2 border-t bg-muted/20 px-4 pb-2">
            <div className="flex justify-between items-center w-full">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Last login: {selectedUser?.lastLogin}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} size="sm">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700" size="sm">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Roles Dialog */}
      <Dialog open={isViewRolesDialogOpen} onOpenChange={setIsViewRolesDialogOpen}>
        <DialogContent 
          className="overflow-hidden p-0"
          style={{ 
            width: '90vw', 
            maxWidth: '1600px', 
            height: '80vh',
            maxHeight: '80vh'
          }}
        >
          <DialogHeader className="pb-1 border-b px-6 pt-3">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-blue-600" />
              <div>
                <div>Role Management</div>
                <div className="text-sm font-normal text-muted-foreground">
                  View and edit role permissions
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex h-full" style={{ height: 'calc(80vh - 200px)' }}>
            {/* Left Panel - Role List */}
            <div className="w-1/3 border-r bg-muted/20">
              <div className="p-4 h-full flex flex-col">
                <h3 className="font-semibold mb-3">All Roles</h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {/* Preset Roles */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Preset Roles
                    </Label>
                    {roleTemplates.map((role) => (
                      <div
                        key={role.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedRoleForEdit?.id === role.id 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => handleEditRole(role)}
                      >
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Object.values(role.permissions).filter(Boolean).length} permissions
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Roles */}
                  {customRoles.length > 0 && (
                    <div className="space-y-1 mt-4">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Custom Roles
                      </Label>
                      {customRoles.map((role) => (
                        <div
                          key={role.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedRoleForEdit?.id === role.id 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'hover:bg-accent'
                          }`}
                          onClick={() => handleEditRole(role)}
                        >
                          <div className="font-medium">{role.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Object.values(role.permissions).filter(Boolean).length} permissions • Custom
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Role Details */}
            <div className="flex-1 flex flex-col">
              {selectedRoleForEdit ? (
                <>
                  <div className="p-6 border-b bg-muted/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold">{selectedRoleForEdit.name}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedRoleForEdit.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {Object.values(selectedRoleForEdit.permissions).filter(Boolean).length} of {Object.keys(permissionLabels).length} permissions
                          </Badge>
                          <Badge variant={selectedRoleForEdit.id.startsWith('custom-') ? 'default' : 'secondary'} className="text-xs">
                            {selectedRoleForEdit.id.startsWith('custom-') ? 'Custom Role' : 'Preset Role'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column - Insights & Payroll */}
                      <div className="space-y-4">
                        {/* Insights Modules */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="p-3 bg-muted">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={permissionCategories.insights.items.every(item => 
                                  selectedRoleForEdit.permissions[item.key as keyof User['permissions']]
                                )}
                                onCheckedChange={(checked) => {
                                  permissionCategories.insights.items.forEach(item => {
                                    handleRolePermissionEditChange(item.key as keyof User['permissions'], checked as boolean)
                                  })
                                }}
                              />
                              <Label className="font-semibold text-sm">
                                {permissionCategories.insights.label}
                              </Label>
                            </div>
                          </div>
                          <div className="p-3 space-y-2 bg-white">
                            {permissionCategories.insights.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-2 p-2 rounded hover:bg-accent transition-colors">
                                <Checkbox
                                  checked={selectedRoleForEdit.permissions[item.key as keyof User['permissions']]}
                                  onCheckedChange={(checked) => handleRolePermissionEditChange(item.key as keyof User['permissions'], checked as boolean)}
                                />
                                <Label className="text-sm flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Payroll Modules */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="p-3 bg-muted">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={permissionCategories.payroll.items.every(item => 
                                  selectedRoleForEdit.permissions[item.key as keyof User['permissions']]
                                )}
                                onCheckedChange={(checked) => {
                                  permissionCategories.payroll.items.forEach(item => {
                                    handleRolePermissionEditChange(item.key as keyof User['permissions'], checked as boolean)
                                  })
                                }}
                              />
                              <Label className="font-semibold text-sm">
                                {permissionCategories.payroll.label}
                              </Label>
                            </div>
                          </div>
                          <div className="p-3 space-y-2 bg-white">
                            {permissionCategories.payroll.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-2 p-2 rounded hover:bg-accent transition-colors">
                                <Checkbox
                                  checked={selectedRoleForEdit.permissions[item.key as keyof User['permissions']]}
                                  onCheckedChange={(checked) => handleRolePermissionEditChange(item.key as keyof User['permissions'], checked as boolean)}
                                />
                                <Label className="text-sm flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Accounting & Settings */}
                      <div className="space-y-4">
                        {/* Accounting Category */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="p-3 bg-muted">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={permissionCategories.accounting.items.every(item => 
                                  selectedRoleForEdit.permissions[item.key as keyof User['permissions']]
                                )}
                                onCheckedChange={(checked) => {
                                  permissionCategories.accounting.items.forEach(item => {
                                    handleRolePermissionEditChange(item.key as keyof User['permissions'], checked as boolean)
                                  })
                                }}
                              />
                              <Label className="font-semibold text-sm">
                                {permissionCategories.accounting.label}
                              </Label>
                            </div>
                          </div>
                          <div className="p-3 space-y-2 bg-white">
                            {permissionCategories.accounting.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-2 p-2 rounded hover:bg-accent transition-colors">
                                <Checkbox
                                  checked={selectedRoleForEdit.permissions[item.key as keyof User['permissions']]}
                                  onCheckedChange={(checked) => handleRolePermissionEditChange(item.key as keyof User['permissions'], checked as boolean)}
                                />
                                <Label className="text-sm flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Settings Category */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="p-3 bg-muted">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={permissionCategories.settings.items.every(item => 
                                  selectedRoleForEdit.permissions[item.key as keyof User['permissions']]
                                )}
                                onCheckedChange={(checked) => {
                                  permissionCategories.settings.items.forEach(item => {
                                    handleRolePermissionEditChange(item.key as keyof User['permissions'], checked as boolean)
                                  })
                                }}
                              />
                              <Label className="font-semibold text-sm">
                                {permissionCategories.settings.label}
                              </Label>
                            </div>
                          </div>
                          <div className="p-3 space-y-2 bg-white">
                            {permissionCategories.settings.items.map((item) => (
                              <div key={item.key} className="flex items-center space-x-2 p-2 rounded hover:bg-accent transition-colors">
                                <Checkbox
                                  checked={selectedRoleForEdit.permissions[item.key as keyof User['permissions']]}
                                  onCheckedChange={(checked) => handleRolePermissionEditChange(item.key as keyof User['permissions'], checked as boolean)}
                                />
                                <Label className="text-sm flex-1 cursor-pointer">
                                  {item.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Role to Edit</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a role from the left panel to view and modify its permissions
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-3 border-t bg-muted/20 px-6 pb-3">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-muted-foreground">
                {selectedRoleForEdit && (
                  <span>
                    Editing: {selectedRoleForEdit.name} • 
                    {selectedRoleForEdit.id.startsWith('custom-') ? ' Custom role can be modified' : ' Preset role (view only)'}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsViewRolesDialogOpen(false)
                    setSelectedRoleForEdit(null)
                  }} 
                  size="lg"
                >
                  Close
                </Button>
                {selectedRoleForEdit?.id.startsWith('custom-') && (
                  <Button 
                    onClick={handleSaveRoleEdit} 
                    className="bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
