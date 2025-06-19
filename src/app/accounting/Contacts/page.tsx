"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, RefreshCw, Pencil, Eye, Filter } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'
import { ColDef, CellClickedEvent, ICellRendererParams } from 'ag-grid-community'

// Register modules immediately
if (typeof window !== 'undefined') {
  ModuleRegistry.registerModules([AllCommunityModule])
}

interface Contact {
  id: string
  name: string
  company: string
  lastSynced: string
  defaultAccountCode: string
  status: string
  type: "supplier" | "customer"
}

export default function ContactsPage() {
  const [isClient, setIsClient] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [newContactName, setNewContactName] = React.useState("")
  const [contactSearch, setContactSearch] = React.useState("")
  const [selectedCompanyFilter, setSelectedCompanyFilter] = React.useState<string>("all")
  const [selectedTypeFilter, setSelectedTypeFilter] = React.useState<string>("all")
  const [selectedAccountCode, setSelectedAccountCode] = React.useState<string>("")
  const [selectedCompany, setSelectedCompany] = React.useState<string>("")
  const [selectedContactType, setSelectedContactType] = React.useState<string>("")
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null)
  const [editContactName, setEditContactName] = React.useState("")
  const [editSelectedAccountCode, setEditSelectedAccountCode] = React.useState<string>("")
  const [editSelectedCompany, setEditSelectedCompany] = React.useState<string>("")
  const [editSelectedContactType, setEditSelectedContactType] = React.useState<string>("")

  // Mock data - replace with actual data from your backend
  const companies = React.useMemo(() => [
    { id: "1", name: "Bajs Limited" },
    { id: "2", name: "Bellam & Co Limited" },
    { id: "3", name: "Topbake Limited" },
    { id: "4", name: "R&D Yorkshire Limited" },
    { id: "5", name: "Dhillon Brothers Limited" },
    { id: "6", name: "Radas Pizza Ltd" },
    { id: "7", name: "Nij Enterprises Ltd" },
  ], [])

  const accountCodes = React.useMemo(() => [
    { id: "4001", name: "STORE - SALES" },
    { id: "5001", name: "Food - Food with out VAT" },
    { id: "5002", name: "Food - Food Non VAT" },
    { id: "5100", name: "Food - Delivery (Dominos)" },
    { id: "5109", name: "UBER EATS DELIVERY" },
    { id: "5110", name: "JUST EATS DELIVERY" },
    { id: "6001", name: "Dominos - Advertising Levy" },
    { id: "6002", name: "Dominos - Royalties" },
    { id: "6200", name: "Sales Promotions: Text Management" },
    { id: "6202", name: "Sales Promotions- Paragon" },
    { id: "6203", name: "Sales Promotions- Leaflet" },
    { id: "6300", name: "Dominos - Interactive Management Charge" },
    { id: "6301", name: "Dominos - INTERACTIVE CHARGES" },
    { id: "7002", name: "Holiday pay/ Statutary Pay/ Bonus" },
    { id: "7004", name: "Wages - Regular" },
    { id: "4902", name: "BANK INTEREST RECEIVED" },
    { id: "4903", name: "Insurance Claims" },
    { id: "4904", name: "HMRC JRS GRANT" },
    { id: "4905", name: "Competitor Intrusion Rebate" },
    { id: "4906", name: "ICB Rebate" },
    { id: "4907", name: "Rent Income" },
    { id: "4908", name: "Profit on sale of Motor Vehicle" },
    { id: "5004", name: "Commisary Rebate Scheme" },
    { id: "5005", name: "Food - Interstore food Purchases" },
    { id: "5006", name: "C3 National Deal - Food Cost Support" },
    { id: "5007", name: "Recharge Service Charge (VAT)" },
    { id: "5050", name: "Monthly Stock Movement" },
    { id: "6005", name: "Dominos - Other Admin and Marketing Charges" },
    { id: "6006", name: "STORE DEVELOPMENT" },
    { id: "6007", name: "Dominos - GPRS" }
  ], [])

  const contacts: Contact[] = React.useMemo(() => [
    {
      id: "1",
      name: "1st Waste Management",
      company: "Bajs Limited",
      lastSynced: "2024-03-20",
      defaultAccountCode: "5001",
      status: "active",
      type: "supplier"
    },
    {
      id: "2",
      name: "American Express",
      company: "Bellam & Co Limited",
      lastSynced: "2024-03-19",
      defaultAccountCode: "4001",
      status: "active",
      type: "supplier"
    },
    {
      id: "3",
      name: "British Gas",
      company: "Topbake Limited",
      lastSynced: "2024-03-18",
      defaultAccountCode: "6001",
      status: "active",
      type: "supplier"
    },
    {
      id: "4",
      name: "Business Stream",
      company: "R&D Yorkshire Limited",
      lastSynced: "2024-03-17",
      defaultAccountCode: "6001",
      status: "active",
      type: "supplier"
    },
    {
      id: "5",
      name: "Cartridge People",
      company: "Dhillon Brothers Limited",
      lastSynced: "2024-03-16",
      defaultAccountCode: "6005",
      status: "active",
      type: "supplier"
    },
    {
      id: "6",
      name: "Castle Water",
      company: "Radas Pizza Ltd",
      lastSynced: "2024-03-15",
      defaultAccountCode: "6001",
      status: "active",
      type: "supplier"
    },
    {
      id: "7",
      name: "Coca-Cola",
      company: "Nij Enterprises Ltd",
      lastSynced: "2024-03-14",
      defaultAccountCode: "5001",
      status: "active",
      type: "supplier"
    },
    {
      id: "8",
      name: "Complete Wiring Solutions Ltd",
      company: "Maintenance",
      lastSynced: "2024-03-13",
      defaultAccountCode: "6006",
      status: "active",
      type: "supplier"
    },
    {
      id: "9",
      name: "DOMBARM",
      company: "Internal",
      lastSynced: "2024-03-10",
      defaultAccountCode: "4001",
      status: "active",
      type: "customer"
    },
    {
      id: "10",
      name: "DOMKING",
      company: "Internal",
      lastSynced: "2024-03-09",
      defaultAccountCode: "4001",
      status: "active",
      type: "customer"
    },
    {
      id: "11",
      name: "DOMLOSE",
      company: "Internal",
      lastSynced: "2024-03-08",
      defaultAccountCode: "4001",
      status: "active",
      type: "customer"
    },
    {
      id: "12",
      name: "DOMMAID",
      company: "Internal",
      lastSynced: "2024-03-07",
      defaultAccountCode: "4001",
      status: "active",
      type: "customer"
    },
    {
      id: "13",
      name: "DOMSNOD",
      company: "Internal",
      lastSynced: "2024-03-06",
      defaultAccountCode: "4001",
      status: "active",
      type: "customer"
    },
    {
      id: "14",
      name: "DMS1 Limited",
      company: "Services",
      lastSynced: "2024-03-12",
      defaultAccountCode: "7004",
      status: "active",
      type: "customer"
    },
    {
      id: "15",
      name: "DOJO",
      company: "Payment Processing",
      lastSynced: "2024-03-11",
      defaultAccountCode: "4001",
      status: "active",
      type: "customer"
    }
  ], [])

  React.useEffect(() => {
    setIsClient(true)
    // Ensure modules are registered
    ModuleRegistry.registerModules([AllCommunityModule])
  }, [])

  const handleSync = async () => {
    setIsSyncing(true)
    // Implement Xero sync logic here
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
    setIsSyncing(false)
  }

  const handleCreateContact = () => {
    // Implement contact creation logic here
    console.log("Creating contact:", {
      name: newContactName,
      company: companies.find(c => c.id === selectedCompany)?.name,
      defaultAccountCode: selectedAccountCode,
      type: selectedContactType
    })
    setIsDialogOpen(false)
    setNewContactName("")
    setSelectedCompany("")
    setSelectedAccountCode("")
    setSelectedContactType("")
  }

  const handleEditContact = React.useCallback((contact: Contact) => {
    setEditingContact(contact)
    setEditContactName(contact.name)
    setEditSelectedCompany(companies.find(c => c.name === contact.company)?.id || "")
    setEditSelectedAccountCode(contact.defaultAccountCode)
    setEditSelectedContactType(contact.type)
    setIsEditDialogOpen(true)
  }, [companies])

  const handleSaveEdit = () => {
    // Implement contact edit logic here
    console.log("Editing contact:", {
      id: editingContact?.id,
      name: editContactName,
      company: companies.find(c => c.id === editSelectedCompany)?.name,
      defaultAccountCode: editSelectedAccountCode,
      type: editSelectedContactType
    })
    setIsEditDialogOpen(false)
    setEditingContact(null)
    setEditContactName("")
    setEditSelectedCompany("")
    setEditSelectedAccountCode("")
    setEditSelectedContactType("")
  }

  // Avatar color generator
  function stringToColor(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = `hsl(${hash % 360}, 70%, 80%)`
    return color
  }

  // Initials generator
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Custom cell renderers
  const ContactCellRenderer = React.useCallback((params: ICellRendererParams) => {
    const contact = params.data as Contact
    return (
      <div className="flex items-center gap-3 py-1">
        <div
          className="flex items-center justify-center rounded-full text-white font-semibold text-sm"
          style={{
            backgroundColor: stringToColor(contact.name),
            width: 36,
            height: 36,
            minWidth: 36,
            minHeight: 36,
          }}
        >
          {getInitials(contact.name)}
        </div>
        <span className="font-medium text-gray-900">{contact.name}</span>
      </div>
    )
  }, [])

  const TypeCellRenderer = React.useCallback((params: ICellRendererParams) => {
    const type = params.value as string
    return (
      <Badge 
        variant={type === 'supplier' ? 'default' : 'secondary'}
        className={`text-xs font-medium ${
          type === 'supplier' 
            ? 'bg-blue-100 text-blue-800 border-blue-200' 
            : 'bg-green-100 text-green-800 border-green-200'
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }, [])

  const AccountCodeCellRenderer = React.useCallback((params: ICellRendererParams) => {
    const code = params.value as string
    const accountName = accountCodes.find(ac => ac.id === code)?.name || code
    return (
      <div>
        <div className="font-medium text-sm">{code}</div>
        <div className="text-xs text-gray-600 truncate">{accountName}</div>
      </div>
    )
  }, [accountCodes])

  const ActionsCellRenderer = React.useCallback((params: ICellRendererParams) => {
    const contact = params.data as Contact
    
    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation()
      handleEditContact(contact)
    }
    
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEdit}
          className="h-8 px-2"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    )
  }, [handleEditContact])

  // Column definitions for AG Grid
  const columnDefs: ColDef[] = React.useMemo(() => [
    {
      headerName: "Contact",
      field: "name",
      cellRenderer: ContactCellRenderer,
      flex: 2,
      minWidth: 250,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Type",
      field: "type",
      cellRenderer: TypeCellRenderer,
      flex: 0.8,
      minWidth: 100,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Company",
      field: "company",
      flex: 1.5,
      minWidth: 150,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Default Account Codes",
      field: "defaultAccountCode",
      cellRenderer: AccountCodeCellRenderer,
      flex: 1.8,
      minWidth: 180,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Last Synced",
      field: "lastSynced",
      flex: 1,
      minWidth: 120,
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        const date = new Date(params.value)
        return date.toLocaleDateString('en-GB')
      }
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionsCellRenderer,
      width: 80,
      sortable: false,
      filter: false,
      suppressMenu: true,
      resizable: false,
    },
  ], [ContactCellRenderer, TypeCellRenderer, AccountCodeCellRenderer, ActionsCellRenderer])

  // Filter data based on search, company, and type
  const filteredContacts = React.useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = !contactSearch || 
        contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        contact.company.toLowerCase().includes(contactSearch.toLowerCase())
      
      const matchesCompany = selectedCompanyFilter === "all" || 
        contact.company === companies.find(c => c.id === selectedCompanyFilter)?.name
      
      const matchesType = selectedTypeFilter === "all" || contact.type === selectedTypeFilter
      
      return matchesSearch && matchesCompany && matchesType
    })
  }, [contacts, contactSearch, selectedCompanyFilter, selectedTypeFilter, companies])

  const onCellClicked = (event: CellClickedEvent) => {
    if (event.colDef.field !== "actions") {
      // Could implement row selection or detail view here
      console.log("Contact clicked:", event.data)
    }
  }

  // Contact type counts for filter tabs
  const contactCounts = React.useMemo(() => {
    const counts = { all: 0, supplier: 0, customer: 0 }
    filteredContacts.forEach(contact => {
      counts.all++
      counts[contact.type as keyof typeof counts]++
    })
    return counts
  }, [filteredContacts])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your suppliers and customers</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Contact</DialogTitle>
                <DialogDescription>
                  Add a new contact and select a company.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Contact Name</Label>
                  <Input
                    id="name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Company</Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Default Account Code</Label>
                  <Select value={selectedAccountCode} onValueChange={setSelectedAccountCode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account code" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountCodes.map((code) => (
                        <SelectItem key={code.id} value={code.id}>
                          {code.id} - {code.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Contact Type</Label>
                  <Select value={selectedContactType} onValueChange={setSelectedContactType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContact} disabled={!newContactName || !selectedCompany || !selectedAccountCode || !selectedContactType}>
                  Create Contact
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Tabs and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {Object.entries(contactCounts).map(([type, count]) => (
            <button
              key={type}
              onClick={() => setSelectedTypeFilter(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTypeFilter === type
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {type === 'all' ? 'All Contacts' : type.charAt(0).toUpperCase() + type.slice(1) + 's'} ({count})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
            />
          </div>

          <Select value={selectedCompanyFilter} onValueChange={setSelectedCompanyFilter}>
            <SelectTrigger className="w-[200px]">
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
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{contactCounts.all}</p>
              <p className="text-sm text-gray-600">Total Contacts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
              <Filter className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{contactCounts.supplier}</p>
              <p className="text-sm text-gray-600">Suppliers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
              <Filter className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{contactCounts.customer}</p>
              <p className="text-sm text-gray-600">Customers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
              <RefreshCw className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">Active</p>
              <p className="text-sm text-gray-600">All Synced</p>
            </div>
          </div>
        </div>
      </div>

      {/* AG Grid */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="ag-theme-material" style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={filteredContacts}
            onCellClicked={onCellClicked}
            rowSelection="single"
            suppressRowClickSelection={false}
            domLayout="normal"
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
            }}
            rowHeight={60}
            headerHeight={50}
            floatingFiltersHeight={35}
            suppressMenuHide={true}
            rowClass="cursor-pointer hover:bg-gray-50"
            animateRows={true}
            pagination={false}
            suppressCellFocus={true}
          />
        </div>
      </div>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update the contact information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Contact Name</Label>
              <Input
                id="edit-name"
                value={editContactName}
                onChange={(e) => setEditContactName(e.target.value)}
                placeholder="Enter contact name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Company</Label>
              <Select value={editSelectedCompany} onValueChange={setEditSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Default Account Code</Label>
              <Select value={editSelectedAccountCode} onValueChange={setEditSelectedAccountCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account code" />
                </SelectTrigger>
                <SelectContent>
                  {accountCodes.map((code) => (
                    <SelectItem key={code.id} value={code.id}>
                      {code.id} - {code.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Contact Type</Label>
              <Select value={editSelectedContactType} onValueChange={setEditSelectedContactType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editContactName || !editSelectedCompany || !editSelectedAccountCode || !editSelectedContactType}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
