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
import { Plus, Search, Filter, Pencil } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

// Define Store type
interface Store {
  id: string
  name: string
  address: string
  postCode: string
  tenantName: string
  trackingCategory: string
  trackingOption: string
  additionalInfo: string
}

// Store data based on provided examples
const stores: Store[] = [
  {
    id: "28684",
    name: "SHEERNESS",
    address: "123 High Street, Sheerness",
    postCode: "ME121NZ",
    tenantName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "SHEERNESS",
    additionalInfo: "Some invoices arrive with incorrect postcode ME121NY. Utility bills often have wrong unit number."
  },
  {
    id: "28260",
    name: "SITTINGBOURNE",
    address: "45 Main Road, Sittingbourne",
    postCode: "ME102GZ",
    tenantName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "SITTINGBOURNE",
    additionalInfo: ""
  },
  {
    id: "28862",
    name: "HERNE BAY",
    address: "78 Beach Avenue, Herne Bay",
    postCode: "CT65LE",
    tenantName: "Fans (UK) Limited",
    trackingCategory: "Store",
    trackingOption: "HERNE BAY",
    additionalInfo: ""
  },
  {
    id: "28921",
    name: "HEATHFIELD",
    address: "12 Market Street, Heathfield",
    postCode: "TN218JD",
    tenantName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "HEATHFIELD",
    additionalInfo: ""
  },
  {
    id: "28868",
    name: "PADDOCK WOOD",
    address: "34 Station Road, Paddock Wood",
    postCode: "TN126EZ",
    tenantName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "PADDOCK WOOD",
    additionalInfo: ""
  },
  {
    id: "29130",
    name: "SOUTHBOROUGH",
    address: "67 London Road, Southborough",
    postCode: "TN40PA",
    tenantName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "SOUTHBOROUGH",
    additionalInfo: ""
  },
  {
    id: "28115",
    name: "TUNBRIDGE WELLS",
    address: "89 Camden Road, Tunbridge Wells",
    postCode: "TN48AU",
    tenantName: "J & R Corporation Limited",
    trackingCategory: "Store",
    trackingOption: "TUNBRIDGE WELLS",
    additionalInfo: "Incorrect postcode TN45PG appears on several supplier accounts. Electricity bills addressed to former business name."
  },
  {
    id: "29123",
    name: "HONOR OAK",
    address: "23 Honor Oak Park, Honor Oak",
    postCode: "SE231DY",
    tenantName: "MDJ Investments Limited",
    trackingCategory: "Store",
    trackingOption: "HONOR OAK",
    additionalInfo: ""
  },
  {
    id: "28109",
    name: "ORPINGTON",
    address: "56 High Street, Orpington",
    postCode: "BR60NF",
    tenantName: "MDJ Investments Limited",
    trackingCategory: "Store",
    trackingOption: "ORPINGTON",
    additionalInfo: ""
  },
  {
    id: "28621",
    name: "ST PAULS CRAY",
    address: "91 Main Road, St Pauls Cray",
    postCode: "BR52RA",
    tenantName: "MDJ Investments Limited", 
    trackingCategory: "Store",
    trackingOption: "ST PAULS CRAY",
    additionalInfo: ""
  }
]

