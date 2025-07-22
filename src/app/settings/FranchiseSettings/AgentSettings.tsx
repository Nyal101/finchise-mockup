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
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Bot, FileText, BarChart3, Info, ChevronDown, ChevronRight } from "lucide-react"

export default function AgentSettings() {
  const [journalsThreshold, setJournalsThreshold] = useState("10000")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [expandedSettings, setExpandedSettings] = useState<string[]>([])
  
  const handleJournalsThresholdChange = (value: string) => {
    setJournalsThreshold(value)
    setHasUnsavedChanges(true)
  }

  const handleSaveSettings = () => {
    console.log("Saving agent settings:", {
      journalsThreshold: parseFloat(journalsThreshold)
    })
    setHasUnsavedChanges(false)
  }

  const handleResetToDefaults = () => {
    setJournalsThreshold("10000")
    setHasUnsavedChanges(true)
  }

  const toggleSettings = (agentId: string) => {
    setExpandedSettings(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  const isExpanded = (agentId: string) => expandedSettings.includes(agentId)

  return (
    <div className="space-y-4">
      {hasUnsavedChanges && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 mb-6">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">You have unsaved changes</span>
        </div>
      )}

      {/* About Section */}
      <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 mt-6">
        <Info className="h-4 w-4 text-gray-500" />
        <span className="font-medium text-gray-700">About Agent Settings:</span>
        <span className="text-gray-600">Configure AI agent behaviors and thresholds. Changes take effect immediately.</span>
      </div>

      {/* 3x3 Grid of Agent Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Active Agent Cards */}
        {/* Invoices Agent */}
        <Card className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <CardTitle className="text-sm">Invoices Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">OCR and validation enabled</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 hover:bg-green-50"
                onClick={() => toggleSettings('invoices')}
              >
                {isExpanded('invoices') ? (
                  <ChevronDown className="h-4 w-4 text-green-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-green-600" />
                )}
              </Button>
            </div>
            {isExpanded('invoices') && (
              <div className="mt-2 space-y-2 border-t pt-2">
                <div className="text-xs text-gray-600">Additional settings coming soon</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accruals & Prepayments Agent */}
        <Card className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-600" />
                <CardTitle className="text-sm">Journals Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Auto-journaling enabled</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 hover:bg-purple-50"
                onClick={() => toggleSettings('journals')}
              >
                {isExpanded('journals') ? (
                  <ChevronDown className="h-4 w-4 text-purple-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-purple-600" />
                )}
              </Button>
            </div>
            {isExpanded('journals') && (
              <div className="mt-2 space-y-2 border-t pt-2">
                <div className="space-y-1">
                  <Label htmlFor="journals-threshold" className="text-xs font-medium">
                    Invoice Journaling Threshold
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">£</span>
                    <Input
                      id="journals-threshold"
                      type="number"
                      value={journalsThreshold}
                      onChange={(e) => handleJournalsThresholdChange(e.target.value)}
                      placeholder="10000"
                      className="text-xs h-7 pl-5"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Agent */}
        <Card className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm">Analytics Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Trend analysis enabled</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 hover:bg-blue-50"
                onClick={() => toggleSettings('analytics')}
              >
                {isExpanded('analytics') ? (
                  <ChevronDown className="h-4 w-4 text-blue-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                )}
              </Button>
            </div>
            {isExpanded('analytics') && (
              <div className="mt-2 space-y-2 border-t pt-2">
                <div className="text-xs text-gray-600">Additional settings coming soon</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Future Agent Cards - Each one written out for easy title modification */}
        {/* Future Agent 1 - Payroll */}
        <Card className="relative opacity-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <CardTitle className="text-sm text-gray-500">Payroll Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 text-xs">
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Coming soon</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                disabled
              >
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Future Agent 2 - Loans */}
        <Card className="relative opacity-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <CardTitle className="text-sm text-gray-500">Loans Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 text-xs">
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Coming soon</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                disabled
              >
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Future Agent 3 - Assests */}
        <Card className="relative opacity-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <CardTitle className="text-sm text-gray-500">Assets Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 text-xs">
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Coming soon</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                disabled
              >
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Future Agent 4 - Audit */}
        <Card className="relative opacity-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <CardTitle className="text-sm text-gray-500">Audit Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 text-xs">
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Coming soon</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                disabled
              >
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Future Agent 5 - Reporting */}
        <Card className="relative opacity-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <CardTitle className="text-sm text-gray-500">Reporting Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 text-xs">
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Coming soon</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                disabled
              >
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Future Agent 6 - Future Agent... */}
        <Card className="relative opacity-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <CardTitle className="text-sm text-gray-500">Future Agent</CardTitle>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 text-xs">
                Planned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Coming soon</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                disabled
              >
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={handleResetToDefaults}
        >
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
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
} 