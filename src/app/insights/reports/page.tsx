"use client"

import * as React from "react"
import { BarChart3, Download, Filter, LineChart, PieChart } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <DateRangePicker />
      </div>
      
      <Tabs defaultValue="sales">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <MetricCard
              title="Total Sales"
              value="$245,389.32"
              trend="+12.5%"
              trendType="positive"
              description="vs. previous period"
            />
            <MetricCard
              title="Average Order Value"
              value="$35.42"
              trend="+2.4%"
              trendType="positive"
              description="vs. previous period"
            />
            <MetricCard
              title="Conversion Rate"
              value="3.8%"
              trend="-0.5%"
              trendType="negative"
              description="vs. previous period"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>Monthly sales for all stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                  <p className="ml-2 text-muted-foreground">Sales Trend Chart (Placeholder)</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Store</CardTitle>
                <CardDescription>Distribution across locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-muted-foreground" />
                  <p className="ml-2 text-muted-foreground">Sales Distribution (Placeholder)</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  <p className="ml-2 text-muted-foreground">Product Sales Chart (Placeholder)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <MetricCard
              title="Total Customers"
              value="24,512"
              trend="+8.2%"
              trendType="positive"
              description="vs. previous period"
            />
            <MetricCard
              title="New Customers"
              value="1,429"
              trend="+22.8%"
              trendType="positive"
              description="vs. previous period"
            />
            <MetricCard
              title="Customer Retention"
              value="68.3%"
              trend="-1.2%"
              trendType="negative"
              description="vs. previous period"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Customer Demographics Chart (Placeholder)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <MetricCard
              title="Total Products"
              value="152"
              trend="+5"
              trendType="positive"
              description="vs. previous period"
            />
            <MetricCard
              title="Best Seller"
              value="Hawaiian Pizza"
              trend="$14,230"
              trendType="neutral"
              description="in revenue"
            />
            <MetricCard
              title="Inventory Value"
              value="$42,891"
              trend="+3.1%"
              trendType="positive"
              description="vs. previous period"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Product Performance Chart (Placeholder)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <MetricCard
              title="Total Expenses"
              value="$128,459"
              trend="+4.3%"
              trendType="negative"
              description="vs. previous period"
            />
            <MetricCard
              title="Biggest Category"
              value="Inventory"
              trend="$43,675"
              trendType="neutral"
              description="34% of expenses"
            />
            <MetricCard
              title="Profit Margin"
              value="22.7%"
              trend="+0.8%"
              trendType="positive"
              description="vs. previous period"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Expense Breakdown Chart (Placeholder)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  trend: string
  trendType: "positive" | "negative" | "neutral"
  description: string
}

function MetricCard({ title, value, trend, trendType, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <span 
            className={`text-xs ${
              trendType === "positive" 
                ? "text-green-500" 
                : trendType === "negative" 
                  ? "text-red-500" 
                  : "text-gray-500"
            }`}
          >
            {trend}
          </span>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
} 