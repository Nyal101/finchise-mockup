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


export default function DominosManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("invoice-mapping")
  
  // Filter invoice mappings based on search query
  const filteredMappings = invoiceMappings.filter(mapping => 
    searchQuery === "" || 
    mapping.dominosCode.toString().includes(searchQuery) ||
    mapping.dominosDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.xeroCode.toString().includes(searchQuery) ||
    mapping.xeroDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.quickBooksCode.toString().includes(searchQuery) ||
    mapping.quickBooksDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.sageCode.toString().includes(searchQuery) ||
    mapping.sageDescription.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dominos Management</h1>
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
                Map Dominos cost codes to your accounting software codes
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
                    Map a Dominos cost code to the corresponding codes in your accounting software.
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quickBooksCode">QuickBooks Code</Label>
                      <Input id="quickBooksCode" placeholder="e.g. 6010" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quickBooksDescription">QuickBooks Description</Label>
                      <Input id="quickBooksDescription" placeholder="e.g. Advertising Expense" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="sageCode">Sage Code</Label>
                      <Input id="sageCode" placeholder="e.g. 7010" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sageDescription">Sage Description</Label>
                      <Input id="sageDescription" placeholder="e.g. Marketing & Advertising" />
                    </div>
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
          
          {/* Search Bar */}
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
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-0">
                    <TableHead colSpan={2} className="text-center bg-slate-100 rounded-tl-md">
                      Dominos
                    </TableHead>
                    <TableHead colSpan={6} className="text-center bg-slate-50 rounded-tr-md">
                      Accounting Software
                    </TableHead>
                    <TableHead rowSpan={2} className="text-right border-b"></TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="bg-slate-100">Code</TableHead>
                    <TableHead className="bg-slate-100">Description</TableHead>
                    <TableHead className="bg-slate-50 border-l">Xero Code</TableHead>
                    <TableHead className="bg-slate-50">Xero Description</TableHead>
                    <TableHead className="bg-slate-50/80">QuickBooks Code</TableHead>
                    <TableHead className="bg-slate-50/80">QuickBooks Description</TableHead>
                    <TableHead className="bg-slate-50/60">Sage Code</TableHead>
                    <TableHead className="bg-slate-50/60">Sage Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">{mapping.dominosCode}</TableCell>
                      <TableCell>{mapping.dominosDescription}</TableCell>
                      <TableCell className="border-l">{mapping.xeroCode}</TableCell>
                      <TableCell>{mapping.xeroDescription}</TableCell>
                      <TableCell>{mapping.quickBooksCode}</TableCell>
                      <TableCell>{mapping.quickBooksDescription}</TableCell>
                      <TableCell>{mapping.sageCode}</TableCell>
                      <TableCell>{mapping.sageDescription}</TableCell>
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
                <div className="space-y-2">
                  <Label htmlFor="defaultMarkup">Default Markup (%)</Label>
                  <Input id="defaultMarkup" type="number" placeholder="e.g. 10" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rechargeDay">Recharge Day</Label>
                  <Input id="rechargeDay" type="number" placeholder="e.g. 1" defaultValue="1" min="1" max="31" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Categories to Recharge</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Recharge?</TableHead>
                      <TableHead>Markup (%)</TableHead>
                      <TableHead>Allocation Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rechargeCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <input 
                            type="checkbox" 
                            defaultChecked={category.recharge} 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            defaultValue={category.markup.toString()} 
                            className="h-8 w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={category.method}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equal">Equal Split</SelectItem>
                              <SelectItem value="revenue">By Revenue</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">Reset</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">API Integrations</h2>
            <p className="text-sm text-muted-foreground">
              Manage connections to TextManagement and ExtraNet
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TextManagement Integration Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">TextManagement (TextMan)</h3>
                    <p className="text-sm text-muted-foreground">Text messaging service integration</p>
                  </div>
                  <StatusBadge status={textManStatus === "connected" ? "connected" : "disconnected"} />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="textManApiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="textManApiKey" 
                        type="password" 
                        placeholder="Enter API key" 
                        defaultValue={textManStatus === "connected" ? "••••••••••••••••" : ""}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textManEndpoint">Endpoint URL</Label>
                    <Input 
                      id="textManEndpoint" 
                      placeholder="Enter endpoint URL" 
                      defaultValue={textManStatus === "connected" ? "https://api.textman.com/v2" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textManAccountId">Account ID</Label>
                    <Input 
                      id="textManAccountId" 
                      placeholder="Enter account ID" 
                      defaultValue={textManStatus === "connected" ? "DOM-12345" : ""}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Test Connection</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* ExtraNet Integration Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">ExtraNet</h3>
                    <p className="text-sm text-muted-foreground">Dominos franchise software integration</p>
                  </div>
                  <StatusBadge status={extraNetStatus === "connected" ? "connected" : "disconnected"} />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="extraNetApiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="extraNetApiKey" 
                        type="password" 
                        placeholder="Enter API key" 
                        defaultValue={extraNetStatus === "connected" ? "••••••••••••••••" : ""}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="extraNetEndpoint">Endpoint URL</Label>
                    <Input 
                      id="extraNetEndpoint" 
                      placeholder="Enter endpoint URL" 
                      defaultValue={extraNetStatus === "connected" ? "https://extranet.dominos.com/api" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="extraNetFranchiseId">Franchise ID</Label>
                    <Input 
                      id="extraNetFranchiseId" 
                      placeholder="Enter franchise ID" 
                      defaultValue={extraNetStatus === "connected" ? "FR-5678" : ""}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Test Connection</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Latest Sync Status</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Last Sync Attempt:</span>
                      <span>{extraNetStatus === "connected" ? "Today at 09:15 AM" : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={extraNetStatus === "connected" ? "text-green-600" : "text-red-600"}>
                        {extraNetStatus === "connected" ? "Successful" : "Failed"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Records Synced:</span>
                      <span>{extraNetStatus === "connected" ? "172" : "0"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Integration Settings */}
            <Card className="md:col-span-2">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium">Global Integration Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="syncFrequency">Sync Frequency</Label>
                    <Select defaultValue="hourly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15min">Every 15 minutes</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="syncTime">Daily Sync Time</Label>
                    <Input 
                      id="syncTime" 
                      type="time" 
                      defaultValue="02:00"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="logFailedRequests"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <Label htmlFor="logFailedRequests">Log failed API requests for troubleshooting</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="retryFailed"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <Label htmlFor="retryFailed">Automatically retry failed operations (up to 3 times)</Label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Status badge component
type StatusBadgeProps = {
  status: "connected" | "disconnected";
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span 
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === "connected" 
          ? "bg-green-50 text-green-600" 
          : "bg-red-50 text-red-600"
      }`}
    >
      {status === "connected" ? "Connected" : "Disconnected"}
    </span>
  );
};

// Sample invoice mapping data
const invoiceMappings = [
  {
    id: "map-001",
    dominosCode: 1001,
    dominosDescription: "Advertising",
    xeroCode: 40245,
    xeroDescription: "Advertising Expense",
    quickBooksCode: 6010,
    quickBooksDescription: "Marketing & Advertising",
    sageCode: 7010,
    sageDescription: "Marketing & Promotions"
  },
  {
    id: "map-002",
    dominosCode: 1002,
    dominosDescription: "Rent",
    xeroCode: 40250,
    xeroDescription: "Rent Expense",
    quickBooksCode: 6020,
    quickBooksDescription: "Rent & Occupancy",
    sageCode: 7020,
    sageDescription: "Property Rent"
  },
  {
    id: "map-003",
    dominosCode: 1003,
    dominosDescription: "Utilities",
    xeroCode: 40255,
    xeroDescription: "Utility Expenses",
    quickBooksCode: 6030,
    quickBooksDescription: "Utilities",
    sageCode: 7030,
    sageDescription: "Utilities & Services"
  },
  {
    id: "map-004",
    dominosCode: 1004,
    dominosDescription: "Payroll",
    xeroCode: 40260,
    xeroDescription: "Salary & Wages",
    quickBooksCode: 6040,
    quickBooksDescription: "Payroll Expenses",
    sageCode: 7040,
    sageDescription: "Employee Costs"
  },
  {
    id: "map-005",
    dominosCode: 1005,
    dominosDescription: "Ingredients",
    xeroCode: 40265,
    xeroDescription: "Food Supplies",
    quickBooksCode: 6050,
    quickBooksDescription: "Food & Ingredients",
    sageCode: 7050,
    sageDescription: "Food Costs"
  },
  {
    id: "map-006",
    dominosCode: 1006,
    dominosDescription: "Equipment",
    xeroCode: 40270,
    xeroDescription: "Equipment Expenses",
    quickBooksCode: 6060,
    quickBooksDescription: "Equipment & Maintenance",
    sageCode: 7060,
    sageDescription: "Kitchen Equipment"
  },
  {
    id: "map-007",
    dominosCode: 1007,
    dominosDescription: "Insurance",
    xeroCode: 40275,
    xeroDescription: "Insurance Expense",
    quickBooksCode: 6070,
    quickBooksDescription: "Business Insurance",
    sageCode: 7070,
    sageDescription: "Insurance Costs"
  },
  {
    id: "map-008",
    dominosCode: 1008,
    dominosDescription: "Training",
    xeroCode: 40280,
    xeroDescription: "Staff Training",
    quickBooksCode: 6080,
    quickBooksDescription: "Employee Development",
    sageCode: 7080,
    sageDescription: "Training & Development"
  }
];

// Sample recharge category data
const rechargeCategories = [
  {
    id: "cat-001",
    name: "Advertising & Marketing",
    recharge: true,
    markup: 5,
    method: "revenue"
  },
  {
    id: "cat-002",
    name: "Rent & Facilities",
    recharge: true,
    markup: 2,
    method: "custom"
  },
  {
    id: "cat-003",
    name: "Utilities",
    recharge: true,
    markup: 0,
    method: "equal"
  },
  {
    id: "cat-004",
    name: "Corporate Staff",
    recharge: true,
    markup: 10,
    method: "revenue"
  },
  {
    id: "cat-005",
    name: "IT Services",
    recharge: true,
    markup: 8,
    method: "equal"
  },
  {
    id: "cat-006",
    name: "Franchise Fees",
    recharge: false,
    markup: 0,
    method: "equal"
  }
];

// Integration statuses
const textManStatus = "connected";
const extraNetStatus = "connected"; 