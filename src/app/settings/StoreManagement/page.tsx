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
import { Plus, Search, Pencil, Trash2, Building2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Define Store type
interface Store {
  id: string
  name: string
  address: string
  postCode: string
  tenantName: string
  trackingCategory: string
  trackingOption: string
  additionalInfo: string
}

// Define StoreGroup type
interface StoreGroup {
  id: string
  name: string
  description: string
  storeIds: string[]
  color: string
  createdAt: Date
}

// Company to color mapping (matching the Company Management page)
const companyColors: Record<string, string> = {
  "Fans (UK) Limited": "#3b82f6",
  "J & R Corporation Limited": "#10b981", 
  "MDJ Investments Limited": "#f59e0b",
  "Popat Leisure Limited": "#ef4444",
  "R & D 2 Pizza Limited": "#8b5cf6",
  "DMS1 Limited": "#06b6d4",
  "KDG Holdings": "#84cc16"
}

// Store data based on provided examples
const stores: Store[] = [
  {
    id: "28684",
    name: "SHEERNESS",
    address: "123 High Street, Sheerness",
    postCode: "ME121NZ",
    tenantName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "SHEERNESS",
    additionalInfo: "Some invoices arrive with incorrect postcode ME121NY. Utility bills often have wrong unit number."
  },
  {
    id: "28260",
    name: "SITTINGBOURNE",
    address: "45 Main Road, Sittingbourne",
    postCode: "ME102GZ",
    tenantName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "SITTINGBOURNE",
    additionalInfo: ""
  },
  {
    id: "28862",
    name: "HERNE BAY",
    address: "78 Beach Avenue, Herne Bay",
    postCode: "CT65LE",
    tenantName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "HERNE BAY",
    additionalInfo: ""
  },
  {
    id: "28921",
    name: "HEATHFIELD",
    address: "12 Market Street, Heathfield",
    postCode: "TN218JD",
    tenantName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "HEATHFIELD",
    additionalInfo: ""
  },
  {
    id: "28868",
    name: "PADDOCK WOOD",
    address: "34 Station Road, Paddock Wood",
    postCode: "TN126EZ",
    tenantName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "PADDOCK WOOD",
    additionalInfo: ""
  },
  {
    id: "29130",
    name: "SOUTHBOROUGH",
    address: "67 London Road, Southborough",
    postCode: "TN40PA",
    tenantName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "SOUTHBOROUGH",
    additionalInfo: ""
  },
  {
    id: "28115",
    name: "TUNBRIDGE WELLS",
    address: "89 Camden Road, Tunbridge Wells",
    postCode: "TN48AU",
    tenantName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "TUNBRIDGE WELLS",
    additionalInfo: "Incorrect postcode TN45PG appears on several supplier accounts. Electricity bills addressed to former business name."
  },
  {
    id: "29123",
    name: "HONOR OAK",
    address: "23 Honor Oak Park, Honor Oak",
    postCode: "SE231DY",
    tenantName: "MDJ Investments Limited",
    trackingCategory: "Store",
    trackingOption: "HONOR OAK",
    additionalInfo: ""
  },
  {
    id: "28109",
    name: "ORPINGTON",
    address: "56 High Street, Orpington",
    postCode: "BR60NF",
    tenantName: "MDJ Investments Limited",
    trackingCategory: "Store",
    trackingOption: "ORPINGTON",
    additionalInfo: ""
  },
  {
    id: "28621",
    name: "ST PAULS CRAY",
    address: "91 Main Road, St Pauls Cray",
    postCode: "BR52RA",
    tenantName: "MDJ Investments Limited", 
    trackingCategory: "Store",
    trackingOption: "ST PAULS CRAY",
    additionalInfo: ""
  }
]

// Sample store groups
const initialStoreGroups: StoreGroup[] = [
  {
    id: "group-1",
    name: "Kent Stores",
    description: "All stores located in Kent area",
    storeIds: ["28684", "28260", "28862", "28868", "28921", "29130", "28115"],
    color: "#3b82f6",
    createdAt: new Date("2024-01-15")
  },
  {
    id: "group-2", 
    name: "London Area",
    description: "Stores in Greater London area",
    storeIds: ["29123", "28109", "28621"],
    color: "#10b981",
    createdAt: new Date("2024-01-20")
  }
]

export default function StoreManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = React.useState(false)
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = React.useState(false)
  const [storeSearch, setStoreSearch] = React.useState("")
  const [groupSearch, setGroupSearch] = React.useState("")
  const [selectedTenantFilter, setSelectedTenantFilter] = React.useState<string>("all")
  const [selectedGroupFilter, setSelectedGroupFilter] = React.useState<string>("all")
  const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<string[]>([])
  const [storeGroups, setStoreGroups] = React.useState<StoreGroup[]>(initialStoreGroups)
  const [editFormData, setEditFormData] = React.useState<Store>({
    name: "",
    id: "",
    address: "",
    postCode: "",
    tenantName: "",
    trackingCategory: "",
    trackingOption: "",
    additionalInfo: ""
  })
  
  const [groupFormData, setGroupFormData] = React.useState({
    name: "",
    description: "",
    storeIds: [] as string[],
    color: "#3b82f6"
  })
  
  const [editingGroupId, setEditingGroupId] = React.useState<string | null>(null)
  
  // Available tenants for filtering
  const tenants = [
    { id: "1", name: "Fans (UK) Limited" },
    { id: "2", name: "J & R Corporation Limited" },
    { id: "3", name: "MDJ Investments Limited" }
  ]
  
  // Available colors for groups
  const groupColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
  ]
  
  // Get company color for store
  const getStoreColor = (tenantName: string) => {
    return companyColors[tenantName] || "#6b7280" // fallback to gray
  }
  
  const handleCreateStore = () => {
    // Implement store creation logic here
    setIsDialogOpen(false)
  }
  
  const handleEditStore = (store: Store) => {
    setEditFormData({
      name: store.name,
      id: store.id,
      address: store.address,
      postCode: store.postCode,
      tenantName: store.tenantName,
      trackingCategory: store.trackingCategory,
      trackingOption: store.trackingOption,
      additionalInfo: store.additionalInfo
    })
    setIsEditDialogOpen(true)
  }
  
  const handleSaveEdit = () => {
    // Implement save edit logic here
    // This would update the store in the database
    console.log("Saving edits for store:", editFormData)
    setIsEditDialogOpen(false)
  }
  
  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Group management functions
  const handleCreateGroup = () => {
    const newGroup: StoreGroup = {
      id: `group-${Date.now()}`,
      name: groupFormData.name,
      description: groupFormData.description,
      storeIds: groupFormData.storeIds,
      color: groupFormData.color,
      createdAt: new Date()
    }
    
    setStoreGroups(prev => [...prev, newGroup])
    setGroupFormData({ name: "", description: "", storeIds: [], color: "#3b82f6" })
    setIsGroupDialogOpen(false)
  }
  
  const handleEditGroup = (group: StoreGroup) => {
    setEditingGroupId(group.id)
    setGroupFormData({
      name: group.name,
      description: group.description,
      storeIds: group.storeIds,
      color: group.color
    })
    setIsEditGroupDialogOpen(true)
  }
  
  const handleSaveGroupEdit = () => {
    if (!editingGroupId) return
    
    setStoreGroups(prev => prev.map(group => 
      group.id === editingGroupId 
        ? { ...group, 
            name: groupFormData.name,
            description: groupFormData.description,
            storeIds: groupFormData.storeIds,
            color: groupFormData.color
          }
        : group
    ))
    
    setGroupFormData({ name: "", description: "", storeIds: [], color: "#3b82f6" })
    setEditingGroupId(null)
    setIsEditGroupDialogOpen(false)
  }
  
  const handleDeleteGroup = (groupId: string) => {
    setStoreGroups(prev => prev.filter(group => group.id !== groupId))
  }
  
  const handleGroupFormChange = (field: string, value: string | string[]) => {
    setGroupFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const toggleStoreInGroup = (storeId: string) => {
    setGroupFormData(prev => ({
      ...prev,
      storeIds: prev.storeIds.includes(storeId)
        ? prev.storeIds.filter(id => id !== storeId)
        : [...prev.storeIds, storeId]
    }))
  }
  
  // Filter stores by search and tenant
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
                         store.address.toLowerCase().includes(storeSearch.toLowerCase()) ||
                         store.postCode.toLowerCase().includes(storeSearch.toLowerCase()) ||
                         store.additionalInfo.toLowerCase().includes(storeSearch.toLowerCase())
    const matchesTenant = selectedTenantFilter === "all" || store.tenantName === tenants.find(t => t.id === selectedTenantFilter)?.name
    const matchesGroup = selectedGroupFilter === "all" || 
                        storeGroups.find(group => group.id === selectedGroupFilter)?.storeIds.includes(store.id)
    
    return matchesSearch && matchesTenant && matchesGroup
  })
  
  // Filter groups by search
  const filteredGroups = storeGroups.filter(group =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
    group.description.toLowerCase().includes(groupSearch.toLowerCase())
  )
  
  // Initials generator
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  
  // Store checkbox logic
  const allSelected =
    filteredStores.length > 0 &&
    filteredStores.every((s) => selectedStoreIds.includes(s.id))
  const someSelected =
    filteredStores.some((s) => selectedStoreIds.includes(s.id)) && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedStoreIds((ids) => ids.filter(id => !filteredStores.some(s => s.id === id)))
    } else {
      setSelectedStoreIds((ids) => [
        ...ids,
        ...filteredStores.map((s) => s.id).filter((id) => !ids.includes(id)),
      ])
    }
  }

  function toggleStore(id: string) {
    setSelectedStoreIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    )
  }

  // Group checkbox logic
  const allGroupsSelected =
    filteredGroups.length > 0 &&
    filteredGroups.every((g) => selectedGroupIds.includes(g.id))
  const someGroupsSelected =
    filteredGroups.some((g) => selectedGroupIds.includes(g.id)) && !allGroupsSelected

  function toggleSelectAllGroups() {
    if (allGroupsSelected) {
      setSelectedGroupIds((ids) => ids.filter(id => !filteredGroups.some(g => g.id === id)))
    } else {
      setSelectedGroupIds((ids) => [
        ...ids,
        ...filteredGroups.map((g) => g.id).filter((id) => !ids.includes(id)),
      ])
    }
  }

  function toggleGroup(id: string) {
    setSelectedGroupIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Store Management</h1>
        <div className="flex gap-2">
          <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Store Group</DialogTitle>
                <DialogDescription>
                  Create a new group to organize your stores.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="e.g., London Stores, Kent Stores"
                    value={groupFormData.name}
                    onChange={(e) => handleGroupFormChange('name', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Input
                    id="group-description"
                    placeholder="Brief description of this group"
                    value={groupFormData.description}
                    onChange={(e) => handleGroupFormChange('description', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Group Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {groupColors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          groupFormData.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleGroupFormChange('color', color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Select Stores</Label>
                  <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                    {stores.map((store) => (
                      <div key={store.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={groupFormData.storeIds.includes(store.id)}
                          onCheckedChange={() => toggleStoreInGroup(store.id)}
                        />
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center mr-2"
                          style={{ backgroundColor: getStoreColor(store.tenantName) }}
                        >
                          <Building2 className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm">{store.name} - {store.tenantName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGroup} disabled={!groupFormData.name}>
                  Create Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Store
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
                <DialogDescription>
                  Add a new store to your management system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter store name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Store Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter store address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postcode">Post Code</Label>
                  <Input
                    id="postcode"
                    placeholder="Enter post code"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tenant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tracking Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tracking category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Store">Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tracking Option</Label>
                  <Input
                    placeholder="Enter tracking option"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Input
                    id="additionalInfo"
                    placeholder="Enter any additional information"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateStore}>
                  Create Store
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stores or groups"
            className="pl-8"
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={selectedTenantFilter} onValueChange={setSelectedTenantFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={selectedGroupFilter} onValueChange={setSelectedGroupFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {storeGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected count */}
      <div className="text-xs text-muted-foreground mb-4">
        {selectedStoreIds.length} store{selectedStoreIds.length !== 1 ? 's' : ''} selected
        <span className="ml-4">
          {selectedGroupIds.length} group{selectedGroupIds.length !== 1 ? 's' : ''} selected
        </span>
      </div>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stores ({filteredStores.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table header */}
          <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
            <input
              type="checkbox"
              checked={allSelected}
              ref={el => { if (el) el.indeterminate = someSelected; }}
              onChange={toggleSelectAll}
              className="mr-4 h-4 w-4"
            />
            <span className="w-1/2">Store Name</span>
            <span className="w-1/4">Company</span>
            <span className="w-1/6">Post Code</span>
            <span className="w-1/12">Actions</span>
          </div>

          {/* Scrollable stores list */}
          <ScrollArea className="h-[400px] w-full">
            <div>
              {filteredStores.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  No stores found
                </div>
              ) : (
                filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center px-2 py-2 border-b hover:bg-accent transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStoreIds.includes(store.id)}
                      onChange={() => toggleStore(store.id)}
                      className="mr-4 h-4 w-4"
                    />
                    <div className="flex items-center w-1/2">
                      <div
                        className="flex items-center justify-center rounded-md mr-3"
                        style={{
                          backgroundColor: getStoreColor(store.tenantName),
                          width: 32,
                          height: 32,
                          minWidth: 32,
                          minHeight: 32,
                        }}
                      >
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm truncate">{store.name}</span>
                    </div>
                    <span className="w-1/4 text-sm truncate">{store.tenantName}</span>
                    <span className="w-1/6 text-sm truncate">{store.postCode}</span>
                    <div className="w-1/12">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStore(store)}
                        className="h-8"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Store Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Store Groups ({filteredGroups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search bar for groups */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                className="pl-8"
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Groups Table header */}
          <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
            <input
              type="checkbox"
              checked={allGroupsSelected}
              ref={el => { if (el) el.indeterminate = someGroupsSelected; }}
              onChange={toggleSelectAllGroups}
              className="mr-4 h-4 w-4"
            />
            <span className="w-1/4">Group Name</span>
            <span className="w-1/4">Description</span>
            <span className="w-1/4">Stores</span>
            <span className="w-1/4 flex justify-between">
              <span>Created</span>
              <span>Actions</span>
            </span>
          </div>

          {/* Scrollable groups list */}
          <ScrollArea className="h-[300px] w-full">
            <div>
              {filteredGroups.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  {groupSearch ? 'No groups found matching your search.' : 'No groups created yet. Create your first group to organize stores.'}
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroupIds.includes(group.id)}
                      onChange={() => toggleGroup(group.id)}
                      className="mr-4 h-4 w-4"
                    />
                    <div className="flex items-center w-1/4">
                      <div
                        className="flex items-center justify-center rounded-full mr-3"
                        style={{
                          backgroundColor: group.color,
                          width: 32,
                          height: 32,
                          minWidth: 32,
                          minHeight: 32,
                        }}
                      >
                        <span className="text-xs font-bold text-white">
                          {getInitials(group.name)}
                        </span>
                      </div>
                      <span className="font-semibold text-sm truncate">{group.name}</span>
                    </div>
                    <span className="w-1/4 text-sm truncate">{group.description}</span>
                    <div className="w-1/4 flex gap-1 flex-wrap">
                      {group.storeIds.map(storeId => {
                        const store = stores.find(s => s.id === storeId)
                        return store ? (
                          <Badge
                            key={storeId}
                            variant="secondary"
                            className="text-xs"
                            style={{ 
                              backgroundColor: getStoreColor(store.tenantName) + '20', 
                              color: getStoreColor(store.tenantName) 
                            }}
                          >
                            {store.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                    <div className="w-1/4 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {group.createdAt.toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditGroup(group)}
                          className="h-8"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="h-8 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Store Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Update the store information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Store Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => handleEditFormChange('name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-id">Store ID</Label>
              <Input
                id="edit-id"
                value={editFormData.id}
                onChange={(e) => handleEditFormChange('id', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Store Address</Label>
              <Input
                id="edit-address"
                value={editFormData.address}
                onChange={(e) => handleEditFormChange('address', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-postcode">Post Code</Label>
              <Input
                id="edit-postcode"
                value={editFormData.postCode}
                onChange={(e) => handleEditFormChange('postCode', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tenant</Label>
              <Select 
                value={tenants.find(t => t.name === editFormData.tenantName)?.id || ""} 
                onValueChange={(value) => {
                  const tenant = tenants.find(t => t.id === value);
                  if (tenant) {
                    handleEditFormChange('tenantName', tenant.name);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tracking Category</Label>
              <Select 
                value={editFormData.trackingCategory}
                onValueChange={(value) => handleEditFormChange('trackingCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tracking category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Store">Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-trackingOption">Tracking Option</Label>
              <Input
                id="edit-trackingOption"
                value={editFormData.trackingOption}
                onChange={(e) => handleEditFormChange('trackingOption', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-additionalInfo">Additional Information</Label>
              <Input
                id="edit-additionalInfo"
                value={editFormData.additionalInfo}
                onChange={(e) => handleEditFormChange('additionalInfo', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupDialogOpen} onOpenChange={setIsEditGroupDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Store Group</DialogTitle>
            <DialogDescription>
              Modify the group information and store assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-group-name">Group Name</Label>
              <Input
                id="edit-group-name"
                placeholder="e.g., London Stores, Kent Stores"
                value={groupFormData.name}
                onChange={(e) => handleGroupFormChange('name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-group-description">Description</Label>
              <Input
                id="edit-group-description"
                placeholder="Brief description of this group"
                value={groupFormData.description}
                onChange={(e) => handleGroupFormChange('description', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Group Color</Label>
              <div className="flex gap-2 flex-wrap">
                {groupColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      groupFormData.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleGroupFormChange('color', color)}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Select Stores</Label>
              <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                {stores.map((store) => (
                  <div key={store.id} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      checked={groupFormData.storeIds.includes(store.id)}
                      onCheckedChange={() => toggleStoreInGroup(store.id)}
                    />
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center mr-2"
                      style={{ backgroundColor: getStoreColor(store.tenantName) }}
                    >
                      <Building2 className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">{store.name} - {store.tenantName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGroupEdit} disabled={!groupFormData.name}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 