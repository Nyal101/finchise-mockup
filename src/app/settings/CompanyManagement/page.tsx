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
import { Plus, Search, RefreshCw, Pencil, Trash2, Building2, Settings } from "lucide-react"
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
import Image from "next/image"

// Companies House API interfaces
interface CompaniesHouseCompany {
  company_number: string
  title: string
  company_status: string
  company_type: string
  date_of_creation: string
  address: {
    address_line_1?: string
    address_line_2?: string
    locality?: string
    postal_code?: string
    country?: string
  }
}

interface CompaniesHouseSearchResponse {
  items: CompaniesHouseCompany[]
  total_results: number
}

// Define types
interface Company {
  id: string
  name: string
  tenantId: string
  organization: string
  isConnectedToXero: boolean
  connectedAt: string
  lastSyncDate: string
  color: string
  xeroCompanyName: string
  financialYearStart: string
  booksCloseDate: string
  storeCount: number
}

interface CompanyGroup {
  id: string
  name: string
  description: string
  companyIds: string[]
  color: string
  createdAt: Date
}

// Company data
const companies: Company[] = [
  {
    id: "1",
    name: "Fans (UK) Limited",
    tenantId: "XR-12345-UK",
    organization: "Fans UK Holdings",
    isConnectedToXero: true,
    connectedAt: "2023-09-15T10:30:00Z",
    lastSyncDate: "2023-11-12T08:15:22Z",
    color: "#3b82f6",
    xeroCompanyName: "Fans (UK) Limited",
    financialYearStart: "April",
    booksCloseDate: "31/03/2024",
    storeCount: 3
  },
  {
    id: "2",
    name: "J & R Corporation Limited", 
    tenantId: "XR-67890-JR",
    organization: "J&R Enterprise Group",
    isConnectedToXero: true,
    connectedAt: "2023-10-02T14:45:00Z",
    lastSyncDate: "2023-11-10T16:30:45Z",
    color: "#10b981",
    xeroCompanyName: "J & R Corporation Limited",
    financialYearStart: "January",
    booksCloseDate: "31/12/2023",
    storeCount: 4
  },
  {
    id: "3",
    name: "MDJ Investments Limited",
    tenantId: "", 
    organization: "MDJ Holdings Ltd",
    isConnectedToXero: false,
    connectedAt: "",
    lastSyncDate: "",
    color: "#f59e0b",
    xeroCompanyName: "",
    financialYearStart: "April",
    booksCloseDate: "",
    storeCount: 3
  },
  {
    id: "4",
    name: "Popat Leisure Limited",
    tenantId: "XR-98765-PL",
    organization: "Popat Leisure Limited", 
    isConnectedToXero: true,
    connectedAt: "2023-07-10T11:20:00Z",
    lastSyncDate: "2023-11-11T10:15:22Z",
    color: "#ef4444",
    xeroCompanyName: "Popat Leisure Limited",
    financialYearStart: "April",
    booksCloseDate: "31/03/2024",
    storeCount: 2
  },
  {
    id: "5",
    name: "R & D 2 Pizza Limited",
    tenantId: "XR-45678-RD",
    organization: "R & D Enterprise",
    isConnectedToXero: true, 
    connectedAt: "2023-08-05T13:40:00Z",
    lastSyncDate: "2023-11-09T14:25:18Z",
    color: "#8b5cf6",
    xeroCompanyName: "R & D 2 Pizza Limited",
    financialYearStart: "January",
    booksCloseDate: "31/12/2023",
    storeCount: 1
  },
  {
    id: "6",
    name: "DMS1 Limited",
    tenantId: "XR-23456-DMS",
    organization: "DMS Group",
    isConnectedToXero: true,
    connectedAt: "2023-09-22T08:30:00Z", 
    lastSyncDate: "2023-11-08T09:45:30Z",
    color: "#06b6d4",
    xeroCompanyName: "DMS1 Limited",
    financialYearStart: "April",
    booksCloseDate: "31/03/2024",
    storeCount: 5
  },
  {
    id: "7",
    name: "KDG Holdings",
    tenantId: "XR-34567-KDB",
    organization: "KDG Holdings",
    isConnectedToXero: true,
    connectedAt: "2023-06-15T15:20:00Z",
    lastSyncDate: "2023-11-07T16:10:45Z", 
    color: "#84cc16",
    xeroCompanyName: "KDG Holdings Limited",
    financialYearStart: "April", 
    booksCloseDate: "31/03/2024",
    storeCount: 8
  },
  {
    id: "8",
    name: "Alpha Pizza Group",
    tenantId: "",
    organization: "Alpha Food Ventures",
    isConnectedToXero: false,
    connectedAt: "",
    lastSyncDate: "",
    color: "#f97316",
    xeroCompanyName: "",
    financialYearStart: "April",
    booksCloseDate: "",
    storeCount: 6
  },
  {
    id: "9",
    name: "Metro Franchise Ltd",
    tenantId: "",
    organization: "Metro Business Holdings",
    isConnectedToXero: false,
    connectedAt: "",
    lastSyncDate: "",
    color: "#ec4899",
    xeroCompanyName: "",
    financialYearStart: "January",
    booksCloseDate: "",
    storeCount: 4
  },
  {
    id: "10",
    name: "Crown Restaurant Group",
    tenantId: "",
    organization: "Crown Hospitality Ltd",
    isConnectedToXero: false,
    connectedAt: "",
    lastSyncDate: "",
    color: "#6366f1",
    xeroCompanyName: "",
    financialYearStart: "April",
    booksCloseDate: "",
    storeCount: 2
  },
  {
    id: "11",
    name: "Phoenix Dining Solutions",
    tenantId: "",
    organization: "Phoenix Corporate Ltd",
    isConnectedToXero: false,
    connectedAt: "",
    lastSyncDate: "",
    color: "#8b5cf6",
    xeroCompanyName: "",
    financialYearStart: "January",
    booksCloseDate: "",
    storeCount: 3
  }
]

