import React from 'react';
import { format } from 'date-fns';
import {
  Button
} from '@/components/ui/button';
import {
  Calendar
} from '@/components/ui/calendar';
import {
  Input
} from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { InvoiceData } from './types';

type InvoiceDetailsSectionProps = {
  invoice: InvoiceData;
  isEditing: boolean;
  stores: string[];
  statuses: string[];
  invoiceTypes: string[];
  accountCodes: string[];
  onInvoiceChange: (field: keyof InvoiceData, value: unknown) => void;
  getStatusClass: (status: string) => string;
};

export const InvoiceDetailsSection: React.FC<InvoiceDetailsSectionProps> = ({
  invoice,
  isEditing,
  stores,
  statuses,
  invoiceTypes,
  accountCodes,
  onInvoiceChange,
  getStatusClass
}) => {
  const handleInvoiceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInvoiceChange('invoiceNumber', e.target.value);
  };

  const handleStoreChange = (value: string) => {
    onInvoiceChange('store', value);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onInvoiceChange('date', date);
    }
  };

  const handleInvoiceTypeChange = (value: string) => {
    onInvoiceChange('invoiceType', value);
  };

  const handleStatusChange = (value: string) => {
    onInvoiceChange('status', value);
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInvoiceChange('supplier', e.target.value);
  };

  const handleAccountCodeChange = (value: string) => {
    onInvoiceChange('accountCode', value);
  };

  const handleVatRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vatRate = parseFloat(e.target.value) || 0;
    onInvoiceChange('vatRate', vatRate);
  };

  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">Invoice Number</h3>
        {isEditing ? (
          <Input
            value={invoice.invoiceNumber}
            onChange={handleInvoiceNumberChange}
            className="h-7 text-sm"
          />
        ) : (
          <p>{invoice.invoiceNumber}</p>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">Date</h3>
        {isEditing ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-7 text-sm"
              >
                {format(invoice.date, "dd MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={invoice.date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          <p>{format(invoice.date, "dd MMM yyyy")}</p>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">Status</h3>
        {isEditing ? (
          <Select 
            value={invoice.status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="h-7 text-sm">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status} className="text-sm">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className={getStatusClass(invoice.status)}>
            {invoice.status}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">Store</h3>
        {isEditing ? (
          <Select 
            value={invoice.store} 
            onValueChange={handleStoreChange}
          >
            <SelectTrigger className="h-7 text-sm">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map(store => (
                <SelectItem key={store} value={store} className="text-sm">
                  {store}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>{invoice.store}</p>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">Supplier</h3>
        {isEditing ? (
          <Input
            value={invoice.supplier}
            onChange={handleSupplierChange}
            className="h-7 text-sm"
          />
        ) : (
          <p>{invoice.supplier}</p>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">Invoice Type</h3>
        {isEditing ? (
          <Select 
            value={invoice.invoiceType} 
            onValueChange={handleInvoiceTypeChange}
          >
            <SelectTrigger className="h-7 text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {invoiceTypes.map(type => (
                <SelectItem key={type} value={type} className="text-sm">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>{invoice.invoiceType}</p>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">Account Code</h3>
        {isEditing ? (
          <Select 
            value={invoice.accountCode} 
            onValueChange={handleAccountCodeChange}
          >
            <SelectTrigger className="h-7 text-sm">
              <SelectValue placeholder="Select code" />
            </SelectTrigger>
            <SelectContent>
              {accountCodes.map(code => (
                <SelectItem key={code} value={code} className="text-sm">
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>{invoice.accountCode}</p>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-muted-foreground">VAT Rate (%)</h3>
        {isEditing ? (
          <Input
            type="number"
            value={invoice.vatRate}
            onChange={handleVatRateChange}
            className="h-7 text-sm"
            min="0"
            max="100"
          />
        ) : (
          <p>{invoice.vatRate}%</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailsSection; 