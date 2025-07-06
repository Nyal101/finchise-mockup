"use client"

import React from "react"
import { 
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible"

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

interface SyncIssue {
  id: string;
  type: "missing" | "mismatch" | "new";
  account: {
    code: string;
    name: string;
    type: AccountType;
  };
  companies: string[];
  description: string;
  severity: "high" | "medium" | "low";
  details: Record<string, { 
    exists: boolean; 
    name?: string; 
    type?: AccountType;
    taxRate?: string; 
  }>;
}

interface SyncIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncIssues: SyncIssue[];
  expandedIssues: Set<string>;
  onToggleExpanded: (issueId: string) => void;
}

export default function SyncIssuesModal({
  isOpen,
  onClose,
  syncIssues,
  expandedIssues,
  onToggleExpanded
}: SyncIssuesModalProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-[90vw] max-w-[1200px] max-h-[85vh] overflow-hidden border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Sync Issues ({syncIssues.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Review account synchronization issues across companies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="space-y-4">
            {syncIssues.map((issue) => (
              <Collapsible
                key={issue.id}
                open={expandedIssues.has(issue.id)}
                onOpenChange={() => onToggleExpanded(issue.id)}
              >
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(issue.severity)}`}
                          >
                            {issue.severity.toUpperCase()}
                          </Badge>
                          <span className="font-mono text-sm font-medium">
                            {issue.account.code}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {(() => {
                              if (issue.type === "missing") return "MISSING ACCOUNT"
                              
                              // For mismatch issues, determine the specific type
                              const differences: string[] = []
                              const firstCompanyDetails = issue.details[Object.keys(issue.details)[0]]
                              
                              Object.values(issue.details).forEach((details) => {
                                if (!details.exists) return
                                
                                if (details.type !== issue.account.type) {
                                  if (!differences.includes("ACCOUNT TYPE")) {
                                    differences.push("ACCOUNT TYPE")
                                  }
                                }
                                if (details.name !== issue.account.name) {
                                  if (!differences.includes("ACCOUNT NAME")) {
                                    differences.push("ACCOUNT NAME")
                                  }
                                }
                                if (details.taxRate !== firstCompanyDetails.taxRate) {
                                  if (!differences.includes("TAX RATE")) {
                                    differences.push("TAX RATE")
                                  }
                                }
                              })
                              
                              return differences.join(" + ")
                            })()}
                          </Badge>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {issue.account.name}
                        </h4>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {issue.description}
                        </p>
                        
                        <div className="text-xs text-gray-500">
                          <strong>Affected Companies:</strong> {issue.companies.join(', ')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-500 hover:text-gray-900"
                          onClick={() => onToggleExpanded(issue.id)}
                        >
                          {expandedIssues.has(issue.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium text-sm text-gray-900 mb-3">
                          Account Details Across Companies
                        </h5>
                        <div className="overflow-hidden rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="w-[200px]">Company</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead>Account Name</TableHead>
                                <TableHead className="w-[150px]">Type</TableHead>
                                <TableHead className="w-[200px]">Tax Rate</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(issue.details).map(([company, details]) => {
                                const hasTypeMismatch = details.exists && 
                                  details.type !== issue.account.type;
                                const hasNameMismatch = details.exists && 
                                  details.name !== issue.account.name;
                                const hasTaxMismatch = details.exists && 
                                  details.taxRate !== issue.details[Object.keys(issue.details)[0]].taxRate;
                                
                                return (
                                  <TableRow 
                                    key={company}
                                    className={details.exists ? '' : 'bg-red-50'}
                                  >
                                    <TableCell className="font-medium">
                                      {company}
                                    </TableCell>
                                    <TableCell>
                                      {details.exists ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700">
                                          Present
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-red-50 text-red-700">
                                          Missing
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className={`text-gray-600 ${hasNameMismatch ? 'bg-yellow-50' : ''}`}>
                                      {details.exists ? details.name : '-'}
                                    </TableCell>
                                    <TableCell className={`text-gray-600 ${hasTypeMismatch ? 'bg-yellow-50' : ''}`}>
                                      {details.exists ? details.type : '-'}
                                    </TableCell>
                                    <TableCell className={`text-gray-600 ${hasTaxMismatch ? 'bg-yellow-50' : ''}`}>
                                      {details.exists ? details.taxRate : '-'}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                        {issue.type === "mismatch" && (
                          <div className="mt-3 text-sm text-gray-500">
                            <AlertTriangle className="h-4 w-4 inline-block mr-1" />
                            Highlighted cells indicate differences from the standard configuration
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            ))}
            
            {syncIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">All Synced!</h3>
                <p className="text-sm">No sync issues found. All accounts are synchronized across companies.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
} 