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
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: monthlyProduction,
    isLoading: productionLoading,
    error: productionError,
    refetch: refetchProduction
  } = useQuery({
    queryKey: ['monthlyProduction', period],
    queryFn: () => ReportsService.getMonthlyProduction(period),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: workerPerformance,
    isLoading: workersLoading,
    error: workersError,
    refetch: refetchWorkers
  } = useQuery({
    queryKey: ['workerPerformance', period],
    queryFn: () => ReportsService.getWorkerPerformance(period),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: materialUsage,
    isLoading: materialsLoading,
    error: materialsError,
    refetch: refetchMaterials
  } = useQuery({
    queryKey: ['materialUsage', period],
    queryFn: () => ReportsService.getMaterialUsage(period),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: materialUsageDetails,
    isLoading: materialDetailsLoading,
    error: materialDetailsError,
    refetch: refetchMaterialDetails
  } = useQuery({
    queryKey: ['materialUsageDetails', period],
    queryFn: () => ReportsService.getMaterialUsageDetails(period),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: materialUsageTrends,
    isLoading: materialTrendsLoading,
    error: materialTrendsError,
    refetch: refetchMaterialTrends
  } = useQuery({
    queryKey: ['materialUsageTrends', period],
    queryFn: () => ReportsService.getMaterialUsageTrends(period),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: recentActivities,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['recentActivities', period],
    queryFn: () => ReportsService.getRecentActivities(period),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: quickStats,
    isLoading: quickStatsLoading,
    error: quickStatsError,
    refetch: refetchQuickStats
  } = useQuery({
    queryKey: ['quickStats', period],
    queryFn: () => ReportsService.getQuickStats(period),
    staleTime: 2 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const isLoading = statsLoading || productionLoading || workersLoading || materialsLoading || 
                   materialDetailsLoading || materialTrendsLoading || activitiesLoading || quickStatsLoading;

  const hasErrors = Object.values({
    stats: statsError,
    production: productionError,
    workers: workersError,
    materials: materialsError,
    materialDetails: materialDetailsError,
    materialTrends: materialTrendsError,
    activities: activitiesError,
    quickStats: quickStatsError,
  }).some(error => error);

  const refetchAll = () => {
    refetchStats();
    refetchProduction();
    refetchWorkers();
    refetchMaterials();
    refetchMaterialDetails();
    refetchMaterialTrends();
    refetchActivities();
    refetchQuickStats();
  };

  return {
    workLogStats,
    monthlyProduction,
    workerPerformance,
    materialUsage,
    materialUsageDetails,
    materialUsageTrends,
    recentActivities,
    quickStats,
    isLoading,
    hasErrors,
    errors: {
      stats: statsError,
      production: productionError,
      workers: workersError,
      materials: materialsError,
      materialDetails: materialDetailsError,
      materialTrends: materialTrendsError,
      activities: activitiesError,
      quickStats: quickStatsError,
    },
    refetchAll,
  };
};
