import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Calendar as CalendarIcon, PencilIcon, SaveIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { MonthlyBreakdown, JournalLineItem } from "../types";
import { AgGridReact } from 'ag-grid-react';
import { 
  ModuleRegistry, 
  AllCommunityModule, 
  ColDef, 
  ValueSetterParams, 
  CellValueChangedEvent,
  ICellRendererParams,
  GridReadyEvent
} from 'ag-grid-community';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

// Register modules immediately
if (typeof window !== 'undefined') {
  ModuleRegistry.registerModules([AllCommunityModule]);
}

// Map of account codes to descriptive names
const accountDescriptions: Record<string, string> = {
  "1001": "Stock Asset",
  "5050": "Stock Movement/COGS",
  "1105": "Prepayment General / Business Rates",
  "1400": "Prepayments",
  "6500": "Insurance Expense",
  "7100": "Staff Costs",
  "2200": "Accruals",
  "8100": "Capital Expenditure",
  "7101": "Property - Business Rates",
  "0000": "Test Account",
};

const stores = ["ST PAULS CRAY", "Kings Hill", "Manchester", "London", "Birmingham", "Leeds"];

const taxRates = [
  "No VAT",
  "20% (VAT on Expenses)",
  "20% (VAT on Income)",
  "5% (Reduced Rate)",
  "0% (Zero Rate)"
];

interface JournalLineItemsProps {
  selectedMonth: string;
  breakdown: MonthlyBreakdown;
  onUpdateDescription?: (description: string) => void;
}

interface DeleteButtonRendererProps extends ICellRendererParams<JournalLineItem> {
  onClick: (data: JournalLineItem) => void;
}

interface SearchableSelectProps extends Omit<ICellRendererParams<JournalLineItem>, 'colDef'> {
  colDef: {
    field?: keyof JournalLineItem;
    cellEditorParams?: {
      values: string[];
    };
  };
}

