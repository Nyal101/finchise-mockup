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
import { Textarea } from "@/components/ui/textarea"

// Define Store type
interface Store {
  id: string
  name: string
  address: string
  postCode: string
  companyName: string
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
  "KDG Holdings": "#84cc16",
  "Alpha Pizza Group": "#f97316",
  "Metro Franchise Ltd": "#ec4899",
  "Crown Restaurant Group": "#6366f1",
  "Phoenix Dining Solutions": "#8b5cf6"
}

// Store data based on provided examples
const stores: Store[] = [
  {
    id: "28684",
    name: "SHEERNESS",
    address: "123 High Street, Sheerness",
    postCode: "ME121NZ",
    companyName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "SHEERNESS",
    additionalInfo: "Some invoices arrive with incorrect postcode ME121NY. Utility bills often have wrong unit number."
  },
  {
    id: "28260",
    name: "SITTINGBOURNE",
    address: "45 Main Road, Sittingbourne",
    postCode: "ME102GZ",
    companyName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "SITTINGBOURNE",
    additionalInfo: ""
  },
  {
    id: "28862",
    name: "HERNE BAY",
    address: "78 Beach Avenue, Herne Bay",
    postCode: "CT65LE",
    companyName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "HERNE BAY",
    additionalInfo: ""
  },
  {
    id: "28921",
    name: "HEATHFIELD",
    address: "12 Market Street, Heathfield",
    postCode: "TN218JD",
    companyName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "HEATHFIELD",
    additionalInfo: ""
  },
  {
    id: "28868",
    name: "PADDOCK WOOD",
    address: "34 Station Road, Paddock Wood",
    postCode: "TN126EZ",
    companyName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "PADDOCK WOOD",
    additionalInfo: ""
  },
  {
    id: "29130",
    name: "SOUTHBOROUGH",
    address: "67 London Road, Southborough",
    postCode: "TN40PA",
    companyName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "SOUTHBOROUGH",
    additionalInfo: ""
  },
  {
    id: "28115",
    name: "TUNBRIDGE WELLS",
    address: "89 Camden Road, Tunbridge Wells",
    postCode: "TN48AU",
    companyName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "TUNBRIDGE WELLS",
    additionalInfo: "Incorrect postcode TN45PG appears on several supplier accounts. Electricity bills addressed to former business name."
  },
  {
    id: "29123",
    name: "HONOR OAK",
    address: "23 Honor Oak Park, Honor Oak",
    postCode: "SE231DY",
    companyName: "MDJ Investments Limited",
    trackingCategory: "Store",
    trackingOption: "HONOR OAK",
    additionalInfo: ""
  },
  {
    id: "28109",
    name: "ORPINGTON",
    address: "56 High Street, Orpington",
    postCode: "BR60NF",
    companyName: "MDJ Investments Limited",
    trackingCategory: "Store",
    trackingOption: "ORPINGTON",
    additionalInfo: ""
  },
  {
    id: "28621",
    name: "ST PAULS CRAY",
    address: "91 Main Road, St Pauls Cray",
    postCode: "BR52RA",
    companyName: "MDJ Investments Limited", 
    trackingCategory: "Store",
    trackingOption: "ST PAULS CRAY",
    additionalInfo: ""
  }
]

