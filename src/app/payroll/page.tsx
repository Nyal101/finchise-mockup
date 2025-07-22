"use client";

import PayrollSummary from './PayrollSummary';

export default function PayrollPage() {
  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payroll Overview</h1>
      </div>

      <PayrollSummary month="March 2025" />
    </div>
  );
}
