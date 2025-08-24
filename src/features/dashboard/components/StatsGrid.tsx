import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Package, BarChart3, Clock, DollarSign } from 'lucide-react';
import { StatCard } from './StatCard';
import { DashboardStats } from '../types/dashboard.types';
import { DASHBOARD_COLORS, DASHBOARD_TRENDS, DASHBOARD_DELAYS } from '../constants/dashboard.constants';
import { formatCurrency } from '../utils/dashboard.utils';

interface StatsGridProps {
  stats: DashboardStats;
  isRTL: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, isRTL }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 tablet-grid desktop-grid gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard
        title={t('stats.totalWorkers')}
        value={stats.totalWorkers}
        icon={Users}
        color={DASHBOARD_COLORS.TOTAL_WORKERS}
        trend={DASHBOARD_TRENDS.WORKERS}
        delay={DASHBOARD_DELAYS.WORKERS}
        isRTL={isRTL}
      />
      <StatCard
        title={t('stats.activeOrders')}
        value={stats.activeOrders}
        icon={Package}
        color={DASHBOARD_COLORS.ACTIVE_ORDERS}
        trend={DASHBOARD_TRENDS.ORDERS}
        delay={DASHBOARD_DELAYS.ORDERS}
        isRTL={isRTL}
      />
      <StatCard
        title={t('stats.completedTasks')}
        value={stats.completedTasks}
        icon={BarChart3}
        color={DASHBOARD_COLORS.COMPLETED_TASKS}
        trend={DASHBOARD_TRENDS.TASKS}
        delay={DASHBOARD_DELAYS.TASKS}
        isRTL={isRTL}
      />
      <StatCard
        title={t('stats.pendingApprovals')}
        value={stats.pendingApprovals}
        icon={Clock}
        color={DASHBOARD_COLORS.PENDING_APPROVALS}
        delay={DASHBOARD_DELAYS.APPROVALS}
        isRTL={isRTL}
      />
      <StatCard
        title={t('stats.workersPay')}
        value={formatCurrency(stats.totalEarnings)}
        icon={DollarSign}
        color={DASHBOARD_COLORS.TOTAL_EARNINGS}
        trend={DASHBOARD_TRENDS.EARNINGS}
        delay={DASHBOARD_DELAYS.EARNINGS}
        isRTL={isRTL}
      />
    </div>
  );
};
