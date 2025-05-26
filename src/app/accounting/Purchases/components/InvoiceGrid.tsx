import * as React from "react";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef, ValueFormatterParams, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { format } from "date-fns";
import type { InvoiceData } from "./types";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface InvoiceGridProps {
  invoices: InvoiceData[];
  onInvoiceSelect: (invoice: InvoiceData) => void;
  selectedInvoiceId?: string;
}

export default function InvoiceGrid({ invoices, onInvoiceSelect, selectedInvoiceId }: InvoiceGridProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "AI Processed":
        return "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"
      case "Pending AI":
        return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium"
      case "Needs Human Review":
        return "text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium"
      case "Duplicate?":
        return "text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-xs font-medium"
      default:
        return "text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium"
    }
  };

  // Column definitions with proper formatting
  const columnDefs = React.useMemo(() => [
    { 
      field: 'invoiceNumber', 
      headerName: 'Invoice #',
      width: 120,
      pinned: 'left'
    },
    { 
      field: 'store', 
      headerName: 'Store',
      width: 150
    },
    { 
      field: 'supplier', 
      headerName: 'Supplier',
      width: 180
    },
    { 
      field: 'date', 
      headerName: 'Date',
      width: 120,
      valueFormatter: (params: ValueFormatterParams) => {
        try {
          return format(new Date(params.value), "dd/MM/yyyy");
        } catch {
          return params.value;
        }
      }
    },
    { 
      field: 'status', 
      headerName: 'Status',
      width: 160,
      cellRenderer: (params: ICellRendererParams) => {
        const statusClass = getStatusClass(params.value);
        return `<span class="${statusClass}">${params.value}</span>`;
      }
    },
    { 
      field: 'total', 
      headerName: 'Total',
      width: 120,
      type: 'numericColumn',
      valueFormatter: (params: ValueFormatterParams) => `£${Number(params.value).toFixed(2)}`,
      cellStyle: { textAlign: 'right' }
    }
  ] as ColDef[], []);

  const defaultColDef = React.useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true
  }), []);

  if (invoices.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center">
        <p className="text-muted-foreground">No invoices to display</p>
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 300px)', width: '100%', border: '2px solid #007acc', padding: '4px' }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>AG Grid ({invoices.length} invoices)</h4>
      <div 
        className="ag-theme-alpine" 
        style={{ 
          height: 'calc(100% - 30px)', 
          width: '100%'
        }}
      >
        <AgGridReact
          rowData={invoices}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="single"
          onRowClicked={(event) => {
            if (event.data) {
              onInvoiceSelect(event.data);
            }
          }}
          getRowClass={(params) => {
            return params.data && selectedInvoiceId === params.data.id ? 'ag-row-selected' : '';
          }}
          suppressCellFocus={true}
          animateRows={true}
          pagination={false}
          headerHeight={40}
          rowHeight={35}
          domLayout="normal"
        />
      </div>
    </div>
  );
} 