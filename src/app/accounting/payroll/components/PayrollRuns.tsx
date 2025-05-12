"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PayrollRunsProps {
  month: string;
}

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  payrollId: string;
  storeName: string;
  hoursWorked: number;
  salary: number;
  tax: number;
  nationalInsurance: number;
  netPay: number;
  category: 'standard' | 'student' | 'cos' | 'deferred';
};

export default function PayrollRuns({ month }: PayrollRunsProps) {
  // Sample payroll data
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', firstName: 'Balraj', lastName: 'Singh', payrollId: 'TJ653831D', storeName: 'Dhillon Brands', hoursWorked: 160, salary: 3200, tax: 640, nationalInsurance: 320, netPay: 2240, category: 'standard' },
    { id: '2', firstName: 'Harpreet', lastName: 'Singh', payrollId: 'TJ468853B', storeName: 'Fans (UK) Ltd', hoursWorked: 160, salary: 2800, tax: 560, nationalInsurance: 280, netPay: 1960, category: 'standard' },
    { id: '3', firstName: 'Muhammad', lastName: 'Arslan', payrollId: 'ST343016A', storeName: 'R&D Yorkshire', hoursWorked: 160, salary: 3500, tax: 700, nationalInsurance: 350, netPay: 2450, category: 'standard' },
    { id: '4', firstName: 'Ranjit', lastName: 'Singh', payrollId: 'PW773929B', storeName: 'Dhillon Brands', hoursWorked: 160, salary: 3100, tax: 620, nationalInsurance: 310, netPay: 2170, category: 'standard' },
    { id: '5', firstName: 'Usman', lastName: 'Arshad', payrollId: 'SN501039D', storeName: 'MDJ Investments', hoursWorked: 80, salary: 1200, tax: 120, nationalInsurance: 60, netPay: 1020, category: 'student' },
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const filteredEmployees = activeTab === 'all' 
    ? employees 
    : employees.filter(employee => employee.category === activeTab);

  const handleExport = (format: 'csv' | 'excel' | 'brightpay') => {
    // In a real app, this would handle the actual export
    alert(`Exporting payroll data for ${month} in ${format.toUpperCase()} format`);
  };

  const updateEmployee = (employee: Employee) => {
    setEmployees(employees.map(e => 
      e.id === employee.id ? employee : e
    ));
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payroll for {month}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            Export as CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            Export as Excel
          </Button>
          <Button onClick={() => handleExport('brightpay')}>
            Export for BrightPay
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Employees</TabsTrigger>
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="cos">COS Managers</TabsTrigger>
          <TabsTrigger value="deferred">Deferred Pay</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Payroll ID</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">NI</TableHead>
                  <TableHead className="text-right">Net Pay</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                    <TableCell>{employee.payrollId}</TableCell>
                    <TableCell>{employee.storeName}</TableCell>
                    <TableCell className="text-right">{employee.hoursWorked}</TableCell>
                    <TableCell className="text-right">£{employee.salary.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">£{employee.tax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">£{employee.nationalInsurance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">£{employee.netPay.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingEmployee(employee)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                      No employees found for this category
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

      {editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Employee Payroll</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Employee</label>
                <div className="mt-1 font-bold">
                  {editingEmployee.firstName} {editingEmployee.lastName} ({editingEmployee.payrollId})
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium">Hours Worked</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingEmployee.hoursWorked}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    hoursWorked: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Salary</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingEmployee.salary}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    salary: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Tax</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingEmployee.tax}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    tax: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">National Insurance</label>
                <input 
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingEmployee.nationalInsurance}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    nationalInsurance: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setEditingEmployee(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  const netPay = editingEmployee.salary - editingEmployee.tax - editingEmployee.nationalInsurance;
                  updateEmployee({
                    ...editingEmployee,
                    netPay
                  });
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 