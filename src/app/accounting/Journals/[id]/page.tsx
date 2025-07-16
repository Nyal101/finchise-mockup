"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Download,
  X,
  ChevronRight,
  Package,
  RotateCcw
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { journalEntries } from "../journalData";
import { calculateJournal, calculateStockJournal } from "../utils/journalCalculations";
import { useEffect } from "react";
import { JournalLineItems } from "../components/JournalLineItems";
import { PrepaymentJournalDetails } from "../components/PrepaymentJournalDetails";
import { AccrualJournalDetails } from "../components/AccrualJournalDetails";
import { StockJournalDetails } from "../components/StockJournalDetails";
import { JournalEntry } from "../types";

export default function JournalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedDocumentId, setSelectedDocumentId] = React.useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);
  const [showDocuments, setShowDocuments] = React.useState(false);
  
  // Reset journal data when ID changes
  const [journalData, setJournalData] = React.useState<JournalEntry | undefined>(undefined);

  // Find the current journal
  const journal = journalData;

  // Get current selected document
  const selectedDocument = journal?.sourceDocuments.find(doc => doc.id === selectedDocumentId);

  // Update journal data when ID changes
  React.useEffect(() => {
    const j = journalEntries.find(j => j.id === params.id);
    if (j) {
      setJournalData({ 
        ...j, 
        scheduleType: j.scheduleType || 'monthly (weekly split)', 
        monthlyBreakdown: j.monthlyBreakdown || [] 
      });
      setSelectedMonth(null);
    }
  }, [params.id]);

  // Reset selected month if it's not in the current journal's breakdown
  React.useEffect(() => {
    if (journalData && selectedMonth && journalData.monthlyBreakdown) {
      const monthExists = journalData.monthlyBreakdown.some(b => b.month === selectedMonth);
      if (!monthExists) {
        setSelectedMonth(null);
      }
    }
  }, [journalData, selectedMonth]);

  // Set initial selected document
  useEffect(() => {
    if (!journal) return;
    if (!selectedDocumentId && journal.sourceDocuments.length > 0) {
      setSelectedDocumentId(journal.sourceDocuments[0].id);
    }
  }, [journal, selectedDocumentId]);

  // Calculate monthly breakdown using the appropriate calculation function
  const monthlyBreakdown = React.useMemo(() => {
    if (!journal) return [];
    
    if (journal.type === 'stock') {
      // For stock journals, use the stock calculation
      if (!journal.openingStockDate || !journal.closingStockDate || 
          journal.openingStockValue === undefined || journal.closingStockValue === undefined ||
          !journal.stockMovementAccountCode || !journal.stockAccountCode) {
        return [];
      }
      
      const result = calculateStockJournal({
        description: journal.description,
        openingStockDate: journal.openingStockDate,
        openingStockValue: journal.openingStockValue,
        closingStockDate: journal.closingStockDate,
        closingStockValue: journal.closingStockValue,
        stockMovementAccountCode: journal.stockMovementAccountCode,
        stockAccountCode: journal.stockAccountCode,
        store: journal.store,
        status: journal.status as 'published' | 'review' | 'archived',
      });

      return result.monthlyBreakdown;
    } else {
      // For prepayment/accrual journals, use the existing calculation
      if (!journal.periodStartDate || !journal.periodEndDate || !journal.expensePaidMonth || !journal.scheduleType) {
        return [];
      }
    
    const result = calculateJournal({
      description: journal.description,
      totalAmount: journal.totalAmount,
      expensePaidMonth: journal.expensePaidMonth,
      periodStartDate: journal.periodStartDate,
      periodEndDate: journal.periodEndDate,
      scheduleType: journal.scheduleType,
      accountCode: journal.accountCode,
      monthlyAccountCode: journal.monthlyAccountCode,
        status: journal.status as 'published' | 'review' | 'archived',
    });

    if (result.error) {
      console.error(result.error);
      return [];
    }

    return result.monthlyBreakdown;
    }
  }, [journal]);

  // Filter journals for the list
  const filteredJournals = React.useMemo(() => {
    return journalEntries.filter(j => {
      return statusFilter === "all" || j.status === statusFilter;
    });
  }, [statusFilter]);

  // Get current journal index for navigation
  const currentIndex = journalEntries.findIndex(j => j.id === params.id);
  const prevJournal = currentIndex > 0 ? journalEntries[currentIndex - 1] : null;
  const nextJournal = currentIndex < journalEntries.length - 1 ? journalEntries[currentIndex + 1] : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Handle month selection
  const handleMonthSelect = (month: string) => {
    setSelectedMonth(prevMonth => prevMonth === month ? null : month);
  };

  // State for managing journal operations
  const [isVoiding, setIsVoiding] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [showVoidConfirm, setShowVoidConfirm] = React.useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = React.useState(false);

  // Handle void and restart journal
  const handleVoidAndRestart = async () => {
    setIsVoiding(true);
    try {
      // Simulate API call to void journals in Xero and update status
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update journal status to review
      if (journal) {
        journal.status = 'review';
      }
      
      console.log('Journal voided and restarted for editing');
    } catch (error) {
      console.error('Error voiding journal:', error);
    } finally {
      setIsVoiding(false);
      setShowVoidConfirm(false);
    }
  };

  // Handle publish journal
  const handlePublishJournal = async () => {
    setIsPublishing(true);
    try {
      // Simulate API call to publish journal to Xero
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update journal status to published
      if (journal) {
        journal.status = 'published';
      }
      
      console.log('Journal published successfully');
    } catch (error) {
      console.error('Error publishing journal:', error);
    } finally {
      setIsPublishing(false);
      setShowPublishConfirm(false);
    }
  };

  // Handle journal updates
  const handleJournalUpdate = (updates: Partial<JournalEntry>) => {
    setJournalData(prev => prev ? { ...prev, ...updates } : prev);
  };

  if (!journal) {
    return <div>Journal not found</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Journals</h3>
            <Button variant="ghost" size="sm" onClick={() => router.push("/accounting/Journals")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status Filter Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-md">
            {["all", "review", "published"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1 text-xs rounded transition-colors capitalize ${
                  statusFilter === status
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Journal List */}
        <div className="flex-1 overflow-y-auto">
          {/* Group and sort journals by month */}
          {(() => {
            // Group journals by month
            const groupedJournals = filteredJournals.reduce((acc, journal) => {
              const date = journal.type === 'stock' 
                ? journal.closingStockDate 
                : journal.periodStartDate;
              
              if (!date) return acc;
              
              const monthKey = format(date, 'MMMM yyyy');
              if (!acc[monthKey]) {
                acc[monthKey] = [];
              }
              acc[monthKey].push(journal);
              return acc;
            }, {} as Record<string, typeof filteredJournals>);

            // Sort months in reverse chronological order
            return Object.entries(groupedJournals)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([month, journals]) => (
                <div key={month}>
                  {/* Month Header */}
                  <div className="sticky top-0 bg-gray-50 px-4 py-1.5 text-xs font-medium text-gray-500 border-b border-gray-200">
                    {month}
                  </div>
                  
                  {/* Journal Items */}
                  {journals.map((j) => (
            <div
              key={j.id}
              onClick={() => router.push(`/accounting/Journals/${j.id}`)}
                      className={`group px-4 py-3 border-b border-gray-100 cursor-pointer transition-all
                        ${j.id === journal?.id 
                          ? 'bg-blue-50 border-l-4 border-l-blue-500 px-3' 
                          : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {/* Journal Icon based on type */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                              ${j.type === 'prepayment' ? 'bg-blue-50 text-blue-600' :
                                j.type === 'accrual' ? 'bg-green-50 text-green-600' :
                                'bg-gray-50 text-gray-600'}`}
                            >
                              {j.type === 'prepayment' ? (
                                <ArrowRight className="h-5 w-5 stroke-2" />
                              ) : j.type === 'accrual' ? (
                                <ArrowLeft className="h-5 w-5 stroke-2" />
                              ) : (
                                <Package className="h-5 w-5 stroke-2" />
                              )}
                            </div>
                            
                            <div>
                              <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {j.title}
                  </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                {format(
                                  j.type === 'stock' 
                                    ? j.closingStockDate || new Date()
                                    : j.periodStartDate || new Date(),
                                  'dd MMM yyyy'
                                )}
                                <span className="text-gray-300">•</span>
                                <span className={`font-medium ${j.totalAmount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                  {formatCurrency(j.totalAmount)}
                                </span>
                  </div>
                  </div>
                  </div>
                </div>

                        <div className="flex flex-col items-end gap-1.5 min-w-[100px]">
                          <div className={`text-xs font-medium px-2 py-1 rounded-full
                            ${j.type === 'prepayment' ? 'bg-blue-50 text-blue-700' :
                              j.type === 'accrual' ? 'bg-green-50 text-green-700' :
                              'bg-gray-50 text-gray-700'}`}
                          >
                            {j.type}
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1
                            ${j.status === 'published' 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-yellow-50 text-yellow-700'}`}
                          >
                            {j.status === 'published' ? '✓' : '⚠️'}
                    {j.status}
                          </div>
                </div>
              </div>
            </div>
          ))}
                </div>
              ));
          })()}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 h-16">
          {/* Left Side */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/accounting/Journals")}
            className="flex items-center text-gray-600 hover:text-gray-900"
            >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Grid View
            </Button>

          {/* Center - Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => prevJournal && router.push(`/accounting/Journals/${prevJournal.id}`)}
                disabled={!prevJournal}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => nextJournal && router.push(`/accounting/Journals/${nextJournal.id}`)}
                disabled={!nextJournal}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex gap-3">
            {journal.status === 'published' && (
            <Button 
                variant="destructive"
              size="sm"
                onClick={() => setShowVoidConfirm(true)}
                className="bg-red-600 hover:bg-red-700"
            >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Void Journals & Restart
            </Button>
            )}
            
            {journal.status === 'review' && (
            <Button 
              size="sm"
                onClick={() => setShowPublishConfirm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Publish Journal
              </Button>
            )}
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Journal Details */}
          <div className={`${showDocuments ? 'w-1/2' : 'w-full'} overflow-y-auto transition-all duration-300`}>
            <div className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Journal Details</h2>
                  <Badge variant="outline" className="capitalize">
                    {journal.type}
                  </Badge>
                </div>
                  {journal.sourceDocuments.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {journal.sourceDocuments.length} Document{journal.sourceDocuments.length > 1 ? 's' : ''}
                      </span>
                          <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 h-8 w-8 ${showDocuments ? 'bg-gray-100' : ''}`}
                        onClick={() => setShowDocuments(!showDocuments)}
                        title={showDocuments ? 'Hide Documents' : 'Show Documents'}
                      >
                        {showDocuments ? (
                          <ChevronRight className="h-5 w-5" />
                        ) : (
                          <ChevronLeft className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Render appropriate journal details component based on type */}
                {journal.type === 'prepayment' && (
                  <PrepaymentJournalDetails journal={journal} onUpdate={handleJournalUpdate} />
                )}
                {journal.type === 'accrual' && (
                  <AccrualJournalDetails journal={journal} onUpdate={handleJournalUpdate} />
                )}
                {journal.type === 'stock' && (
                  <StockJournalDetails journal={journal} onUpdate={handleJournalUpdate} />
                )}
              </div>
            </div>

            {/* Monthly Breakdown - Only show for non-stock journals or stock journals with breakdown */}
            {(journal.type !== 'stock' || monthlyBreakdown.length > 0) && (
            <div className="px-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-white p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                      <h3 className="font-semibold">
                        {journal.type === 'stock' ? 'Journal Entry' : 'Monthly Breakdown'}
                      </h3>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>Published</span>
                      </div>
                      <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span>Review</span>
                        </div>
                      </div>
                    </div>
                    {journal.type !== 'stock' && (
                  <div className="text-xs text-muted-foreground">
                    Scroll horizontally to view all months →
                  </div>
                    )}
                </div>
                
                <div className="bg-gray-50/50">
                  {/* Monthly Cards */}
                    <div className={journal.type === 'stock' ? 'p-3' : 'overflow-x-auto'}>
                      <div className={journal.type === 'stock' ? '' : `flex gap-3 p-3`} style={journal.type !== 'stock' ? { minWidth: `${monthlyBreakdown.length * 260}px` } : {}}>
                      {monthlyBreakdown
                        .sort((a, b) => new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime())
                        .map((breakdown) => {
                          const monthDate = new Date(breakdown.month + "-01");
                          const isCurrentMonth = format(new Date(), "yyyy-MM") === breakdown.month;
                          const isSelected = selectedMonth === breakdown.month;

                          return (
                              <div key={breakdown.month} className={journal.type === 'stock' ? 'w-full' : 'w-[260px]'}>
                              <div
                                className={`p-4 rounded-lg border transition-all duration-200 text-sm cursor-pointer ${
                                  breakdown.status === 'published'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-yellow-500 bg-yellow-50'
                                } ${isCurrentMonth && !isSelected ? 'ring-2 ring-blue-300' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                                  onClick={() => handleMonthSelect(breakdown.month)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-base flex items-center gap-1">
                                    {isCurrentMonth && (
                                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500" title="Current month"></span>
                                    )}
                                     {format(monthDate, "MMM yyyy")}
                                   </span>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={
                                          breakdown.status === 'published'
                                          ? 'bg-green-100 text-green-800 border-green-200'
                                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                      }
                                    >
                                      {breakdown.status}
                                    </Badge>
                                    {breakdown.isReversing && (
                                      <span title="Reversing entry">
                                        <RotateCcw className="h-4 w-4 text-purple-600" />
                                      </span>
                                    )}
                                    {isSelected ? (
                                      <ChevronUp className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                                  {journal.type === 'stock' && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Stock Movement</span>
                                      <span className="font-mono">{formatCurrency(breakdown.amount)}</span>
                                    </div>
                                  )}
                                {journal.type === 'prepayment' && (
                                  <>
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Prepay Bal</span>
                                      <span className="font-mono">{formatCurrency(breakdown.prepayBalance)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Expense Bal</span>
                                      <span className="font-mono">{formatCurrency(breakdown.expenseBalance)}</span>
                                    </div>
                                  </>
                                )}
                                {journal.type === 'accrual' && (
                                  <>
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Accrual Bal</span>
                                      <span className="font-mono">{formatCurrency(breakdown.prepayBalance)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Expense Bal</span>
                                      <span className="font-mono">{formatCurrency(breakdown.expenseBalance)}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                    {/* Line Items Section */}
                  {selectedMonth && (() => {
                    const breakdown = monthlyBreakdown.find(b => b.month === selectedMonth);
                    if (!breakdown) return null;

                    return (
                        <JournalLineItems
                          key={`${params.id}-${selectedMonth}`}
                          selectedMonth={selectedMonth}
                          breakdown={breakdown}
                        />
                    );
                  })()}
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Right Panel: Document Preview */}
          {showDocuments && (
            <div className="w-1/2 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex-1 flex items-center gap-3">
                  <h3 className="font-semibold">Source Documents</h3>
                  {journal.sourceDocuments.length > 1 && (
                    <Select value={selectedDocumentId || ''} onValueChange={setSelectedDocumentId}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select document" />
                      </SelectTrigger>
                      <SelectContent>
                        {journal.sourceDocuments.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                  <Button
                    variant="outline"
                    size="sm"
                  onClick={() => setShowDocuments(false)}
                  className="ml-2"
                  >
                  <X className="h-4 w-4" />
                  </Button>
              </div>

              {selectedDocument ? (
                <div className="flex-1 overflow-hidden">
                  <iframe
                    src={selectedDocument.url}
                    className="w-full h-full"
                    title={selectedDocument.description}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a document to preview
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Void Confirmation Dialog */}
      {showVoidConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Void Journals & Restart</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will void all published journal entries in Xero and move the journal back to review status for editing. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowVoidConfirm(false)}
                disabled={isVoiding}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleVoidAndRestart}
                disabled={isVoiding}
                className="bg-red-600 hover:bg-red-700"
              >
                {isVoiding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Voiding...
                  </>
                ) : (
                  'Void & Restart'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Publish Confirmation Dialog */}
      {showPublishConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold">Publish Journal</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will publish all journal entries to Xero and mark the journal as published. Once published, the journal cannot be edited without voiding.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPublishConfirm(false)}
                disabled={isPublishing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublishJournal}
                disabled={isPublishing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  'Publish Journal'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 