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
  Activity,
  AlertCircle,
  AlertTriangle
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
  EXPORT_OPTIONS
} from '../constants/reports.constants';
import { useReportsData } from '../hooks/useReportsData';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/reports.utils';
import { ReportsService } from '../services/reports.service';

const ReportsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('production');
  const [exporting, setExporting] = useState(false);
  
  const isRTL = i18n.language === 'ar';

  const {
    workLogStats,
    monthlyProduction,
    workerPerformance,
    materialUsage,
    recentActivities,
    quickStats,
    isLoading,
    hasErrors,
    errors,
    refetchAll
  } = useReportsData(selectedPeriod);

  const handleRefresh = () => {
    refetchAll();
  };

  const handleExport = async (format: string) => {
    try {
      setExporting(true);
      const exportData = await ReportsService.exportReport(selectedReport, selectedPeriod, format);
      
      // Convert data to appropriate format
      let dataString = '';
      let mimeType = '';
      let fileExtension = '';
      
      switch (format) {
        case 'csv':
          dataString = convertToCSV(exportData.data);
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;
        case 'excel':
          dataString = convertToExcel(exportData.data);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileExtension = 'xlsx';
          break;
        case 'pdf':
          // For PDF, we'd need a proper PDF library
          dataString = JSON.stringify(exportData.data, null, 2);
          mimeType = 'application/pdf';
          fileExtension = 'pdf';
          break;
        default:
          throw new Error('Unsupported export format');
      }
      
      // Create and download file
      const blob = new Blob([dataString], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportData.filename}.${fileExtension}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Show success message
      showToast('Export successful!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export failed. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  };

  const convertToExcel = (data: any[]): string => {
    // Simplified Excel format - in production, use a proper Excel library
    return convertToCSV(data);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const ReportCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
      <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-orange-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 ${isRTL ? 'ml-4' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-orange-600 text-lg">{t('loadingReports') || 'Loading reports...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-3xl font-bold text-orange-900">
              {t('reportsAnalytics')}
            </h1>
            <p className="text-orange-700 mt-1">
              {t('comprehensiveInsights')}
            </p>
          </div>
          
          <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-auto bg-white/80"
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
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>{t('refresh')}</span>
            </button>
            
            <button 
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>{exporting ? 'Exporting...' : t('export')}</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {hasErrors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Some data failed to load</h3>
                <p className="text-sm text-red-700 mt-1">Please refresh to try again</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            title={t('totalProduction')}
            value={workLogStats ? formatNumber(workLogStats.total_completed + workLogStats.total_pending) : '0'}
            change="+12.5%"
            icon={Package}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
          <ReportCard
            title={t('activeWorkers')}
            value={workLogStats ? workLogStats.worker_count.toString() : '0'}
            change="+3.2%"
            icon={Users}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
          <ReportCard
            title={t('revenue')}
            value={workLogStats ? formatCurrency(workLogStats.total_revenue) : '$0'}
            change="+18.7%"
            icon={DollarSign}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
          <ReportCard
            title={t('efficiency')}
            value={workLogStats ? formatPercentage(workLogStats.efficiency_rate) : '0%'}
            change="+5.1%"
            icon={TrendingUp}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
        </div>

        {/* Report Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-200/30">
          <div className="flex flex-wrap gap-2 p-2">
            {REPORT_TYPES.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedReport === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-orange-700 hover:text-orange-900 hover:bg-orange-100'
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
            {selectedReport === 'production' && monthlyProduction && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-orange-900">{t('productionTrends')}</h3>
                  <div className={`flex items-center space-x-2 text-sm text-orange-700 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{t('lastSixMonths')}</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyProduction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
                    <XAxis dataKey="month" stroke="#92400e" />
                    <YAxis stroke="#92400e" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #fbbf24',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="pending" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {selectedReport === 'workers' && workerPerformance && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-orange-900">{t('workerPerformance')}</h3>
                  <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{t('viewDetails')}</span>
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workerPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
                    <XAxis dataKey="worker_name" stroke="#92400e" />
                    <YAxis stroke="#92400e" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #fbbf24',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="tasks_completed" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {selectedReport === 'materials' && materialUsage && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-orange-900">{t('materialUsageDistribution')}</h3>
                  <div className="text-sm text-orange-700">{t('currentMonth')}</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={materialUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="percentage"
                      label={({ material_name, percentage }) => `${material_name} ${percentage.toFixed(1)}%`}
                    >
                      {materialUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            )}

            {selectedReport === 'financial' && monthlyProduction && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-orange-900">{t('revenueTrends')}</h3>
                  <div className="text-sm text-orange-700">{t('monthlyRevenue')}</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyProduction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
                    <XAxis dataKey="month" stroke="#92400e" />
                    <YAxis stroke="#92400e" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #fbbf24',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Empty State */}
            {!monthlyProduction && !workerPerformance && !materialUsage && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-orange-200/30 text-center">
                <Package className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-orange-900 mb-2">No data available</h3>
                <p className="text-orange-600">Select a different period or report type to view data.</p>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
              <h4 className="text-lg font-bold text-orange-900 mb-4">{t('quickStats')}</h4>
              <div className="space-y-4">
                {quickStats?.map((stat, index) => (
                  <div key={index} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-orange-700">{t(stat.label)}</span>
                    <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                )) || (
                  <div className="text-orange-500 text-sm">Loading stats...</div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
              <h4 className="text-lg font-bold text-orange-900 mb-4">{t('recentActivities')}</h4>
              <div className="space-y-3">
                {recentActivities?.map((activity) => (
                  <div key={activity.id} className={`flex items-start space-x-3 p-3 bg-orange-50/50 rounded-lg ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-emerald-500' :
                      activity.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <p className="text-sm font-medium text-orange-900">{t(activity.action)}</p>
                      <p className="text-xs text-orange-700">{activity.item}</p>
                      <p className="text-xs text-orange-600 mt-1">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) || (
                  <div className="text-orange-500 text-sm">Loading activities...</div>
                )}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
              <h4 className="text-lg font-bold text-orange-900 mb-4">{t('exportReports')}</h4>
              <div className="space-y-2">
                {EXPORT_OPTIONS.map((option, index) => (
                  <button 
                    key={index}
                    onClick={() => handleExport(option.format)}
                    disabled={exporting}
                    className={`w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors ${isRTL ? 'text-right' : 'text-left'} disabled:opacity-50`}
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