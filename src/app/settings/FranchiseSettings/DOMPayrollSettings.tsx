import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type PayrollRow = {
  id: string
  fieldName: string
  condition: string
  value: string
}

export default function DOMPayrollSettings() {
  const [rows, setRows] = React.useState<PayrollRow[]>([
    { id: "1", fieldName: "Position", condition: "=", value: "Area Trainer" },
    { id: "2", fieldName: "Position", condition: "=", value: "Area Manager" },
    { id: "3", fieldName: "Position", condition: "=", value: "Regional Mgr" },
    { id: "4", fieldName: "Position", condition: "=", value: "Franchisee" },
    { id: "5", fieldName: "Position", condition: "=", value: "Ops Director" },
    { id: "6", fieldName: "Hours Worked", condition: "<", value: "0.1" },
    { id: "7", fieldName: "Pay Rate", condition: "<", value: "0.1" },
  ])

  const handleDelete = (id: string) => {
    setRows(rows.filter((row) => row.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Payroll Settings</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Field Name</TableHead>
            <TableHead className="w-1/3">Condition</TableHead>
            <TableHead className="w-1/3">Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.fieldName}</TableCell>
              <TableCell>{row.condition}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex justify-end items-center space-x-2">
        <div>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  )
}
