"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar, CheckCircle, Clock, Download, FileText, Filter, User } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payroll</h1>
        <DateRangePicker />
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Pay Run</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">June 30, 2023</div>
            <p className="text-xs text-muted-foreground mt-1">
              14 days remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$128,459.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all stores
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="payroll-runs">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="payroll-runs">Payroll Runs</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
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
        
        <TabsContent value="payroll-runs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payroll Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pay Period</TableHead>
                    <TableHead>Pay Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>
                        {format(run.periodStart, "MMM d")} - {format(run.periodEnd, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{format(run.payDate, "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <span className={getStatusClass(run.status)}>
                          {run.status}
                        </span>
                      </TableCell>
                      <TableCell>{run.employeeCount}</TableCell>
                      <TableCell>{run.totalHours}</TableCell>
                      <TableCell>${run.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pay Rate</TableHead>
                    <TableHead>Hours this Month</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.store}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <span className={employee.status === "Active" ? "text-green-500" : "text-yellow-500"}>
                          {employee.status}
                        </span>
                      </TableCell>
                      <TableCell>${employee.payRate.toFixed(2)}/hr</TableCell>
                      <TableCell>{employee.hoursThisMonth}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timesheets">
          <Card>
            <CardHeader>
              <CardTitle>Recent Timesheets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Regular Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheets.map((timesheet) => (
                    <TableRow key={timesheet.id}>
                      <TableCell className="font-medium">{timesheet.employee}</TableCell>
                      <TableCell>
                        {format(timesheet.periodStart, "MMM d")} - {format(timesheet.periodEnd, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{timesheet.store}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {timesheet.status === "Approved" ? (
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                          )}
                          {timesheet.status}
                        </div>
                      </TableCell>
                      <TableCell>{timesheet.regularHours}</TableCell>
                      <TableCell>{timesheet.overtimeHours}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
    </div>
  )
}

function getStatusClass(status: string) {
  switch (status) {
    case "Paid":
      return "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"
    case "Scheduled":
      return "text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium"
    case "Processing":
      return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium"
    default:
      return "text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium"
  }
}

// Sample payroll runs data
const payrollRuns = [
  {
    id: "1",
    periodStart: new Date("2023-05-16"),
    periodEnd: new Date("2023-05-31"),
    payDate: new Date("2023-06-05"),
    status: "Paid",
    employeeCount: 87,
    totalHours: 3245,
    totalAmount: 52876.45
  },
  {
    id: "2",
    periodStart: new Date("2023-05-01"),
    periodEnd: new Date("2023-05-15"),
    payDate: new Date("2023-05-20"),
    status: "Paid",
    employeeCount: 85,
    totalHours: 3178,
    totalAmount: 51234.89
  },
  {
    id: "3",
    periodStart: new Date("2023-04-16"),
    periodEnd: new Date("2023-04-30"),
    payDate: new Date("2023-05-05"),
    status: "Paid",
    employeeCount: 84,
    totalHours: 3150,
    totalAmount: 50432.67
  },
  {
    id: "4",
    periodStart: new Date("2023-04-01"),
    periodEnd: new Date("2023-04-15"),
    payDate: new Date("2023-04-20"),
    status: "Paid",
    employeeCount: 83,
    totalHours: 3112,
    totalAmount: 49876.23
  },
  {
    id: "5",
    periodStart: new Date("2023-06-01"),
    periodEnd: new Date("2023-06-15"),
    payDate: new Date("2023-06-20"),
    status: "Scheduled",
    employeeCount: 87,
    totalHours: 3256,
    totalAmount: 53123.78
  },
  {
    id: "6",
    periodStart: new Date("2023-06-16"),
    periodEnd: new Date("2023-06-30"),
    payDate: new Date("2023-07-05"),
    status: "Processing",
    employeeCount: 87,
    totalHours: 3260,
    totalAmount: 53245.12
  }
]

// Sample employees data
const employees = [
  {
    id: "1",
    name: "John Smith",
    store: "Store 1",
    position: "Store Manager",
    status: "Active",
    payRate: 25.50,
    hoursThisMonth: 168
  },
  {
    id: "2",
    name: "Emily Johnson",
    store: "Store 2",
    position: "Assistant Manager",
    status: "Active",
    payRate: 22.00,
    hoursThisMonth: 160
  },
  {
    id: "3",
    name: "Michael Davis",
    store: "Store 3",
    position: "Shift Supervisor",
    status: "Active",
    payRate: 18.75,
    hoursThisMonth: 152
  },
  {
    id: "4",
    name: "Sarah Wilson",
    store: "Store 1",
    position: "Crew Member",
    status: "Active",
    payRate: 15.50,
    hoursThisMonth: 140
  },
  {
    id: "5",
    name: "David Thompson",
    store: "Store 2",
    position: "Crew Member",
    status: "Active",
    payRate: 15.50,
    hoursThisMonth: 138
  }
]

// Sample timesheets data
const timesheets = [
  {
    id: "1",
    employee: "John Smith",
    periodStart: new Date("2023-05-16"),
    periodEnd: new Date("2023-05-31"),
    store: "Store 1",
    status: "Approved",
    regularHours: 80,
    overtimeHours: 4
  },
  {
    id: "2",
    employee: "Emily Johnson",
    periodStart: new Date("2023-05-16"),
    periodEnd: new Date("2023-05-31"),
    store: "Store 2",
    status: "Approved",
    regularHours: 80,
    overtimeHours: 0
  },
  {
    id: "3",
    employee: "Michael Davis",
    periodStart: new Date("2023-05-16"),
    periodEnd: new Date("2023-05-31"),
    store: "Store 3",
    status: "Approved",
    regularHours: 76,
    overtimeHours: 0
  },
  {
    id: "4",
    employee: "Sarah Wilson",
    periodStart: new Date("2023-06-01"),
    periodEnd: new Date("2023-06-15"),
    store: "Store 1",
    status: "Pending",
    regularHours: 70,
    overtimeHours: 0
  },
  {
    id: "5",
    employee: "David Thompson",
    periodStart: new Date("2023-06-01"),
    periodEnd: new Date("2023-06-15"),
    store: "Store 2",
    status: "Pending",
    regularHours: 68,
    overtimeHours: 2
  }
] 