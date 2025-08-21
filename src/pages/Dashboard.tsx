import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from 'react-i18next';
import { 
  useDashboardStats, 
  useRecentActivities, 
  useLowStockItems,
  useTableStructure
} from '../hooks/useSupabaseQuery';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  Users,
  Package,
  DollarSign,
  Clock,
  Crown,
  Scissors,
  Shirt
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  // Real data hooks
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: recentActivities, isLoading: activitiesLoading, error: activitiesError } = useRecentActivities();
  const { data: lowStockItems, isLoading: stockLoading, error: stockError } = useLowStockItems();
  const { data: tableStructure } = useTableStructure();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Set loading to false when all data is loaded
    if (!statsLoading && !activitiesLoading && !stockLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500); // Reduced delay since we're using real data
      
      return () => clearTimeout(timer);
    }
  }, [statsLoading, activitiesLoading, stockLoading]);

  // Handle errors gracefully
  if (statsError || activitiesError || stockError) {
    console.error('Dashboard data errors:', { statsError, activitiesError, stockError });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/30 to-amber-50/50 caftan-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 caftan-gradient rounded-3xl flex items-center justify-center pulse-glow mb-4 mx-auto">
            <Crown className="h-10 w-10 text-white animate-pulse" />
          </div>
          <p className="text-orange-800 text-xl font-bold arabic-text">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0 }) => (
    <div 
      className={`glass-card rounded-2xl p-4 sm:p-6 border-2 border-slate-200/30 hover:border-slate-300/50 transition-all duration-300 slide-up mobile-card`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-slate-600 responsive-text font-medium">{title}</p>
          <p className="text-slate-800 text-xl sm:text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-green-500 mx-1" />
              <span className="text-green-500 responsive-text font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${color} ${isRTL ? 'ml-4' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Use real data with fallbacks
  const dashboardStats = stats || {
    totalWorkers: 0,
    activeOrders: 0,
    completedTasks: 0,
    pendingApprovals: 0,
    totalEarnings: 0
  };

  const activities = recentActivities || [];
  const stockItems = lowStockItems || [];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-0">
      {/* Header */}
      <div className="mb-8 slide-up">
        <div className={`flex items-center space-x-4 mb-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center pulse-glow shadow-lg">
            <img 
              src="/image.png" 
              alt="Caftan Talia Logo" 
              className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'block';
              }}
            />
            <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 hidden" />
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="responsive-heading font-bold cold-gradient-text mb-2">Dashboard</h1>
            <p className="text-slate-600 font-medium responsive-text">
              Welcome back, {user?.name || 'User'}
            </p>
          </div>
        </div>
      </div>

      {/* Debug Table Structure */}
      {tableStructure && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-bold text-blue-800 mb-2">🔍 Table Structure Debug</h3>
          <div className="text-sm text-blue-700">
            <p><strong>Users columns:</strong> {tableStructure.usersColumns.join(', ')}</p>
            <p><strong>Stock columns:</strong> {tableStructure.stockColumns.join(', ')}</p>
            <p><strong>Rates columns:</strong> {tableStructure.ratesColumns.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 tablet-grid desktop-grid gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title={t('totalWorkers')}
          value={dashboardStats.totalWorkers}
          icon={Users}
          color="cold-gradient"
          trend="+15%"
          delay={100}
        />
        <StatCard
          title={t('activeOrders')}
          value={dashboardStats.activeOrders}
          icon={Package}
          color="bg-gradient-to-r from-emerald-500 to-teal-600"
          trend="+12%"
          delay={200}
        />
        <StatCard
          title={t('completedTasks')}
          value={dashboardStats.completedTasks}
          icon={BarChart3}
          color="bg-gradient-to-r from-blue-500 to-indigo-600"
          trend="+18%"
          delay={300}
        />
        <StatCard
          title={t('pendingApprovals')}
          value={dashboardStats.pendingApprovals}
          icon={Clock}
          color="bg-gradient-to-r from-amber-500 to-yellow-500"
          delay={400}
        />
        <StatCard
          title="Workers Pay"
          value={`$${dashboardStats.totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-purple-500 to-pink-600"
          trend="+25%"
          delay={500}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Activities */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border-2 border-slate-200/30 slide-up stagger-1 mobile-card">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h3 className="responsive-subheading font-bold text-slate-800">Recent Activities</h3>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Shirt className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="tablet-spacing desktop-spacing">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50/50 rounded-2xl border border-slate-200/50 hover:border-slate-300/70 transition-all duration-300 mobile-padding"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="text-xl sm:text-2xl">{activity.avatar}</div>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-slate-800 font-bold responsive-text">{activity.worker}</p>
                      <p className="text-slate-600 responsive-text">{activity.task} - {activity.product}</p>
                    </div>
                  </div>
                  <span className="text-slate-500 responsive-text font-medium mt-2 sm:mt-0">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Shirt className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border-2 border-red-200/30 slide-up stagger-2 mobile-card">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h3 className="responsive-subheading font-bold text-red-800">Low Stock Alerts</h3>
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="tablet-spacing desktop-spacing">
            {stockItems.length > 0 ? (
              stockItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50/50 rounded-2xl border border-red-200/50 hover:border-red-300/70 transition-all duration-300 mobile-padding"
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="p-2 bg-red-100 rounded-xl">
                      <Scissors className="w-4 h-4 text-red-600" />
                    </div>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-red-800 font-bold responsive-text">{item.material}</p>
                      <p className="text-red-600 responsive-text">
                        Available: {item.current} {item.unit} | Min: {item.threshold} {item.unit}
                      </p>
                    </div>
                  </div>
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-2 sm:mt-0 self-end sm:self-center" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>All stock levels are adequate</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Traditional Pattern Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-slate-200">
          <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="text-slate-700 font-bold responsive-text">Caftan Talia - Excellence in Traditional Fashion</span>
          <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;