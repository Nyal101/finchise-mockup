"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react"

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
      <div className="bg-[#232b3b] rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">While you were away</h2>
        <div className="space-y-3">
          <div className="flex items-center bg-[#2d3650] rounded-md p-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4">
              <span className="text-lg font-bold text-black">23</span>
            </div>
            <div className="flex-1">
              <span className="text-white font-semibold">Invoices</span> processed by AI
            </div>
            <button className="ml-4 px-4 py-1 rounded bg-[#3a4256] text-white text-sm">View</button>
          </div>
          <div className="flex items-center bg-[#2d3650] rounded-md p-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4">
              <span className="text-lg font-bold text-black">15</span>
            </div>
            <div className="flex-1">
              <span className="text-white font-semibold">Bills</span> processed by AI
            </div>
            <button className="ml-4 px-4 py-1 rounded bg-[#3a4256] text-white text-sm">View</button>
          </div>
        </div>
      </div>

      {/* Your clients section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your clients</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
              <span className="text-lg font-bold text-[#232b3b]">D</span>
            </div>
            <div>
              <div className="font-semibold text-lg">Dom123 Ltd</div>
              <div className="text-xs text-gray-500">Actions pending review</div>
            </div>
          </div>
          <a href="#" className="flex items-center px-4 py-2 bg-[#13b5ea] text-white rounded hover:bg-[#0e8bbd] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" className="mr-2"><circle cx="16" cy="16" r="16" fill="#13b5ea"/><path d="M16 6C10.477 6 6 10.477 6 16c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18.333A8.333 8.333 0 1 1 16 7.667a8.333 8.333 0 0 1 0 16.666zm0-15A6.667 6.667 0 1 0 16 22.667 6.667 6.667 0 0 0 16 9.333z" fill="#fff"/></svg>
            Xero
          </a>
        </div>
      </div>
    </main>
  )
} 