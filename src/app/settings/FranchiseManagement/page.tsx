"use client"

import * as React from "react"
import { Edit, MoreHorizontal, Plus, Trash, Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

// Mock data - replace with actual data from your backend
const invoiceMappings = [
  {
    id: 1,
    dominosCode: "1001",
    dominosDescription: "Advertising",
    xeroCode: "40245",
    xeroDescription: "Advertising Expense",
    isSynced: true,
    company: "Store A"
  },
  // Add more mappings as needed
]

export default function FranchiseManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("invoice-mapping")
  const [selectedCompany, setSelectedCompany] = React.useState("all")
  
  // Filter invoice mappings based on search query and company
  const filteredMappings = invoiceMappings.filter(mapping => {
    const matchesSearch = searchQuery === "" || 
      mapping.dominosCode.toString().includes(searchQuery) ||
      mapping.dominosDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.xeroCode.toString().includes(searchQuery) ||
      mapping.xeroDescription.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCompany = selectedCompany === "all" || mapping.company === selectedCompany
    
    return matchesSearch && matchesCompany
  })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Franchise Management</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoice-mapping">Invoice Mapping</TabsTrigger>
          <TabsTrigger value="recharging">Recharging</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        {/* Invoice Mapping Tab */}
        <TabsContent value="invoice-mapping" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Invoice Code Mapping</h2>
              <p className="text-sm text-muted-foreground">
                Map Dominos cost codes to Xero codes
              </p>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Mapping
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Code Mapping</DialogTitle>
                  <DialogDescription>
                    Map a Dominos cost code to the corresponding Xero code.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dominosCode">Dominos Code</Label>
                      <Input id="dominosCode" placeholder="e.g. 1001" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dominosDescription">Dominos Description</Label>
                      <Input id="dominosDescription" placeholder="e.g. Advertising" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="xeroCode">Xero Code</Label>
                      <Input id="xeroCode" placeholder="e.g. 40245" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="xeroDescription">Xero Description</Label>
                      <Input id="xeroDescription" placeholder="e.g. Advertising Expense" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store-a">Store A</SelectItem>
                        <SelectItem value="store-b">Store B</SelectItem>
                        <SelectItem value="store-c">Store C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setAddDialogOpen(false)}>
                    Add Mapping
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search code mappings..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="store-a">Store A</SelectItem>
                <SelectItem value="store-b">Store B</SelectItem>
                <SelectItem value="store-c">Store C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dominos Code</TableHead>
                    <TableHead>Dominos Description</TableHead>
                    <TableHead>Xero Code</TableHead>
                    <TableHead>Xero Description</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Sync Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">{mapping.dominosCode}</TableCell>
                      <TableCell>{mapping.dominosDescription}</TableCell>
                      <TableCell>{mapping.xeroCode}</TableCell>
                      <TableCell>{mapping.xeroDescription}</TableCell>
                      <TableCell>{mapping.company}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mapping.isSynced 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {mapping.isSynced ? 'Synced' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Mapping
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Mapping
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recharging Tab */}
        <TabsContent value="recharging" className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Recharging Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure how expenses are recharged across stores
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rechargeMethod">Recharge Method</Label>
                  <Select defaultValue="percentage">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Based</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="proportional">Proportional to Revenue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rechargeFrequency">Recharge Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Integration Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your Xero integration settings
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Xero Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your Xero account to sync data
                    </p>
                  </div>
                  <Button>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Connect Xero
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 