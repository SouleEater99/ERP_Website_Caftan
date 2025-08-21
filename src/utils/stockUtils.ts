/**
 * Calculate remaining stock for an item
 * @param currentStock - Current available stock
 * @param reorderThreshold - Reorder threshold level
 * @returns Remaining stock (can be negative if below threshold)
 */
export const calculateRemainingStock = (currentStock: number, reorderThreshold: number) =>
  currentStock - reorderThreshold

/**
 * Check if stock is low (remaining <= 0)
 * @param currentStock - Current available stock
 * @param reorderThreshold - Reorder threshold level
 * @returns True if stock is low
 */
export const isLowStock = (currentStock: number, reorderThreshold: number) =>
  calculateRemainingStock(currentStock, reorderThreshold) <= 0

/**
 * Get stock status for display purposes
 * @param currentStock - Current available stock
 * @param reorderThreshold - Reorder threshold level
 * @returns Object with remaining amount and status
 */
export const getStockStatus = (currentStock: number, reorderThreshold: number) => {
  const remaining = calculateRemainingStock(currentStock, reorderThreshold)
  return {
    remaining,
    isLow: remaining <= 0
  }
}
