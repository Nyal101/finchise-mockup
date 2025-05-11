"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  PieChart,
  Settings,
  Store,
  User,
  Zap,
  LucideIcon,
  Bell,
  LogOut,
  UserCircle,
  KeyRound,
  Plus,
  Upload
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HorizontalNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeSection: string;
}

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  beta?: boolean;
}

type User = {
  name: string;
  email: string;
  initials: string;
}

export function HorizontalNavBar({ 
  className, 
  activeSection 
}: HorizontalNavBarProps) {
  const pathname = usePathname()
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const fileUploadRef = React.useRef<HTMLInputElement>(null)
  
  // Mock user data - in a real app, this would come from authentication
  const [currentUser] = React.useState<User>({
    name: "John Doe",
    email: "john.doe@example.com",
    initials: "JD"
  })

  // Define all navigation items organized by section
  const navItems: Record<string, NavItem[]> = {
    dashboard: [
      { 
        name: "Dashboard", 
        href: "/dashboard", 
        icon: Home 
      },
    ],
    insights: [
      { 
        name: "Financial Reports", 
        href: "/insights/FinancialReports", 
        icon: BarChart2 
      },
      { 
        name: "Management Reports", 
        href: "/insights/ManagementReports", 
        icon: BarChart2 
      },
      { 
        name: "AI Chatbot", 
        href: "/insights/chatbot", 
        icon: MessageSquare, 
        beta: true 
      },
    ],
    accounting: [
      { 
        name: "Purchases - Bills", 
        href: "/accounting/Purchases", 
        icon: FileText 
      },
      { 
        name: "Sales - Invoices", 
        href: "/accounting/Sales", 
        icon: FileText 
      },
      { 
        name: "Contacts", 
        href: "/accounting/Contacts", 
        icon: User 
      },
      { 
        name: "Manual Journals", 
        href: "/accounting/Journals", 
        icon: FileText 
      },
      { 
        name: "Payroll", 
        href: "/accounting/Payroll", 
        icon: CreditCard 
      },
      { 
        name: "Stock control", 
        href: "/accounting/StockControl", 
        icon: Store 
      },
    ],
    settings: [
      { 
        name: "Suppliers Management", 
        href: "/settings/Suppliers", 
        icon: User 
      },
      { 
        name: "User Management", 
        href: "/settings/UserManagement", 
        icon: User 
      },
      { 
        name: "Integrations", 
        href: "/settings/Integrations", 
        icon: Zap 
      },
      { 
        name: "Franchise Management", 
        href: "/settings/FranchiseManagement", 
        icon: Store 
      },
      { 
        name: "Account Code Mappings", 
        href: "/settings/AccountCodeMappings", 
        icon: BarChart2 
      },
      { 
        name: "Store Mx", 
        href: "/settings/StoreMx", 
        icon: Store 
      },
      { 
        name: "Chart of Accounts Mx", 
        href: "/settings/COASync", 
        icon: PieChart 
      },
    ],
    subscription: [
      { 
        name: "Subscription and Billing", 
        href: "/settings/Subscription", 
        icon: CreditCard 
      },
    ],
  };

  // Keep the rest of the navigation items
  navItems.accounting = [
    { 
      name: "Purchases - Bills", 
      href: "/accounting/Purchases", 
      icon: FileText 
    },
    { 
      name: "Sales - Invoices", 
      href: "/accounting/Sales", 
      icon: FileText 
    },
    { 
      name: "Contacts", 
      href: "/accounting/Contacts", 
      icon: User 
    },
    { 
      name: "Manual Journals", 
      href: "/accounting/Journals", 
      icon: FileText 
    },
    { 
      name: "Payroll", 
      href: "/accounting/Payroll", 
      icon: CreditCard 
    },
    { 
      name: "Stock control", 
      href: "/accounting/StockControl", 
      icon: Store 
    },
  ];

  navItems.settings = [
    { 
      name: "Suppliers Management", 
      href: "/settings/Suppliers", 
      icon: User 
    },
    { 
      name: "User Management", 
      href: "/settings/UserManagement", 
      icon: User 
    },
    { 
      name: "Integrations", 
      href: "/settings/Integrations", 
      icon: Zap 
    },
    { 
      name: "Franchise Management", 
      href: "/settings/FranchiseManagement", 
      icon: Store 
    },
    { 
      name: "Account Code Mappings", 
      href: "/settings/AccountCodeMappings", 
      icon: BarChart2 
    },
    { 
      name: "Store Mx", 
      href: "/settings/StoreMx", 
      icon: Store 
    },
    { 
      name: "Chart of Accounts Mx", 
      href: "/settings/COASync", 
      icon: PieChart 
    },
  ];

  navItems.subscription = [
    { 
      name: "Subscription and Billing", 
      href: "/settings/Subscription", 
      icon: CreditCard 
    },
  ];

  // Get the navigation items for the active section
  const activeItems = navItems[activeSection] || [];

  if (activeItems.length === 0) {
    return null;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleSubmit = () => {
    // Here you would implement the actual file upload to your server
    console.log("Files to upload:", files)
    // After upload is complete
    setFiles([])
  }

  return (
    <div className={cn("border-b bg-white", className)}>
      <div className="flex h-16 items-center px-4 justify-between">
        {/* Left side - navigation tabs */}
        <nav className="flex items-center space-x-4 lg:space-x-6 overflow-x-auto">
          {activeItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.href} className="relative flex flex-col items-center">
                <Link 
                  href={item.href} 
                  passHref 
                  className="relative"
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "flex items-center justify-center px-4",
                      isActive ? "text-black font-bold bg-gray-100" : ""
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                    {item.beta && (
                      <span className="ml-2 text-xs text-muted-foreground">(beta)</span>
                    )}
                  </Button>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right side - notifications and user profile */}
        <div className="flex items-center space-x-4">
          {/* Upload button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Upload Files</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Drag and drop files here or click to browse
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
                    isDragging ? "border-primary bg-primary/10" : "border-gray-300",
                    files.length > 0 ? "border-green-500" : ""
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileUploadRef.current?.click()}
                >
                  <input 
                    ref={fileUploadRef}
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                  
                  {files.length > 0 ? (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-green-500 mx-auto" />
                      <p className="text-sm font-medium">{files.length} file(s) selected</p>
                      <ul className="text-xs text-gray-500 max-h-24 overflow-y-auto space-y-1">
                        {files.map((file, i) => (
                          <li key={i} className="truncate">{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-sm font-medium">Drop files here or click</p>
                      <p className="text-xs text-gray-500">Supports common file formats</p>
                    </div>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 flex justify-end gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={files.length === 0}
                >
                  Clear
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSubmit} 
                  disabled={files.length === 0}
                >
                  Upload {files.length > 0 && `(${files.length})`}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
