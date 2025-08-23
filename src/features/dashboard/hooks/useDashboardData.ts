import { 
  useDashboardStats, 
  useRecentActivities, 
  useLowStockItems,
  useTableStructure
} from '../../../shared/hooks/useSupabaseQuery';

export const useDashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: recentActivities, isLoading: activitiesLoading, error: activitiesError } = useRecentActivities();
  const { data: lowStockItems, isLoading: stockLoading, error: stockError } = useLowStockItems();
  const { data: tableStructure } = useTableStructure();

  return {
    stats,
    recentActivities,
    lowStockItems,
    tableStructure,
    loading: {
      stats: statsLoading,
      activities: activitiesLoading,
      stock: stockLoading,
    },
    errors: {
      stats: statsError,
      activities: activitiesError,
      stock: stockError,
    }
  };
};
