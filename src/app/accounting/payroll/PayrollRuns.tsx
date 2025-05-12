"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight, RefreshCw } from "lucide-react";

interface PayrollRunsProps {
  month: string;
}

type PayrollEntry = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  hoursWorked: number;
  payRate: number;
  totalPay: number;
  storeName: string;
  employingCompany: string;
  storeId: string;
  payrollId: string;
  position: string;
  payrollType: string;
  hasError?: boolean;
  errorType?: 'missing_assignment' | 'invalid_hours' | 'rate_error';
};

export default function PayrollRuns({ month }: PayrollRunsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
  const [activeTab, setActiveTab] = useState('processing');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [totalEntries, setTotalEntries] = useState(196);
  const [pageSize, setPageSize] = useState(20);
  
  // Mock fetch payroll data
  useEffect(() => {
    const fetchPayrollData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // await fetch('/api/payroll/monthly-data')
        
        // Mock data based on screenshot
        const mockData: PayrollEntry[] = [
          { id: '1', employeeCode: '', firstName: 'Dilakshana', lastName: 'Sri Prasath', hoursWorked: 2, payRate: 11.44, totalPay: 22.88, storeName: 'BUXTON', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28826', payrollId: 'RZ583465B', position: 'Instore', payrollType: 'Manual Entry' },
          { id: '2', employeeCode: '', firstName: 'Dilakshana', lastName: 'Sri Prasath', hoursWorked: 2, payRate: 11.44, totalPay: 22.88, storeName: 'BUXTON', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28826', payrollId: 'RZ583465B', position: 'Instore', payrollType: 'Manual Entry' },
          { id: '3', employeeCode: '', firstName: 'Ajanas', lastName: 'Clinskas', hoursWorked: 2, payRate: 11.54, totalPay: 23.08, storeName: 'PONTEFRACT', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28555', payrollId: 'SN866594C', position: 'TM', payrollType: 'Manual Entry' },
          { id: '4', employeeCode: '', firstName: 'Joel Mateo', lastName: 'Collison', hoursWorked: 2, payRate: 8.7, totalPay: 17.4, storeName: 'MORECAMBE', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28823', payrollId: 'PK984520A', position: 'TM', payrollType: 'Manual Entry' },
          { id: '5', employeeCode: '', firstName: 'Jinethra Amitha', lastName: 'Malavi Arachchi', hoursWorked: 2, payRate: 11.54, totalPay: 23.08, storeName: 'PONTEFRACT', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28555', payrollId: 'TK089489B', position: 'TM', payrollType: 'Manual Entry' },
          { id: '6', employeeCode: '', firstName: 'Laxmi', lastName: 'Khadka', hoursWorked: 2, payRate: 11.44, totalPay: 22.88, storeName: 'MORECAMBE', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28823', payrollId: 'RZ632324A', position: 'TM', payrollType: 'Manual Entry' },
          { id: '7', employeeCode: '', firstName: 'Carys Ruth', lastName: 'Wilson', hoursWorked: 2, payRate: 11.54, totalPay: 23.08, storeName: 'MORECAMBE', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28823', payrollId: 'PE691734C', position: 'TM', payrollType: 'Manual Entry' },
          { id: '8', employeeCode: '', firstName: 'Stuart Paul L...', lastName: 'Durkin', hoursWorked: 2, payRate: 11.54, totalPay: 23.08, storeName: 'PONTEFRACT', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28555', payrollId: 'JR604600A', position: 'TM', payrollType: 'Manual Entry' },
          { id: '9', employeeCode: '', firstName: 'Madisyn Paige', lastName: 'Harkin', hoursWorked: 2, payRate: 8.7, totalPay: 17.4, storeName: 'MORECAMBE', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28823', payrollId: 'PR476318C', position: 'TM', payrollType: 'Manual Entry' },
          { id: '10', employeeCode: '', firstName: 'Delight Maybe', lastName: 'Santana', hoursWorked: 2, payRate: 11.54, totalPay: 23.08, storeName: 'PONTEFRACT', employingCompany: 'R & D 2 Pizza Ltd', storeId: '28555', payrollId: 'PJ158693B', position: 'TM', payrollType: 'Manual Entry' },
          // Add more entries to match the screenshot
        ];
        
        setPayrollEntries(mockData);
        setTotalEntries(196);
        setTotalPages(10);
      } catch (error) {
        console.error("Failed to fetch payroll data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayrollData();
  }, [month]);
  
  // For processed payroll data
  const [processedPayroll] = useState([
    { id: '1', name: 'Sarayu Poladi', payrollId: 'RZ109814C', amount: 17.32, hours: 80 },
    // More data would be added here in real implementation
  ]);
  
  const handleUpdatePayroll = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call the API to update/process payroll
      // await fetch('/api/payroll/process', { method: 'POST' });
      
      setTimeout(() => {
        setActiveTab('export');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to process payroll:", error);
      setIsLoading(false);
    }
  };
  
  const handleAddEntry = () => {
    // This would open a form to add a new payroll entry
    alert('Add new payroll entry');
  };
  
  const handleDelete = (id: string) => {
    // In a real app, this would call the API to delete the entry
    setPayrollEntries(payrollEntries.filter(entry => entry.id !== id));
  };
  
  const handleViewDetails = (id: string) => {
    // This would navigate to details view
    alert(`View details for entry ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payroll for {month}</h2>
      </div>

      <Tabs defaultValue="processing" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="processing">
          <div className="mb-4">
            <Button 
              onClick={handleUpdatePayroll} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Update
                </>
              )}
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Code</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Hours Worked</TableHead>
                      <TableHead>Pay Rate</TableHead>
                      <TableHead>Total Pay</TableHead>
                      <TableHead>Store Name</TableHead>
                      <TableHead>Employing Company</TableHead>
                      <TableHead>Store ID</TableHead>
                      <TableHead>Payroll ID</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Payroll Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollEntries.map(entry => (
                      <TableRow key={entry.id} className={entry.hasError ? "bg-red-50" : ""}>
                        <TableCell>{entry.employeeCode}</TableCell>
                        <TableCell>{entry.firstName}</TableCell>
                        <TableCell>{entry.lastName}</TableCell>
                        <TableCell>{entry.hoursWorked}</TableCell>
                        <TableCell>{entry.payRate}</TableCell>
                        <TableCell>{entry.totalPay}</TableCell>
                        <TableCell>{entry.storeName}</TableCell>
                        <TableCell>{entry.employingCompany}</TableCell>
                        <TableCell>{entry.storeId}</TableCell>
                        <TableCell>{entry.payrollId}</TableCell>
                        <TableCell>{entry.position}</TableCell>
                        <TableCell>{entry.payrollType}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {payrollEntries.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-6 text-gray-500">
                          No payroll entries found
                        </TableCell>
                      </TableRow>
                    )}
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-6 text-gray-500">
                          Loading payroll data...
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Payroll ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedPayroll.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.payrollId}</TableCell>
                      <TableCell>{entry.amount}</TableCell>
                      <TableCell>{entry.hours}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => handleViewDetails(entry.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-2">
                  <span>Page Size:</span>
                  <select 
                    className="border rounded px-2 py-1"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <span className="mr-4">
                    {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="mx-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-2xl font-bold">Payroll Monthly Data</h2>
        <Button onClick={handleAddEntry} className="rounded-full" size="icon">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
} 