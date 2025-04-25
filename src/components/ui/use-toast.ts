// A simplified version of use-toast.ts
// This is a placeholder for the actual implementation

import { useCallback } from "react"

export interface ToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export type ToastActionElement = React.ReactElement

interface ToastFunction {
  (props: ToastProps): { id: string }
  success: (message: string) => { id: string }
  error: (message: string) => { id: string }
}

export function useToast() {
  const toastFunction = useCallback(({ title, description, variant }: ToastProps) => {
    console.log(`Toast: ${variant || 'default'} - ${title} - ${description || ''}`)
    return { id: Date.now().toString() }
  }, []) as ToastFunction

  // Add convenience methods
  toastFunction.success = (message: string) => {
    console.log(`Toast success: ${message}`)
    return { id: Date.now().toString() }
  }

  toastFunction.error = (message: string) => {
    console.log(`Toast error: ${message}`)
    return { id: Date.now().toString() }
  }

  return { toast: toastFunction }
} 