"use client"

import * as React from "react"
import { CheckCircle, ExternalLink, RefreshCw, Settings, X } from "lucide-react"
import Image from "next/image"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <DateRangePicker />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <IntegrationCard
          name="Xero"
          description="Connect your franchise accounts with Xero for seamless accounting and financial management."
          status="connected"
          lastSync="2 hours ago"
        />
        
        <IntegrationCard
          name="QuickBooks"
          description="Synchronize your invoices, expenses, and payroll with QuickBooks."
          status="disconnected"
          lastSync="Never"
        />
        
        <IntegrationCard
          name="Sage"
          description="Connect with Sage for comprehensive accounting and business management."
          status="connected"
          lastSync="1 day ago"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Integration History</CardTitle>
          <CardDescription>Recent synchronization events and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrationHistory.map((event, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ${getStatusIndicatorClass(event.status)}`}>
                  {getStatusIcon(event.status)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Mapping Settings</CardTitle>
          <CardDescription>Configure how your data is mapped between systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Invoices</h3>
                <p className="text-xs text-muted-foreground">Map invoice fields between FranchiseAI and your accounting software</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Expense Categories</h3>
                <p className="text-xs text-muted-foreground">Map expense categories between systems</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Payroll Data</h3>
                <p className="text-xs text-muted-foreground">Configure how payroll data syncs with accounting</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface IntegrationCardProps {
  name: string
  description: string
  status: "connected" | "disconnected" | "pending"
  lastSync: string
}

function IntegrationCard({ name, description, status, lastSync }: IntegrationCardProps) {
  // Function to get the logo path based on the name
  const getLogoPath = () => {
    switch (name.toLowerCase()) {
      case "xero":
        return "/accounting-logos/xero.png";
      case "quickbooks":
        return "/accounting-logos/quickbooks.png";
      case "sage":
        return "/accounting-logos/sage.png";
      default:
        return "";
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            {getLogoPath() ? (
              <Image 
                src={getLogoPath()} 
                alt={`${name} logo`} 
                width={48} 
                height={48} 
                className="object-contain p-1" 
              />
            ) : (
              <div className="text-xs text-gray-500">{name[0]}</div>
            )}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "connected" 
              ? "bg-green-50 text-green-600" 
              : status === "pending" 
                ? "bg-yellow-50 text-yellow-600" 
                : "bg-gray-50 text-gray-600"
          }`}>
            {status === "connected" ? "Connected" : status === "pending" ? "Pending" : "Disconnected"}
          </div>
        </div>
        <CardTitle className="mt-4">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {status === "connected" && (
          <div className="text-sm">
            <span className="text-muted-foreground">Last synced:</span> {lastSync}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {status === "connected" ? (
          <div className="flex space-x-2 w-full">
            <Button variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Now
            </Button>
            <Button variant="outline" className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        ) : (
          <Button className="w-full">
            Connect {name}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function getStatusIndicatorClass(status: "success" | "error" | "warning" | "info") {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-600"
    case "error":
      return "bg-red-100 text-red-600"
    case "warning":
      return "bg-yellow-100 text-yellow-600"
    case "info":
      return "bg-blue-100 text-blue-600"
  }
}

function getStatusIcon(status: "success" | "error" | "warning" | "info") {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4" />
    case "error":
      return <X className="h-4 w-4" />
    case "warning":
      return <RefreshCw className="h-4 w-4" />
    case "info":
      return <ExternalLink className="h-4 w-4" />
  }
}

const integrationHistory = [
  {
    title: "Xero Sync Completed",
    description: "Successfully synchronized 24 invoices and 18 expenses",
    time: "Today, 2:34 PM",
    status: "success" as const
  },
  {
    title: "Sage Sync Warning",
    description: "3 invoices could not be synced due to missing data",
    time: "Today, 10:12 AM",
    status: "warning" as const
  },
  {
    title: "QuickBooks Connection Failed",
    description: "Authentication token expired. Please reconnect your account",
    time: "Yesterday, 4:45 PM",
    status: "error" as const
  },
  {
    title: "Xero Integration Updated",
    description: "New features available with the latest Xero API update",
    time: "2 days ago",
    status: "info" as const
  },
  {
    title: "Sage Sync Completed",
    description: "Successfully synchronized 42 invoices and 27 expenses",
    time: "3 days ago",
    status: "success" as const
  }
] 