// Store codes data - this could be stored with each store or separately
const storeCodesData: Record<string, {provider: string, code: string}[]> = {
  "28684": [
    { provider: "Dominoes", code: "AN684M" },
    { provider: "WorldPay", code: "WP28684" },
    { provider: "Till System", code: "TSSHE84" },
    { provider: "Delivery App", code: "DA-SHE123" }
  ],
  "28260": [
    { provider: "Dominoes", code: "AN260M" },
    { provider: "WorldPay", code: "WP28260" },
    { provider: "Till System", code: "TSSIT60" },
    { provider: "Uber Eats", code: "UE-SIT456" }
  ],
  "28862": [
    { provider: "Dominoes", code: "AN862M" },
    { provider: "WorldPay", code: "WP28862" },
    { provider: "Till System", code: "TSHER62" },
    { provider: "Just Eat", code: "JE-HER789" }
  ],
  "28921": [
    { provider: "Dominoes", code: "AN921M" },
    { provider: "WorldPay", code: "WP28921" },
    { provider: "Till System", code: "TSHEA21" },
    { provider: "Deliveroo", code: "DR-HEA321" }
  ],
  "28868": [
    { provider: "Dominoes", code: "AN868M" },
    { provider: "WorldPay", code: "WP28868" },
    { provider: "Till System", code: "TSPAD68" },
    { provider: "Uber Eats", code: "UE-PAD654" }
  ],
  "29130": [
    { provider: "Dominoes", code: "AN130M" },
    { provider: "WorldPay", code: "WP29130" },
    { provider: "Till System", code: "TSSOU30" },
    { provider: "Just Eat", code: "JE-SOU987" }
  ],
  "28115": [
    { provider: "Dominoes", code: "AN115M" },
    { provider: "WorldPay", code: "WP28115" },
    { provider: "Till System", code: "TSTUN15" },
    { provider: "Deliveroo", code: "DR-TUN147" },
    { provider: "Card Reader", code: "CR-TUN258" }
  ],
  "29123": [
    { provider: "Dominoes", code: "AN123M" },
    { provider: "WorldPay", code: "WP29123" },
    { provider: "Till System", code: "TSHON23" },
    { provider: "Uber Eats", code: "UE-HON369" }
  ],
  "28109": [
    { provider: "Dominoes", code: "AN109M" },
    { provider: "WorldPay", code: "WP28109" },
    { provider: "Till System", code: "TSORP09" },
    { provider: "Just Eat", code: "JE-ORP741" }
  ],
  "28621": [
    { provider: "Dominoes", code: "AN621M" },
    { provider: "WorldPay", code: "WP28621" },
    { provider: "Till System", code: "TSSTP21" },
    { provider: "Deliveroo", code: "DR-STP852" }
  ]
}

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
  const [selectedCompanyFilter, setSelectedCompanyFilter] = React.useState<string>("all")
  const [selectedGroupFilter, setSelectedGroupFilter] = React.useState<string>("all")
  const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<string[]>([])
  const [storeGroups, setStoreGroups] = React.useState<StoreGroup[]>(initialStoreGroups)
  const [editFormData, setEditFormData] = React.useState<Store>({
    name: "",
    id: "",
    address: "",
    postCode: "",
    companyName: "",
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
  
  const [storeCodes, setStoreCodes] = React.useState<{provider: string, code: string}[]>([])
  const [newCodeProvider, setNewCodeProvider] = React.useState("")
  const [newCodeValue, setNewCodeValue] = React.useState("")
  
  // Available companies for filtering
  const companies = [
    { id: "1", name: "Fans (UK) Limited" },
    { id: "2", name: "J & R Corporation Limited" },
    { id: "3", name: "MDJ Investments Limited" }
  ]
  
  // Available tracking options for dropdown
  const trackingOptions = [
    "BENFLEET", "HADLEY", "RILEY", "SHEERNESS", "SITTINGBOURNE", "HERNE BAY", 
    "HEATHFIELD", "PADDOCK WOOD", "SOUTHBOROUGH", "TUNBRIDGE WELLS", 
    "HONOR OAK", "ORPINGTON", "ST PAULS CRAY", "BASILDON", "CHELMSFORD",
    "ROMFORD", "BRENTWOOD", "GRAYS", "WICKFORD", "SOUTHEND"
  ]
  
  // Available colors for groups
  const groupColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
  ]
  
  // Get company color for store
  const getStoreColor = (companyName: string) => {
    return companyColors[companyName] || "#6b7280" // fallback to gray
  }
  
  const handleCreateStore = () => {
    // Implement store creation logic here
    setIsDialogOpen(false)
    // Reset codes when creating new store
    setStoreCodes([])
    setNewCodeProvider("")
    setNewCodeValue("")
  }
  
  const handleEditStore = (store: Store) => {
    setEditFormData({
      name: store.name,
      id: store.id,
      address: store.address,
      postCode: store.postCode,
      companyName: store.companyName,
      trackingCategory: store.trackingCategory,
      trackingOption: store.trackingOption,
      additionalInfo: store.additionalInfo
    })
    
    // Initialize codes based on store (sample data)
    const sampleCodes = storeCodesData[store.id] || []
    setStoreCodes(sampleCodes)
    
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
    // Auto-assign color from available palette
    const usedColors = storeGroups.map(group => group.color)
    const availableColor = groupColors.find(color => !usedColors.includes(color)) || groupColors[0]
    
    const newGroup: StoreGroup = {
      id: `group-${Date.now()}`,
      name: groupFormData.name,
      description: groupFormData.description,
      storeIds: groupFormData.storeIds,
      color: availableColor,
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
    const matchesTenant = selectedCompanyFilter === "all" || store.companyName === companies.find(t => t.id === selectedCompanyFilter)?.name
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

  const addStoreCode = () => {
    if (newCodeProvider.trim() && newCodeValue.trim()) {
      setStoreCodes([...storeCodes, { provider: newCodeProvider.trim(), code: newCodeValue.trim() }])
      setNewCodeProvider("")
      setNewCodeValue("")
    }
  }
  
  const removeStoreCode = (index: number) => {
    setStoreCodes(storeCodes.filter((_, i) => i !== index))
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
              <div className="grid gap-3 py-3">
                <div className="grid gap-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="e.g., London Stores, Kent Stores"
                    value={groupFormData.name}
                    onChange={(e) => handleGroupFormChange('name', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Input
                    id="group-description"
                    placeholder="Brief description of this group"
                    value={groupFormData.description}
                    onChange={(e) => handleGroupFormChange('description', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Select Stores</Label>
                  <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                    {stores.map((store) => (
                      <div key={store.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={groupFormData.storeIds.includes(store.id)}
                          onCheckedChange={() => toggleStoreInGroup(store.id)}
                        />
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center mr-2"
                          style={{ backgroundColor: getStoreColor(store.companyName) }}
                        >
                          <Building2 className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm">{store.name} - {store.companyName}</span>
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
            <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
                <DialogDescription>
                  Add a new store to your management system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6 py-4">
                {/* Left Column - Store Information */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Information</h3>
                    <div className="space-y-3">
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium text-gray-700">Store Name</Label>
                        <Input
                          placeholder="Enter store name"
                          className="h-9"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium text-gray-700">Store ID</Label>
                        <Input
                          placeholder="Enter store ID"
                          className="h-9"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium text-gray-700">Store Address</Label>
                        <Textarea
                          placeholder="Enter store address"
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium text-gray-700">Post Code</Label>
                        <Input
                          placeholder="Enter post code"
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Company & Tracking</h3>
                    <div className="space-y-3">
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium text-gray-700">Company</Label>
                        <Select>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-md"
                                    style={{ backgroundColor: getStoreColor(company.name) }}
                                  />
                                  {company.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium text-gray-700">Tracking Option</Label>
                        <Select>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select tracking option" />
                          </SelectTrigger>
                          <SelectContent>
                            {trackingOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Store Codes */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Codes</h3>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        Add provider-specific codes for this store:
                      </div>
                      
                      {/* Codes Table */}
                      <div className="border rounded-lg">
                        <div className="grid grid-cols-2 gap-0 bg-gray-50 border-b text-xs font-medium text-gray-700">
                          <div className="p-2 border-r">Provider</div>
                          <div className="p-2">Code</div>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {storeCodes.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              No codes added yet
                            </div>
                          ) : (
                            storeCodes.map((code, index) => (
                              <div key={index} className="grid grid-cols-2 gap-0 border-b last:border-b-0 text-sm">
                                <div className="p-2 border-r font-medium">{code.provider}</div>
                                <div className="p-2 flex justify-between items-center">
                                  <span className="font-mono text-blue-600">{code.code}</span>
                                  <button
                                    onClick={() => removeStoreCode(index)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Add New Code */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Add Code:</div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Provider"
                            value={newCodeProvider}
                            onChange={(e) => setNewCodeProvider(e.target.value)}
                            className="h-8 text-sm"
                          />
                          <Input
                            placeholder="Code"
                            value={newCodeValue}
                            onChange={(e) => setNewCodeValue(e.target.value)}
                            className="h-8 text-sm"
                          />
                          <Button
                            onClick={addStoreCode}
                            size="sm"
                            className="h-8 px-3 text-xs"
                            disabled={!newCodeProvider.trim() || !newCodeValue.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                        Examples: Dominoes (AN345M), WorldPay (WP12345), Till System (TS001)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="border-t pt-3">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false)
                  setStoreCodes([])
                  setNewCodeProvider("")
                  setNewCodeValue("")
                }}>
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

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stores ({filteredStores.length})</CardTitle>
          
          {/* Search and Filter bar moved inside */}
          <div className="flex items-center gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores"
                className="pl-8"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select value={selectedCompanyFilter} onValueChange={setSelectedCompanyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
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
        </CardHeader>
        <CardContent>
          {/* Selection count */}
          <div className="text-xs text-muted-foreground mb-3">
            {selectedStoreIds.length} store{selectedStoreIds.length !== 1 ? 's' : ''} selected
          </div>
          
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
                          backgroundColor: getStoreColor(store.companyName),
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
                    <span className="w-1/4 text-sm truncate">{store.companyName}</span>
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
          
          {/* Search bar for groups moved inside */}
          <div className="flex items-center gap-2 pt-4">
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
        </CardHeader>
        <CardContent>
          {/* Selection count */}
          <div className="text-xs text-muted-foreground mb-3">
            {selectedGroupIds.length} group{selectedGroupIds.length !== 1 ? 's' : ''} selected
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
                          backgroundColor: "#6b7280",
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
                              backgroundColor: getStoreColor(store.companyName) + '20', 
                              color: getStoreColor(store.companyName) 
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
        <DialogContent className="sm:max-w-[1100px] max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-md border"
                style={{ backgroundColor: getStoreColor(editFormData.companyName) }}
              />
              <DialogTitle className="text-xl">Store Settings - {editFormData.name}</DialogTitle>
            </div>
            <DialogDescription>
              Update store information, company assignment, and tracking settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-6 py-4">
            {/* Left Column - Store Preview */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Preview</h3>
                <div className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: getStoreColor(editFormData.companyName) }}
                    >
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {editFormData.name || "Store Name"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editFormData.companyName || "Company Name"}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div><span className="font-medium">ID:</span> {editFormData.id}</div>
                    <div><span className="font-medium">Address:</span> {editFormData.address}</div>
                    <div><span className="font-medium">Post Code:</span> {editFormData.postCode}</div>
                    <div><span className="font-medium">Tracking:</span> {editFormData.trackingOption}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Company Assignment</h3>
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Parent Company</Label>
                    <Select 
                      value={companies.find(t => t.name === editFormData.companyName)?.id || ""} 
                      onValueChange={(value) => {
                        const company = companies.find(t => t.id === value);
                        if (company) {
                          handleEditFormChange('companyName', company.name);
                        }
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-md"
                                style={{ backgroundColor: getStoreColor(company.name) }}
                              />
                              {company.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-800">
                      <strong>Color:</strong> Auto-inherited from company
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-4 h-4 rounded-md border border-blue-200"
                        style={{ backgroundColor: getStoreColor(editFormData.companyName) }}
                      />
                      <span className="text-xs text-blue-700">
                        {getStoreColor(editFormData.companyName)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Store Information */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Information</h3>
                <div className="space-y-3">
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Store Name</Label>
                    <Input
                      value={editFormData.name}
                      onChange={(e) => handleEditFormChange('name', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Store ID</Label>
                    <Input
                      value={editFormData.id}
                      onChange={(e) => handleEditFormChange('id', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Store Address</Label>
                    <Textarea
                      value={editFormData.address}
                      onChange={(e) => handleEditFormChange('address', e.target.value)}
                      className="min-h-[60px] resize-none"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Post Code</Label>
                    <Input
                      value={editFormData.postCode}
                      onChange={(e) => handleEditFormChange('postCode', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Xero Tracking</h3>
                <div className="space-y-3">
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <div className="p-2 bg-gray-50 border rounded text-sm text-gray-600 h-9 flex items-center">
                      Store (Default)
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Tracking Option</Label>
                    <Select 
                      value={editFormData.trackingOption}
                      onValueChange={(value) => handleEditFormChange('trackingOption', value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {trackingOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Store Codes */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Store Codes</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Provider-specific codes for this store:
                  </div>
                  
                  {/* Codes Table */}
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-2 gap-0 bg-gray-50 border-b text-xs font-medium text-gray-700">
                      <div className="p-2 border-r">Provider</div>
                      <div className="p-2">Code</div>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      {storeCodes.map((code, index) => (
                        <div key={index} className="grid grid-cols-2 gap-0 border-b last:border-b-0 text-sm">
                          <div className="p-2 border-r font-medium">{code.provider}</div>
                          <div className="p-2 flex justify-between items-center">
                            <span className="font-mono text-blue-600">{code.code}</span>
                            <button
                              onClick={() => removeStoreCode(index)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Code */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Add New Code:</div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Provider"
                        value={newCodeProvider}
                        onChange={(e) => setNewCodeProvider(e.target.value)}
                        className="h-8 text-sm"
                      />
                      <Input
                        placeholder="Code"
                        value={newCodeValue}
                        onChange={(e) => setNewCodeValue(e.target.value)}
                        className="h-8 text-sm"
                      />
                      <Button
                        onClick={addStoreCode}
                        size="sm"
                        className="h-8 px-3 text-xs"
                        disabled={!newCodeProvider.trim() || !newCodeValue.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                    Examples: Dominoes (AN345M), WorldPay (WP12345), Till System (TS001)
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t pt-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupDialogOpen} onOpenChange={setIsEditGroupDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: "#6b7280" }}
              />
              <DialogTitle className="text-lg">Edit Store Group</DialogTitle>
            </div>
            <DialogDescription>
              Update group information and store assignments.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-3">
            {/* Left Column - Group Information */}
            <div className="space-y-3">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Group Information</h3>
                <div className="space-y-3">
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Group Name</Label>
                    <Input
                      placeholder="e.g., South East Stores, Greater London Stores"
                      value={groupFormData.name}
                      onChange={(e) => handleGroupFormChange('name', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      placeholder="Brief description of this group"
                      value={groupFormData.description}
                      onChange={(e) => handleGroupFormChange('description', e.target.value)}
                      className="min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group Preview */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Group Preview</h3>
                <div className="p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#6b7280" }}
                    >
                      <span className="text-white text-xs font-bold">
                        {getInitials(groupFormData.name || "Group")}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {groupFormData.name || "Group Name"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {groupFormData.description || "Group description"}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {groupFormData.storeIds.length} stores selected
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {groupFormData.storeIds.map(storeId => {
                      const store = stores.find(s => s.id === storeId)
                      return store ? (
                        <Badge
                          key={storeId}
                          variant="secondary"
                          className="text-xs"
                          style={{ 
                            backgroundColor: getStoreColor(store.companyName) + '20', 
                            color: getStoreColor(store.companyName) 
                          }}
                        >
                          {store.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Store Selection */}
            <div className="space-y-3">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Store Selection</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Select stores for this group:
                  </div>
                  <div className="border rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {stores.map((store) => (
                        <div key={store.id} className="flex items-center space-x-3 p-2 rounded hover:bg-white transition-colors">
                          <Checkbox
                            checked={groupFormData.storeIds.includes(store.id)}
                            onCheckedChange={() => toggleStoreInGroup(store.id)}
                          />
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: getStoreColor(store.companyName) }}
                          >
                            <Building2 className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                            <div className="text-xs text-gray-500">{store.companyName}</div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {store.postCode}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t pt-3">
            <Button variant="outline" onClick={() => setIsEditGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGroupEdit} disabled={!groupFormData.name} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 