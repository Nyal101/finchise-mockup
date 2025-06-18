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
  linkedTenantId?: string
}

interface Tenant {
  id: string
  name: string
  type: 'xero' | 'quickbooks' | 'sage'
  connectedAt: string
  isLinkedToCompany: boolean
  linkedCompanyId?: string
  organizationId: string
}

interface CompanyGroup {
  id: string
  name: string
  description: string
  companyIds: string[]
  color: string
  createdAt: Date
}

// Add sample tenants data
const initialTenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "Fans (UK) Limited - Xero",
    type: "xero",
    connectedAt: "2023-09-15T10:30:00Z",
    isLinkedToCompany: true,
    linkedCompanyId: "1",
    organizationId: "XR-12345-UK"
  },
  {
    id: "tenant-2", 
    name: "J & R Corporation Limited - Xero",
    type: "xero",
    connectedAt: "2023-10-02T14:45:00Z",
    isLinkedToCompany: true,
    linkedCompanyId: "2",
    organizationId: "XR-67890-JR"
  },
  {
    id: "tenant-3",
    name: "Popat Leisure Limited - Xero", 
    type: "xero",
    connectedAt: "2023-07-10T11:20:00Z",
    isLinkedToCompany: true,
    linkedCompanyId: "4",
    organizationId: "XR-98765-PL"
  },
  {
    id: "tenant-4",
    name: "R & D 2 Pizza Limited - Xero",
    type: "xero", 
    connectedAt: "2023-08-05T13:40:00Z",
    isLinkedToCompany: true,
    linkedCompanyId: "5",
    organizationId: "XR-45678-RD"
  },
  {
    id: "tenant-5",
    name: "DMS1 Limited - Xero",
    type: "xero",
    connectedAt: "2023-09-22T08:30:00Z",
    isLinkedToCompany: true,
    linkedCompanyId: "6", 
    organizationId: "XR-23456-DMS"
  },
  {
    id: "tenant-6",
    name: "KDG Holdings - Xero",
    type: "xero",
    connectedAt: "2023-06-15T15:20:00Z",
    isLinkedToCompany: true,
    linkedCompanyId: "7",
    organizationId: "XR-34567-KDB"
  },
  {
    id: "tenant-7",
    name: "Alpha Business Solutions - Xero",
    type: "xero",
    connectedAt: "2023-11-01T09:15:00Z",
    isLinkedToCompany: false,
    organizationId: "XR-11111-ABS"
  },
  {
    id: "tenant-8", 
    name: "Metro Franchise System - QuickBooks",
    type: "quickbooks",
    connectedAt: "2023-10-15T14:20:00Z",
    isLinkedToCompany: false,
    organizationId: "QB-22222-MFS"
  }
]