// Sample company groups
const initialCompanyGroups: CompanyGroup[] = [
  {
    id: "group-1",
    name: "London Companies",
    description: "Companies operating in Greater London area",
    companyIds: ["1", "2", "7", "8"],
    color: "#3b82f6",
    createdAt: new Date("2024-01-15")
  },
  {
    id: "group-2",
    name: "All South Companies", 
    description: "Companies operating in Southern England",
    companyIds: ["3", "4", "5", "11"],
    color: "#10b981",
    createdAt: new Date("2024-01-20")
  },
  {
    id: "group-3",
    name: "Multi-Region Operators", 
    description: "Companies with operations across multiple regions",
    companyIds: ["6", "7"],
    color: "#f59e0b",
    createdAt: new Date("2024-02-01")
  },
  {
    id: "group-4",
    name: "Emerging Franchises", 
    description: "Newer companies in expansion phase",
    companyIds: ["9", "10", "11"],
    color: "#8b5cf6",
    createdAt: new Date("2024-02-10")
  }
]

export default function CompanyManagementPage() {
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = React.useState(false)
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = React.useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = React.useState(false)
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = React.useState(false)
  const [companySearch, setCompanySearch] = React.useState("")
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>("all")
  const [selectedGroupFilter, setSelectedGroupFilter] = React.useState<string>("all")
  const [selectedCompanyIds, setSelectedCompanyIds] = React.useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<string[]>([])
  const [companyGroups, setCompanyGroups] = React.useState<CompanyGroup[]>(initialCompanyGroups)
  
  // Companies House search states
  const [companySearchQuery, setCompanySearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<CompaniesHouseCompany[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [selectedCompanyFromSearch, setSelectedCompanyFromSearch] = React.useState<CompaniesHouseCompany | null>(null)
  const [searchStep, setSearchStep] = React.useState<"search" | "confirm">("search")
  
  // Form states
  const [newCompanyForm, setNewCompanyForm] = React.useState({
    name: "",
    organization: ""
  })
  
  const [editingCompany, setEditingCompany] = React.useState<Company | null>(null)
  const [editCompanyForm, setEditCompanyForm] = React.useState({
    name: "",
    organization: "",
    color: "",
    downloadYears: "1",
    startMonth: "January"
  })
  
  const [groupFormData, setGroupFormData] = React.useState({
    name: "",
    description: "",
    companyIds: [] as string[],
    color: "#3b82f6"
  })
  
  const [editingGroupId, setEditingGroupId] = React.useState<string | null>(null)
  
  // Available colors for auto-assignment to companies
  const availableColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1",
    "#64748b", "#059669", "#dc2626", "#7c3aed", "#0891b2"
  ]
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  // Utility functions
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  
  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(companySearch.toLowerCase())
    const matchesStatus = selectedStatusFilter === "all" || 
      (selectedStatusFilter === "connected" && company.isConnectedToXero) ||
      (selectedStatusFilter === "not-connected" && !company.isConnectedToXero)
    const matchesGroup = selectedGroupFilter === "all" || 
      companyGroups.find(group => group.id === selectedGroupFilter)?.companyIds.includes(company.id)
    
    return matchesSearch && matchesStatus && matchesGroup
  })
  
  // Filter groups
  const filteredGroups = companyGroups.filter(group =>
    group.name.toLowerCase().includes(companySearch.toLowerCase())
  )
  
  // Company Management Functions
  const searchCompaniesHouse = async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    try {
      // Note: In production, you'll need to handle CORS and authentication
      // You might need to use a backend proxy for this API call
      const response = await fetch(
        `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': 'YOUR_API_KEY_HERE', // You'll need to get an API key
          }
        }
      )
      
      if (response.ok) {
        const data: CompaniesHouseSearchResponse = await response.json()
        setSearchResults(data.items.slice(0, 10)) // Limit to 10 results
      } else {
        // For demo purposes, let's use mock data
        const mockResults: CompaniesHouseCompany[] = [
          {
            company_number: "12345678",
            title: `${query} LIMITED`,
            company_status: "active",
            company_type: "ltd",
            date_of_creation: "2020-01-15",
            address: {
              address_line_1: "123 Business Street",
              locality: "London",
              postal_code: "SW1A 1AA",
              country: "England"
            }
          },
          {
            company_number: "87654321",
            title: `${query} ENTERPRISES LTD`,
            company_status: "active", 
            company_type: "ltd",
            date_of_creation: "2019-06-20",
            address: {
              address_line_1: "456 Commerce Road",
              locality: "Manchester",
              postal_code: "M1 1AA",
              country: "England"
            }
          }
        ]
        setSearchResults(mockResults)
      }
    } catch (error) {
      console.error("Error searching Companies House:", error)
      // Use mock data on error
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleCreateCompany = () => {
    if (selectedCompanyFromSearch) {
      const newCompany: Company = {
        id: (companies.length + 1).toString(),
        name: selectedCompanyFromSearch.title,
        tenantId: "",
        organization: selectedCompanyFromSearch.title,
        isConnectedToXero: false,
        connectedAt: "",
        lastSyncDate: "",
        color: getNextAvailableColor(),
        xeroCompanyName: "",
        financialYearStart: "April",
        booksCloseDate: "",
        storeCount: 0
      }
      
      // In a real app, you'd add this to your database/state management
      console.log("Creating company from Companies House:", newCompany)
      
      // Reset form and close dialog
      setIsAddCompanyDialogOpen(false)
      setNewCompanyForm({ name: "", organization: "" })
      setCompanySearchQuery("")
      setSearchResults([])
      setSelectedCompanyFromSearch(null)
      setSearchStep("search")
    }
  }

  const handleSelectCompanyFromSearch = (company: CompaniesHouseCompany) => {
    setSelectedCompanyFromSearch(company)
    setNewCompanyForm({
      name: company.title,
      organization: company.title
    })
    setSearchStep("confirm")
  }

  const handleBackToSearch = () => {
    setSelectedCompanyFromSearch(null)
    setSearchStep("search")
  }
  
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company)
    setEditCompanyForm({
      name: company.name,
      organization: company.organization,
      color: company.color,
      downloadYears: "1",
      startMonth: company.financialYearStart
    })
    setIsEditCompanyDialogOpen(true)
  }
  
  const handleSaveCompanyEdit = () => {
    console.log("Saving company edit:", editCompanyForm)
    setIsEditCompanyDialogOpen(false)
    setEditingCompany(null)
  }
  
  const handleConnectXero = (companyId: string) => {
    console.log("Connecting to Xero:", companyId)
  }
  
  const handleDisconnectXero = (companyId: string) => {
    console.log("Disconnecting from Xero:", companyId)
  }
  
  const handleSyncCompany = (companyId: string) => {
    console.log("Syncing company:", companyId)
  }
  
  const handleSyncAllCompanies = () => {
    console.log("Syncing all companies:", companies.filter(c => c.isConnectedToXero).map(c => c.id))
  }
  
  // Group Management Functions
  const handleCreateGroup = () => {
    // Auto-assign color from available palette
    const usedColors = companyGroups.map(group => group.color)
    const availableColor = availableColors.find(color => !usedColors.includes(color)) || availableColors[0]
    
    const newGroup: CompanyGroup = {
      id: `group-${Date.now()}`,
      name: groupFormData.name,
      description: groupFormData.description,
      companyIds: groupFormData.companyIds,
      color: availableColor,
      createdAt: new Date()
    }
    setCompanyGroups([...companyGroups, newGroup])
    setIsGroupDialogOpen(false)
    setGroupFormData({ name: "", description: "", companyIds: [], color: "#3b82f6" })
  }
  
  const handleEditGroup = (group: CompanyGroup) => {
    setEditingGroupId(group.id)
    setGroupFormData({
      name: group.name,
      description: group.description,
      companyIds: group.companyIds,
      color: group.color
    })
    setIsEditGroupDialogOpen(true)
  }
  
  const handleSaveGroupEdit = () => {
    if (editingGroupId) {
      setCompanyGroups(groups => 
        groups.map(group => 
          group.id === editingGroupId 
            ? { ...group, ...groupFormData }
            : group
        )
      )
      setIsEditGroupDialogOpen(false)
      setEditingGroupId(null)
      setGroupFormData({ name: "", description: "", companyIds: [], color: "#3b82f6" })
    }
  }
  
  const handleDeleteGroup = (groupId: string) => {
    setCompanyGroups(groups => groups.filter(group => group.id !== groupId))
  }
  
  const toggleCompanyInGroup = (companyId: string) => {
    setGroupFormData(prev => ({
      ...prev,
      companyIds: prev.companyIds.includes(companyId)
        ? prev.companyIds.filter(id => id !== companyId)
        : [...prev.companyIds, companyId]
    }))
  }
  
  // Selection functions
  const allCompaniesSelected = filteredCompanies.length > 0 && filteredCompanies.every(c => selectedCompanyIds.includes(c.id))
  const someCompaniesSelected = filteredCompanies.some(c => selectedCompanyIds.includes(c.id)) && !allCompaniesSelected
  
  function toggleSelectAllCompanies() {
    if (allCompaniesSelected) {
      setSelectedCompanyIds(ids => ids.filter(id => !filteredCompanies.some(c => c.id === id)))
    } else {
      setSelectedCompanyIds(ids => [
        ...ids,
        ...filteredCompanies.map(c => c.id).filter(id => !ids.includes(id))
      ])
    }
  }
  
  function toggleCompany(id: string) {
    setSelectedCompanyIds(ids =>
      ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
    )
  }
  
  const allGroupsSelected = filteredGroups.length > 0 && filteredGroups.every(g => selectedGroupIds.includes(g.id))
  const someGroupsSelected = filteredGroups.some(g => selectedGroupIds.includes(g.id)) && !allGroupsSelected
  
  function toggleSelectAllGroups() {
    if (allGroupsSelected) {
      setSelectedGroupIds(ids => ids.filter(id => !filteredGroups.some(g => g.id === id)))
    } else {
      setSelectedGroupIds(ids => [
        ...ids,
        ...filteredGroups.map(g => g.id).filter(id => !ids.includes(id))
      ])
    }
  }
  
  function toggleGroup(id: string) {
    setSelectedGroupIds(ids =>
      ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
    )
  }

  // Function to auto-generate color for new company
  const getNextAvailableColor = () => {
    const usedColors = companies.map(company => company.color)
    const unusedColors = availableColors.filter(color => !usedColors.includes(color))
    
    if (unusedColors.length > 0) {
      return unusedColors[0]
    }
    
    // If all colors are used, use a random one
    return availableColors[Math.floor(Math.random() * availableColors.length)]
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Company Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSyncAllCompanies}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync All
          </Button>
          
          <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Company Group</DialogTitle>
                <DialogDescription>
                  Create a new group to organize your companies.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="grid gap-2">
                  <Label>Group Name</Label>
                  <Input
                    placeholder="Enter group name"
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-9"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter group description"
                    value={groupFormData.description}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[60px] resize-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Select Companies</Label>
                  <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          checked={groupFormData.companyIds.includes(company.id)}
                          onCheckedChange={() => toggleCompanyInGroup(company.id)}
                        />
                        <span className="text-sm">{company.name}</span>
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
          
          <Dialog open={isAddCompanyDialogOpen} onOpenChange={setIsAddCompanyDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Company</DialogTitle>
                <DialogDescription>
                  Search for a company using the Companies House database.
                </DialogDescription>
              </DialogHeader>
              
              {searchStep === "search" ? (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Search Companies House</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter company name to search..."
                        value={companySearchQuery}
                        onChange={(e) => setCompanySearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchCompaniesHouse(companySearchQuery)}
                      />
                      <Button 
                        onClick={() => searchCompaniesHouse(companySearchQuery)}
                        disabled={isSearching || !companySearchQuery.trim()}
                      >
                        {isSearching ? "Searching..." : "Search"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Search the official Companies House database to find registered UK companies.
                    </p>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="grid gap-2">
                      <Label>Search Results</Label>
                      <div className="border rounded-lg max-h-60 overflow-y-auto">
                        {searchResults.map((company) => (
                          <div
                            key={company.company_number}
                            className="p-3 border-b last:border-b-0 hover:bg-accent cursor-pointer transition-colors"
                            onClick={() => handleSelectCompanyFromSearch(company)}
                          >
                            <div className="font-medium">{company.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Company No: {company.company_number} • Status: {company.company_status}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {company.address.address_line_1}, {company.address.locality}, {company.address.postal_code}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isSearching && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-sm text-muted-foreground">Searching Companies House...</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Selected Company</Label>
                    <div className="p-3 border rounded-lg bg-accent">
                      <div className="font-medium">{selectedCompanyFromSearch?.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Company No: {selectedCompanyFromSearch?.company_number}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedCompanyFromSearch?.address.address_line_1}, {selectedCompanyFromSearch?.address.locality}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Company Name</Label>
                    <Input
                      value={newCompanyForm.name}
                      onChange={(e) => setNewCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Organization</Label>
                    <Input
                      value={newCompanyForm.organization}
                      onChange={(e) => setNewCompanyForm(prev => ({ ...prev, organization: e.target.value }))}
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium">Next Steps:</p>
                    <p>After adding this company, you can connect it to Xero using the &quot;Edit Company&quot; button and clicking &quot;Connect to Xero&quot;.</p>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddCompanyDialogOpen(false)
                  setSearchStep("search")
                  setCompanySearchQuery("")
                  setSearchResults([])
                  setSelectedCompanyFromSearch(null)
                  setNewCompanyForm({ name: "", organization: "" })
                }}>
                  Cancel
                </Button>
                
                {searchStep === "confirm" && (
                  <Button variant="outline" onClick={handleBackToSearch}>
                    Back to Search
                  </Button>
                )}
                
                {searchStep === "confirm" && (
                  <Button onClick={handleCreateCompany} disabled={!selectedCompanyFromSearch}>
                    Add Company
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Companies ({filteredCompanies.length})</CardTitle>
          
          {/* Search and Filter bar moved inside */}
          <div className="flex items-center gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies"
                className="pl-8"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by connection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="connected">Connected to Xero</SelectItem>
                  <SelectItem value="not-connected">Not connected to Xero</SelectItem>
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
                  {companyGroups.map((group) => (
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
            {selectedCompanyIds.length} compan{selectedCompanyIds.length !== 1 ? 'ies' : 'y'} selected
          </div>
          
          {/* Companies table header */}
          <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
            <input
              type="checkbox"
              checked={allCompaniesSelected}
              ref={el => { if (el) el.indeterminate = someCompaniesSelected; }}
              onChange={toggleSelectAllCompanies}
              className="mr-4 h-4 w-4"
            />
            <span className="w-1/2">Company</span>
            <span className="w-1/6">Xero Connection</span>
            <span className="w-1/6">Stores</span>
            <span className="w-1/6">Actions</span>
          </div>

          {/* Scrollable companies list */}
          <ScrollArea className="h-[400px] w-full">
            <div>
              {filteredCompanies.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  No companies found
                </div>
              ) : (
                filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompanyIds.includes(company.id)}
                      onChange={() => toggleCompany(company.id)}
                      className="mr-4 h-4 w-4"
                    />
                    <div className="flex items-center w-1/2">
                      <div
                        className="flex items-center justify-center rounded-md mr-3"
                        style={{
                          backgroundColor: company.color,
                          width: 32,
                          height: 32,
                          minWidth: 32,
                          minHeight: 32,
                        }}
                      >
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm truncate">{company.name}</span>
                    </div>
                    <div className="w-1/6">
                      {company.isConnectedToXero ? (
                        <div className="text-xs">
                          <div className="text-muted-foreground">Last sync:</div>
                          <div className="font-medium">
                            {new Date(company.lastSyncDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Not connected to Xero
                        </span>
                      )}
                    </div>
                    <span className="w-1/6 text-sm">{company.storeCount} stores</span>
                    <div className="w-1/6 flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCompany(company)}
                        className="h-8"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncCompany(company.id)}
                        className="h-8"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Company Groups ({filteredGroups.length})</CardTitle>
          
          {/* Search bar moved inside */}
          <div className="flex items-center gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                className="pl-8"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Selection count */}
          <div className="text-xs text-muted-foreground mb-3">
            {selectedGroupIds.length} group{selectedGroupIds.length !== 1 ? 's' : ''} selected
          </div>
          
          {/* Groups table header */}
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
            <span className="w-1/4">Companies</span>
            <span className="w-1/4">Actions</span>
          </div>

          {/* Scrollable groups list */}
          <ScrollArea className="h-[300px] w-full">
            <div>
              {filteredGroups.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  No groups found
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
                      {group.companyIds.map(companyId => {
                        const company = companies.find(c => c.id === companyId)
                        return company ? (
                          <Badge
                            key={companyId}
                            variant="secondary"
                            className="text-xs"
                            style={{ backgroundColor: company.color + '20', color: company.color }}
                          >
                            {company.name.split(' ')[0]}
                          </Badge>
                        ) : null
                      })}
                    </div>
                    <div className="w-1/4 flex gap-1">
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
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      <Dialog open={isEditCompanyDialogOpen} onOpenChange={setIsEditCompanyDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: editingCompany?.color }}
              />
              <DialogTitle className="text-lg">Company Settings - {editingCompany?.name}</DialogTitle>
            </div>
            <DialogDescription>
              Manage company information, Xero integration, and sync preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-3">
            {/* Left Column - Company Information & Xero Details */}
            <div className="space-y-3">
              {/* Basic Company Info */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Company Information</h3>
                <div className="space-y-3">
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                    <Input
                      value={editCompanyForm.name}
                      onChange={(e) => setEditCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                      className="h-9"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Organization</Label>
                    <Input
                      value={editCompanyForm.organization}
                      onChange={(e) => setEditCompanyForm(prev => ({ ...prev, organization: e.target.value }))}
                      className="h-9"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Company Color</Label>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: editingCompany?.color }}
                      />
                      <span className="text-sm text-gray-600">
                        Auto-assigned: {editingCompany?.color}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Xero Details (Read-Only) */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Xero Details</h3>
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  {editingCompany?.isConnectedToXero ? (
                    <>
                      <div className="grid gap-1">
                        <Label className="text-sm font-medium text-gray-700">Xero Company Name</Label>
                        <div className="p-2 bg-white border rounded text-sm text-gray-600">
                          {editingCompany?.xeroCompanyName || "Not available"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1">
                          <Label className="text-sm font-medium text-gray-700">Financial Year</Label>
                          <div className="p-2 bg-white border rounded text-sm text-gray-600">
                            {editingCompany?.financialYearStart || "Not set"}
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <Label className="text-sm font-medium text-gray-700">Books Close</Label>
                          <div className="p-2 bg-white border rounded text-sm text-gray-600">
                            {editingCompany?.booksCloseDate || "Not set"}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-gray-500 text-sm">
                        Company is not connected to Xero
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Xero Integration & Data Sync */}
            <div className="space-y-3">
              {/* Xero Connection */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Xero Integration</h3>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        editingCompany?.isConnectedToXero 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          editingCompany?.isConnectedToXero ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {editingCompany?.isConnectedToXero ? 'Connected' : 'Not connected'}
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      {editingCompany?.isConnectedToXero ? (
                        <Button
                          variant="outline"
                          onClick={() => handleDisconnectXero(editingCompany.id)}
                          className="p-2 h-auto border-0 bg-transparent hover:bg-gray-50"
                        >
                          <Image
                            src="/Xero-Connect-Buttons/disconnect-white.svg"
                            alt="Disconnect from Xero"
                            width={120}
                            height={30}
                            className="rounded"
                          />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleConnectXero(editingCompany?.id || "")}
                          className="p-2 h-auto border-0 bg-transparent hover:bg-gray-50"
                        >
                          <Image
                            src="/Xero-Connect-Buttons/connect-white.svg"
                            alt="Connect to Xero"
                            width={120}
                            height={30}
                            className="rounded"
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sync Preferences */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Data Sync</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1">
                      <Label className="text-sm font-medium text-gray-700">Download data</Label>
                      <Select
                        value={editCompanyForm.downloadYears}
                        onValueChange={(value) => setEditCompanyForm(prev => ({ ...prev, downloadYears: value }))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 year</SelectItem>
                          <SelectItem value="2">2 years</SelectItem>
                          <SelectItem value="3">3 years</SelectItem>
                          <SelectItem value="5">5 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-sm font-medium text-gray-700">Starting in</Label>
                      <Select
                        value={editCompanyForm.startMonth}
                        onValueChange={(value) => setEditCompanyForm(prev => ({ ...prev, startMonth: value }))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Statistics */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{editingCompany?.storeCount || 0}</div>
                    <div className="text-sm text-gray-600">Total Stores</div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {editingCompany?.isConnectedToXero ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-sm text-gray-600">Xero Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t pt-3">
            <Button variant="outline" onClick={() => setIsEditCompanyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompanyEdit} className="bg-blue-600 hover:bg-blue-700">
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
              <DialogTitle className="text-lg">Edit Company Group</DialogTitle>
            </div>
            <DialogDescription>
              Update group information and company assignments.
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
                      placeholder="e.g., London Companies, All South Companies"
                      value={groupFormData.name}
                      onChange={(e) => setGroupFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-9"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      placeholder="Brief description of this group"
                      value={groupFormData.description}
                      onChange={(e) => setGroupFormData(prev => ({ ...prev, description: e.target.value }))}
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
                    {groupFormData.companyIds.length} companies selected
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {groupFormData.companyIds.map(companyId => {
                      const company = companies.find(c => c.id === companyId)
                      return company ? (
                        <Badge
                          key={companyId}
                          variant="secondary"
                          className="text-xs"
                          style={{ backgroundColor: company.color + '20', color: company.color }}
                        >
                          {company.name.split(' ')[0]}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Company Selection */}
            <div className="space-y-3">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Company Selection</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Select companies for this group:
                  </div>
                  <div className="border rounded-lg p-3 bg-gray-50 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {companies.map((company) => (
                        <div key={company.id} className="flex items-center space-x-3 p-2 rounded hover:bg-white transition-colors">
                          <Checkbox
                            checked={groupFormData.companyIds.includes(company.id)}
                            onCheckedChange={() => toggleCompanyInGroup(company.id)}
                          />
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: company.color }}
                          >
                            <span className="text-white text-xs font-bold">
                              {getInitials(company.name)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                            <div className="text-xs text-gray-500">{company.organization}</div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            company.isConnectedToXero ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {company.isConnectedToXero ? 'Connected' : 'Not connected'}
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