"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayrollSummary from './PayrollSummary';
import PayrollRuns from './PayrollRuns';
import EmployeeManagement from './EmployeeManagement';

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('March 2025');

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payroll</h1>
        <div className="flex gap-2">
          <select 
            className="border border-gray-300 rounded-md p-2" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="January 2025">January 2025</option>
            <option value="February 2025">February 2025</option>
            <option value="March 2025">March 2025</option>
            <option value="April 2025">April 2025</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
          <TabsTrigger value="employees">Employee Management</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <PayrollSummary month={selectedMonth} />
        </TabsContent>
        <TabsContent value="runs">
          <PayrollRuns month={selectedMonth} />
        </TabsContent>
        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
