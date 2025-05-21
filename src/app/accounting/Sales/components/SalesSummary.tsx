import * as React from "react";

interface SalesSummaryProps {
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
  paymentMethod?: string;
}

export default function SalesSummary({ 
  subtotal, 
  vatRate, 
  vat, 
  total, 
  paymentMethod 
}: SalesSummaryProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">VAT ({vatRate}%)</span>
          <span>£{vat.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>
        {paymentMethod && (
          <div className="flex justify-between text-sm mt-3">
            <span className="text-muted-foreground">Payment Method</span>
            <span>{paymentMethod}</span>
          </div>
        )}
      </div>
    </div>
  );
} 