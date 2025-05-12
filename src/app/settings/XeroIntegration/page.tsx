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
import { Search, Filter, RefreshCw, ExternalLink, LinkIcon } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Define types
interface XeroConnection {
  id: string
  tenantName: string
  tenantId: string
  connectedAt: string
  status: "Active" | "Expired" | "Disconnected"
  lastSyncDate: string
  organization: string
}

interface SyncHistory {
  id: string
  tenantId: string
  tenantName: string
  syncDate: string
  status: "Success" | "Failed" | "Partial"
  dataType: "Invoices" | "Bills" | "Contacts" | "All"
  itemsProcessed: number
  errors: number
}

// Mock data for connected tenants
const connections: XeroConnection[] = [
  {
    id: "1",
    tenantName: "Fans (UK) Limited",
    tenantId: "XR-12345-UK",
    connectedAt: "2023-09-15T10:30:00Z",
    status: "Active",
    lastSyncDate: "2023-11-12T08:15:22Z",
    organization: "Fans UK Holdings"
  },
  {
    id: "2",
    tenantName: "J & R Corporation Limited",
    tenantId: "XR-67890-JR",
    connectedAt: "2023-10-02T14:45:00Z",
    status: "Active",
    lastSyncDate: "2023-11-10T16:30:45Z",
    organization: "J&R Enterprise Group"
  },
  {
    id: "3",
    tenantName: "MDJ Investments Limited",
    tenantId: "XR-54321-MDJ",
    connectedAt: "2023-08-20T09:15:00Z",
    status: "Expired",
    lastSyncDate: "2023-11-05T11:22:18Z",
    organization: "MDJ Holdings Ltd"
  },
  {
    id: "4",
    tenantName: "Popat Leisure Limited",
    tenantId: "XR-98765-PL",
    connectedAt: "2023-07-10T11:20:00Z",
    status: "Active",
    lastSyncDate: "2023-11-11T10:15:22Z",
    organization: "Popat Leisure Limited"
  },
  {
    id: "5",
    tenantName: "R & D 2 Pizza Limited",
    tenantId: "XR-45678-RD",
    connectedAt: "2023-08-05T13:40:00Z",
    status: "Active",
    lastSyncDate: "2023-11-09T14:25:18Z",
    organization: "R & D Enterprise"
  },
  {
    id: "6",
    tenantName: "DMS1 Limited",
    tenantId: "XR-23456-DMS",
    connectedAt: "2023-09-22T08:30:00Z",
    status: "Active",
    lastSyncDate: "2023-11-08T09:45:30Z",
    organization: "DMS Group"
  },
  {
    id: "7",
    tenantName: "KDG Bexleyheath Limited",
    tenantId: "XR-34567-KDB",
    connectedAt: "2023-06-15T15:20:00Z",
    status: "Active",
    lastSyncDate: "2023-11-07T16:10:45Z",
    organization: "KDG Holdings"
  },
  {
    id: "8",
    tenantName: "KDG Canterbury Limited",
    tenantId: "XR-45678-KDC",
    connectedAt: "2023-07-25T09:10:00Z",
    status: "Active",
    lastSyncDate: "2023-11-06T10:30:22Z",
    organization: "KDG Holdings"
  },
  {
    id: "9",
    tenantName: "KDG Gravesend Limited",
    tenantId: "XR-56789-KDG",
    connectedAt: "2023-08-12T14:50:00Z",
    status: "Active",
    lastSyncDate: "2023-11-05T15:40:15Z",
    organization: "KDG Holdings"
  },
  {
    id: "10",
    tenantName: "KDG Greenwich Limited",
    tenantId: "XR-67890-KDGR",
    connectedAt: "2023-09-08T10:15:00Z",
    status: "Active",
    lastSyncDate: "2023-11-04T11:25:30Z",
    organization: "KDG Holdings"
  },
  {
    id: "11",
    tenantName: "KDG Hempstead Ltd",
    tenantId: "XR-78901-KDH",
    connectedAt: "2023-10-17T16:30:00Z",
    status: "Active",
    lastSyncDate: "2023-11-03T17:10:45Z",
    organization: "KDG Holdings"
  },
  {
    id: "12",
    tenantName: "KDG Maidstone Limited",
    tenantId: "XR-89012-KDM",
    connectedAt: "2023-06-30T12:45:00Z",
    status: "Active",
    lastSyncDate: "2023-11-02T13:20:15Z",
    organization: "KDG Holdings"
  },
  {
    id: "13",
    tenantName: "KDG Tunbridge Wells Limited",
    tenantId: "XR-90123-KDTW",
    connectedAt: "2023-07-05T08:20:00Z",
    status: "Active",
    lastSyncDate: "2023-11-01T09:15:30Z",
    organization: "KDG Holdings"
  },
  {
    id: "14",
    tenantName: "KDG Woolwich Limited",
    tenantId: "XR-01234-KDW",
    connectedAt: "2023-08-22T15:10:00Z",
    status: "Active",
    lastSyncDate: "2023-10-31T16:45:22Z",
    organization: "KDG Holdings"
  },
  {
    id: "15",
    tenantName: "Sui Generis Restaurants Limited",
    tenantId: "XR-12345-SGR",
    connectedAt: "2023-09-10T11:30:00Z",
    status: "Active",
    lastSyncDate: "2023-10-30T12:20:45Z",
    organization: "Sui Generis Group"
  },
  {
    id: "16",
    tenantName: "Bajs Limited",
    tenantId: "XR-23456-BL",
    connectedAt: "2023-10-25T09:45:00Z",
    status: "Active",
    lastSyncDate: "2023-10-29T10:35:15Z",
    organization: "Bajs Enterprises"
  },
  {
    id: "17",
    tenantName: "Bellam & Co Limited",
    tenantId: "XR-34567-BCL",
    connectedAt: "2023-06-18T14:15:00Z",
    status: "Active",
    lastSyncDate: "2023-10-28T15:05:30Z",
    organization: "Bellam Holdings"
  },
  {
    id: "18",
    tenantName: "Topbake Limited",
    tenantId: "XR-45678-TL",
    connectedAt: "2023-07-27T10:30:00Z",
    status: "Expired",
    lastSyncDate: "2023-10-27T11:50:22Z",
    organization: "Topbake Foods"
  },
  {
    id: "19",
    tenantName: "R&D Yorkshire Limited",
    tenantId: "XR-56789-RDY",
    connectedAt: "2023-08-15T16:20:00Z",
    status: "Active",
    lastSyncDate: "2023-10-26T17:15:45Z",
    organization: "R&D Group"
  },
  {
    id: "20",
    tenantName: "Dhillon Brothers Limited",
    tenantId: "XR-67890-DBL",
    connectedAt: "2023-09-05T12:10:00Z",
    status: "Active",
    lastSyncDate: "2023-10-25T13:40:15Z",
    organization: "Dhillon Enterprises"
  },
  {
    id: "21",
    tenantName: "Radas Pizza Ltd",
    tenantId: "XR-78901-RPL",
    connectedAt: "2023-10-12T08:35:00Z",
    status: "Active",
    lastSyncDate: "2023-10-24T09:30:30Z",
    organization: "Radas Food Group"
  },
  {
    id: "22",
    tenantName: "Nij Enterprises Ltd",
    tenantId: "XR-89012-NEL",
    connectedAt: "2023-06-25T15:50:00Z",
    status: "Disconnected",
    lastSyncDate: "2023-10-23T16:25:45Z",
    organization: "Nij Holdings"
  }
]

