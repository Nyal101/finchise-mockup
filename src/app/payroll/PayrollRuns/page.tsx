"use client";

import { useState } from 'react';
import PayrollRuns from '../PayrollRuns';

export default function PayrollRunsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('March 2025');

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payroll Runs</h1>
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

      <PayrollRuns month={selectedMonth} />
    </div>
  );
} 