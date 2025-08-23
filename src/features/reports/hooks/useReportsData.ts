import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports.service';

export const useReportsData = (period: string = 'monthly') => {
  const {
    data: workLogStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['workLogStats', period],
    queryFn: () => ReportsService.getWorkLogStats(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: monthlyProduction,
    isLoading: productionLoading,
    error: productionError,
    refetch: refetchProduction
  } = useQuery({
    queryKey: ['monthlyProduction'],
    queryFn: () => ReportsService.getMonthlyProduction(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: workerPerformance,
    isLoading: workersLoading,
    error: workersError,
    refetch: refetchWorkers
  } = useQuery({
    queryKey: ['workerPerformance'],
    queryFn: () => ReportsService.getWorkerPerformance(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: materialUsage,
    isLoading: materialsLoading,
    error: materialsError,
    refetch: refetchMaterials
  } = useQuery({
    queryKey: ['materialUsage'],
    queryFn: () => ReportsService.getMaterialUsage(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: recentActivities,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => ReportsService.getRecentActivities(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const {
    data: quickStats,
    isLoading: quickStatsLoading,
    error: quickStatsError,
    refetch: refetchQuickStats
  } = useQuery({
    queryKey: ['quickStats'],
    queryFn: () => ReportsService.getQuickStats(),
    staleTime: 2 * 60 * 1000,
  });

  const isLoading = statsLoading || productionLoading || workersLoading || materialsLoading || activitiesLoading || quickStatsLoading;

  const refetchAll = () => {
    refetchStats();
    refetchProduction();
    refetchWorkers();
    refetchMaterials();
    refetchActivities();
    refetchQuickStats();
  };

  return {
    workLogStats,
    monthlyProduction,
    workerPerformance,
    materialUsage,
    recentActivities,
    quickStats,
    isLoading,
    errors: {
      stats: statsError,
      production: productionError,
      workers: workersError,
      materials: materialsError,
      activities: activitiesError,
      quickStats: quickStatsError,
    },
    refetchAll,
  };
};