// Custom select component for searchable dropdowns
const SearchableSelectRenderer = (props: SearchableSelectProps) => {
  const [search, setSearch] = React.useState('');
  const options = props.colDef.cellEditorParams?.values || [];
  const descriptions = props.colDef.field === 'accountCode' ? accountDescriptions : null;
  
  const filteredOptions = options.filter((opt: string) => {
    const searchStr = search.toLowerCase();
    if (descriptions) {
      return opt.toLowerCase().includes(searchStr) || 
             descriptions[opt].toLowerCase().includes(searchStr);
    }
    return opt.toLowerCase().includes(searchStr);
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full h-full text-left px-2 hover:bg-gray-50">
          {props.colDef.field === 'accountCode' && props.value
            ? `${props.value} - ${accountDescriptions[props.value]}`
            : props.value || 'Select...'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-2 py-1 text-sm border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filteredOptions.map((option: string) => (
            <button
              key={option}
              className="w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              onClick={() => {
                if (props.setValue) {
                  props.setValue(option);
                }
                setSearch('');
              }}
            >
              {props.colDef.field === 'accountCode'
                ? `${option} - ${accountDescriptions[option]}`
                : option}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Custom delete button component
const DeleteButtonRenderer = (props: DeleteButtonRendererProps) => {
  return (
    <button 
      onClick={() => props.onClick(props.data!)} 
      className="flex items-center justify-center w-full h-full opacity-50 hover:opacity-100"
    >
      <X className="h-4 w-4 text-gray-500" />
    </button>
  );
};

export function JournalLineItems({ 
  selectedMonth, 
  breakdown: initialBreakdown,
  onUpdateDescription 
}: JournalLineItemsProps) {
  const [isClient, setIsClient] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [description, setDescription] = React.useState(initialBreakdown.description || '');
  const [breakdown, setBreakdown] = React.useState(initialBreakdown);
  const gridRef = React.useRef<AgGridReact>(null);
  const [postingDate, setPostingDate] = React.useState(() => {
    // Handle both monthly format (YYYY-MM) and weekly format (YYYY-MM-DD)
    if (selectedMonth.length === 10) { // Weekly format: YYYY-MM-DD
      return parse(selectedMonth, "yyyy-MM-dd", new Date());
    } else { // Monthly format: YYYY-MM
      return parse(selectedMonth + "-01", "yyyy-MM-dd", new Date());
    }
  });

  // Reset local state when initial data changes
  React.useEffect(() => {
    setBreakdown(initialBreakdown);
    setDescription(initialBreakdown.description || '');
    setIsEditMode(false);
    // Handle both monthly format (YYYY-MM) and weekly format (YYYY-MM-DD)
    if (selectedMonth.length === 10) { // Weekly format: YYYY-MM-DD
      setPostingDate(parse(selectedMonth, "yyyy-MM-dd", new Date()));
    } else { // Monthly format: YYYY-MM
      setPostingDate(parse(selectedMonth + "-01", "yyyy-MM-dd", new Date()));
    }
  }, [initialBreakdown, selectedMonth]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = () => {
    setIsEditMode(false);
    if (onUpdateDescription) {
      onUpdateDescription(description);
    }
    console.log('Saving changes:', breakdown);
  };

  // Prevent editing if journal is published
  const canEdit = breakdown.status !== 'published';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleAddLine = () => {
    const newLineItem: JournalLineItem = {
      id: `li_${Date.now()}`,
      accountCode: "",
      description: "",
      debitAmount: 0,
      creditAmount: 0,
      store: "",
      taxRate: "No VAT",
      date: postingDate.toISOString(),
    };

    setBreakdown(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newLineItem]
    }));
  };

  const handleDeleteRow = (data: JournalLineItem) => {
    setBreakdown(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== data.id)
    }));
  };

  const columnDefs: ColDef[] = [
    {
      field: 'description',
      headerName: 'Description',
      editable: isEditMode,
      flex: 2,
      cellStyle: { fontSize: '13px', padding: '4px' },
    },
    {
      field: 'accountCode',
      headerName: 'Account',
      editable: isEditMode,
      width: 200,
      cellRenderer: isEditMode ? SearchableSelectRenderer : undefined,
      valueFormatter: (params) => {
        const code = params.value;
        return code ? `${code} - ${accountDescriptions[code] ?? ""}` : "";
      },
      cellStyle: { fontSize: '13px', padding: '4px' },
      cellEditorParams: {
        values: Object.keys(accountDescriptions),
      },
    },
    {
      field: 'taxRate',
      headerName: 'Tax Rate',
      editable: isEditMode,
      width: 180,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: taxRates,
      },
      cellStyle: { fontSize: '13px', padding: '4px' },
    },
    {
      field: 'store',
      headerName: 'Store',
      editable: isEditMode,
      width: 150,
      cellRenderer: isEditMode ? SearchableSelectRenderer : undefined,
      cellEditorParams: {
        values: stores,
      },
      cellStyle: { fontSize: '13px', padding: '4px' },
    },
    {
      field: 'debitAmount',
      headerName: 'Debit GBP',
      editable: isEditMode,
      type: 'numericColumn',
      width: 120,
      valueFormatter: (params) => params.value ? formatCurrency(params.value).replace('£', '') : '',
      valueSetter: (params: ValueSetterParams) => {
        const newValue = parseFloat(params.newValue || "0");
        params.data.debitAmount = newValue;
        params.data.creditAmount = 0;
        return true;
      },
      cellStyle: { fontSize: '13px', padding: '4px', textAlign: 'right' },
    },
    {
      field: 'creditAmount',
      headerName: 'Credit GBP',
      editable: isEditMode,
      type: 'numericColumn',
      width: 120,
      valueFormatter: (params) => params.value ? formatCurrency(params.value).replace('£', '') : '',
      valueSetter: (params: ValueSetterParams) => {
        const newValue = parseFloat(params.newValue || "0");
        params.data.creditAmount = newValue;
        params.data.debitAmount = 0;
        return true;
      },
      cellStyle: { fontSize: '13px', padding: '4px', textAlign: 'right' },
    },
    {
      field: 'delete',
      headerName: '',
      width: 40,
      cellRenderer: DeleteButtonRenderer,
      cellRendererParams: {
        onClick: handleDeleteRow,
      },
      cellStyle: { padding: 0 },
      hide: !isEditMode,
    },
  ];

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    setBreakdown(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === event.data.id ? event.data : item
      )
    }));
  };

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  // Calculate totals and VAT
  const totalDebit = breakdown.lineItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0);
  const totalCredit = breakdown.lineItems.reduce((sum, item) => sum + (item.creditAmount || 0), 0);
  const vatDebit = breakdown.lineItems.reduce((sum, item) => {
    if (item.taxRate?.includes('20%') && item.debitAmount) {
      return sum + (item.debitAmount * 0.2);
    }
    return sum;
  }, 0);
  const vatCredit = breakdown.lineItems.reduce((sum, item) => {
    if (item.taxRate?.includes('20%') && item.creditAmount) {
      return sum + (item.creditAmount * 0.2);
    }
    return sum;
  }, 0);

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01; // Account for floating point precision

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-t">
      <div className="bg-white p-4 max-w-[1200px]">
        <div className="mb-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4" />
                <span className={breakdown.status === 'published' ? 'text-green-600 font-medium' : ''}>
                  {breakdown.status === 'published' ? 'Published' : 'Posting Date'}: {format(postingDate, 'dd MMM yyyy')}
                </span>
              </div>
            </div>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => isEditMode ? handleSave() : setIsEditMode(true)}
                className={`h-8 text-xs ${
                  isEditMode 
                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {isEditMode ? (
                  <><SaveIcon className="h-3 w-3 mr-1" /> Save Changes</>
                ) : (
                  <><PencilIcon className="h-3 w-3 mr-1" /> Edit Journal</>
                )}
              </Button>
            )}
          </div>

          {/* Description Section */}
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isEditMode || !canEdit}
              placeholder="Enter journal description..."
              className={`w-full p-3 text-sm border rounded-md ${
                isEditMode && canEdit
                  ? 'bg-white border-gray-300' 
                  : 'bg-gray-50 border-transparent'
              }`}
              rows={2}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <style jsx global>{`
            .ag-theme-material {
              --ag-header-height: 40px;
              --ag-row-height: 36px;
              --ag-header-background-color: #374151;
              --ag-header-foreground-color: #ffffff;
              --ag-header-cell-hover-background-color: #4b5563;
              --ag-row-hover-color: #f8fafc;
              --ag-cell-horizontal-padding: 12px;
              --ag-borders: none;
              --ag-row-border-color: #f1f5f9;
            }
            
            .ag-theme-material .ag-header-cell {
              font-size: 13px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            
            .ag-theme-material .ag-row {
              border-bottom: 1px solid var(--ag-row-border-color);
              transition: background-color 0.2s ease;
            }
            
            .ag-theme-material .ag-row:hover {
              background-color: var(--ag-row-hover-color);
            }
            
            .ag-theme-material .ag-cell {
              display: flex;
              align-items: center;
              font-size: 13px;
            }

            .ag-theme-material .ag-header {
              border-bottom: 2px solid #e5e7eb;
            }

            .add-row-button {
              padding: 8px 12px;
              border-bottom: 1px solid var(--ag-row-border-color);
              background-color: #f8fafc;
              transition: background-color 0.2s ease;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 8px;
              color: #2563eb;
              font-size: 13px;
            }

            .add-row-button:hover {
              background-color: #f1f5f9;
            }
          `}</style>
          <div 
            className="ag-theme-material rounded-lg border shadow-sm overflow-hidden"
            style={{ width: '100%' }}
          >
            <AgGridReact
              ref={gridRef}
              columnDefs={columnDefs.map(col => ({
                ...col,
                editable: isEditMode && canEdit && col.editable,
              }))}
              rowData={breakdown.lineItems}
              onCellValueChanged={onCellValueChanged}
              onGridReady={onGridReady}
              domLayout="autoHeight"
              suppressRowClickSelection={true}
              defaultColDef={{
                resizable: true,
                sortable: false,
                filter: false,
              }}
              rowHeight={36}
              headerHeight={40}
              suppressMenuHide={true}
              suppressHorizontalScroll={false}
              rowClass={isEditMode && canEdit ? "hover:bg-blue-50" : "hover:bg-gray-50"}
              getRowStyle={() => ({ 
                cursor: isEditMode && canEdit ? 'pointer' : 'default',
                backgroundColor: isEditMode && canEdit ? '#ffffff' : '#f9fafb'
              })}
            />
            {isEditMode && canEdit && (
              <div 
                className="add-row-button"
                onClick={handleAddLine}
              >
                <Plus className="h-4 w-4" />
                Add a new line
              </div>
            )}
          </div>
          
          {/* Totals Footer */}
          <div className="border-t mt-2">
            <div className="flex justify-end text-xs">
              <div className="w-[480px] grid grid-cols-3 gap-x-4 py-2">
                <div className="text-right text-gray-600"></div>
                <div className="text-right font-medium">Debit GBP</div>
                <div className="text-right font-medium">Credit GBP</div>

                <div className="text-right text-gray-600">Subtotal</div>
                <div className="text-right font-medium">{formatCurrency(totalDebit).replace('£', '')}</div>
                <div className="text-right font-medium">{formatCurrency(totalCredit).replace('£', '')}</div>

                <div className="text-right text-gray-600">Includes VAT at 20.00%</div>
                <div className="text-right font-medium">{formatCurrency(vatDebit).replace('£', '')}</div>
                <div className="text-right font-medium">{formatCurrency(vatCredit).replace('£', '')}</div>

                <div className="text-right font-bold border-t pt-1">TOTAL</div>
                <div className="text-right font-bold border-t pt-1">{formatCurrency(totalDebit).replace('£', '')}</div>
                <div className="text-right font-bold border-t pt-1">{formatCurrency(totalCredit).replace('£', '')}</div>
              </div>
            </div>
            {!isBalanced && (
              <div className="flex justify-end mt-2">
                <div className="text-red-600 text-xs font-medium">
                  Warning: Debits and credits do not match
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 