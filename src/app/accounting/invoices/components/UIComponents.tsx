"use client"

import { ReactNode, forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FormFieldProps {
  label: string
  children: ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

interface ReadOnlyFieldProps {
  label: string
  value: string | number | React.ReactNode
  className?: string
}

export function ReadOnlyField({ label, value, className }: ReadOnlyFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="px-3 py-2 border rounded-md bg-muted/20">{value}</div>
    </div>
  )
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <div className={cn("px-2 py-1 text-xs font-medium rounded-full", className)}>
      {status}
    </div>
  )
}

export function ActionButtons({ 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}: { 
  isEditing: boolean; 
  onEdit: () => void; 
  onSave: () => void; 
  onCancel: () => void;
}) {
  return (
    <div className="flex space-x-2">
      {isEditing ? (
        <>
          <Button onClick={onSave} variant="default">Save</Button>
          <Button onClick={onCancel} variant="outline">Cancel</Button>
        </>
      ) : (
        <Button onClick={onEdit} variant="outline">Edit</Button>
      )}
    </div>
  )
}

export function HeaderSection({ 
  title, 
  status, 
  statusClassName,
  actions
}: { 
  title: string; 
  status?: string; 
  statusClassName?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {status && (
          <StatusBadge status={status} className={statusClassName} />
        )}
      </div>
      {actions && (
        <div>
          {actions}
        </div>
      )}
    </div>
  )
}

// Simple Badge component
export const Badge = ({ className, variant, children }: { 
  variant?: 'default' | 'secondary' | 'destructive' | 'outline', 
  className?: string, 
  children: React.ReactNode 
}) => {
  const getVariantClasses = () => {
    switch(variant) {
      case 'secondary': return 'bg-gray-100 text-gray-800';
      case 'destructive': return 'bg-red-100 text-red-800';
      case 'outline': return 'border border-gray-300 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  }
  
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getVariantClasses()} ${className || ''}`}>
    {children}
  </span>
}

// Simple mock toast hook
export const useToast = () => {
  return {
    toast: {
      success: (message: string) => console.log(`Toast: ${message}`),
      error: (message: string) => console.error(`Toast: ${message}`)
    }
  }
} 