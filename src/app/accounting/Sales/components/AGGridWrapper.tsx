"use client";

import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import { SalesInvoiceData } from './types';

// Register modules immediately
if (typeof window !== 'undefined') {
  ModuleRegistry.registerModules([AllCommunityModule]);
}

interface AGGridWrapperProps {
  columnDefs: ColDef[];
  rowData: SalesInvoiceData[];
  onCellClicked: (event: CellClickedEvent) => void;
}

export default function AGGridWrapper({ columnDefs, rowData, onCellClicked }: AGGridWrapperProps) {
  const [isClient, setIsClient] = React.useState(false);
  const gridRef = React.useRef<AgGridReact>(null);

  React.useEffect(() => {
    setIsClient(true);
    // Ensure modules are registered
    ModuleRegistry.registerModules([AllCommunityModule]);
  }, []);

  // Auto-size columns on grid ready and data change
  const onGridReady = React.useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, []);

  const onFirstDataRendered = React.useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading grid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ag-theme-material" style={{ height: '600px', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={rowData}
        onCellClicked={onCellClicked}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
        theme="legacy"
        rowSelection="single"
        suppressRowClickSelection={false}
        domLayout="normal"
        defaultColDef={{
          resizable: true,
          sortable: false,
          filter: false,
        }}
        suppressColumnVirtualisation={true}
        suppressHorizontalScroll={false}
        rowHeight={60}
        headerHeight={50}
        floatingFiltersHeight={35}
        suppressMenuHide={true}
        rowClass="cursor-pointer hover:bg-gray-50"
        getRowStyle={(params) => {
          const data = params.data as SalesInvoiceData;
          if (data?.status === 'Review') {
            return { backgroundColor: '#fef2f2' };
          }
          return undefined;
        }}
      />
    </div>
  );
} 