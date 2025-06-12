// Utility functions for the invoice components

/**
 * Get the CSS class for an invoice status label
 */
export function getStatusClass(status: string) {
  switch (status) {
    case "AI Processed":
      return "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"
    case "Pending AI":
      return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium"
    case "Needs Human Review":
      return "text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium"
    case "Duplicate?":
      return "text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-xs font-medium"
    default:
      return "text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium"
  }
}

/**
 * Calculate the total for a line item
 */
export function calculateLineItemTotal(item: { quantity: number; unitPrice: number }) {
  return item.quantity * item.unitPrice;
} 