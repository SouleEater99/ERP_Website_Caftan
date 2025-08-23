import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity
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
  LineChart, 
  Line, 
  Area, 
  AreaChart
} from 'recharts';
import { 
  REPORT_PERIODS, 
  REPORT_TYPES, 
  MOCK_PRODUCTION_DATA, 
  MOCK_WORKER_PERFORMANCE, 
  MOCK_MATERIAL_USAGE,
  QUICK_STATS,
  RECENT_ACTIVITIES,
  EXPORT_OPTIONS
} from '../constants/reports.constants';
import { 
  getTotalProduction, 
  getActiveWorkersCount, 
  getTotalRevenue, 
  getEfficiencyRate 
} from '../utils/reports.utils';

const ReportsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('production');
  const [loading, setLoading] = useState(false);
  
  const isRTL = i18n.language === 'ar';

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
  };

  const ReportCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
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
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span>{t('refresh')}</span>
            </button>
            
            <button 
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>{t('export')}</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            title={t('totalProduction')}
            value={getTotalProduction(MOCK_PRODUCTION_DATA)}
            change="+12.5%"
            icon={Package}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <ReportCard
            title={t('activeWorkers')}
            value={getActiveWorkersCount()}
            change="+3.2%"
            icon={Users}
            color="bg-gradient-to-r from-emerald-500 to-teal-600"
          />
          <ReportCard
            title={t('revenue')}
            value={getTotalRevenue(MOCK_PRODUCTION_DATA)}
            change="+18.7%"
            icon={DollarSign}
            color="bg-gradient-to-r from-violet-500 to-purple-600"
          />
          <ReportCard
            title={t('efficiency')}
            value={getEfficiencyRate(MOCK_WORKER_PERFORMANCE)}
            change="+5.1%"
            icon={TrendingUp}
            color="bg-gradient-to-r from-amber-500 to-orange-500"
          />
        </div>

        {/* Report Navigation */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
          <div className="flex flex-wrap gap-2 p-2">
            {REPORT_TYPES.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedReport === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {tab.icon === 'BarChart3' && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab.icon === 'Users' && <Users className="w-4 h-4 mr-2" />}
                {tab.icon === 'PieChart' && <PieChart className="w-4 h-4 mr-2" />}
                {tab.icon === 'DollarSign' && <DollarSign className="w-4 h-4 mr-2" />}
                <span>{t(tab.label)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            {selectedReport === 'production' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-slate-800">{t('productionTrends')}</h3>
                  <div className={`flex items-center space-x-2 text-sm text-slate-600 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{t('lastSixMonths')}</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={MOCK_PRODUCTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="pending" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {selectedReport === 'workers' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-slate-800">{t('workerPerformance')}</h3>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{t('viewDetails')}</span>
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={MOCK_WORKER_PERFORMANCE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="tasks" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {selectedReport === 'materials' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-slate-800">{t('materialUsageDistribution')}</h3>
                  <div className="text-sm text-slate-600">{t('currentMonth')}</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={MOCK_MATERIAL_USAGE}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {MOCK_MATERIAL_USAGE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            )}

            {selectedReport === 'financial' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-slate-800">{t('revenueTrends')}</h3>
                  <div className="text-sm text-slate-600">{t('monthlyRevenue')}</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={MOCK_PRODUCTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={3} dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h4 className="text-lg font-bold text-slate-800 mb-4">{t('quickStats')}</h4>
              <div className="space-y-4">
                {QUICK_STATS.map((stat, index) => (
                  <div key={index} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-slate-600">{t(stat.label)}</span>
                    <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h4 className="text-lg font-bold text-slate-800 mb-4">{t('recentActivities')}</h4>
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map((activity, index) => (
                  <div key={index} className={`flex items-start space-x-3 p-3 bg-slate-50/50 rounded-lg ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-emerald-500' :
                      activity.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <p className="text-sm font-medium text-slate-800">{t(activity.action)}</p>
                      <p className="text-xs text-slate-600">{activity.item}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h4 className="text-lg font-bold text-slate-800 mb-4">{t('exportReports')}</h4>
              <div className="space-y-2">
                {EXPORT_OPTIONS.map((option, index) => (
                  <button 
                    key={index}
                    onClick={() => handleExport(option.format)}
                    className={`w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    {option.icon === 'FileText' && <FileText className="w-4 h-4 mr-2" />}
                    {option.icon === 'BarChart3' && <BarChart3 className="w-4 h-4 mr-2" />}
                    {option.icon === 'Activity' && <Activity className="w-4 h-4 mr-2" />}
                    <span>{t(option.label)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;