"use client";

import EmployeeManagement from '../EmployeeManagement';

export default function EmployeeManagementPage() {
  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
      </div>

      <EmployeeManagement />
    </div>
  );
} 