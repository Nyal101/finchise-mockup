"use client"

import * as React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  FileText, 
  BookOpen, 
  BarChart3, 
  Settings2, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AgentSettings() {
  // State for agent settings
  const [journalsThreshold, setJournalsThreshold] = useState("10000")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Handle changes and mark as unsaved
  const handleJournalsThresholdChange = (value: string) => {
    setJournalsThreshold(value)
    setHasUnsavedChanges(true)
  }

  // Save settings
  const handleSaveSettings = () => {
    // Here you would typically save to your backend/state management
    console.log("Saving agent settings:", {
      journalsThreshold: parseFloat(journalsThreshold)
    })
    setHasUnsavedChanges(false)
  }

  // Reset to defaults
  const handleResetToDefaults = () => {
    setJournalsThreshold("10000")
    setHasUnsavedChanges(true)
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return "£0.00"
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(num)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Agent Settings</h1>
            <p className="text-sm text-gray-600">Configure AI agent behaviors and thresholds</p>
          </div>
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">You have unsaved changes</span>
          </div>
        )}
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Invoices Agent */}
        <Card className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Invoices Agent</CardTitle>
                <p className="text-sm text-gray-600">AI-powered invoice processing</p>
              </div>
            </div>
            <Badge variant="outline" className="w-fit bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Current Capabilities</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  OCR text extraction
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Data validation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Auto-categorization
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Status</h4>
              <p className="text-xs text-gray-600">No configuration required. Agent is ready to process invoices.</p>
            </div>
          </CardContent>
        </Card>

        {/* Journals Agent */}
        <Card className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Accruals & Prepayments Agent</CardTitle>
                <p className="text-sm text-gray-600">Automated journal entry creation</p>
              </div>
            </div>
            <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
              Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="journals-threshold" className="text-sm font-medium">
                    Invoice Journaling Threshold
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Invoices above this amount will be automatically journaled</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-1">
                  <Input
                    id="journals-threshold"
                    type="number"
                    value={journalsThreshold}
                    onChange={(e) => handleJournalsThresholdChange(e.target.value)}
                    placeholder="10000"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Current threshold: {formatCurrency(journalsThreshold)}
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Current Capabilities</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Automatic prepayment journals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Accrual calculations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Stock movement tracking
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Agent */}
        <Card className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Analytics Agent</CardTitle>
                <p className="text-sm text-gray-600">Intelligent business insights</p>
              </div>
            </div>
            <Badge variant="outline" className="w-fit bg-blue-50 text-blue-700 border-blue-200">
              Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Current Capabilities</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Trend analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Predictive insights
                </li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Status</h4>
              <p className="text-xs text-gray-600">No configuration required. Agent is ready to provide insights.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={handleResetToDefaults}
          className="flex items-center gap-2"
        >
          <Settings2 className="h-4 w-4" />
          Reset to Defaults
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setHasUnsavedChanges(false)}
            disabled={!hasUnsavedChanges}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={!hasUnsavedChanges}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Help Section */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mt-0.5">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-gray-900">About Agent Settings</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                These settings control how AI agents behave within your franchise management system. 
                The Journals Agent threshold determines which invoices are automatically processed for journaling. 
                Changes to these settings will take effect immediately across all stores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 