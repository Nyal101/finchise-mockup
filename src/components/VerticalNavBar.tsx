"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  Home,
  PieChart,
  Settings,
  Store,
  ChevronRight,
  ChevronLeft,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VerticalNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function VerticalNavBar({ 
  className, 
  activeSection, 
  onSectionChange 
}: VerticalNavBarProps) {
  const [selectedStore, setSelectedStore] = React.useState<string>("Dominos")
  const [isCollapsed, setIsCollapsed] = React.useState(true)
  const router = useRouter()

  const stores = [
    { id: "dominos", name: "Dominos", logo: "/logos/dominos.png" },
    { id: "gdk", name: "GDK", logo: "/logos/gdk.webp" },
    { id: "costa", name: "Costa", logo: "/logos/costa.png" },
  ]

  const sections = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "insights", name: "Insights", icon: PieChart },
    { id: "accounting", name: "Accounting", icon: CreditCard },
    { id: "settings", name: "Settings", icon: Settings },
    { id: "subscription", name: "Subscription", icon: Store },
  ]

  const currentStore = stores.find(s => s.name === selectedStore)!

  // Define the default/first page for each section
  const sectionDefaultPages = {
    dashboard: "/dashboard",
    insights: "/insights/FinancialReports",
    accounting: "/accounting/Purchases",
    settings: "/settings/Suppliers",
    subscription: "/settings/Subscription",
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId)
    
    // Navigate to the default page for this section
    const defaultPage = sectionDefaultPages[sectionId as keyof typeof sectionDefaultPages]
    if (defaultPage) {
      router.push(defaultPage)
    }
  }

  return (
    <div 
      className={cn(
        "min-h-screen bg-white border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-60",
        className
      )}
    >
      <div className="flex flex-col h-screen">
        {/* Header with logo and toggle button */}
        <div className="p-4 flex items-center justify-between">
          {/* Store selector */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full p-0 h-9 w-9 overflow-hidden"
                    >
                      <Image
                        src={currentStore.logo}
                        alt={currentStore.name}
                        width={35}
                        height={35}
                        className="rounded-full object-cover"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" className={isCollapsed ? "block" : "hidden"}>
                  {currentStore.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="center">
              {stores.map((store) => (
                <DropdownMenuItem
                  key={store.id}
                  onClick={() => setSelectedStore(store.name)}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={store.logo}
                    alt={store.name + " logo"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{store.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Store name when expanded */}
          {!isCollapsed && (
            <span className="text-sm font-medium truncate flex-1 mx-2">{currentStore.name}</span>
          )}
        </div>

        <Separator className="my-3" />

        {/* Navigation items */}
        <div className="px-2 py-4 flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <TooltipProvider key={section.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative overflow-visible w-full">
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "flex items-center h-10 px-3 w-full relative",
                            isCollapsed ? "justify-center px-0" : "justify-start gap-3",
                            isActive ? "border-r-4 border-orange-500 bg-gray-100" : ""
                          )}
                          onClick={() => handleSectionClick(section.id)}
                        >
                          <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-orange-500" : "")} />
                          {!isCollapsed && (
                            <span className="text-sm font-medium">
                              {section.name}
                            </span>
                          )}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className={isCollapsed ? "block" : "hidden"}>
                      {section.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
        </div>
        
        {/* Collapse toggle button moved to bottom */}
        <div className="p-4 flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleCollapse}
                  className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                >
                  {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className={isCollapsed ? "block" : "hidden"}>
                {isCollapsed ? "Expand" : "Collapse"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
