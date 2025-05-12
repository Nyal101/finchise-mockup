"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  payrollId: string;
  position: string;
  employingEntity: string;
  employeeType: string;
  hoursPerWeek: number | null;
  salary: number | null;
  maxHours: number | null;
  active: boolean;
  lastEdited: string;
};

export default function EmployeeManagement() {
  // Sample employee data based on the screenshot
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', firstName: 'Balraj', lastName: 'Singh', payrollId: 'TJ653831D', position: 'Manager', employingEntity: 'Dhillon Brands', employeeType: 'STANDARD', hoursPerWeek: null, salary: null, maxHours: null, active: true, lastEdited: '2025-03-15' },
    { id: '2', firstName: 'Balraj', lastName: 'Singh', payrollId: 'TJ817906C', position: 'Assistant', employingEntity: 'Bellam & Co', employeeType: 'STANDARD', hoursPerWeek: null, salary: null, maxHours: null, active: true, lastEdited: '2025-04-22' },
    { id: '3', firstName: 'Harpreet', lastName: 'Singh', payrollId: 'TJ468853B', position: 'Operations', employingEntity: 'Fans (UK) Ltd', employeeType: 'STANDARD', hoursPerWeek: null, salary: null, maxHours: null, active: true, lastEdited: '2025-03-15' },
    { id: '4', firstName: 'Harpreet', lastName: 'Singh', payrollId: 'NJ711386C', position: 'Store Manager', employingEntity: 'Nij Enterprises', employeeType: 'STANDARD', hoursPerWeek: null, salary: null, maxHours: null, active: true, lastEdited: '2025-03-15' },
    { id: '5', firstName: 'Muhammad', lastName: 'Arslan', payrollId: 'ST343016A', position: 'Finance', employingEntity: 'R&D Yorkshire', employeeType: 'STANDARD', hoursPerWeek: null, salary: null, maxHours: null, active: true, lastEdited: '2025-03-15' },
    { id: '6', firstName: 'Muhammad', lastName: 'Arslan', payrollId: 'RZ026895D', position: 'TM Driver', employingEntity: 'Nij Enterprises', employeeType: 'STUDENT PART TIME', hoursPerWeek: 20, salary: null, maxHours: null, active: true, lastEdited: '2025-04-22' },
    { id: '7', firstName: 'Ranjit', lastName: 'Singh', payrollId: 'PW773929B', position: 'Supervisor', employingEntity: 'Dhillon Brands', employeeType: 'STANDARD', hoursPerWeek: null, salary: null, maxHours: null, active: true, lastEdited: '2025-03-15' },
    { id: '8', firstName: 'Ranjit', lastName: 'Singh', payrollId: 'TL491607D', position: 'Operations', employingEntity: 'R&D Yorkshire', employeeType: 'STANDARD', hoursPerWeek: null, salary: null, maxHours: null, active: true, lastEdited: '2025-03-15' },
    { id: '9', firstName: 'Usman', lastName: 'Arshad', payrollId: 'SN501039D', position: 'Cashier', employingEntity: 'MDJ Investments', employeeType: 'STUDENT PART TIME', hoursPerWeek: 20, salary: null, maxHours: null, active: true, lastEdited: '2025-03-15' },
    { id: '10', firstName: 'Usman', lastName: 'Arshad', payrollId: 'RZ209279D', position: 'Cashier', employingEntity: 'Popat Leisure', employeeType: 'STANDARD', hoursPerWeek: null, salary: null, maxHours: null, active: true, lastEdited: '2025-03-15' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    payrollId: '',
    position: '',
    employingEntity: '',
    employeeType: 'STANDARD',
    active: true
  });
  
  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(searchLower) ||
      employee.lastName.toLowerCase().includes(searchLower) ||
      employee.payrollId.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower) ||
      employee.employingEntity.toLowerCase().includes(searchLower)
    );
  });

  const handleAddEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.payrollId) {
      alert('Please fill in all required fields');
      return;
    }

    const id = (employees.length + 1).toString();
    const today = new Date().toISOString().split('T')[0];

    setEmployees([
      ...employees,
      {
        id,
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        payrollId: newEmployee.payrollId,
        position: newEmployee.position || '',
        employingEntity: newEmployee.employingEntity || '',
        employeeType: newEmployee.employeeType || 'STANDARD',
        hoursPerWeek: newEmployee.employeeType?.includes('PART TIME') ? 20 : null,
        salary: null,
        maxHours: null,
        active: true,
        lastEdited: today
      }
    ]);

    setNewEmployee({
      firstName: '',
      lastName: '',
      payrollId: '',
      position: '',
      employingEntity: '',
      employeeType: 'STANDARD',
      active: true
    });

    setIsAddEmployeeOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(employee => employee.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">All Employee Records</h2>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Search Employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button>+ Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name*</label>
                    <Input 
                      value={newEmployee.firstName}
                      onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name*</label>
                    <Input 
                      value={newEmployee.lastName}
                      onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">NI Number*</label>
                  <Input 
                    value={newEmployee.payrollId}
                    onChange={(e) => setNewEmployee({...newEmployee, payrollId: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Input 
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employing Entity</label>
                  <Input 
                    value={newEmployee.employingEntity}
                    onChange={(e) => setNewEmployee({...newEmployee, employingEntity: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee Type</label>
                  <select 
                    className="w-full border rounded-md p-2"
                    value={newEmployee.employeeType}
                    onChange={(e) => setNewEmployee({...newEmployee, employeeType: e.target.value})}
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="STUDENT PART TIME">Student (Part Time)</option>
                    <option value="COS MANAGER">COS Manager</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>
                    Add Employee
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            Show All
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>NI Number</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Employing Entity</TableHead>
                <TableHead>Employee Type</TableHead>
                <TableHead className="text-right">Hours/Week</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead className="text-right">Max Hours</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.payrollId}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.employingEntity}</TableCell>
                  <TableCell>{employee.employeeType}</TableCell>
                  <TableCell className="text-right">{employee.hoursPerWeek}</TableCell>
                  <TableCell className="text-right">{employee.salary}</TableCell>
                  <TableCell className="text-right">{employee.maxHours}</TableCell>
                  <TableCell className="text-center">
                    {employee.active && (
                      <svg className="h-5 w-5 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </TableCell>
                  <TableCell>{employee.lastEdited}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-6 text-gray-500">
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 