// Mock data for sync history
const syncHistory: SyncHistory[] = [
  {
    id: "sync-001",
    tenantId: "XR-12345-UK",
    tenantName: "Fans (UK) Limited",
    syncDate: "2023-11-12T08:15:22Z",
    status: "Success",
    dataType: "All",
    itemsProcessed: 324,
    errors: 0
  },
  {
    id: "sync-002",
    tenantId: "XR-67890-JR",
    tenantName: "J & R Corporation Limited",
    syncDate: "2023-11-10T16:30:45Z",
    status: "Success",
    dataType: "Invoices",
    itemsProcessed: 156,
    errors: 0
  },
  {
    id: "sync-003",
    tenantId: "XR-54321-MDJ",
    tenantName: "MDJ Investments Limited",
    syncDate: "2023-11-05T11:22:18Z",
    status: "Partial",
    dataType: "All",
    itemsProcessed: 289,
    errors: 12
  },
  {
    id: "sync-004",
    tenantId: "XR-12345-UK",
    tenantName: "Fans (UK) Limited",
    syncDate: "2023-11-01T09:45:30Z",
    status: "Success",
    dataType: "Bills",
    itemsProcessed: 78,
    errors: 0
  },
  {
    id: "sync-005",
    tenantId: "XR-67890-JR",
    tenantName: "J & R Corporation Limited",
    syncDate: "2023-10-28T14:20:15Z",
    status: "Failed",
    dataType: "Contacts",
    itemsProcessed: 42,
    errors: 15
  },
  {
    id: "sync-006",
    tenantId: "XR-54321-MDJ",
    tenantName: "MDJ Investments Limited",
    syncDate: "2023-10-25T10:10:45Z",
    status: "Success",
    dataType: "Invoices",
    itemsProcessed: 112,
    errors: 0
  }
]

