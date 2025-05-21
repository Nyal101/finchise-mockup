import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadSalesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload?: (files: File[]) => void;
}

export function UploadSalesDialog({ open, onOpenChange, onUpload }: UploadSalesDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleClear = () => setFiles([]);

  const handleUpload = () => {
    if (onUpload && files.length > 0) {
      onUpload(files);
      setFiles([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Sales Report</DialogTitle>
        </DialogHeader>
        <div className="mb-2 text-sm text-gray-600">
          Drag and drop sales files here, or click to browse. Supported formats: PDF, CSV, XLSX from POS systems.
        </div>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/10" : "border-gray-300",
            files.length > 0 ? "border-green-500" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          {files.length > 0 ? (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-green-500 mx-auto" />
              <p className="text-sm font-medium">{files.length} file(s) selected</p>
              <ul className="text-xs text-gray-500 max-h-24 overflow-y-auto space-y-1">
                {files.map((file, i) => (
                  <li key={i} className="truncate">{file.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm font-medium">Drop files here or click</p>
              <p className="text-xs text-gray-500">Supports formats from Domino&apos;s POS, UberEats, JustEat, etc.</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <a
            href="/BillTemplate.csv"
            download
            className="text-xs text-blue-600 hover:underline"
          >
            Download sales template (CSV)
          </a>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClear}
              disabled={files.length === 0}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={files.length === 0}
            >
              Upload{files.length > 0 ? ` (${files.length})` : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 