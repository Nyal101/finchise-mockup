"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar, Download, FileText, Filter, User } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonthSelector } from "./Components/Summary"

export default function PayrollPage() {
  // State for the center (current) month
  const [centerMonth, setCenterMonth] = React.useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  // State for selected month (for detailed view)
  const [selectedMonth, setSelectedMonth] = React.useState<Date | null>(null);
  const [activeTab, setActiveTab] = React.useState("payroll-run");

  // Handlers
  function handleBackToMonths() {
    setSelectedMonth(null);
  }

  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payroll</h1>
        <DateRangePicker />
      </div>

      {/* Tabs Nav Bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="payroll-run">Payroll Run</TabsTrigger>
          <TabsTrigger value="employee-management">Employee Management</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary">
          {/* Summary Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Next Pay Run</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">June 30, 2023</div>
                <p className="text-xs text-muted-foreground mt-1">14 days remaining</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£128,459.00</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87</div>
                <p className="text-xs text-muted-foreground mt-1">Across all stores</p>
              </CardContent>
            </Card>
          </div>

          {/* Sub-tabs for summary */}
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" className="rounded-full px-4 py-1 text-sm font-medium">Payroll Runs</Button>
            <Button variant="ghost" className="rounded-full px-4 py-1 text-sm font-medium">Employees</Button>
            <Button variant="ghost" className="rounded-full px-4 py-1 text-sm font-medium">Timesheets</Button>
            <div className="flex-1" />
            <Button variant="outline" size="sm" className="flex items-center gap-1"><Filter className="h-4 w-4" />Filter</Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1"><Download className="h-4 w-4" />Export</Button>
          </div>

          {/* Recent Payroll Runs Table */}
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
                        {format(run.periodStart, "MMM d, yyyy")} - {format(run.periodEnd, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{format(run.payDate, "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <span className={getStatusClass(run.status)}>
                          {run.status}
                        </span>
                      </TableCell>
                      <TableCell>{run.employeeCount}</TableCell>
                      <TableCell>{run.totalHours}</TableCell>
                      <TableCell>${run.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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

        {/* Payroll Run Tab */}
        <TabsContent value="payroll-run">
          <MonthSelector
            centerMonth={centerMonth}
            setCenterMonth={setCenterMonth}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          {selectedMonth && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Payroll for {selectedMonth.toLocaleString('default', { month: 'long' })}, {selectedMonth.getFullYear()}
                </h2>
                <Button variant="outline" onClick={handleBackToMonths}>Back</Button>
              </div>
              {/* --- BEGIN: DETAILED PAYROLL MOCKUP --- */}
              <div className="flex gap-4 items-center mb-4">
                <Button variant="default">Update</Button>
                <Button variant="destructive">Delete Payroll</Button>
              </div>
              <div className="flex gap-2 mb-4">
                <Button variant="secondary">Payroll Errors</Button>
                <Button variant="secondary">COS Managers</Button>
                <Button variant="secondary">Students</Button>
                <Button variant="secondary">Deferred Pay</Button>
                <Button variant="secondary">Bonuses</Button>
                <Button variant="secondary">Deleted</Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">COS Managers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>NI Number</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Hours Per Week</TableHead>
                        <TableHead>Total Hours Worked</TableHead>
                        <TableHead>Hours Difference</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Mock rows */}
                      <TableRow>
                        <TableCell>Ramanathan</TableCell>
                        <TableCell>Thirumalai</TableCell>
                        <TableCell>NJ007412A</TableCell>
                        <TableCell>29000</TableCell>
                        <TableCell>44</TableCell>
                        <TableCell>234.2</TableCell>
                        <TableCell>58.20</TableCell>
                        <TableCell><Button variant="link">View Details</Button></TableCell>
                      </TableRow>
                      {/* Add more rows as needed */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payroll Monthly Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Hours Worked</TableHead>
                        <TableHead>Pay Rate</TableHead>
                        <TableHead>Total Pay</TableHead>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Employing Entity</TableHead>
                        <TableHead>Store ID</TableHead>
                        <TableHead>Payroll ID</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Payroll Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Mock rows */}
                      <TableRow>
                        <TableCell>Dilakshana</TableCell>
                        <TableCell>Sri Prasath</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>11.44</TableCell>
                        <TableCell>22.88</TableCell>
                        <TableCell>BUXTON</TableCell>
                        <TableCell>R & D 2</TableCell>
                        <TableCell>28826</TableCell>
                        <TableCell>RZ58346</TableCell>
                        <TableCell>Instore</TableCell>
                        <TableCell>Manual</TableCell>
                        <TableCell><Button variant="link" className="text-red-500">Delete</Button></TableCell>
                      </TableRow>
                      {/* Add more rows as needed */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              {/* --- END: DETAILED PAYROLL MOCKUP --- */}
            </div>
          )}
        </TabsContent>

        {/* Employee Management Tab */}
        <TabsContent value="employee-management">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
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
      </Tabs>
    </main>
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