export default function XeroIntegrationPage() {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = React.useState(false)
  const [connectionSearch, setConnectionSearch] = React.useState("")
  const [historySearch, setHistorySearch] = React.useState("")
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>("all")
  const [selectedTenantFilter, setSelectedTenantFilter] = React.useState<string>("all")
  const [selectedDataTypeFilter, setSelectedDataTypeFilter] = React.useState<string>("all")
  
  // Filtered connections
  const filteredConnections = connections.filter(connection =>
    (connection.tenantName.toLowerCase().includes(connectionSearch.toLowerCase()) ||
     connection.tenantId.toLowerCase().includes(connectionSearch.toLowerCase()) ||
     connection.organization.toLowerCase().includes(connectionSearch.toLowerCase())) &&
    (selectedStatusFilter === "all" || connection.status === selectedStatusFilter)
  )
  
  // Filtered sync history
  const filteredHistory = syncHistory.filter(item =>
    (item.tenantName.toLowerCase().includes(historySearch.toLowerCase())) &&
    (selectedTenantFilter === "all" || item.tenantId === selectedTenantFilter) &&
    (selectedDataTypeFilter === "all" || item.dataType === selectedDataTypeFilter)
  )
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Handle connecting new tenant
  const handleConnectTenant = () => {
    // In a real implementation, this would redirect to Xero OAuth flow
    setIsConnectDialogOpen(false)
  }
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Expired": return "bg-amber-100 text-amber-800"
      case "Disconnected": return "bg-red-100 text-red-800"
      case "Success": return "bg-green-100 text-green-800"
      case "Failed": return "bg-red-100 text-red-800"
      case "Partial": return "bg-amber-100 text-amber-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  
  // Sync tenant data
  const syncTenantData = (tenantId: string) => {
    console.log(`Syncing data for tenant: ${tenantId}`)
    // In a real implementation, this would trigger a data sync with Xero
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Xero Integration</h1>
        <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <LinkIcon className="mr-2 h-4 w-4" />
              Connect New Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect to Xero</DialogTitle>
              <DialogDescription>
                Connect to a new Xero organization to sync accounting data.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Organization Name</Label>
                <Input
                  placeholder="Enter organization name"
                />
              </div>
              <div className="grid gap-2">
                <Label>Connection Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Connection</SelectItem>
                    <SelectItem value="partner">Partner Connection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Data to Sync</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer">Invoices</Badge>
                  <Badge variant="outline" className="cursor-pointer">Bills</Badge>
                  <Badge variant="outline" className="cursor-pointer">Contacts</Badge>
                  <Badge variant="outline" className="cursor-pointer">Bank Transactions</Badge>
                  <Badge variant="outline" className="cursor-pointer">Chart of Accounts</Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConnectTenant}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Connect to Xero
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="connections">
        <TabsList>
          <TabsTrigger value="connections">Connected Tenants</TabsTrigger>
          <TabsTrigger value="syncHistory">Sync History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Xero Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and Filter bar */}
              <div className="mb-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a tenant"
                    className="pl-8"
                    value={connectionSearch}
                    onChange={(e) => setConnectionSearch(e.target.value)}
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
                          Filter connections by status
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                            <SelectItem value="Disconnected">Disconnected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Table header */}
              <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
                <span className="w-1/5">Tenant Name</span>
                <span className="w-1/5">Tenant ID</span>
                <span className="w-1/5">Organization</span>
                <span className="w-1/5">Status</span>
                <span className="w-1/5">Last Sync</span>
                <span className="w-1/5">Actions</span>
              </div>

              {/* Scrollable connections list */}
              <ScrollArea className="h-[400px] w-full">
                <div>
                  {filteredConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors"
                    >
                      <span className="w-1/5 font-semibold text-sm truncate">{connection.tenantName}</span>
                      <span className="w-1/5 text-sm truncate">{connection.tenantId}</span>
                      <span className="w-1/5 text-sm truncate">{connection.organization}</span>
                      <span className="w-1/5">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                          {connection.status}
                        </span>
                      </span>
                      <span className="w-1/5 text-sm truncate">{formatDate(connection.lastSyncDate)}</span>
                      <div className="w-1/5 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => syncTenantData(connection.tenantId)}
                          className="h-8"
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          Sync
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8"
                        >
                          Settings
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="syncHistory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and Filter bar */}
              <div className="mb-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by tenant name"
                    className="pl-8"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
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
                          Filter sync history
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label>Tenant</Label>
                        <Select value={selectedTenantFilter} onValueChange={setSelectedTenantFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenant" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Tenants</SelectItem>
                            {connections.map((connection) => (
                              <SelectItem key={connection.tenantId} value={connection.tenantId}>
                                {connection.tenantName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Data Type</Label>
                        <Select value={selectedDataTypeFilter} onValueChange={setSelectedDataTypeFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select data type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Invoices">Invoices</SelectItem>
                            <SelectItem value="Bills">Bills</SelectItem>
                            <SelectItem value="Contacts">Contacts</SelectItem>
                            <SelectItem value="All">Full Sync</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Table header */}
              <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
                <span className="w-1/6">Tenant</span>
                <span className="w-1/6">Sync Date</span>
                <span className="w-1/6">Data Type</span>
                <span className="w-1/6">Status</span>
                <span className="w-1/6">Items Processed</span>
                <span className="w-1/6">Errors</span>
              </div>

              {/* Scrollable history list */}
              <ScrollArea className="h-[400px] w-full">
                <div>
                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors"
                    >
                      <span className="w-1/6 font-semibold text-sm truncate">{item.tenantName}</span>
                      <span className="w-1/6 text-sm truncate">{formatDate(item.syncDate)}</span>
                      <span className="w-1/6 text-sm truncate">{item.dataType}</span>
                      <span className="w-1/6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </span>
                      <span className="w-1/6 text-sm truncate">{item.itemsProcessed}</span>
                      <span className="w-1/6 text-sm truncate">
                        {item.errors > 0 ? (
                          <span className="text-red-600">{item.errors}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 