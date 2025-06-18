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
import { Plus, Search, Pencil, Trash2, Building2, ChevronDown, ChevronUp } from "lucide-react"
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
  "New Ventures Limited": "#6b7280",
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
  },
  {
    id: "29200",
    name: "DARTFORD",
    address: "15 High Street, Dartford",
    postCode: "DA11EY",
    companyName: "New Ventures Limited",
    trackingCategory: "Store",
    trackingOption: "",
    additionalInfo: "New store - accounting software setup pending"
  }
]



// Store additional information data - updated format
const storeAdditionalInfoData: Record<string, {infoType: string, information: string}[]> = {
  "28684": [
    { infoType: "WorldPay Reference Number", information: "WP28684" },
    { infoType: "Dominoes Store Code", information: "AN684M" },
    { infoType: "Till System ID", information: "TSSHE84" },
    { infoType: "British Gas Account Number", information: "BG-SHE-001234" }
  ],
  "28260": [
    { infoType: "WorldPay Reference Number", information: "WP28260" },
    { infoType: "Dominoes Store Code", information: "AN260M" },
    { infoType: "Till System ID", information: "TSSIT60" },
    { infoType: "Uber Eats Partner ID", information: "UE-SIT456" }
  ],
  "28862": [
    { infoType: "WorldPay Reference Number", information: "WP28862" },
    { infoType: "Dominoes Store Code", information: "AN862M" },
    { infoType: "Till System ID", information: "TSHER62" },
    { infoType: "Just Eat Restaurant ID", information: "JE-HER789" }
  ],
  "28921": [
    { infoType: "WorldPay Reference Number", information: "WP28921" },
    { infoType: "Dominoes Store Code", information: "AN921M" },
    { infoType: "Till System ID", information: "TSHEA21" },
    { infoType: "Deliveroo Partner Code", information: "DR-HEA321" }
  ],
  "28868": [
    { infoType: "WorldPay Reference Number", information: "WP28868" },
    { infoType: "Dominoes Store Code", information: "AN868M" },
    { infoType: "Till System ID", information: "TSPAD68" },
    { infoType: "EDF Energy Customer Number", information: "EDF-PAD-567890" }
  ],
  "29130": [
    { infoType: "WorldPay Reference Number", information: "WP29130" },
    { infoType: "Dominoes Store Code", information: "AN130M" },
    { infoType: "Till System ID", information: "TSSOU30" },
    { infoType: "Thames Water Account Reference", information: "TW-SOU-987654" }
  ],
  "28115": [
    { infoType: "WorldPay Reference Number", information: "WP28115" },
    { infoType: "Dominoes Store Code", information: "AN115M" },
    { infoType: "Till System ID", information: "TSTUN15" },
    { infoType: "British Gas Unique Billing Code", information: "BG-TUN-147258" },
    { infoType: "Deliveroo Partner Code", information: "DR-TUN147" }
  ],
  "29123": [
    { infoType: "WorldPay Reference Number", information: "WP29123" },
    { infoType: "Dominoes Store Code", information: "AN123M" },
    { infoType: "Till System ID", information: "TSHON23" },
    { infoType: "Uber Eats Partner ID", information: "UE-HON369" }
  ],
  "28109": [
    { infoType: "WorldPay Reference Number", information: "WP28109" },
    { infoType: "Dominoes Store Code", information: "AN109M" },
    { infoType: "Till System ID", information: "TSORP09" },
    { infoType: "Just Eat Restaurant ID", information: "JE-ORP741" }
  ],
  "28621": [
    { infoType: "WorldPay Reference Number", information: "WP28621" },
    { infoType: "Dominoes Store Code", information: "AN621M" },
    { infoType: "Till System ID", information: "TSSTP21" },
    { infoType: "Deliveroo Partner Code", information: "DR-STP852" }
  ],
  "29200": [
    { infoType: "British Gas Account Number", information: "BG-DAR-NEW001" },
    { infoType: "Landlord Reference", information: "LL-DARTFORD-15" }
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
  

  
  const [storeAdditionalInfo, setStoreAdditionalInfo] = React.useState<{infoType: string, information: string}[]>([])
  const [newInfoType, setNewInfoType] = React.useState("")
  const [newInformation, setNewInformation] = React.useState("")
  const [editingInfoIndex, setEditingInfoIndex] = React.useState<number | null>(null)
  const [editingInfoType, setEditingInfoType] = React.useState("")
  const [editingInformation, setEditingInformation] = React.useState("")
  const [isAdditionalInfoExpanded, setIsAdditionalInfoExpanded] = React.useState(true)
  
  // Available companies for filtering
  const companies = [
    { id: "1", name: "Fans (UK) Limited" },
    { id: "2", name: "J & R Corporation Limited" },
    { id: "3", name: "MDJ Investments Limited" },
    { id: "4", name: "New Ventures Limited" }
  ]
  
  // Available tracking options for dropdown
  const trackingOptions = [
    "BENFLEET", "HADLEY", "RILEY", "SHEERNESS", "SITTINGBOURNE", "HERNE BAY", 
    "HEATHFIELD", "PADDOCK WOOD", "SOUTHBOROUGH", "TUNBRIDGE WELLS", 
    "HONOR OAK", "ORPINGTON", "ST PAULS CRAY", "BASILDON", "CHELMSFORD",
    "ROMFORD", "BRENTWOOD", "GRAYS", "WICKFORD", "SOUTHEND"
  ]

  // Available accounting software options
  const accountingSoftwareOptions = [
    "Xero",
    "QuickBooks", 
    "Sage",
    "FreeAgent",
    "Wave",
    "Kashflow"
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
    // Reset additional info when creating new store
    setStoreAdditionalInfo([])
    setNewInfoType("")
    setNewInformation("")
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
    
    // Initialize additional info based on store (sample data)
    const sampleInfo = storeAdditionalInfoData[store.id] || []
    setStoreAdditionalInfo(sampleInfo)
    
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



  const addStoreAdditionalInfo = () => {
    if (newInfoType.trim() && newInformation.trim()) {
      setStoreAdditionalInfo([...storeAdditionalInfo, { infoType: newInfoType.trim(), information: newInformation.trim() }])
      setNewInfoType("")
      setNewInformation("")
    }
  }
  
  const removeStoreAdditionalInfo = (index: number) => {
    setStoreAdditionalInfo(storeAdditionalInfo.filter((_, i) => i !== index))
  }

  const startEditingInfo = (index: number) => {
    const info = storeAdditionalInfo[index]
    setEditingInfoIndex(index)
    setEditingInfoType(info.infoType)
    setEditingInformation(info.information)
  }

  const saveEditingInfo = () => {
    if (editingInfoIndex !== null && editingInfoType.trim() && editingInformation.trim()) {
      const updatedInfo = [...storeAdditionalInfo]
      updatedInfo[editingInfoIndex] = { 
        infoType: editingInfoType.trim(), 
        information: editingInformation.trim() 
      }
      setStoreAdditionalInfo(updatedInfo)
      setEditingInfoIndex(null)
      setEditingInfoType("")
      setEditingInformation("")
    }
  }

  const cancelEditingInfo = () => {
    setEditingInfoIndex(null)
    setEditingInfoType("")
    setEditingInformation("")
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
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Company & Accounting</h3>
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
                        <Label className="text-sm font-medium text-gray-700">Accounting Software</Label>
                        <Select>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select accounting software" />
                          </SelectTrigger>
                          <SelectContent>
                            {accountingSoftwareOptions.map((software) => (
                              <SelectItem key={software} value={software}>
                                {software}
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
                        <div className="p-2 bg-blue-50 rounded text-xs text-blue-600">
                          Note: If no options appear, please ensure the company is connected to external accounting software.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Additional Info */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        This additional information is used by the invoice agent to assign invoices to the correct store.
                      </div>
                      
                      {/* Additional Information Table */}
                      <div className="border rounded-lg">
                        <div className="grid grid-cols-2 gap-0 bg-gray-50 border-b text-xs font-medium text-gray-700">
                          <div className="p-2 border-r">Information Type</div>
                          <div className="p-2">Information</div>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {storeAdditionalInfo.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              No additional information added yet
                            </div>
                          ) : (
                            storeAdditionalInfo.map((info, index) => (
                              <div key={index} className="grid grid-cols-2 gap-0 border-b last:border-b-0 text-sm">
                                <div className="p-2 border-r font-medium">{info.infoType}</div>
                                <div className="p-2 flex justify-between items-center">
                                  <span className="font-mono text-blue-600">{info.information}</span>
                                  <button
                                    onClick={() => removeStoreAdditionalInfo(index)}
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

                      {/* Add New Information */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Add Information:</div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Information Type"
                            value={newInfoType}
                            onChange={(e) => setNewInfoType(e.target.value)}
                            className="h-8 text-sm"
                          />
                          <Input
                            placeholder="Information"
                            value={newInformation}
                            onChange={(e) => setNewInformation(e.target.value)}
                            className="h-8 text-sm"
                          />
                          <Button
                            onClick={addStoreAdditionalInfo}
                            size="sm"
                            className="h-8 px-3 text-xs"
                            disabled={!newInfoType.trim() || !newInformation.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                        Examples: WorldPay Reference Number, British Gas Unique Billing Code, Insurance Policy Number, etc.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="border-t pt-3">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false)
                  setStoreAdditionalInfo([])
                  setNewInfoType("")
                  setNewInformation("")
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
                        <span className="text-white text-xs font-bold">
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
        <DialogContent className="sm:max-w-[1200px] max-h-[95vh] overflow-y-auto">
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
          
          <div className="space-y-6 py-4">
            {/* Top Section - 2 Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Store Preview & Company Assignment */}
              <div className="space-y-6">
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

              {/* Right Column - Store Information & Accounting */}
              <div className="space-y-6">
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
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Accounting Tracking</h3>
                  <div className="space-y-3">
                    <div className="grid gap-1">
                      <Label className="text-sm font-medium text-gray-700">Tracking Option</Label>
                      {editFormData.companyName === "New Ventures Limited" ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="text-sm text-orange-800">
                              <strong>No tracking options available</strong>
                            </div>
                            <div className="text-xs text-orange-600 mt-1">
                              Please connect to external accounting software and sync, then assign option.
                            </div>
                          </div>
                        </div>
                      ) : (
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

                        {/* Bottom Section - Full Width Additional Information */}
            <div className="border-t pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                    <button
                      onClick={() => setIsAdditionalInfoExpanded(!isAdditionalInfoExpanded)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      {isAdditionalInfoExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          Expand
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Used by the invoice agent to assign invoices to the correct store
                  </div>
                </div>
                
                {isAdditionalInfoExpanded && (
                  <>
                    {/* Additional Information Table - Full Width */}
                    <div className="border rounded-lg bg-white">
                      <div className="grid grid-cols-4 gap-0 bg-gray-50 border-b">
                        <div className="p-3 border-r text-sm font-medium text-gray-700">Information Type</div>
                        <div className="p-3 border-r text-sm font-medium text-gray-700 col-span-2">Information</div>
                        <div className="p-3 text-sm font-medium text-gray-700 text-center">Actions</div>
                      </div>
                      <div className="max-h-32 overflow-y-auto">
                        {storeAdditionalInfo.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <div className="text-sm">No additional information added yet</div>
                            <div className="text-xs text-gray-400 mt-1">Add information below to help with invoice processing</div>
                          </div>
                        ) : (
                          storeAdditionalInfo.map((info, index) => (
                            <div key={index} className="grid grid-cols-4 gap-0 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                              {editingInfoIndex === index ? (
                                <>
                                  <div className="p-3 border-r">
                                    <Input
                                      value={editingInfoType}
                                      onChange={(e) => setEditingInfoType(e.target.value)}
                                      className="h-8 text-sm"
                                      placeholder="Information Type"
                                    />
                                  </div>
                                  <div className="p-3 border-r col-span-2">
                                    <Input
                                      value={editingInformation}
                                      onChange={(e) => setEditingInformation(e.target.value)}
                                      className="h-8 text-sm"
                                      placeholder="Information"
                                    />
                                  </div>
                                  <div className="p-3 flex justify-center gap-2">
                                    <button
                                      onClick={saveEditingInfo}
                                      className="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEditingInfo}
                                      className="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="p-3 border-r">
                                    <span className="text-sm font-medium text-gray-900">{info.infoType}</span>
                                  </div>
                                  <div className="p-3 border-r col-span-2">
                                    <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                      {info.information}
                                    </span>
                                  </div>
                                  <div className="p-3 flex justify-center gap-2">
                                    <button
                                      onClick={() => startEditingInfo(index)}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => removeStoreAdditionalInfo(index)}
                                      className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded text-xs font-medium transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Add New Information - Full Width */}
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Information Type</Label>
                          <Input
                            placeholder="e.g., WorldPay Reference Number, British Gas Account, etc."
                            value={newInfoType}
                            onChange={(e) => setNewInfoType(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-700 block mb-2">Information</Label>
                          <Input
                            placeholder="e.g., WP12345, BG-123456, etc."
                            value={newInformation}
                            onChange={(e) => setNewInformation(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="pt-6">
                          <Button
                            onClick={addStoreAdditionalInfo}
                            disabled={!newInfoType.trim() || !newInformation.trim()}
                            className="h-9 px-6"
                          >
                            Add Information
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Examples: WorldPay Reference Number, British Gas Unique Billing Code, Insurance Policy Number, Landlord Reference, etc.
                      </div>
                    </div>
                  </>
                )}
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