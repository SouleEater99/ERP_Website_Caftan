import { Stock, StockRow } from '../types/inventory.types';

export const calculateStockRow = (
  item: Stock, 
  usedSummary: Map<string, number> | undefined
): StockRow => {
  const remaining = Number(item.current_stock) - Number(item.reorder_threshold);
  const isLow = remaining <= 0;
  const totalUsed = usedSummary?.get(item.id) || 0;
  
  return { 
    ...item, 
    remaining, 
    isLow, 
    totalUsed 
  };
};

export const filterLowStockItems = (rows: StockRow[]): StockRow[] => {
  return rows.filter(item => item.isLow);
};

export const formatQuantity = (quantity: number, unit: string): string => {
  return `${Number(quantity).toFixed(2)} ${unit}`;
};

export const formatRemainingQuantity = (quantity: number, unit: string, isLow: boolean): string => {
  const formatted = `${Number(quantity).toFixed(2)} ${unit}`;
  return isLow ? formatted : formatted;
};

export const validateQuantity = (quantity: string): boolean => {
  const num = Number(quantity);
  return !isNaN(num) && num > 0;
};
