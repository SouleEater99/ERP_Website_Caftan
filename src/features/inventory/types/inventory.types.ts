export interface Stock {
  id: string;
  material: string;
  unit: string;
  current_stock: number;
  reorder_threshold: number;
  last_updated: string;
}

export interface StockMovement {
  id: string;
  stock_id: string;
  type: 'in' | 'out';
  quantity: number;
  note?: string | null;
  created_at: string;
}

export interface StockRow extends Stock {
  remaining: number;
  isLow: boolean;
  totalUsed: number;
}

export interface StockAdjustment {
  stockId: string;
  quantity: number;
  note?: string;
}

export interface LowStockItem {
  id: string;
  material: string;
  remaining: number;
  unit: string;
  reorder_threshold: number;
}
