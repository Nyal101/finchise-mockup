import React from 'react';

type InvoiceSummaryProps = {
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
};

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  subtotal,
  vatRate,
  vat,
  total
}) => {
  return (
    <div className="flex flex-col gap-1 items-end mt-2 text-sm">
      <div className="flex justify-between w-48">
        <span className="text-muted-foreground">Subtotal:</span>
        <span>£{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between w-48">
        <span className="text-muted-foreground">VAT ({vatRate}%):</span>
        <span>£{vat.toFixed(2)}</span>
      </div>
      <div className="flex justify-between w-48 font-medium">
        <span>Total:</span>
        <span>£{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default InvoiceSummary; 