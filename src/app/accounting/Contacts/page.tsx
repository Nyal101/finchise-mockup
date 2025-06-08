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
import { Plus, Search, RefreshCw, Pencil } from "lucide-react"
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

interface Contact {
  id: string
  name: string
  company: string
  lastSynced: string
  defaultAccountCode: string
  status: string
  balance: number
  type: "supplier" | "customer"
}

export default function ContactsPage() {
  const [isSyncing, setIsSyncing] = React.useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [newContactName, setNewContactName] = React.useState("")
  const [selectedSupplierIds, setSelectedSupplierIds] = React.useState<string[]>([])
  const [selectedCustomerIds, setSelectedCustomerIds] = React.useState<string[]>([])
  const [contactSearch, setContactSearch] = React.useState("")
  const [selectedCompanyFilter, setSelectedCompanyFilter] = React.useState<string>("all")
  const [selectedAccountCode, setSelectedAccountCode] = React.useState<string>("")
  const [selectedCompany, setSelectedCompany] = React.useState<string>("")
  const [selectedContactType, setSelectedContactType] = React.useState<string>("")
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null)
  const [editContactName, setEditContactName] = React.useState("")
  const [editSelectedAccountCode, setEditSelectedAccountCode] = React.useState<string>("")
  const [editSelectedCompany, setEditSelectedCompany] = React.useState<string>("")
  const [editSelectedContactType, setEditSelectedContactType] = React.useState<string>("")

  // Mock data - replace with actual data from your backend
  const companies = [
    { id: "1", name: "Bajs Limited" },
    { id: "2", name: "Bellam & Co Limited" },
    { id: "3", name: "Topbake Limited" },
    { id: "4", name: "R&D Yorkshire Limited" },
    { id: "5", name: "Dhillon Brothers Limited" },
    { id: "6", name: "Radas Pizza Ltd" },
    { id: "7", name: "Nij Enterprises Ltd" },
  ]

  const accountCodes = [
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
  ]

  const contacts: Contact[] = [
    {
      id: "1",
      name: "1st Waste Management",
      company: "Bajs Limited",
      lastSynced: "2024-03-20",
      defaultAccountCode: "5001",
      status: "active",
      balance: 3226.85,
      type: "supplier"
    },
    {
      id: "2",
      name: "American Express",
      company: "Bellam & Co Limited",
      lastSynced: "2024-03-19",
      defaultAccountCode: "4001",
      status: "active",
      balance: 0,
      type: "supplier"
    },
    {
      id: "3",
      name: "British Gas",
      company: "Topbake Limited",
      lastSynced: "2024-03-18",
      defaultAccountCode: "6001",
      status: "active",
      balance: -806.28,
      type: "supplier"
    },
    {
      id: "4",
      name: "Business Stream",
      company: "R&D Yorkshire Limited",
      lastSynced: "2024-03-17",
      defaultAccountCode: "6001",
      status: "active",
      balance: 162.58,
      type: "supplier"
    },
    {
      id: "5",
      name: "Cartridge People",
      company: "Dhillon Brothers Limited",
      lastSynced: "2024-03-16",
      defaultAccountCode: "6005",
      status: "active",
      balance: 424.91,
      type: "supplier"
    },
    {
      id: "6",
      name: "Castle Water",
      company: "Radas Pizza Ltd",
      lastSynced: "2024-03-15",
      defaultAccountCode: "6001",
      status: "active",
      balance: 2601.99,
      type: "supplier"
    },
    {
      id: "7",
      name: "Coca-Cola",
      company: "Nij Enterprises Ltd",
      lastSynced: "2024-03-14",
      defaultAccountCode: "5001",
      status: "active",
      balance: 4280.64,
      type: "supplier"
    },
    {
      id: "8",
      name: "Complete Wiring Solutions Ltd",
      company: "Maintenance",
      lastSynced: "2024-03-13",
      defaultAccountCode: "6006",
      status: "active",
      balance: 0,
      type: "supplier"
    },
    {
      id: "9",
      name: "DOMBARM",
      company: "Internal",
      lastSynced: "2024-03-10",
      defaultAccountCode: "4001",
      status: "active",
      balance: 9784.22,
      type: "customer"
    },
    {
      id: "10",
      name: "DOMKING",
      company: "Internal",
      lastSynced: "2024-03-09",
      defaultAccountCode: "4001",
      status: "active",
      balance: 9600.38,
      type: "customer"
    },
    {
      id: "11",
      name: "DOMLOSE",
      company: "Internal",
      lastSynced: "2024-03-08",
      defaultAccountCode: "4001",
      status: "active",
      balance: 15700.11,
      type: "customer"
    },
    {
      id: "12",
      name: "DOMMAID",
      company: "Internal",
      lastSynced: "2024-03-07",
      defaultAccountCode: "4001",
      status: "active",
      balance: 10570.97,
      type: "customer"
    },
    {
      id: "13",
      name: "DOMSNOD",
      company: "Internal",
      lastSynced: "2024-03-06",
      defaultAccountCode: "4001",
      status: "active",
      balance: 11324.66,
      type: "customer"
    },
    {
      id: "14",
      name: "DMS1 Limited",
      company: "Services",
      lastSynced: "2024-03-12",
      defaultAccountCode: "7004",
      status: "active",
      balance: 36015.48,
      type: "customer"
    },
    {
      id: "15",
      name: "DOJO",
      company: "Payment Processing",
      lastSynced: "2024-03-11",
      defaultAccountCode: "4001",
      status: "active",
      balance: 77.90,
      type: "customer"
    }
  ]

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

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setEditContactName(contact.name)
    setEditSelectedCompany(companies.find(c => c.name === contact.company)?.id || "")
    setEditSelectedAccountCode(contact.defaultAccountCode)
    setEditSelectedContactType(contact.type)
    setIsEditDialogOpen(true)
  }

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

  // Filter contacts by search, company, and type
  const suppliers = contacts.filter(contact => 
    contact.type === "supplier" &&
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) &&
    (selectedCompanyFilter === "all" || contact.company === companies.find(c => c.id === selectedCompanyFilter)?.name)
  )

  const customers = contacts.filter(contact => 
    contact.type === "customer" &&
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) &&
    (selectedCompanyFilter === "all" || contact.company === companies.find(c => c.id === selectedCompanyFilter)?.name)
  )

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
      .slice(0, 3)
  }

  // Suppliers checkbox logic
  const allSuppliersSelected =
    suppliers.length > 0 &&
    suppliers.every((c) => selectedSupplierIds.includes(c.id))
  const someSuppliersSelected =
    suppliers.some((c) => selectedSupplierIds.includes(c.id)) && !allSuppliersSelected

  function toggleSelectAllSuppliers() {
    if (allSuppliersSelected) {
      setSelectedSupplierIds((ids) => ids.filter(id => !suppliers.some(c => c.id === id)))
    } else {
      setSelectedSupplierIds((ids) => [
        ...ids,
        ...suppliers.map((c) => c.id).filter((id) => !ids.includes(id)),
      ])
    }
  }

  function toggleSupplier(id: string) {
    setSelectedSupplierIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    )
  }

  // Customers checkbox logic
  const allCustomersSelected =
    customers.length > 0 &&
    customers.every((c) => selectedCustomerIds.includes(c.id))
  const someCustomersSelected =
    customers.some((c) => selectedCustomerIds.includes(c.id)) && !allCustomersSelected

  function toggleSelectAllCustomers() {
    if (allCustomersSelected) {
      setSelectedCustomerIds((ids) => ids.filter(id => !customers.some(c => c.id === id)))
    } else {
      setSelectedCustomerIds((ids) => [
        ...ids,
        ...customers.map((c) => c.id).filter((id) => !ids.includes(id)),
      ])
    }
  }

  function toggleCustomer(id: string) {
    setSelectedCustomerIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync with Xero
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
                          {code.name}
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

      {/* Search and Filter bar - shared for both tables */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a contact"
            className="pl-8"
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
          />
        </div>
        <div className="w-64">
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
      </div>

      {/* Selected count - combined for both tables */}
      <div className="text-xs text-muted-foreground mb-4">
        {selectedSupplierIds.length + selectedCustomerIds.length} contact{selectedSupplierIds.length + selectedCustomerIds.length !== 1 ? 's' : ''} selected
        <span className="ml-2 text-muted-foreground">
          ({selectedSupplierIds.length} suppliers, {selectedCustomerIds.length} customers)
        </span>
      </div>

      {/* Two tables stacked vertically */}
      <div className="space-y-6">
        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Suppliers ({suppliers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table header */}
            <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
              <input
                type="checkbox"
                checked={allSuppliersSelected}
                ref={el => { if (el) el.indeterminate = someSuppliersSelected; }}
                onChange={toggleSelectAllSuppliers}
                className="mr-4 h-4 w-4"
              />
              <span className="w-1/4">Contact</span>
              <span className="w-1/4">Company</span>
              <span className="w-1/4">Account Code</span>
              <span className="w-1/4">Actions</span>
            </div>

            {/* Scrollable suppliers list */}
            <ScrollArea className="h-[400px] w-full">
              <div>
                {suppliers.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                    No suppliers found
                  </div>
                ) : (
                  suppliers.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center px-2 py-2 border-b hover:bg-accent transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSupplierIds.includes(contact.id)}
                        onChange={() => toggleSupplier(contact.id)}
                        className="mr-4 h-4 w-4"
                      />
                      <div className="flex items-center w-1/4">
                        <div
                          className="flex items-center justify-center rounded-md mr-3"
                          style={{
                            backgroundColor: stringToColor(contact.name),
                            width: 32,
                            height: 32,
                            minWidth: 32,
                            minHeight: 32,
                          }}
                        >
                          <span className="text-xs font-bold text-gray-800">
                            {getInitials(contact.name)}
                          </span>
                        </div>
                        <span className="font-semibold text-sm truncate">{contact.name}</span>
                      </div>
                      <span className="w-1/4 text-sm truncate">{contact.company}</span>
                      <div className="w-1/4">
                        <Badge variant="secondary" className="text-xs">
                          {accountCodes.find(code => code.id === contact.defaultAccountCode)?.name || contact.defaultAccountCode}
                        </Badge>
                      </div>
                      <div className="w-1/4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditContact(contact)}
                          className="h-8"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({customers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table header */}
            <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
              <input
                type="checkbox"
                checked={allCustomersSelected}
                ref={el => { if (el) el.indeterminate = someCustomersSelected; }}
                onChange={toggleSelectAllCustomers}
                className="mr-4 h-4 w-4"
              />
              <span className="w-1/4">Contact</span>
              <span className="w-1/4">Company</span>
              <span className="w-1/4">Account Code</span>
              <span className="w-1/4">Actions</span>
            </div>

            {/* Scrollable customers list */}
            <ScrollArea className="h-[400px] w-full">
              <div>
                {customers.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                    No customers found
                  </div>
                ) : (
                  customers.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center px-2 py-2 border-b hover:bg-accent transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCustomerIds.includes(contact.id)}
                        onChange={() => toggleCustomer(contact.id)}
                        className="mr-4 h-4 w-4"
                      />
                      <div className="flex items-center w-1/4">
                        <div
                          className="flex items-center justify-center rounded-md mr-3"
                          style={{
                            backgroundColor: stringToColor(contact.name),
                            width: 32,
                            height: 32,
                            minWidth: 32,
                            minHeight: 32,
                          }}
                        >
                          <span className="text-xs font-bold text-gray-800">
                            {getInitials(contact.name)}
                          </span>
                        </div>
                        <span className="font-semibold text-sm truncate">{contact.name}</span>
                      </div>
                      <span className="w-1/4 text-sm truncate">{contact.company}</span>
                      <div className="w-1/4">
                        <Badge variant="secondary" className="text-xs">
                          {accountCodes.find(code => code.id === contact.defaultAccountCode)?.name || contact.defaultAccountCode}
                        </Badge>
                      </div>
                      <div className="w-1/4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditContact(contact)}
                          className="h-8"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
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
                      {code.name}
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
