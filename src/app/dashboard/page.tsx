"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { DollarSign, ShoppingCart, TrendingUp, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DateRangePicker />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* While you were away section */}
      <Card>
        <CardHeader>
          <CardTitle>While you were away</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-700">23</span>
                </div>
                <div>
                  <span className="font-medium">Invoices</span> processed by AI
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                View <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-700">15</span>
                </div>
                <div>
                  <span className="font-medium">Bills</span> processed by AI
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                View <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your clients section */}
      <Card className="bg-blue-50/50 shadow-md border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle>Your clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 overflow-hidden border">
                <Image 
                  src="/logos/dominos.png" 
                  alt="Domino's logo" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-medium">Dom123 Ltd</div>
                <div className="text-xs text-muted-foreground">Actions pending review</div>
              </div>
            </div>
            <Button className="flex items-center gap-2 bg-[#13b5ea] hover:bg-[#0e8bbd]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
                <circle cx="16" cy="16" r="16" fill="#13b5ea"/>
                <path d="M16 6C10.477 6 6 10.477 6 16c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.333A8.333 8.333 0 1 1 16 7.667a8.333 8.333 0 0 1 0 16.666zm0-15A6.667 6.667 0 1 0 16 22.667 6.667 6.667 0 0 0 16 9.333z" fill="#fff"/>
              </svg>
              Xero
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 overflow-hidden border">
                <Image 
                  src="/logos/gdk.webp" 
                  alt="GDK logo" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-medium">GDK123 Ltd</div>
                <div className="text-xs text-muted-foreground">Actions pending review</div>
              </div>
            </div>
            <Button className="flex items-center gap-2 bg-[#13b5ea] hover:bg-[#0e8bbd]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
                <circle cx="16" cy="16" r="16" fill="#13b5ea"/>
                <path d="M16 6C10.477 6 6 10.477 6 16c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.333A8.333 8.333 0 1 1 16 7.667a8.333 8.333 0 0 1 0 16.666zm0-15A6.667 6.667 0 1 0 16 22.667 6.667 6.667 0 0 0 16 9.333z" fill="#fff"/>
              </svg>
              Xero
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 overflow-hidden border">
                <Image 
                  src="/logos/costa.png" 
                  alt="Costa logo" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-medium">Costa123 Ltd</div>
                <div className="text-xs text-muted-foreground">Actions pending review</div>
              </div>
            </div>
            <Button className="flex items-center gap-2 bg-[#13b5ea] hover:bg-[#0e8bbd]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
                <circle cx="16" cy="16" r="16" fill="#13b5ea"/>
                <path d="M16 6C10.477 6 6 10.477 6 16c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.333A8.333 8.333 0 1 1 16 7.667a8.333 8.333 0 0 1 0 16.666zm0-15A6.667 6.667 0 1 0 16 22.667 6.667 6.667 0 0 0 16 9.333z" fill="#fff"/>
              </svg>
              Xero
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 