import React from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

type InvoicePreviewProps = {
  previewType?: string;
  previewUrl?: string;
  invoiceNumber: string;
  supplier: string;
  store: string;
  date: Date;
  total: number;
};

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  previewType,
  previewUrl,
  invoiceNumber,
  supplier,
  store,
  date,
  total
}) => {
  return (
    <div className="border rounded-md overflow-hidden h-full">
      {previewType === "pdf" ? (
        <object 
          data={`/invoice-previews/${previewUrl}`}
          type="application/pdf"
          className="w-full h-full min-h-[650px]"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6">
            <FileText className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-center">
              PDF preview not available. Please check that the file exists in the public folder.
            </p>
          </div>
        </object>
      ) : previewType === "image" ? (
        <div className="relative w-full h-full min-h-[650px] bg-gray-100">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6">
            <FileText className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-center">
              Invoice image for {invoiceNumber} from {supplier}
            </p>
            <p className="mt-2 text-center text-sm text-gray-400">
              Add the image file to public/invoice-previews/{previewUrl}
            </p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="original" className="h-full flex flex-col">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="original">Original Document</TabsTrigger>
            <TabsTrigger value="processed">AI Processed</TabsTrigger>
          </TabsList>
          <TabsContent value="original" className="m-0 flex-grow">
            <div className="relative w-full h-full min-h-[600px] bg-gray-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6">
                <FileText className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-center">
                  Sample invoice from {supplier} for {store} location.
                </p>
                <p className="mt-2 text-center text-sm text-gray-400">
                  Invoice #{invoiceNumber} dated {format(date, "dd/MM/yyyy")}
                </p>
                <p className="mt-4 text-sm text-gray-400">
                  Add your actual invoice documents to the public/invoice-previews folder
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="processed" className="m-0 flex-grow">
            <div className="relative w-full h-full min-h-[600px] bg-gray-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6">
                <div className="border rounded p-4 w-full max-w-md bg-white shadow-sm">
                  <h3 className="font-medium mb-2">AI Extracted Data</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-gray-500">Invoice Number:</span>
                      <span className="font-medium">{invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">{format(date, "dd/MM/yyyy")}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-gray-500">Supplier:</span>
                      <span className="font-medium">{supplier}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-medium">£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default InvoicePreview; 