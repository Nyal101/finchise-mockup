"use client"

import * as React from "react"
import { BarChart3, Download, Filter, LineChart, PieChart, ArrowUp, ArrowDown, MoreHorizontal, BarChart2, ArrowRight, ChevronDown, FileSpreadsheet } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
            <TabsTrigger value="kpi">KPIs</TabsTrigger>
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
              value="£245,389.32"
              trend="+12.5%"
              trendType="positive"
              description="vs. previous period"
            />
            <MetricCard
              title="Average Order Value"
              value="£35.42"
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
              trend="£14,230"
              trendType="neutral"
              description="in revenue"
            />
            <MetricCard
              title="Inventory Value"
              value="£42,891"
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
              value="£128,459"
              trend="+4.3%"
              trendType="negative"
              description="vs. previous period"
            />
            <MetricCard
              title="Biggest Category"
              value="Inventory"
              trend="£43,675"
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
        
        {/* KPI Tab Content */}
        <TabsContent value="kpi" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">KPI Report</h2>
              <p className="text-sm text-muted-foreground">Performance metrics across all stores</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs py-1 px-3 rounded-full">
                  7 of 30 companies selected
                </Badge>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs py-1 px-3 rounded-full">
                  British Pound (£)
                </Badge>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs py-1 px-3 rounded-full">
                  May 25, compared to 3 periods
                </Badge>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <BarChart2 className="h-4 w-4 mr-2" />
              Change
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <BarChart2 className="h-4 w-4 mr-2" />
              Budget
            </Button>
            <Button variant="secondary" size="sm" className="rounded-full">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Total
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Average
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <BarChart2 className="h-4 w-4 mr-2" />
              Percent of Sales
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Compact View
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Revenue vs Expenses Chart (Placeholder)</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[200px]"></TableHead>
                    <TableHead className="text-right">Feb 25</TableHead>
                    <TableHead className="text-right">Mar 25</TableHead>
                    <TableHead className="text-right">Apr 25</TableHead>
                    <TableHead className="text-right">May 25</TableHead>
                    <TableHead className="text-right font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Total Revenue</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0 font-normal">
                            £1,444,790.48
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Export to Excel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">£1,616,035.06</TableCell>
                    <TableCell className="text-right">£1,506,905.98</TableCell>
                    <TableCell className="text-right">£259,183.50</TableCell>
                    <TableCell className="text-right font-medium">£4,826,915.02</TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium">Gross Profit</TableCell>
                    <TableCell className="text-right">£540,539.93</TableCell>
                    <TableCell className="text-right">£578,362.22</TableCell>
                    <TableCell className="text-right">£550,373.23</TableCell>
                    <TableCell className="text-right">£198,772.39</TableCell>
                    <TableCell className="text-right font-medium">£1,868,047.77</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Total Expenses</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-auto p-0 font-normal">
                        £507,164.42
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">£639,182.23</TableCell>
                    <TableCell className="text-right">£471,636.90</TableCell>
                    <TableCell className="text-right">£145,076.76</TableCell>
                    <TableCell className="text-right font-medium">£1,763,040.31</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Cash in Bank</TableCell>
                    <TableCell className="text-right">£609,674.44</TableCell>
                    <TableCell className="text-right">£1,880,690.26</TableCell>
                    <TableCell className="text-right">£2,348,368.25</TableCell>
                    <TableCell className="text-right">£2,214,504.61</TableCell>
                    <TableCell className="text-right font-medium">£2,214,504.61</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Gross Profit Margin</TableCell>
                    <TableCell className="text-right">37.41%</TableCell>
                    <TableCell className="text-right">35.79%</TableCell>
                    <TableCell className="text-right">36.55%</TableCell>
                    <TableCell className="text-right">76.69%</TableCell>
                    <TableCell className="text-right font-medium">38.71%</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Operating Profit Margin</TableCell>
                    <TableCell className="text-right">2.31%</TableCell>
                    <TableCell className="text-right">-3.76%</TableCell>
                    <TableCell className="text-right">5.23%</TableCell>
                    <TableCell className="text-right">20.72%</TableCell>
                    <TableCell className="text-right font-medium">2.18%</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Net Profit Margin</TableCell>
                    <TableCell className="text-right">2.31%</TableCell>
                    <TableCell className="text-right">-3.76%</TableCell>
                    <TableCell className="text-right">5.23%</TableCell>
                    <TableCell className="text-right">20.72%</TableCell>
                    <TableCell className="text-right font-medium">2.18%</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">AP Outstanding</TableCell>
                    <TableCell className="text-right">£753,699.46</TableCell>
                    <TableCell className="text-right">£854,594.30</TableCell>
                    <TableCell className="text-right">£687,188.41</TableCell>
                    <TableCell className="text-right">£644,385.41</TableCell>
                    <TableCell className="text-right font-medium">£644,385.41</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">AR Outstanding</TableCell>
                    <TableCell className="text-right">£175,733.07</TableCell>
                    <TableCell className="text-right">£178,340.39</TableCell>
                    <TableCell className="text-right">£1,151,258.53</TableCell>
                    <TableCell className="text-right">£1,461,073.37</TableCell>
                    <TableCell className="text-right font-medium">£1,461,073.37</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Days Sales Outstanding</TableCell>
                    <TableCell className="text-right">3.41</TableCell>
                    <TableCell className="text-right">3.42</TableCell>
                    <TableCell className="text-right">22.93</TableCell>
                    <TableCell className="text-right">174.75</TableCell>
                    <TableCell className="text-right font-medium">51.13</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Activity Ratio</TableCell>
                    <TableCell className="text-right">1.43</TableCell>
                    <TableCell className="text-right">1.45</TableCell>
                    <TableCell className="text-right">1.39</TableCell>
                    <TableCell className="text-right">0.23</TableCell>
                    <TableCell className="text-right font-medium">1.12</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Return on Equity</TableCell>
                    <TableCell className="text-right">3.30%</TableCell>
                    <TableCell className="text-right">-5.45%</TableCell>
                    <TableCell className="text-right">7.26%</TableCell>
                    <TableCell className="text-right">4.77%</TableCell>
                    <TableCell className="text-right font-medium">2.47%</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Working Capital</TableCell>
                    <TableCell className="text-right">£1,138,774.99</TableCell>
                    <TableCell className="text-right">£3,113,709.24</TableCell>
                    <TableCell className="text-right">£3,267,119.55</TableCell>
                    <TableCell className="text-right">£3,335,132.84</TableCell>
                    <TableCell className="text-right font-medium">£2,708,684.16</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b-0">
                    <TableCell className="font-medium">Working Capital Ratio</TableCell>
                    <TableCell className="text-right">121.97%</TableCell>
                    <TableCell className="text-right">159.76%</TableCell>
                    <TableCell className="text-right">165.31%</TableCell>
                    <TableCell className="text-right">172.16%</TableCell>
                    <TableCell className="text-right font-medium">172.16%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Remove Eliminated Accounts
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export to Excel</DropdownMenuItem>
                <DropdownMenuItem>Export to PDF</DropdownMenuItem>
                <DropdownMenuItem>Export to CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm">
              Create custom report
            </Button>
            
            <Button variant="outline" size="sm">
              Add to report pack
            </Button>
          </div>
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
          {trendType === "positive" ? (
            <ArrowUp className="h-3 w-3 text-green-500 ml-1" />
          ) : trendType === "negative" ? (
            <ArrowDown className="h-3 w-3 text-red-500 ml-1" />
          ) : null}
          <span className="text-xs text-muted-foreground ml-1">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 