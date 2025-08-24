import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../shared/store/authStore';
import { useTranslation } from 'react-i18next';
import { 
  DashboardHeader,
  StatsGrid,
  RecentActivities,
  LowStockAlerts,
  DashboardFooter,
  LoadingScreen
} from '../features/dashboard';
import { useDashboard } from '../features/dashboard';
import { getDefaultStats, isDataLoading } from '../features/dashboard';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  const {
    stats,
    recentActivities,
    lowStockItems,
    tableStructure,
    loading: dataLoading,
    errors
  } = useDashboard();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Set loading to false when all data is loaded
    if (!isDataLoading(dataLoading.stats, dataLoading.activities, dataLoading.stock)) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [dataLoading.stats, dataLoading.activities, dataLoading.stock]);

  // Handle errors gracefully
  if (errors.stats || errors.activities || errors.stock) {
    console.error('Dashboard data errors:', errors);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  // Use real data with fallbacks
  const dashboardStats = stats || getDefaultStats();
  const activities = recentActivities || [];
  const stockItems = lowStockItems || [];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-0">
      <DashboardHeader userName={user?.name} isRTL={isRTL} />

      <StatsGrid stats={dashboardStats} isRTL={isRTL} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <RecentActivities activities={activities} isRTL={isRTL} />
        <LowStockAlerts stockItems={stockItems} isRTL={isRTL} />
      </div>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;