"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart2, Zap } from "lucide-react"

const franchiseSettingsNav = [
  {
    name: "Account Code Mappings",
    href: "/settings/FranchiseSettings/AccountCodeMappings",
    icon: BarChart2,
  },
  {
    name: "Custom Integrations",
    href: "/settings/FranchiseSettings/CustomIntegrations",
    icon: Zap,
  },
]

export default function FranchiseSettingsPage() {
  const pathname = usePathname()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Franchise Settings</h1>
      
      {/* Sub-navigation */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          {franchiseSettingsNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "flex items-center",
                    isActive ? "bg-gray-200" : "hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Content area */}
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Select a franchise setting from above to manage.</p>
      </div>
    </div>
  )
} 