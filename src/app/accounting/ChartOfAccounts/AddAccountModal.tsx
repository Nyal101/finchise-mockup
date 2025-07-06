"use client"

import React, { useState, useEffect } from "react"
import { Check, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Type definitions
type AccountType = 
  | "Bank account"
  | "Current Asset account"
  | "Current Liability account"
  | "Depreciation account"
  | "Direct Costs account"
  | "Equity account"
  | "Expense account"
  | "Fixed Asset account"
  | "Inventory Asset account"
  | "Liability account"
  | "Non-current Asset account"
  | "Other Income account"
  | "Overhead account"
  | "Prepayment account"
  | "Revenue account"
  | "Sale account"
  | "Non-current Liability account";

interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  taxRate: string;
  reportCode: string;
  selected: boolean;
  status: "active" | "inactive";
  lastSynced: string;
}

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (accountData: Partial<Account>) => void;
  existingAccounts: Account[];
}

export default function AddAccountModal({
  isOpen,
  onClose,
  onAddAccount,
  existingAccounts
}: AddAccountModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    code: "",
    name: "",
    description: "",
    taxRate: "No VAT"
  })
  const [codeAvailability, setCodeAvailability] = useState<{
    status: 'idle' | 'checking' | 'available' | 'unavailable';
    message: string;
  }>({ status: 'idle', message: '' })

  // Check code availability when code changes
  useEffect(() => {
    if (!formData.code.trim()) {
      setCodeAvailability({ status: 'idle', message: '' })
      return
    }

    // Show checking status
    setCodeAvailability({ status: 'checking', message: 'Checking availability...' })

    // Simulate API call delay
    const timeoutId = setTimeout(() => {
      const isCodeTaken = existingAccounts.some(account => 
        account.code.toLowerCase() === formData.code.toLowerCase()
      )

      if (isCodeTaken) {
        setCodeAvailability({ 
          status: 'unavailable', 
          message: 'This code is already in use' 
        })
      } else {
        setCodeAvailability({ 
          status: 'available', 
          message: 'Code is available' 
        })
      }
    }, 500) // 500ms delay to simulate API call

    return () => clearTimeout(timeoutId)
  }, [formData.code, existingAccounts])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (codeAvailability.status !== 'available') {
      return
    }

    const accountData: Partial<Account> = {
      code: formData.code,
      name: formData.name,
      type: formData.type as AccountType,
      taxRate: formData.taxRate,
      status: "active",
      lastSynced: new Date().toISOString().split('T')[0]
    }

    onAddAccount(accountData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      type: "",
      code: "",
      name: "",
      description: "",
      taxRate: "No VAT"
    })
    setCodeAvailability({ status: 'idle', message: '' })
    onClose()
  }

  const isFormValid = formData.type && formData.code && formData.name && formData.taxRate && 
                     codeAvailability.status === 'available'

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Create a new account in the chart of accounts. This will be synced across all companies.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Account Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank account">Bank account</SelectItem>
                <SelectItem value="Current Asset account">Current Asset account</SelectItem>
                <SelectItem value="Current Liability account">Current Liability account</SelectItem>
                <SelectItem value="Depreciation account">Depreciation account</SelectItem>
                <SelectItem value="Direct Costs account">Direct Costs account</SelectItem>
                <SelectItem value="Equity account">Equity account</SelectItem>
                <SelectItem value="Expense account">Expense account</SelectItem>
                <SelectItem value="Fixed Asset account">Fixed Asset account</SelectItem>
                <SelectItem value="Inventory Asset account">Inventory Asset account</SelectItem>
                <SelectItem value="Liability account">Liability account</SelectItem>
                <SelectItem value="Non-current Asset account">Non-current Asset account</SelectItem>
                <SelectItem value="Other Income account">Other Income account</SelectItem>
                <SelectItem value="Overhead account">Overhead account</SelectItem>
                <SelectItem value="Prepayment account">Prepayment account</SelectItem>
                <SelectItem value="Revenue account">Revenue account</SelectItem>
                <SelectItem value="Sale account">Sale account</SelectItem>
                <SelectItem value="Non-current Liability account">Non-current Liability account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <div className="relative">
              <Input 
                id="code" 
                placeholder="e.g. 0010" 
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className={`pr-10 ${
                  codeAvailability.status === 'available' ? 'border-green-500' :
                  codeAvailability.status === 'unavailable' ? 'border-red-500' : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {codeAvailability.status === 'checking' && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
                {codeAvailability.status === 'available' && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {codeAvailability.status === 'unavailable' && (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            {codeAvailability.message && (
              <p className={`text-xs ${
                codeAvailability.status === 'available' ? 'text-green-600' :
                codeAvailability.status === 'unavailable' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {codeAvailability.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Account name" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input 
              id="description" 
              placeholder="Account description" 
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Tax</Label>
            <Select value={formData.taxRate} onValueChange={(value) => handleInputChange('taxRate', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tax type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20% (VAT on Expenses)">20% (VAT on Expenses)</SelectItem>
                <SelectItem value="No VAT">No VAT</SelectItem>
                <SelectItem value="20% (VAT on Income)">20% (VAT on Income)</SelectItem>
                <SelectItem value="Reverse Charge Expenses (20%)">Reverse Charge Expenses (20%)</SelectItem>
                <SelectItem value="5% (VAT on Expenses)">5% (VAT on Expenses)</SelectItem>
                <SelectItem value="5% (VAT on Income)">5% (VAT on Income)</SelectItem>
                <SelectItem value="15% (VAT on Expenses)">15% (VAT on Expenses)</SelectItem>
                <SelectItem value="15% (VAT on Income)">15% (VAT on Income)</SelectItem>
                <SelectItem value="Zero Rated Expenses">Zero Rated Expenses</SelectItem>
                <SelectItem value="Zero Rated Income">Zero Rated Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Add Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 