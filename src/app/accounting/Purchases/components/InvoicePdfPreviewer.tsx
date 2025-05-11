import React from "react";

interface InvoicePdfPreviewerProps {
  pdfUrl?: string;
  invoiceNumber?: string;
}

const InvoicePdfPreviewer: React.FC<InvoicePdfPreviewerProps> = ({ pdfUrl, invoiceNumber }) => {
  const [pdfExists, setPdfExists] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (!pdfUrl) {
      setPdfExists(null);
      return;
    }
    let cancelled = false;
    fetch(pdfUrl, { method: 'HEAD' })
      .then(res => {
        if (!cancelled) setPdfExists(res.ok);
      })
      .catch(() => {
        if (!cancelled) setPdfExists(false);
      });
    return () => { cancelled = true; };
  }, [pdfUrl]);

  return (
    <div className="h-full flex flex-col w-full max-w-full">
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        {!pdfUrl ? (
          <span className="text-muted-foreground text-center">Select an invoice to preview its PDF</span>
        ) : pdfExists === false ? (
          <span className="text-muted-foreground text-center">No invoice attached</span>
        ) : pdfExists === true ? (
          <iframe
            src={pdfUrl}
            title={invoiceNumber ? `Invoice ${invoiceNumber} PDF` : "Invoice PDF"}
            className="w-full h-full min-h-[400px]"
          />
        ) : (
          <span className="text-muted-foreground text-center">Loading PDF...</span>
        )}
      </div>
    </div>
  );
};

export default InvoicePdfPreviewer;
