"use client"

import * as React from "react"
import { Check, Edit, MoreHorizontal, Search, Trash, UserPlus } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false)
  
  const filteredUsers = users.filter(
    user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <DateRangePicker />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Add a new user to your franchise management system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Store Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="readonly">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="store" className="text-sm font-medium">
                  Assigned Store
                </label>
                <Select>
                  <SelectTrigger id="store">
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    <SelectItem value="store1">Store 1</SelectItem>
                    <SelectItem value="store2">Store 2</SelectItem>
                    <SelectItem value="store3">Store 3</SelectItem>
                    <SelectItem value="store4">Store 4</SelectItem>
                    <SelectItem value="store5">Store 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddUserOpen(false)}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.store}</TableCell>
                  <TableCell>
                    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active" 
                        ? "bg-green-50 text-green-600" 
                        : "bg-gray-50 text-gray-600"
                    }`}>
                      {user.status === "Active" && (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
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
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
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
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Manage access levels and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRoles.map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{role.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user login and system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="min-w-[40px] font-mono text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-muted-foreground"> - {activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "Admin":
      return "bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-xs font-medium"
    case "Store Manager":
      return "bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium"
    case "Staff":
      return "bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-medium"
    case "Accountant":
      return "bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium"
    default:
      return "bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-xs font-medium"
  }
}

// Sample users data
const users = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Admin",
    store: "All Stores",
    status: "Active",
    lastLogin: "Today, 10:30 AM"
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "Store Manager",
    store: "Store 2",
    status: "Active",
    lastLogin: "Today, 9:15 AM"
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    role: "Store Manager",
    store: "Store 3",
    status: "Active",
    lastLogin: "Yesterday, 5:20 PM"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Staff",
    store: "Store 1",
    status: "Active",
    lastLogin: "Yesterday, 2:45 PM"
  },
  {
    id: "5",
    name: "David Thompson",
    email: "david.thompson@example.com",
    role: "Accountant",
    store: "All Stores",
    status: "Active",
    lastLogin: "2 days ago"
  },
  {
    id: "6",
    name: "Jessica Brown",
    email: "jessica.brown@example.com",
    role: "Read Only",
    store: "All Stores",
    status: "Inactive",
    lastLogin: "1 week ago"
  }
]

// Sample user roles
const userRoles = [
  {
    name: "Admin",
    description: "Full access to all system features and settings"
  },
  {
    name: "Store Manager",
    description: "Manage specific store operations and staff"
  },
  {
    name: "Accountant",
    description: "Access to financial data and reports"
  },
  {
    name: "Staff",
    description: "Limited access to daily operations"
  },
  {
    name: "Read Only",
    description: "View only access with no edit permissions"
  }
]

// Sample user activities
const userActivities = [
  {
    user: "John Smith",
    action: "Login",
    details: "Successful login from Chrome browser on Windows",
    time: "10:30"
  },
  {
    user: "Emily Johnson",
    action: "Updated inventory",
    details: "Modified 12 items in Store 2 inventory",
    time: "09:45"
  },
  {
    user: "David Thompson",
    action: "Generated report",
    details: "Monthly financial report for May 2023",
    time: "09:15"
  },
  {
    user: "Sarah Wilson",
    action: "Password reset",
    details: "Requested password reset via email",
    time: "08:30"
  },
  {
    user: "Michael Davis",
    action: "Added staff member",
    details: "Added new employee to Store 3 staff roster",
    time: "Yesterday"
  }
] 