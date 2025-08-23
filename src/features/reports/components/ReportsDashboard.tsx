import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Cell, 
  Pie
} from 'recharts';
import { REPORT_PERIODS, MOCK_PRODUCTION_DATA, MOCK_WORKER_PERFORMANCE, MOCK_MATERIAL_USAGE } from '../constants/reports.constants';
import { calculateTotalRevenue, calculateAverageEfficiency, calculateTotalTasks, formatCurrency, formatPercentage } from '../utils/reports.utils';

const ReportsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  
  const isRTL = i18n.language === 'ar';

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const ReportCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} ${isRTL ? 'ml-4' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-3xl font-bold text-slate-800">
              {t('reportsAnalytics')}
            </h1>
            <p className="text-slate-600 mt-1">
              {t('comprehensiveInsights')}
            </p>
          </div>
          
          <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-auto"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {REPORT_PERIODS.map(period => (
                <option key={period.value} value={period.value}>
                  {t(period.label)}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {t('refresh')}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            title={t('totalRevenue')}
            value={formatCurrency(calculateTotalRevenue(MOCK_PRODUCTION_DATA))}
            change="+12.5%"
            icon={DollarSign}
            color="bg-emerald-500"
          />
          
          <ReportCard
            title={t('totalTasks')}
            value={calculateTotalTasks(MOCK_PRODUCTION_DATA)}
            change="+8.2%"
            icon={Package}
            color="bg-blue-500"
          />
          
          <ReportCard
            title={t('averageEfficiency')}
            value={formatPercentage(calculateAverageEfficiency(MOCK_WORKER_PERFORMANCE))}
            change="+3.1%"
            icon={TrendingUp}
            color="bg-purple-500"
          />
          
          <ReportCard
            title={t('activeWorkers')}
            value={MOCK_WORKER_PERFORMANCE.length}
            change="+2.4%"
            icon={Users}
            color="bg-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {t('productionTrends')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_PRODUCTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#0EA5E9" />
                <Bar dataKey="pending" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Worker Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {t('workerPerformance')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_WORKER_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Usage Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {t('materialUsage')}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={MOCK_MATERIAL_USAGE}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {MOCK_MATERIAL_USAGE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {MOCK_MATERIAL_USAGE.map((material, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: material.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {material.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {material.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;