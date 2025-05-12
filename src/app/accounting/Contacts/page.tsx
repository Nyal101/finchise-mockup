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
import { Plus, Search, RefreshCw, Filter } from "lucide-react"
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
  const [selectedContactIds, setSelectedContactIds] = React.useState<string[]>([])
  const [contactSearch, setContactSearch] = React.useState("")
  const [selectedCompanyFilter, setSelectedCompanyFilter] = React.useState<string>("all")
  const [selectedAccountCode, setSelectedAccountCode] = React.useState<string>("")
  const [selectedCompany, setSelectedCompany] = React.useState<string>("")

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

  const contacts = [
    {
      id: "1",
      name: "1st Waste Management",
      company: "Bajs Limited",
      lastSynced: "2024-03-20",
      defaultAccountCode: "5001",
      status: "active",
      balance: 3226.85
    },
    {
      id: "2",
      name: "American Express",
      company: "Bellam & Co Limited",
      lastSynced: "2024-03-19",
      defaultAccountCode: "4001",
      status: "active",
      balance: 0
    },
    {
      id: "3",
      name: "British Gas",
      company: "Topbake Limited",
      lastSynced: "2024-03-18",
      defaultAccountCode: "6001",
      status: "active",
      balance: -806.28
    },
    {
      id: "4",
      name: "Business Stream",
      company: "R&D Yorkshire Limited",
      lastSynced: "2024-03-17",
      defaultAccountCode: "6001",
      status: "active",
      balance: 162.58
    },
    {
      id: "5",
      name: "Cartridge People",
      company: "Dhillon Brothers Limited",
      lastSynced: "2024-03-16",
      defaultAccountCode: "6005",
      status: "active",
      balance: 424.91
    },
    {
      id: "6",
      name: "Castle Water",
      company: "Radas Pizza Ltd",
      lastSynced: "2024-03-15",
      defaultAccountCode: "6001",
      status: "active",
      balance: 2601.99
    },
    {
      id: "7",
      name: "Coca-Cola",
      company: "Nij Enterprises Ltd",
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
      defaultAccountCode: selectedAccountCode
    })
    setIsDialogOpen(false)
    setNewContactName("")
    setSelectedCompany("")
    setSelectedAccountCode("")
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContact} disabled={!newContactName || !selectedCompany || !selectedAccountCode}>
                  Create Contact
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
