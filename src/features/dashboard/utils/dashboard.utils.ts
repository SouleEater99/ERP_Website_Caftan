import { DashboardStats, RecentActivity, LowStockItem } from '../types/dashboard.types';

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()} MAD`;
};

export const getDefaultStats = (): DashboardStats => ({
  totalWorkers: 0,
  activeOrders: 0,
  completedTasks: 0,
  pendingApprovals: 0,
  totalEarnings: 0
});

export const formatStockInfo = (item: LowStockItem): string => {
  return `Available: ${item.current} ${item.unit} | Min: ${item.threshold} ${item.unit}`;
};

export const getAnimationDelay = (index: number, baseDelay: number = 100): string => {
  return `${(index + 1) * baseDelay}ms`;
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  const fallback = img.nextElementSibling as HTMLElement;
  
  img.style.display = 'none';
  if (fallback) {
    fallback.style.display = 'block';
  }
};

export const isDataLoading = (
  statsLoading: boolean,
  activitiesLoading: boolean,
  stockLoading: boolean
): boolean => {
  return statsLoading || activitiesLoading || stockLoading;
};
