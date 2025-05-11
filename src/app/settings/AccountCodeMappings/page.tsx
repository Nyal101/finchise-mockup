"use client"

import * as React from "react"
import { Edit, MoreHorizontal, Plus, Trash, Search } from "lucide-react"
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

// Mock data - replace with actual data from your backend
const accountMappings = [
  {
    id: 1,
    xeroCode: "40245",
    xeroDescription: "Advertising Expense",
    dominosCode: "1001",
    dominosDescription: "Advertising",
    isSynced: true,
    company: "Store A"
  },
  // Add more mappings as needed
]

export default function AccountCodeMappingsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [selectedCompany, setSelectedCompany] = React.useState("all")
  
  // Filter mappings based on search query and company
  const filteredMappings = accountMappings.filter(mapping => {
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
        <h1 className="text-3xl font-bold">Account Code Mappings</h1>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Xero to Domino&apos;s Code Mapping</h2>
          <p className="text-sm text-muted-foreground">
            Map Xero account codes to Domino&apos;s cost codes
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
                Map a Xero account code to the corresponding Domino&apos;s cost code.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dominosCode">Domino&apos;s Code</Label>
                  <Input id="dominosCode" placeholder="e.g. 1001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dominosDescription">Domino&apos;s Description</Label>
                  <Input id="dominosDescription" placeholder="e.g. Advertising" />
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
                <TableHead>Xero Code</TableHead>
                <TableHead>Xero Description</TableHead>
                <TableHead>Domino&apos;s Code</TableHead>
                <TableHead>Domino&apos;s Description</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Sync Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell className="font-medium">{mapping.xeroCode}</TableCell>
                  <TableCell>{mapping.xeroDescription}</TableCell>
                  <TableCell>{mapping.dominosCode}</TableCell>
                  <TableCell>{mapping.dominosDescription}</TableCell>
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
    </div>
  )
}
