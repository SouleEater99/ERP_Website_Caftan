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

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const getTotalProduction = (data: ProductionData[]): string => {
  const total = data.reduce((sum, item) => sum + item.completed + item.pending, 0);
  return formatNumber(total);
};

export const getActiveWorkersCount = (): string => {
  return '32';
};

export const getTotalRevenue = (data: ProductionData[]): string => {
  return formatCurrency(calculateTotalRevenue(data));
};

export const getEfficiencyRate = (data: WorkerPerformance[]): string => {
  return formatPercentage(calculateAverageEfficiency(data));
};
