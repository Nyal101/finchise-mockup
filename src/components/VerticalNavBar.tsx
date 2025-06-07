"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  Home,
  PieChart,
  Settings,
  Store,
  DollarSign,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VerticalNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function VerticalNavBar({ 
  className, 
  activeSection, 
  onSectionChange,
  onCollapseChange
}: VerticalNavBarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(true)
  const router = useRouter()

  const sections = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "insights", name: "Insights", icon: PieChart },
    { id: "accounting", name: "Accounting", icon: CreditCard },
    { id: "payroll", name: "Payroll", icon: DollarSign },
    { id: "settings", name: "Settings", icon: Settings },
    { id: "subscription", name: "Subscription", icon: Store },
  ]

  // Define the default/first page for each section
  const sectionDefaultPages = {
    dashboard: "/dashboard",
    insights: "/insights/FinancialReports",
    accounting: "/accounting/Purchases",
    payroll: "/payroll/Summary",
    settings: "/settings/StoreManagement",
    subscription: "/settings/Subscription",
  }

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
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
        "bg-gray-100 border-r transition-all duration-300 ease-in-out fixed top-16 left-0 h-[calc(100vh-4rem)]",
        isCollapsed ? "w-20" : "w-60",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Remove the header with logo/franchise selector */}

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
                            isActive ? "bg-gray-200" : ""
                          )}
                          onClick={() => handleSectionClick(section.id)}
                        >
                          <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-black" : "")} />
                          {!isCollapsed && (
                            <span className={cn("text-sm", isActive ? "font-bold text-black" : "font-medium")}>
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
