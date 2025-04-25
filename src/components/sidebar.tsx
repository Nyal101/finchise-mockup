"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  PieChart,
  Settings,
  Store,
  User,
  Zap,
  BarChart2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const [selectedStore, setSelectedStore] = React.useState<string>("All Stores")

  const stores = [
    { id: "all", name: "All Stores" },
    { id: "store1", name: "Store 1" },
    { id: "store2", name: "Store 2" },
    { id: "store3", name: "Store 3" },
  ]

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            FranchiseAI
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedStore}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {stores.map((store) => (
                <DropdownMenuItem
                  key={store.id}
                  onClick={() => setSelectedStore(store.name)}
                >
                  <Store className="mr-2 h-4 w-4" />
                  <span>{store.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <div className="space-y-1">
            <Link href="/dashboard" passHref>
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div className="w-full flex items-center px-3 py-2 mt-4 font-semibold text-sm">
              <PieChart className="mr-2 h-4 w-4" />
              Insights
            </div>
            <Separator className="my-1 mx-3" />
            <Link href="/insights/chatbot" passHref>
              <Button
                variant={pathname === "/insights/chatbot" ? "secondary" : "ghost"}
                className="w-full justify-start pl-8"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                AI Chatbot
              </Button>
            </Link>
            <Link href="/insights/reports" passHref>
              <Button
                variant={pathname === "/insights/reports" ? "secondary" : "ghost"}
                className="w-full justify-start pl-8"
              >
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
            <div className="w-full flex items-center px-3 py-2 mt-4 font-semibold text-sm">
              <CreditCard className="mr-2 h-4 w-4" />
              Accounting
            </div>
            <Separator className="my-1 mx-3" />
            <Link href="/accounting/invoices" passHref>
              <Button
                variant={pathname === "/accounting/invoices" ? "secondary" : "ghost"}
                className="w-full justify-start pl-8"
              >
                <FileText className="mr-2 h-4 w-4" />
                Invoices
              </Button>
            </Link>
            <Link href="/accounting/payroll" passHref>
              <Button
                variant={pathname === "/accounting/payroll" ? "secondary" : "ghost"}
                className="w-full justify-start pl-8"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Payroll
              </Button>
            </Link>
            <Link href="/accounting/integrations" passHref>
              <Button
                variant={pathname === "/accounting/integrations" ? "secondary" : "ghost"}
                className="w-full justify-start pl-8"
              >
                <Zap className="mr-2 h-4 w-4" />
                Integrations
              </Button>
            </Link>
            <div className="w-full flex items-center px-3 py-2 mt-4 font-semibold text-sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </div>
            <Separator className="my-1 mx-3" />
            <Link href="/settings/store-management" passHref>
              <Button
                variant={pathname === "/settings/store-management" ? "secondary" : "ghost"}
                className="w-full justify-start pl-8"
              >
                <Store className="mr-2 h-4 w-4" />
                Store Management
              </Button>
            </Link>
            <Link href="/settings/user-management" passHref>
              <Button
                variant={pathname === "/settings/user-management" ? "secondary" : "ghost"}
                className="w-full justify-start pl-8"
              >
                <User className="mr-2 h-4 w-4" />
                User Management
              </Button>
            </Link>
            <Link href="/settings/dominoes-management" passHref>
              <Button
                variant={pathname === "/settings/dominoes-management" ? "secondary" : "ghost"}
                className="w-full justify-start pl-8"
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Dominoes Management
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 