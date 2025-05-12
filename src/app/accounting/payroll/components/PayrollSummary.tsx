"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PayrollSummaryProps {
  month: string;
}

export default function PayrollSummary({ month }: PayrollSummaryProps) {
  // Example data
  const summaryData = {
    totalEmployees: 45,
    totalGrossPay: 123750.00,
    totalTax: 24750.00,
    totalNetPay: 99000.00,
    employeeBreakdown: {
      fullTime: 30,
      partTime: 12,
      students: 3
    },
    taxBreakdown: {
      incomeTax: 19125.00,
      nationalInsurance: 5625.00
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payroll Summary - {month}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalEmployees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Gross Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{summaryData.totalGrossPay.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Tax & NI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{summaryData.totalTax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Net Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{summaryData.totalNetPay.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Full Time:</span>
                <span>{summaryData.employeeBreakdown.fullTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Part Time:</span>
                <span>{summaryData.employeeBreakdown.partTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Students:</span>
                <span>{summaryData.employeeBreakdown.students}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tax Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Income Tax:</span>
                <span>£{summaryData.taxBreakdown.incomeTax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>National Insurance:</span>
                <span>£{summaryData.taxBreakdown.nationalInsurance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 