// Company data - update to include linkedTenantId
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
    storeCount: 3,
    linkedTenantId: "tenant-1"
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
    storeCount: 4,
    linkedTenantId: "tenant-2"
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
    storeCount: 2,
    linkedTenantId: "tenant-3"
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
    storeCount: 1,
    linkedTenantId: "tenant-4"
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
    storeCount: 5,
    linkedTenantId: "tenant-5"
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
    storeCount: 8,
    linkedTenantId: "tenant-6"
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
  const [isManageConnectionsDialogOpen, setIsManageConnectionsDialogOpen] = React.useState(false)
  const [isAddConnectionDialogOpen, setIsAddConnectionDialogOpen] = React.useState(false)
  const [companySearch, setCompanySearch] = React.useState("")
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>("all")
  const [selectedGroupFilter, setSelectedGroupFilter] = React.useState<string>("all")
  const [selectedCompanyIds, setSelectedCompanyIds] = React.useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<string[]>([])
  const [companyGroups, setCompanyGroups] = React.useState<CompanyGroup[]>(initialCompanyGroups)
  const [tenants, setTenants] = React.useState<Tenant[]>(initialTenants)
  
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
    color: "",
    selectedTenantId: ""
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
      (selectedStatusFilter === "connected" && company.linkedTenantId) ||
      (selectedStatusFilter === "not-connected" && !company.linkedTenantId)
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
      color: company.color,
      selectedTenantId: company.linkedTenantId || ""
    })
    setIsEditCompanyDialogOpen(true)
  }
  
  const handleSaveCompanyEdit = () => {
    console.log("Saving company edit:", editCompanyForm)
    setIsEditCompanyDialogOpen(false)
    setEditingCompany(null)
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

  // Add tenant management functions
  const handleConnectNewXeroTenant = () => {
    console.log("Connecting new Xero tenant...")
    // In a real app, this would initiate the OAuth flow
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: "New Xero Organization",
      type: "xero",
      connectedAt: new Date().toISOString(),
      isLinkedToCompany: false,
      organizationId: `XR-${Math.random().toString(36).substr(2, 9)}`
    }
    setTenants(prev => [...prev, newTenant])
    setIsAddConnectionDialogOpen(false)
  }



  const handleDeleteTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (tenant?.isLinkedToCompany) {
      alert("Cannot delete tenant that is linked to a company. Please unlink it first.")
      return
    }
    setTenants(prev => prev.filter(t => t.id !== tenantId))
  }

  const handleDisconnectTenant = (tenantId: string) => {
    console.log("Disconnecting company from tenant:", tenantId)
    // In a real app, you would update both the company and tenant records
    // This would unlink the company from the tenant
    alert("Company will be disconnected from the accounting system. Data sync will stop but historical data will be preserved.")
  }



  // Get available tenants for company linking (not already linked)
  const getAvailableTenants = () => {
    return tenants.filter(tenant => !tenant.isLinkedToCompany)
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

          <Dialog open={isManageConnectionsDialogOpen} onOpenChange={setIsManageConnectionsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Manage Connections
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl">Manage Accounting System Connections</DialogTitle>
                <DialogDescription className="text-base">
                  Manage your connected accounting system tenants and add new connections.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6">
                <div className="space-y-6">
                  {/* Connected Tenants List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Connected Accounting Systems ({tenants.length})</h3>
                      <Button 
                        onClick={() => setIsAddConnectionDialogOpen(true)} 
                        className="px-4 py-2"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Connection
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {tenants.map((tenant) => (
                        <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center p-2">
                              {tenant.type === 'xero' && (
                                <Image
                                  src="/accounting-logos/xero.png"
                                  alt="Xero"
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 object-contain"
                                />
                              )}
                              {tenant.type === 'quickbooks' && (
                                <Image
                                  src="/accounting-logos/quickbooks.png"
                                  alt="QuickBooks"
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 object-contain"
                                />
                              )}
                              {tenant.type === 'sage' && (
                                <Image
                                  src="/accounting-logos/sage.png"
                                  alt="Sage"
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 object-contain"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-base text-gray-900">{tenant.name}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                Connected: {new Date(tenant.connectedAt).toLocaleDateString('en-GB')}
                                {tenant.isLinkedToCompany && (
                                  <span className="ml-2 text-green-600 font-medium">
                                    • Linked to {companies.find(c => c.id === tenant.linkedCompanyId)?.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTenant(tenant.id)}
                              disabled={tenant.isLinkedToCompany}
                              className="h-9 w-9 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 border-gray-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-6">
                <Button variant="outline" onClick={() => setIsManageConnectionsDialogOpen(false)} className="px-6">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Connection Dialog */}
          <Dialog open={isAddConnectionDialogOpen} onOpenChange={setIsAddConnectionDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Connection</DialogTitle>
                <DialogDescription className="text-base">
                  Choose an accounting system to connect to your franchise management platform.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6">
                <div className="space-y-4">
                  {/* Xero Option - Available */}
                  <div 
                    className="flex items-center p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={handleConnectNewXeroTenant}
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-lg border flex items-center justify-center p-2 mr-4">
                      <Image
                        src="/accounting-logos/xero.png"
                        alt="Xero"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-900">Connect to Xero</div>
                      <div className="text-sm text-gray-500">Connect your Xero accounting system</div>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* QuickBooks Option - Coming Soon */}
                  <div className="flex items-center p-4 border rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center p-2 mr-4">
                      <Image
                        src="/accounting-logos/quickbooks.png"
                        alt="QuickBooks"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain opacity-50"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-500">Connect to QuickBooks</div>
                      <div className="text-sm text-gray-400">Connect your QuickBooks accounting system</div>
                    </div>
                    <div className="text-gray-400">
                      <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full">Coming Soon</span>
                    </div>
                  </div>

                  {/* Sage Option - Coming Soon */}
                  <div className="flex items-center p-4 border rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center p-2 mr-4">
                      <Image
                        src="/accounting-logos/sage.png"
                        alt="Sage"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain opacity-50"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-500">Connect to Sage</div>
                      <div className="text-sm text-gray-400">Connect your Sage accounting system</div>
                    </div>
                    <div className="text-gray-400">
                      <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="pt-6">
                <Button variant="outline" onClick={() => setIsAddConnectionDialogOpen(false)} className="px-6">
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
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
                  <SelectItem value="connected">Connected to Accounting System</SelectItem>
                  <SelectItem value="not-connected">Not Connected</SelectItem>
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
            <span className="w-1/6">Connection Status</span>
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
                      {company.linkedTenantId ? (
                        <div className="text-xs">
                          <div className="text-muted-foreground">Last sync:</div>
                          <div className="font-medium">
                            {new Date(company.lastSyncDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {(() => {
                              const tenant = tenants.find(t => t.id === company.linkedTenantId)
                              return tenant ? (
                                <span className={`px-1 py-0.5 rounded text-xs ${
                                  tenant.type === 'xero' ? 'bg-blue-100 text-blue-700' :
                                  tenant.type === 'quickbooks' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                }`}>
                                  {tenant.type.charAt(0).toUpperCase() + tenant.type.slice(1)}
                                </span>
                              ) : null
                            })()}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Not connected
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


            </div>

            {/* Right Column - Xero Integration & Data Sync */}
            <div className="space-y-3">
                            {/* Tenant Connection */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Accounting System Connection</h3>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        editingCompany?.linkedTenantId 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          editingCompany?.linkedTenantId ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {editingCompany?.linkedTenantId ? 'Connected' : 'Not connected'}
                      </div>
                    </div>
                    
                    {editingCompany?.linkedTenantId ? (
                      /* Connected State - Show tenant info and disconnect option */
                      <div className="space-y-3">
                        <div className="p-3 bg-white border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-50 rounded-lg border flex items-center justify-center p-1">
                              {(() => {
                                const linkedTenant = tenants.find(t => t.id === editingCompany.linkedTenantId)
                                if (linkedTenant?.type === 'xero') {
                                  return (
                                    <Image
                                      src="/accounting-logos/xero.png"
                                      alt="Xero"
                                      width={24}
                                      height={24}
                                      className="w-6 h-6 object-contain"
                                    />
                                  )
                                } else if (linkedTenant?.type === 'quickbooks') {
                                  return (
                                    <Image
                                      src="/accounting-logos/quickbooks.png"
                                      alt="QuickBooks"
                                      width={24}
                                      height={24}
                                      className="w-6 h-6 object-contain"
                                    />
                                  )
                                } else if (linkedTenant?.type === 'sage') {
                                  return (
                                    <Image
                                      src="/accounting-logos/sage.png"
                                      alt="Sage"
                                      width={24}
                                      height={24}
                                      className="w-6 h-6 object-contain"
                                    />
                                  )
                                }
                                return null
                              })()}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900">
                                {tenants.find(t => t.id === editingCompany.linkedTenantId)?.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Connected on {tenants.find(t => t.id === editingCompany.linkedTenantId)?.connectedAt && 
                                new Date(tenants.find(t => t.id === editingCompany.linkedTenantId)!.connectedAt).toLocaleDateString('en-GB')}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="text-amber-600 mt-0.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-amber-800">Disconnect Warning</div>
                              <div className="text-xs text-amber-700 mt-1">
                                Disconnecting from this tenant will stop data synchronization and may affect financial reporting. Historical data will be preserved.
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDisconnectTenant(editingCompany.linkedTenantId!)}
                              className="text-xs px-3 py-1.5"
                            >
                              Disconnect from Tenant
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Not Connected State - Show tenant selection */
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Select Tenant</Label>
                        <Select
                          value={editCompanyForm.selectedTenantId || undefined}
                          onValueChange={(value) => setEditCompanyForm(prev => ({ ...prev, selectedTenantId: value || "" }))}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select an available tenant" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableTenants().map((tenant) => (
                              <SelectItem key={tenant.id} value={tenant.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 flex items-center justify-center">
                                    {tenant.type === 'xero' && (
                                      <Image
                                        src="/accounting-logos/xero.png"
                                        alt="Xero"
                                        width={20}
                                        height={20}
                                        className="w-5 h-5 object-contain"
                                      />
                                    )}
                                    {tenant.type === 'quickbooks' && (
                                      <Image
                                        src="/accounting-logos/quickbooks.png"
                                        alt="QuickBooks"
                                        width={20}
                                        height={20}
                                        className="w-5 h-5 object-contain"
                                      />
                                    )}
                                    {tenant.type === 'sage' && (
                                      <Image
                                        src="/accounting-logos/sage.png"
                                        alt="Sage"
                                        width={20}
                                        height={20}
                                        className="w-5 h-5 object-contain"
                                      />
                                    )}
                                  </div>
                                  {tenant.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Only unlinked tenants are available for selection. Use &quot;Manage Connections&quot; to add new tenants.
                        </p>
                      </div>
                    )}
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