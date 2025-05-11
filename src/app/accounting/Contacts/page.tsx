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
import { Plus, Search, RefreshCw, Check, Filter, AlertCircle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

export default function ContactsPage() {
  const [isSyncing, setIsSyncing] = React.useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [newContactName, setNewContactName] = React.useState("")
  const [selectedCompanies, setSelectedCompanies] = React.useState<string[]>([])
  const [selectedContactIds, setSelectedContactIds] = React.useState<string[]>([])
  const [contactSearch, setContactSearch] = React.useState("")
  const [selectedCompanyFilter, setSelectedCompanyFilter] = React.useState<string>("all")
  const [selectedAccountCode, setSelectedAccountCode] = React.useState<string>("")

  // Mock data - replace with actual data from your backend
  const companies = [
    { id: "1", name: "Company A" },
    { id: "2", name: "Company B" },
    { id: "3", name: "Company C" },
    { id: "4", name: "Company D" },
    { id: "5", name: "Company E" },
    { id: "6", name: "Company F" },
    { id: "7", name: "Company G" },
    { id: "8", name: "Company H" },
    { id: "9", name: "Company I" },
    { id: "10", name: "Company J" },
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

  const contacts = [
    {
      id: "1",
      name: "1st Waste Management",
      company: "Waste Management",
      lastSynced: "2024-03-20",
      defaultAccountCode: "5001",
      status: "active",
      balance: 3226.85
    },
    {
      id: "2",
      name: "American Express",
      company: "Payment Processing",
      lastSynced: "2024-03-19",
      defaultAccountCode: "4001",
      status: "active",
      balance: 0
    },
    {
      id: "3",
      name: "British Gas",
      company: "Utilities",
      lastSynced: "2024-03-18",
      defaultAccountCode: "6001",
      status: "active",
      balance: -806.28
    },
    {
      id: "4",
      name: "Business Stream",
      company: "Utilities",
      lastSynced: "2024-03-17",
      defaultAccountCode: "6001",
      status: "active",
      balance: 162.58
    },
    {
      id: "5",
      name: "Cartridge People",
      company: "Office Supplies",
      lastSynced: "2024-03-16",
      defaultAccountCode: "6005",
      status: "active",
      balance: 424.91
    },
    {
      id: "6",
      name: "Castle Water",
      company: "Utilities",
      lastSynced: "2024-03-15",
      defaultAccountCode: "6001",
      status: "active",
      balance: 2601.99
    },
    {
      id: "7",
      name: "Coca-Cola",
      company: "Beverages",
      lastSynced: "2024-03-14",
      defaultAccountCode: "5001",
      status: "active",
      balance: 4280.64
    },
    {
      id: "8",
      name: "Complete Wiring Solutions Ltd",
      company: "Maintenance",
      lastSynced: "2024-03-13",
      defaultAccountCode: "6006",
      status: "active",
      balance: 0
    },
    {
      id: "9",
      name: "DMS1 Limited",
      company: "Services",
      lastSynced: "2024-03-12",
      defaultAccountCode: "7004",
      status: "active",
      balance: 36015.48
    },
    {
      id: "10",
      name: "DOJO",
      company: "Payment Processing",
      lastSynced: "2024-03-11",
      defaultAccountCode: "4001",
      status: "active",
      balance: 77.90
    },
    {
      id: "11",
      name: "DOMBARM",
      company: "Internal",
      lastSynced: "2024-03-10",
      defaultAccountCode: "4001",
      status: "active",
      balance: 9784.22
    },
    {
      id: "12",
      name: "DOMKING",
      company: "Internal",
      lastSynced: "2024-03-09",
      defaultAccountCode: "4001",
      status: "active",
      balance: 9600.38
    },
    {
      id: "13",
      name: "DOMLOSE",
      company: "Internal",
      lastSynced: "2024-03-08",
      defaultAccountCode: "4001",
      status: "active",
      balance: 15700.11
    },
    {
      id: "14",
      name: "DOMMAID",
      company: "Internal",
      lastSynced: "2024-03-07",
      defaultAccountCode: "4001",
      status: "active",
      balance: 10570.97
    },
    {
      id: "15",
      name: "DOMSNOD",
      company: "Internal",
      lastSynced: "2024-03-06",
      defaultAccountCode: "4001",
      status: "active",
      balance: 11324.66
    }
  ]

  const pendingApprovals = [
    {
      id: "PA1",
      type: "new_contact",
      name: "Eden Farm",
      company: "Suppliers",
      createdBy: "Invoice Agent 1",
      createdAt: "2024-03-21",
      defaultAccountCode: "5001",
      balance: 3997.25,
      status: "pending_approval"
    },
    {
      id: "PA2",
      type: "new_account_code",
      contactName: "Jestic",
      company: "Suppliers",
      accountCode: "5001",
      createdBy: "Invoice Agent 2",
      createdAt: "2024-03-21",
      balance: 112.50,
      status: "pending_approval"
    },
    {
      id: "PA3",
      type: "new_contact",
      name: "Leaflet",
      company: "Marketing",
      createdBy: "Invoice Agent 1",
      createdAt: "2024-03-20",
      defaultAccountCode: "6203",
      balance: 5293.96,
      status: "pending_approval"
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
    console.log("Creating contact:", { name: newContactName, companies: selectedCompanies })
    setIsDialogOpen(false)
    setNewContactName("")
    setSelectedCompanies([])
  }

  const toggleCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    )
  }

  const toggleAllCompanies = () => {
    setSelectedCompanies(prev =>
      prev.length === companies.length
        ? []
        : companies.map(company => company.id)
    )
  }

  // Filter contacts by search and company
  const filteredContacts = contacts.filter(contact =>
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

  // Checkbox logic
  const allSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selectedContactIds.includes(c.id))
  const someSelected =
    filteredContacts.some((c) => selectedContactIds.includes(c.id)) && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedContactIds((ids) => ids.filter(id => !filteredContacts.some(c => c.id === id)))
    } else {
      setSelectedContactIds((ids) => [
        ...ids,
        ...filteredContacts.map((c) => c.id).filter((id) => !ids.includes(id)),
      ])
    }
  }

  function toggleContact(id: string) {
    setSelectedContactIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    )
  }

  const handleApprove = (approvalId: string) => {
    // Implement approval logic here
    console.log("Approving:", approvalId)
  }

  const handleReject = (approvalId: string) => {
    // Implement rejection logic here
    console.log("Rejecting:", approvalId)
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
                  Add a new contact and select which companies to add it to.
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
                  <Label>Select Companies</Label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                      onClick={() => toggleAllCompanies()}
                    >
                      {selectedCompanies.length === companies.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <ScrollArea className="h-[200px] w-full rounded-md border mt-2">
                      <div className="p-2">
                        {companies.map((company) => (
                          <div
                            key={company.id}
                            className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                            onClick={() => toggleCompany(company.id)}
                          >
                            <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                              {selectedCompanies.includes(company.id) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            <span className="text-sm">{company.name}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContact} disabled={!newContactName || selectedCompanies.length === 0 || !selectedAccountCode}>
                  Create Contact
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pending Approvals Section */}
      {pendingApprovals.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-2">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex-1">
                    {approval.type === "new_contact" ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="whitespace-nowrap">NEW CONTACT</Badge>
                        <span className="font-medium">{approval.name}</span>
                        <span className="text-muted-foreground text-sm">• {approval.company}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="whitespace-nowrap">NEW DEFAULT ACCOUNT CODE</Badge>
                        <span className="font-medium">{approval.contactName}</span>
                        <span className="text-muted-foreground text-sm">→</span>
                        <Badge variant="outline">
                          {accountCodes.find(code => code.id === approval.accountCode)?.name || approval.accountCode}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleReject(approval.id)}>
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(approval.id)}>
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter bar */}
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Filter contacts by company
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Company</Label>
                    <Select value={selectedCompanyFilter} onValueChange={setSelectedCompanyFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
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
              </PopoverContent>
            </Popover>
          </div>

          {/* Selected count */}
          <div className="text-xs text-muted-foreground mb-2">
            {selectedContactIds.length} contact{selectedContactIds.length !== 1 ? 's' : ''} selected
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
            <span className="w-1/3">Contact</span>
            <span className="w-1/3">Company</span>
            <span className="w-1/3">Default Account Code</span>
          </div>

          {/* Scrollable contacts list */}
          <ScrollArea className="h-[400px] w-full">
            <div>
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center px-2 py-2 border-b hover:bg-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedContactIds.includes(contact.id)}
                    onChange={() => toggleContact(contact.id)}
                    className="mr-4 h-4 w-4"
                  />
                  <div className="flex items-center w-1/3">
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
                    <span className="font-semibold text-sm">{contact.name}</span>
                  </div>
                  <span className="w-1/3 text-sm">{contact.company}</span>
                  <div className="w-1/3">
                    <Badge variant="secondary">
                      {accountCodes.find(code => code.id === contact.defaultAccountCode)?.name || contact.defaultAccountCode}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
