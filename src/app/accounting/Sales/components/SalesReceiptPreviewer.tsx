import React from "react";
import { FileQuestion } from "lucide-react";
import Image from "next/image";

interface SalesReceiptPreviewerProps {
  previewUrl?: string;
  receiptNumber: string;
}

export default function SalesReceiptPreviewer({ 
  previewUrl, 
  receiptNumber 
}: SalesReceiptPreviewerProps) {
  if (!previewUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground">
        <FileQuestion className="w-12 h-12 mb-2" />
        <p className="text-sm">No preview available for {receiptNumber}</p>
      </div>
    );
  }

  // Check the file type to determine how to display it
  const isImage = previewUrl.match(/\.(jpeg|jpg|gif|png)$/i);
  const isPdf = previewUrl.match(/\.(pdf)$/i);

  if (isImage) {
    return (
      <div className="relative h-full bg-gray-100 flex items-center justify-center">
        <Image 
          src={previewUrl} 
          alt={`Receipt preview for ${receiptNumber}`}
          className="max-w-full max-h-full object-contain"
          width={500}
          height={700}
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    );
  }

  if (isPdf) {
    return (
      <iframe 
        src={previewUrl} 
        title={`Receipt preview for ${receiptNumber}`}
        className="w-full h-full"
      />
    );
  }

  // For CSV or other file types, show a message
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground">
      <FileQuestion className="w-12 h-12 mb-2" />
      <p className="text-sm">Preview not available for this file type</p>
      <p className="text-xs mt-1">Click to download: <a href={previewUrl} className="text-blue-500 hover:underline">{receiptNumber}</a></p>
    </div>
  );
} 