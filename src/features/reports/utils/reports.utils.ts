import { ProductionData, WorkerPerformance, MaterialUsage } from '../types/reports.types';

export const calculateTotalRevenue = (data: ProductionData[]): number => {
  return data.reduce((total, item) => total + item.revenue, 0);
};

export const calculateAverageEfficiency = (data: WorkerPerformance[]): number => {
  if (data.length === 0) return 0;
  const totalEfficiency = data.reduce((sum, worker) => sum + worker.efficiency, 0);
  return totalEfficiency / data.length;
};

export const calculateTotalTasks = (data: ProductionData[]): number => {
  return data.reduce((total, item) => total + item.completed + item.pending, 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
