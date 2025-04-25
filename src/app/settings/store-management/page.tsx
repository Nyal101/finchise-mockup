"use client"

import * as React from "react"
import { Edit, MoreHorizontal, Plus, Trash, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"

export default function StoreManagementPage() {
  const [isAddStoreOpen, setIsAddStoreOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [accountingFilter, setAccountingFilter] = React.useState("all")
  
  // Filter stores based on search query and accounting filter
  const filteredStores = stores.filter(store => {
    const matchesSearch = 
      searchQuery === "" || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      accountingFilter === "all" || 
      store.accountingSoftware === accountingFilter
    
    return matchesSearch && matchesFilter
  })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Store Management</h1>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Your Stores</h2>
          <p className="text-sm text-muted-foreground">
            Manage and configure all your franchise locations
          </p>
        </div>
        <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>
                Enter the details for your new store location.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input id="name" placeholder="Enter store name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Enter company name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="storeId">Store ID</Label>
                  <Input id="storeId" placeholder="Enter store ID" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="software">Accounting Software</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select software" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xero">Xero</SelectItem>
                      <SelectItem value="quickbooks">QuickBooks</SelectItem>
                      <SelectItem value="sage">Sage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Store Address</Label>
                <Input id="address" placeholder="Enter store address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trackingCode">Tracking Code</Label>
                <Input id="trackingCode" placeholder="Enter tracking code" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddStoreOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddStoreOpen(false)}>
                Add Store
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
            placeholder="Search stores..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={accountingFilter} onValueChange={setAccountingFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Accounting Software" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Software</SelectItem>
              <SelectItem value="xero">Xero</SelectItem>
              <SelectItem value="quickbooks">QuickBooks</SelectItem>
              <SelectItem value="sage">Sage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Store ID</TableHead>
                <TableHead>Store Address</TableHead>
                <TableHead>Accounting Software</TableHead>
                <TableHead>Tracking Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.company}</TableCell>
                  <TableCell>{store.id}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {store.accountingSoftware === "xero" && (
                        <Image 
                          src="/accounting-logos/xero.png" 
                          alt="Xero" 
                          width={24} 
                          height={24} 
                          className="object-contain" 
                        />
                      )}
                      {store.accountingSoftware === "quickbooks" && (
                        <Image 
                          src="/accounting-logos/quickbooks.png" 
                          alt="QuickBooks" 
                          width={24} 
                          height={24} 
                          className="object-contain" 
                        />
                      )}
                      {store.accountingSoftware === "sage" && (
                        <Image 
                          src="/accounting-logos/sage.png" 
                          alt="Sage" 
                          width={24} 
                          height={24} 
                          className="object-contain" 
                        />
                      )}
                      <span className="capitalize">{store.accountingSoftware}</span>
                    </div>
                  </TableCell>
                  <TableCell>{store.trackingCode}</TableCell>
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
                          Edit Store
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Store
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
    </div>
  )
}

// Sample store data with UK addresses
const stores = [
  {
    id: "STR-001",
    name: "Kings Hill Branch",
    company: "Franchise Holdings Ltd",
    address: "12 Liberty Square, Kings Hill, West Malling, Kent ME19 4AU",
    accountingSoftware: "xero",
    trackingCode: "XER-8745-KH"
  },
  {
    id: "STR-002",
    name: "Tonbridge Main",
    company: "Franchise Holdings Ltd",
    address: "45 High Street, Tonbridge, Kent TN9 1DR",
    accountingSoftware: "quickbooks",
    trackingCode: "QB-9872-TM"
  },
  {
    id: "STR-003",
    name: "Tunbridge Wells Centre",
    company: "Kent Food Partners",
    address: "22 Mount Pleasant Road, Tunbridge Wells, Kent TN1 1NT",
    accountingSoftware: "sage",
    trackingCode: "SG-6534-TW"
  },
  {
    id: "STR-004",
    name: "Southborough Branch",
    company: "Kent Food Partners",
    address: "102 London Road, Southborough, Tunbridge Wells, TN4 0PL",
    accountingSoftware: "xero",
    trackingCode: "XER-3742-SB"
  },
  {
    id: "STR-005",
    name: "Maidstone Central",
    company: "Franchise Holdings Ltd",
    address: "87-89 Week Street, Maidstone, Kent ME14 1QU",
    accountingSoftware: "quickbooks",
    trackingCode: "QB-5218-MC"
  },
  {
    id: "STR-006",
    name: "Sevenoaks High Street",
    company: "Kent Food Partners",
    address: "62 High Street, Sevenoaks, Kent TN13 1JG",
    accountingSoftware: "sage",
    trackingCode: "SG-9431-SHS"
  },
  {
    id: "STR-007",
    name: "Ashford Outlet",
    company: "Franchise Holdings Ltd",
    address: "Unit 45, Ashford Designer Outlet, Kimberley Way, Ashford, Kent TN24 0SD",
    accountingSoftware: "xero",
    trackingCode: "XER-6179-AO"
  },
  {
    id: "STR-008",
    name: "Canterbury City",
    company: "East Kent Ventures",
    address: "14 Whitefriars Street, Canterbury, Kent CT1 2TF",
    accountingSoftware: "quickbooks",
    trackingCode: "QB-8392-CC"
  }
] 