export default function StoreManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [storeSearch, setStoreSearch] = React.useState("")
  const [selectedTenantFilter, setSelectedTenantFilter] = React.useState<string>("all")
  const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>([])
  const [editFormData, setEditFormData] = React.useState<Store>({
    name: "",
    id: "",
    address: "",
    postCode: "",
    tenantName: "",
    trackingCategory: "",
    trackingOption: "",
    additionalInfo: ""
  })
  
  // Available tenants for filtering
  const tenants = [
    { id: "1", name: "Fans (UK) Limited" },
    { id: "2", name: "J & R Corporation Limited" },
    { id: "3", name: "MDJ Investments Limited" }
  ]
  
  const handleCreateStore = () => {
    // Implement store creation logic here
    setIsDialogOpen(false)
  }
  
  const handleEditStore = (store: Store) => {
    setEditFormData({
      name: store.name,
      id: store.id,
      address: store.address,
      postCode: store.postCode,
      tenantName: store.tenantName,
      trackingCategory: store.trackingCategory,
      trackingOption: store.trackingOption,
      additionalInfo: store.additionalInfo
    })
    setIsEditDialogOpen(true)
  }
  
  const handleSaveEdit = () => {
    // Implement save edit logic here
    // This would update the store in the database
    console.log("Saving edits for store:", editFormData)
    setIsEditDialogOpen(false)
  }
  
  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Filter stores by search and tenant
  const filteredStores = stores.filter(store =>
    (store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
     store.address.toLowerCase().includes(storeSearch.toLowerCase()) ||
     store.postCode.toLowerCase().includes(storeSearch.toLowerCase()) ||
     store.additionalInfo.toLowerCase().includes(storeSearch.toLowerCase())) &&
    (selectedTenantFilter === "all" || store.tenantName === tenants.find(t => t.id === selectedTenantFilter)?.name)
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
      .slice(0, 2)
  }
  
  // Checkbox logic
  const allSelected =
    filteredStores.length > 0 &&
    filteredStores.every((s) => selectedStoreIds.includes(s.id))
  const someSelected =
    filteredStores.some((s) => selectedStoreIds.includes(s.id)) && !allSelected

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedStoreIds((ids) => ids.filter(id => !filteredStores.some(s => s.id === id)))
    } else {
      setSelectedStoreIds((ids) => [
        ...ids,
        ...filteredStores.map((s) => s.id).filter((id) => !ids.includes(id)),
      ])
    }
  }

  function toggleStore(id: string) {
    setSelectedStoreIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Store Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>
                Add a new store to your management system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  placeholder="Enter store name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Store Address</Label>
                <Input
                  id="address"
                  placeholder="Enter store address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postcode">Post Code</Label>
                <Input
                  id="postcode"
                  placeholder="Enter post code"
                />
              </div>
              <div className="grid gap-2">
                <Label>Tenant</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tracking Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tracking category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Store">Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tracking Option</Label>
                <Input
                  placeholder="Enter tracking option"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Input
                  id="additionalInfo"
                  placeholder="Enter any additional information"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStore}>
                Create Store
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter bar */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a store"
                className="pl-8"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
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
                      Filter stores by tenant
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
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
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
            {selectedStoreIds.length} store{selectedStoreIds.length !== 1 ? 's' : ''} selected
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
            <span className="w-1/7">Store Name</span>
            <span className="w-1/7">Store ID</span>
            <span className="w-1/7">Tenant</span>
            <span className="w-1/7">Address</span>
            <span className="w-1/7">Post Code</span>
            <span className="w-1/7">Tracking Option</span>
            <span className="w-1/7 flex justify-between">
              <span>Additional Info</span>
              <span>Actions</span>
            </span>
          </div>

          {/* Scrollable stores list */}
          <ScrollArea className="h-[400px] w-full">
            <div>
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center px-2 py-2 border-b hover:bg-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedStoreIds.includes(store.id)}
                    onChange={() => toggleStore(store.id)}
                    className="mr-4 h-4 w-4"
                  />
                  <div className="flex items-center w-1/7">
                    <div
                      className="flex items-center justify-center rounded-md mr-3"
                      style={{
                        backgroundColor: stringToColor(store.name),
                        width: 32,
                        height: 32,
                        minWidth: 32,
                        minHeight: 32,
                      }}
                    >
                      <span className="text-xs font-bold text-gray-800">
                        {getInitials(store.name)}
                      </span>
                    </div>
                    <span className="font-semibold text-sm truncate">{store.name}</span>
                  </div>
                  <span className="w-1/7 text-sm truncate">{store.id}</span>
                  <span className="w-1/7 text-sm truncate">{store.tenantName}</span>
                  <span className="w-1/7 text-sm truncate">{store.address}</span>
                  <span className="w-1/7 text-sm truncate">{store.postCode}</span>
                  <span className="w-1/7 text-sm truncate">{store.trackingOption}</span>
                  <div className="w-1/7 flex items-center justify-between">
                    {store.additionalInfo ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{store.additionalInfo}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditStore(store)}
                      className="h-8 w-8 ml-2"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Edit Store Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Make changes to the store information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Store Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => handleEditFormChange('name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-id">Store ID</Label>
              <Input
                id="edit-id"
                value={editFormData.id}
                onChange={(e) => handleEditFormChange('id', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Store Address</Label>
              <Input
                id="edit-address"
                value={editFormData.address}
                onChange={(e) => handleEditFormChange('address', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-postcode">Post Code</Label>
              <Input
                id="edit-postcode"
                value={editFormData.postCode}
                onChange={(e) => handleEditFormChange('postCode', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tenant</Label>
              <Select 
                value={tenants.find(t => t.name === editFormData.tenantName)?.id || ""} 
                onValueChange={(value) => {
                  const tenant = tenants.find(t => t.id === value);
                  if (tenant) {
                    handleEditFormChange('tenantName', tenant.name);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tracking Category</Label>
              <Select 
                value={editFormData.trackingCategory}
                onValueChange={(value) => handleEditFormChange('trackingCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tracking category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Store">Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-trackingOption">Tracking Option</Label>
              <Input
                id="edit-trackingOption"
                value={editFormData.trackingOption}
                onChange={(e) => handleEditFormChange('trackingOption', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-additionalInfo">Additional Information</Label>
              <Input
                id="edit-additionalInfo"
                value={editFormData.additionalInfo}
                onChange={(e) => handleEditFormChange('additionalInfo', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 